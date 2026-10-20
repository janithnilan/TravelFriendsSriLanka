"use client";

import { useId, useState } from "react";
import type { VisitorStatistics } from "@/services/visitor-analytics-service";
import { VisitorMapReport } from "@/components/visitor-map-report";
import { AnalyticsConsent } from "@/components/analytics-consent";

const reportingPeriods = [
  "Today",
  "This Week",
  "This Month",
  "All Time",
] as const;

export function VisitorStatisticsWidget({
  statistics,
  collectionEnabled = false,
}: {
  statistics: VisitorStatistics;
  collectionEnabled?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [period, setPeriod] =
    useState<(typeof reportingPeriods)[number]>("Today");
  const widgetId = useId();
  const titleId = `${widgetId}-title`;
  const detailsId = `${widgetId}-details`;
  const summaryMetrics = [
    {
      label: "Total Visitors",
      value: statistics.totalVisitors,
      note: "All time · distinct visitors not measured",
    },
    {
      label: "Online Now",
      value: statistics.onlineNow,
      note: "Active sessions not configured",
    },
    {
      label: "Page Views Today",
      value: statistics.pageViewsToday,
      note: "Daily page-view collection not configured",
    },
    {
      label: "Change From Yesterday",
      value: statistics.percentageChangeFromYesterday,
      note: "Daily page views · comparison unavailable",
    },
  ];

  return (
    <section className="visitor-stats glass-surface" aria-labelledby={titleId}>
      <div className="visitor-stats-summary">
        <div>
          <p className="footer-eyebrow">Site statistics</p>
          <h2 id={titleId}>Visitor overview</h2>
          <p className="visitor-stats-status">
            <span className="status-indicator" aria-hidden="true" />
            {collectionEnabled
              ? "Aggregate reports enabled; summary metrics not measured"
              : "Reporting not configured"}
          </p>
        </div>
        <button
          aria-controls={detailsId}
          aria-expanded={expanded}
          className="visitor-stats-toggle"
          onClick={() => setExpanded((current) => !current)}
          type="button"
        >
          {expanded ? "Hide details" : "View details"}
          <span
            aria-hidden="true"
            className={expanded ? "toggle-chevron is-open" : "toggle-chevron"}
          />
        </button>
      </div>
      <dl className="analytics-metrics">
        {summaryMetrics.map((metric) => (
          <div className="analytics-metric" key={metric.label}>
            <dt>{metric.label}</dt>
            <dd>{metric.value ?? "Unavailable"}</dd>
            <small>{metric.note}</small>
          </div>
        ))}
      </dl>
      <div className="visitor-stats-details" hidden={!expanded} id={detailsId}>
        <div className="analytics-toolbar">
          <div
            className="analytics-periods"
            role="group"
            aria-label="Reporting period"
          >
            {reportingPeriods.map((option) => (
              <button
                aria-pressed={period === option}
                key={option}
                onClick={() => setPeriod(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          <p className="analytics-updated">
            Last updated: {statistics.lastUpdated ?? "No recorded data"}
          </p>
        </div>
        {expanded && <VisitorMapReport period={period} />}
        <div className="analytics-prerequisites">
          <p>
            <strong>Online Now:</strong> no active-session tracking or activity
            window is configured. This is not a live visitor count.
          </p>
          <p>
            <strong>Privacy:</strong> only daily aggregates can be stored. No
            external flag counters, IP addresses, or individual histories are
            published.
          </p>
        </div>
        <p className="visitor-stats-note">
          Visitors, visits, page views, and authenticated logins are different
          metrics. Unique visitors and authenticated logins are not measured
          here. Summary cards retain their stated periods; filters apply only to
          the expanded reports.
        </p>
      </div>
      <AnalyticsConsent enabled={collectionEnabled} />
    </section>
  );
}
