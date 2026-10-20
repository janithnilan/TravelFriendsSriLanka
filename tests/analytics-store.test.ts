import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { analyticsDaily: { upsert: vi.fn(), findMany: vi.fn() } },
}));
import { prisma } from "@/lib/prisma";
import {
  getAnalyticsReport,
  recordPageView,
  trustedCountry,
} from "@/services/analytics-store";
import { analyticsEventSchema, reportingStart } from "@/lib/analytics-policy";

describe("aggregate analytics storage", () => {
  beforeEach(() => {
    vi.stubEnv("ANALYTICS_ENABLED", "true");
    vi.stubEnv("DATABASE_URL", "postgresql://example.invalid/test");
    vi.stubEnv("ANALYTICS_COUNTRY_HEADER", "");
    vi.resetAllMocks();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("does not query storage when collection is disabled", async () => {
    vi.stubEnv("ANALYTICS_ENABLED", "false");
    expect((await getAnalyticsReport("Today")).availability).toBe(
      "not_configured",
    );
    expect(prisma.analyticsDaily.findMany).not.toHaveBeenCalled();
  });
  it("does not trust country headers without an explicitly configured proxy", () => {
    expect(trustedCountry(new Headers({ "x-country": "LK" }))).toBe("ZZ");
    vi.stubEnv("ANALYTICS_COUNTRY_HEADER", "x-country");
    expect(trustedCountry(new Headers({ "x-country": "lk" }))).toBe("LK");
    expect(trustedCountry(new Headers({ "x-country": "not-a-country" }))).toBe(
      "ZZ",
    );
  });
  it("writes only daily aggregate counters and unknown country when needed", async () => {
    vi.mocked(prisma.analyticsDaily.upsert).mockResolvedValueOnce({} as never);
    await recordPageView(new Headers(), true);
    expect(prisma.analyticsDaily.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: {
          day: expect.any(Date),
          country: "ZZ",
          pageViews: 1,
          visits: 1,
        },
        update: { pageViews: { increment: 1 }, visits: { increment: 1 } },
      }),
    );
  });
  it("returns safe unavailable reports on storage failure", async () => {
    vi.mocked(prisma.analyticsDaily.findMany).mockRejectedValueOnce(
      new Error("private storage detail"),
    );
    const result = await getAnalyticsReport("Today");
    expect(result.availability).toBe("unavailable");
    expect(JSON.stringify(result)).not.toContain("private storage detail");
    expect(result.countries).toEqual([]);
  });
  it("withholds reports below five recorded visits rather than inventing counts", async () => {
    vi.mocked(prisma.analyticsDaily.findMany).mockResolvedValueOnce([
      {
        day: new Date(),
        country: "LK",
        pageViews: 4,
        visits: 4,
        updatedAt: new Date(),
      },
    ]);
    const result = await getAnalyticsReport("Today");
    expect(result.availability).toBe("insufficient_data");
    expect(result.visits).toBeNull();
  });
  it("publishes recorded country totals only above threshold and excludes unknown countries", async () => {
    const day = new Date("2026-10-19T00:00:00Z");
    vi.mocked(prisma.analyticsDaily.findMany).mockResolvedValueOnce([
      { day, country: "LK", visits: 7, pageViews: 11, updatedAt: day },
      { day, country: "GB", visits: 2, pageViews: 3, updatedAt: day },
      { day, country: "ZZ", visits: 6, pageViews: 8, updatedAt: day },
    ]);
    const report = await getAnalyticsReport("All Time");
    expect(report.countries).toEqual([{ code: "LK", visits: 7 }]);
    expect(report.trend).toEqual([
      { day: "2026-10-19", visits: 15, pageViews: 22 },
    ]);
    expect(report.visits).toBe(15);
  });
  it("requires explicit consent and rejects visitor-level fields", () => {
    expect(
      analyticsEventSchema.safeParse({ consent: false, visitStart: true })
        .success,
    ).toBe(false);
    expect(
      analyticsEventSchema.safeParse({
        consent: true,
        visitStart: true,
        ip: "private",
      }).success,
    ).toBe(false);
    expect(
      analyticsEventSchema.safeParse({ consent: true, visitStart: false })
        .success,
    ).toBe(true);
  });
  it("defines reporting periods in UTC with Monday-start weeks", () => {
    const now = new Date("2026-10-19T18:00:00Z");
    expect(reportingStart("Today", now)?.toISOString()).toBe(
      "2026-10-19T00:00:00.000Z",
    );
    expect(reportingStart("This Week", now)?.toISOString()).toBe(
      "2026-10-19T00:00:00.000Z",
    );
    expect(reportingStart("This Month", now)?.toISOString()).toBe(
      "2026-10-01T00:00:00.000Z",
    );
    expect(reportingStart("All Time", now)).toBeNull();
  });
});
