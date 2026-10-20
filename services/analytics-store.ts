import { worldMap } from "@/lib/world-map";
import { prisma } from "@/lib/prisma";
import {
  analyticsEnabled,
  publicationThreshold,
  reportingStart,
  type AnalyticsPeriod,
} from "@/lib/analytics-policy";
import type { AnalyticsReport } from "@/types/analytics";

const countryCodes = new Set(
  worldMap.locations.map((location) => location.id.toUpperCase()),
);

export function trustedCountry(headers: Headers): string {
  const header = process.env.ANALYTICS_COUNTRY_HEADER;
  const code = header ? headers.get(header)?.toUpperCase() : undefined;
  return code && /^[A-Z]{2}$/.test(code) && countryCodes.has(code)
    ? code
    : "ZZ";
}

export async function recordPageView(headers: Headers, visitStart: boolean) {
  const now = new Date();
  const day = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const country = trustedCountry(headers);
  await prisma.analyticsDaily.upsert({
    where: { day_country: { day, country } },
    create: { day, country, pageViews: 1, visits: visitStart ? 1 : 0 },
    update: {
      pageViews: { increment: 1 },
      visits: { increment: visitStart ? 1 : 0 },
    },
  });
}

export async function getAnalyticsReport(
  period: AnalyticsPeriod,
): Promise<AnalyticsReport> {
  const now = new Date();
  const start = reportingStart(period, now);
  const base: AnalyticsReport = {
    availability: "not_configured",
    period,
    start: start?.toISOString() ?? null,
    end: now.toISOString(),
    lastUpdated: null,
    visits: null,
    pageViews: null,
    countries: [],
    trend: [],
  };
  if (!analyticsEnabled()) return base;
  try {
    const rows = await prisma.analyticsDaily.findMany({
      where: { day: { ...(start ? { gte: start } : {}), lte: now } },
      orderBy: { day: "asc" },
    });
    const visits = rows.reduce((total, row) => total + row.visits, 0);
    if (visits < publicationThreshold)
      return { ...base, availability: "insufficient_data" };
    const countries = new Map<string, number>();
    const days = new Map<
      string,
      { day: string; visits: number; pageViews: number }
    >();
    let lastUpdated = "";
    for (const row of rows) {
      const day = row.day.toISOString().slice(0, 10);
      const bucket = days.get(day) ?? { day, visits: 0, pageViews: 0 };
      bucket.visits += row.visits;
      bucket.pageViews += row.pageViews;
      days.set(day, bucket);
      if (row.country !== "ZZ")
        countries.set(
          row.country,
          (countries.get(row.country) ?? 0) + row.visits,
        );
      if (row.updatedAt.toISOString() > lastUpdated)
        lastUpdated = row.updatedAt.toISOString();
    }
    return {
      ...base,
      availability: "available",
      start: start?.toISOString() ?? rows[0]?.day.toISOString() ?? null,
      visits,
      pageViews: rows.reduce((total, row) => total + row.pageViews, 0),
      lastUpdated: lastUpdated || null,
      countries: [...countries]
        .filter(([, count]) => count >= publicationThreshold)
        .map(([code, count]) => ({ code, visits: count }))
        .sort((left, right) => right.visits - left.visits),
      trend: [...days.values()]
        .filter((day) => day.visits >= publicationThreshold)
        .slice(-31),
    };
  } catch {
    return { ...base, availability: "unavailable" };
  }
}
