import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/services/analytics-store", () => ({
  recordPageView: vi.fn(),
  getAnalyticsReport: vi.fn(),
}));
import { GET, POST } from "@/app/api/analytics/route";
import { recordPageView } from "@/services/analytics-store";

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/analytics", {
    method: "POST",
    headers: {
      origin: "http://localhost",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("first-party analytics endpoint", () => {
  beforeEach(() => {
    vi.stubEnv("ANALYTICS_ENABLED", "true");
    vi.stubEnv("DATABASE_URL", "postgresql://example.invalid/test");
    vi.resetAllMocks();
  });
  afterEach(() => vi.unstubAllEnvs());
  it("rejects cross-origin collection", async () => {
    expect(
      (
        await POST(
          request(
            { consent: true, visitStart: true },
            { origin: "https://untrusted.invalid" },
          ),
        )
      ).status,
    ).toBe(403);
    expect(recordPageView).not.toHaveBeenCalled();
  });
  it("respects browser privacy preference", async () => {
    expect(
      (
        await POST(
          request({ consent: true, visitStart: true }, { "sec-gpc": "1" }),
        )
      ).status,
    ).toBe(204);
    expect(recordPageView).not.toHaveBeenCalled();
  });
  it("returns unavailable without collection when disabled", async () => {
    vi.stubEnv("ANALYTICS_ENABLED", "false");
    expect(
      (await POST(request({ consent: true, visitStart: true }))).status,
    ).toBe(503);
    expect(recordPageView).not.toHaveBeenCalled();
  });
  it("requires consent", async () => {
    expect((await POST(request({ visitStart: true }))).status).toBe(400);
    expect(recordPageView).not.toHaveBeenCalled();
  });
  it("records valid aggregate events only", async () => {
    expect(
      (await POST(request({ consent: true, visitStart: true }))).status,
    ).toBe(204);
    expect(recordPageView).toHaveBeenCalledWith(expect.any(Headers), true);
  });
  it("does not leak storage errors", async () => {
    vi.mocked(recordPageView).mockRejectedValueOnce(new Error("secret"));
    const response = await POST(request({ consent: true, visitStart: false }));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "unavailable" });
  });
  it("limits request bodies", async () => {
    expect(
      (
        await POST(
          request({ consent: true, visitStart: true, extra: "a".repeat(600) }),
        )
      ).status,
    ).toBe(413);
  });
  it("validates reporting filters", async () => {
    expect(
      (await GET(new Request("http://localhost/api/analytics?period=invalid")))
        .status,
    ).toBe(400);
  });
});
