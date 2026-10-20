# Visitor Analytics

## First-Party Map and Collection

Implemented 2026-10-19 inside the existing footer widget:

Original geometry is by [MapSVG](https://mapsvg.com/maps/world), adapted by the SVG Maps dataset under CC BY 4.0. Both sources are visibly credited in the map panel, with the license link and the color adaptation noted.

- Local SVG world map from `@svg-maps/world@2.0.0`, licensed CC BY 4.0, with visible attribution to SVG Maps / Victor Cazanave. No tile server, external flag counter, or external geolocation call. Native responsive SVG avoids a geographic-rendering framework. Labels and country shapes are dataset context, not inferred visitor locations.
- `POST /api/analytics` validates an exact consented event body, requires same origin, respects DNT/GPC, limits bodies to 512 bytes, and caps accepted collection requests at 120 per minute per server process. It atomically increments daily aggregate counters using Prisma. Errors contain no database details. Origin checks and consent signals do not make client-reported counts fraud-proof. Multi-instance/rate-abuse protection must be reviewed before a production launch.
- `GET /api/analytics?period=Today` supports Today, This Week, This Month, and All Time. Dates are UTC; weeks start Monday. All Time means retained recorded aggregates, not an estimate before collection began.
- Public reports require at least five visits. Country and daily trend groups below five visits are withheld. Unknown countries are not mapped. Distribution percentages refer only to published country visits, not all traffic; suppressed days are not shown as zeros. A maximum of 31 published trend days is rendered. No visitor identifiers are returned.
- Country shapes and the accessible list select the same recorded country. Native meter bars show distribution; the trend uses real points and an exact-data table. No sample points, flags, or counts are shipped as fallback data.

### Metrics and Consent

A page view is a successfully accepted consented homepage-load event. A visit is the first consented load in a browser tab or a consented load following 30 minutes without a recorded load in that tab. Separate tabs count separately. This is a tab-visit definition, not a distinct person or authenticated login. Reloads within the window increment only page views. Single-page navigation outside the homepage is not counted by this collector.

Collection defaults off (`ANALYTICS_ENABLED=false`). When enabled, an explicit Allow button grants permission using sessionStorage for the current tab. Decline/withdraw stops subsequent collection. Closing the tab expires permission. No cookie or cross-tab identifier is generated. Browser DNT/GPC preferences prevent collection. The aggregate row stores only day, country, visits, page views, and an update timestamp: no IPs, page paths, or individual events. Review consent language, aggregate retention, applicable legal requirements, and operational log redaction before enabling; infrastructure access logs are separate from this collector.

Country identification defaults to `ZZ` (unknown). Set `ANALYTICS_COUNTRY_HEADER` only on a deployment where a trusted proxy removes incoming versions of that header and supplies a verified ISO alpha-2 code. Merely accepting a client-supplied country header is not reliable. Without that deployment guarantee, leave it unset. No IP-based lookup is implemented.

### Migration and Current Blocker

The additive `202610190001_aggregate_analytics` migration creates only `AnalyticsDaily`, with a compound day/country primary key and non-negative count constraints. It has NOT been applied. A read-only database probe still returns Prisma P1000. No credentials were inspected or stored. Fix authentication, review the migration, apply `npm run db:deploy`, and approve collection/privacy configuration before enabling. Even a working database cannot determine countries unless a trustworthy country source is configured.

Online Now and distinct visitors remain unmeasured: there is no live-session/identity mechanism. The existing summary cards remain explicitly unavailable rather than relabeling visits as visitors. Actual visits/page views and timestamps appear in expanded reports only after real collection and privacy thresholds are met.

## Earlier Unconfigured Foundation

## Earlier State (Historical)

The existing footer widget shows Total Visitors (all-time distinct visitors), Online Now, Page Views Today, and daily page-view percentage change from yesterday. Today, This Week, This Month, and All Time buttons select the expanded reporting view. Expand/collapse and period selection work without collecting visitor data.

All measurements are unavailable, not zero. The trend, top countries, flags, and distribution panels deliberately do not draw simulated data. Reporting dates, timezone, activity window, and last-updated timestamp are not configured. The summary cards keep their labeled periods independently of the expanded-report filters.

## Earlier Blockers (Historical)

Before the map/collection implementation above, the widget had no analytics model or collection mechanism. The database authentication failure remains current; the newer aggregate model and consent-gated collector now provide the integration path but have not been enabled or migrated.

The original summary-card boundary is `services/visitor-analytics-service.ts`. It still returns explicit unavailable values. The new map report uses `services/analytics-store.ts` through the first-party endpoint, never direct client database access.

## Before Enabling Metrics

- Approve a privacy-conscious first-party collection and retention policy, reporting timezone, and consent requirements before collecting data.
- Define visits separately from page views and distinct visitors. Only report distinct visitors when a reliable privacy-reviewed measurement exists.
- Define and implement an activity window and session lifecycle before reporting Online Now. No window or live count is claimed today.
- Use a reliable, documented country source and suppress small aggregates where necessary. Country flags should be local assets or Unicode flags mapped from recorded country codes, not third-party flag counters.
- Calculate yesterday's percentage change from comparable daily page-view periods; an absent or zero denominator must not become a fabricated percentage.
- Publish only approved aggregates. Do not expose IP addresses, session identifiers, individual histories, or authentication details. Authenticated logins remain a separate metric.

No external analytics scripts, flag services, cookies, geographic requests, or visitor identity storage are added by this widget. Only the optional consent-gated first-party load counter described above has been implemented.
