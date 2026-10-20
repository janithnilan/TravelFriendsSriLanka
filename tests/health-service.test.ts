import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { $queryRaw: vi.fn() },
}));

import { prisma } from "@/lib/prisma";
import { checkHealth } from "@/services/health-service";

describe("health service", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
  });

  it("reports the application ready when the optional database is not configured", async () => {
    await expect(checkHealth()).resolves.toEqual({
      status: "ok",
      database: "not_configured",
    });
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  it("checks the database when a connection URL is configured", async () => {
    process.env.DATABASE_URL =
      "postgresql://traveler:local@localhost:5432/travel_friends";
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce(1);

    await expect(checkHealth()).resolves.toEqual({
      status: "ok",
      database: "connected",
    });
    expect(prisma.$queryRaw).toHaveBeenCalledOnce();
  });

  it("returns a safe unavailable status if the database cannot be reached", async () => {
    process.env.DATABASE_URL =
      "postgresql://traveler:local@localhost:5432/travel_friends";
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(
      new Error("private connection detail"),
    );

    await expect(checkHealth()).resolves.toEqual({
      status: "error",
      database: "unavailable",
    });
  });
});
