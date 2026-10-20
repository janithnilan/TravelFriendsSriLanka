import {
  analyticsEnabled,
  analyticsEventSchema,
  analyticsPeriods,
} from "@/lib/analytics-policy";
import { getAnalyticsReport, recordPageView } from "@/services/analytics-store";

export const dynamic = "force-dynamic";
const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
let windowStart = 0;
let requests = 0;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin)
    return Response.json(
      { error: "Same-origin request required" },
      { status: 403, headers: responseHeaders },
    );
  if (
    request.headers.get("sec-gpc") === "1" ||
    request.headers.get("dnt") === "1"
  )
    return new Response(null, { status: 204, headers: responseHeaders });
  if (!analyticsEnabled())
    return Response.json(
      { status: "not_configured" },
      { status: 503, headers: responseHeaders },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return new Response(null, { status: 415 });
  const now = Date.now();
  if (now - windowStart >= 60_000) {
    windowStart = now;
    requests = 0;
  }
  if (++requests > 120)
    return Response.json(
      { error: "Collection busy" },
      { status: 429, headers: { ...responseHeaders, "Retry-After": "60" } },
    );
  try {
    const reader = request.body?.getReader();
    if (!reader) return new Response(null, { status: 400 });
    let body = "";
    let bytes = 0;
    const decoder = new TextDecoder();
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 512) {
        await reader.cancel();
        return new Response(null, { status: 413 });
      }
      body += decoder.decode(chunk.value, { stream: true });
    }
    body += decoder.decode();
    const parsed = analyticsEventSchema.safeParse(JSON.parse(body));
    if (!parsed.success) return new Response(null, { status: 400 });
    try {
      await recordPageView(request.headers, parsed.data.visitStart);
      return new Response(null, { status: 204, headers: responseHeaders });
    } catch {
      return Response.json(
        { status: "unavailable" },
        { status: 503, headers: responseHeaders },
      );
    }
  } catch {
    return new Response(null, { status: 400, headers: responseHeaders });
  }
}

export async function GET(request: Request) {
  const period = new URL(request.url).searchParams.get("period") ?? "Today";
  if (!analyticsPeriods.includes(period as (typeof analyticsPeriods)[number]))
    return Response.json(
      { error: "Invalid period" },
      { status: 400, headers: responseHeaders },
    );
  const report = await getAnalyticsReport(
    period as (typeof analyticsPeriods)[number],
  );
  return Response.json(report, {
    headers: responseHeaders,
    status: report.availability === "unavailable" ? 503 : 200,
  });
}
