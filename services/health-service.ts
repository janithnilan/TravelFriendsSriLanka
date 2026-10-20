import { getEnvironment } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import type { HealthResponse } from "@/types/health";

export async function checkHealth(): Promise<HealthResponse> {
  const { DATABASE_URL } = getEnvironment();

  if (!DATABASE_URL) {
    return { status: "ok", database: "not_configured" };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "ok", database: "connected" };
  } catch {
    return { status: "error", database: "unavailable" };
  }
}
