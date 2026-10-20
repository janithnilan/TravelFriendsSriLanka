import { z } from "zod";

export const analyticsEventSchema = z
  .object({
    consent: z.literal(true),
    visitStart: z.boolean(),
  })
  .strict();

export const analyticsPeriods = [
  "Today",
  "This Week",
  "This Month",
  "All Time",
] as const;
export type AnalyticsPeriod = (typeof analyticsPeriods)[number];
export const publicationThreshold = 5;
export const visitInactivityMs = 30 * 60 * 1000;

export function analyticsEnabled() {
  return (
    process.env.ANALYTICS_ENABLED === "true" &&
    Boolean(process.env.DATABASE_URL)
  );
}

export function reportingStart(period: AnalyticsPeriod, now: Date) {
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  if (period === "This Week")
    start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  if (period === "This Month") start.setUTCDate(1);
  return period === "All Time" ? null : start;
}
