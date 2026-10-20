import type { AnalyticsPeriod } from "@/lib/analytics-policy";

export type CountryTotal = { code: string; visits: number };
export type AnalyticsReport = {
  availability:
    "available" | "not_configured" | "unavailable" | "insufficient_data";
  period: AnalyticsPeriod;
  start: string | null;
  end: string;
  lastUpdated: string | null;
  visits: number | null;
  pageViews: number | null;
  countries: CountryTotal[];
  trend: { day: string; visits: number; pageViews: number }[];
};
