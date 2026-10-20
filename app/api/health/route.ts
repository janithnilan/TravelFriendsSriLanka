import { NextResponse } from "next/server";
import { checkHealth } from "@/services/health-service";

export async function GET() {
  try {
    const health = await checkHealth();
    return NextResponse.json(health, {
      status: health.status === "ok" ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { status: "error", database: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
