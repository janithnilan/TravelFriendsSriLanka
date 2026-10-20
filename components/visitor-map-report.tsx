"use client";

import { useEffect, useId, useState } from "react";
import { countryFlag, worldMap } from "@/lib/world-map";
import type { AnalyticsPeriod } from "@/lib/analytics-policy";
import type { AnalyticsReport } from "@/types/analytics";

export function VisitorMapReport({ period }: { period: AnalyticsPeriod }) {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const titleId = useId();

  useEffect(() => {
    const controller = new AbortController();
    setReport(null);
    setFailed(false);
    setSelected(null);
    fetch(`/api/analytics?period=${encodeURIComponent(period)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Reporting unavailable");
        return response.json() as Promise<AnalyticsReport>;
      })
      .then(setReport)
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [period]);

  const available = report?.availability === "available";
  const countries = available ? report.countries : [];
  const selectedCountry = countries.find(
    (country) => country.code === selected,
  );
  const countryName = (code: string) =>
    worldMap.locations.find((location) => location.id.toUpperCase() === code)
      ?.name ?? code;
  const publishedVisits = countries.reduce(
    (total, country) => total + country.visits,
    0,
  );
  const status =
    failed || report?.availability === "unavailable"
      ? "Reporting unavailable: storage could not be reached."
      : !report
        ? "Loading aggregate report…"
        : report.availability === "not_configured"
          ? "Reporting not configured. No visitor countries are highlighted."
          : report.availability === "insufficient_data"
            ? "Not enough recorded visits to publish this period safely."
            : "Recorded aggregates only. Country and daily groups below five visits are withheld.";
  const trend = available ? report.trend : [];
  const max = Math.max(1, ...trend.map((point) => point.pageViews));
  const points = (key: "visits" | "pageViews") =>
    trend
      .map(
        (point, index) =>
          `${30 + (index * 540) / Math.max(1, trend.length - 1)},${145 - (point[key] / max) * 115}`,
      )
      .join(" ");

  return (
    <div className="visitor-map-report">
      <p role="status" className="analytics-period-status">
        {period}: {status}
      </p>
      <div className="analytics-map-layout">
        <section
          className="analytics-map-panel"
          aria-label="Visitor countries world map"
        >
          <div className="analytics-panel-heading">
            <h3>Our visitors around the world</h3>
            <span>{period} · UTC</span>
          </div>
          <svg
            className="visitor-world-map"
            viewBox={worldMap.viewBox}
            role="group"
            aria-labelledby={titleId}
          >
            <title id={titleId}>
              World map:{" "}
              {countries.length
                ? "published visitor countries"
                : "no country statistics available"}
            </title>
            {worldMap.locations.map((location) => {
              const country = countries.find(
                (item) => item.code === location.id.toUpperCase(),
              );
              return (
                <path
                  key={location.id}
                  d={location.path}
                  className={
                    country
                      ? `map-country has-visits${selected === country.code ? "is-selected" : ""}`
                      : "map-country"
                  }
                  role={country ? "button" : undefined}
                  tabIndex={country ? 0 : undefined}
                  aria-label={
                    country
                      ? `${location.name}: ${country.visits} visits`
                      : undefined
                  }
                  aria-pressed={country ? selected === country.code : undefined}
                  onClick={
                    country ? () => setSelected(country.code) : undefined
                  }
                  onKeyDown={
                    country
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelected(country.code);
                          }
                        }
                      : undefined
                  }
                >
                  <title>
                    {location.name}
                    {country
                      ? `: ${country.visits} visits`
                      : " — no published count"}
                  </title>
                </path>
              );
            })}
          </svg>
          <p className="map-selection" role="status">
            {selectedCountry
              ? `${countryName(selectedCountry.code)}: ${selectedCountry.visits.toLocaleString()} recorded visits`
              : countries.length
                ? "Select a highlighted country or choose it from the list."
                : "Map context only · no visitor locations inferred"}
          </p>
          <p className="map-attribution">
            Map:{" "}
            <a
              href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/world"
              target="_blank"
              rel="noopener noreferrer"
            >
              SVG Maps / Victor Cazanave
            </a>{" "}
            ·{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>
            . Original geometry:{" "}
            <a
              href="https://mapsvg.com/maps/world"
              target="_blank"
              rel="noopener noreferrer"
            >
              MapSVG
            </a>
            . Colors adapted. No external map or flag requests.
          </p>
        </section>
        <section
          className="analytics-country-list"
          aria-label="Country distribution and visit counts"
        >
          <h3>Country distribution</h3>
          <p className="analytics-period-status">
            Share of published country visits; unknown and suppressed groups
            excluded.
          </p>
          {countries.length ? (
            <ol>
              {countries.map((country) => (
                <li key={country.code}>
                  <button
                    type="button"
                    aria-pressed={selected === country.code}
                    onClick={() => setSelected(country.code)}
                  >
                    <span>
                      <span aria-hidden="true">
                        {countryFlag(country.code)}
                      </span>{" "}
                      {countryName(country.code)}
                    </span>
                    <strong>{country.visits.toLocaleString()} visits</strong>
                  </button>
                  <meter
                    min={0}
                    max={publishedVisits}
                    value={country.visits}
                    aria-label={`${countryName(country.code)} share of published visits`}
                  />
                </li>
              ))}
            </ol>
          ) : (
            <div className="analytics-country-empty">
              <strong>Country counts unavailable</strong>
              <p>
                A trusted country source and publishable recorded totals are
                required. No flags or rankings are inferred.
              </p>
            </div>
          )}
        </section>
      </div>
      <section
        className="analytics-recorded-trend"
        aria-label="Recorded visits and page-view trend"
      >
        <div className="analytics-panel-heading">
          <h3>Recorded visits &amp; page views</h3>
          <span>Up to 31 published days · UTC</span>
        </div>
        {trend.length ? (
          <>
            <svg
              viewBox="0 0 600 175"
              className="visitor-trend-chart"
              role="img"
              aria-label="Recorded visits and page views; exact counts follow in the table"
            >
              <line x1="30" y1="145" x2="570" y2="145" className="trend-axis" />
              <polyline
                points={points("pageViews")}
                className="trend-pageviews"
              />
              <polyline points={points("visits")} className="trend-visits" />
              {trend.map((point, index) => (
                <circle
                  key={point.day}
                  cx={30 + (index * 540) / Math.max(1, trend.length - 1)}
                  cy={145 - (point.visits / max) * 115}
                  r="3"
                  className="trend-dot"
                >
                  <title>
                    {point.day}: {point.visits} visits, {point.pageViews} page
                    views
                  </title>
                </circle>
              ))}
            </svg>
            <details className="trend-table">
              <summary>Exact daily totals</summary>
              <table>
                <caption>Published days only; gaps are not zero counts</caption>
                <thead>
                  <tr>
                    <th scope="col">UTC day</th>
                    <th scope="col">Visits</th>
                    <th scope="col">Page views</th>
                  </tr>
                </thead>
                <tbody>
                  {trend.map((point) => (
                    <tr key={point.day}>
                      <th scope="row">{point.day}</th>
                      <td>{point.visits}</td>
                      <td>{point.pageViews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
            <p className="analytics-period-status">
              Cyan solid: page views · dark dashed: visits. Suppressed days are
              omitted; lines connect published observations.
            </p>
          </>
        ) : (
          <div className="analytics-chart-empty">
            <strong>Trend unavailable</strong>
            <p>
              No publishable recorded daily totals. No chart data is simulated.
            </p>
          </div>
        )}
      </section>
      <p className="analytics-updated">
        Reporting period:{" "}
        {report?.start
          ? `${report.start.slice(0, 10)} to ${report.end.slice(0, 10)} UTC`
          : report?.availability === "available"
            ? `Since collection began, through ${report.end.slice(0, 10)} UTC`
            : "Not available"}{" "}
        · Last recorded update:{" "}
        {available ? (report.lastUpdated ?? "Unavailable") : "Unavailable"}
      </p>
    </div>
  );
}
