# Phase 1 Status

**Scope:** project foundation, branding, architecture, initial homepage, and development environment.

## Completed

- [x] Next.js App Router, TypeScript, Tailwind CSS, and npm scaffold
- [x] Modular project structure and local development scripts
- [x] PostgreSQL Prisma schema and migration workflow, with no speculative domain tables
- [x] Optional `DATABASE_URL` validation and secret-safe `.env.example` strategy
- [x] Application/database health endpoint
- [x] Branded responsive homepage
- [x] Supplied logo integrated in shared header and reusable footer with preserved aspect ratio
- [x] Supplied contact and social links centralized in site configuration and rendered as safe links
- [x] Expandable visitor-statistics widget shows an honest unconfigured state without collecting data
- [x] Environment and health-service tests
- [x] Git ignore rules, project README, and security response headers
- [x] Homepage verified in a local browser at desktop and mobile widths
- [x] Health endpoint and all bundled homepage image routes return successfully
- [x] Dependency audit reports zero known vulnerabilities

## Verification

- [x] Initial ESLint check
- [x] Full lint, typecheck, tests, Prisma validation/generation, and production build
- [x] Manual local browser check at desktop and mobile widths; featured search result and empty state exercised
- [x] Health endpoint and bundled homepage images checked; the current dev server reports `not_configured`
- [blocked] Database connectivity check: a read-only `SELECT 1` returned Prisma `P1000` authentication failure for the configured connection. No credential values were recorded.
- [pending] Run under Node.js 22.13+: this workspace is on Node.js 22.11.0; installed `eslint-visitor-keys@5.0.1` requires `^20.19.0 || ^22.13.0 || >=24`.

Verification reviewed 2026-10-18. Repository contains 18 completed checklist items, one database check blocked by local credentials, and one runtime check pending.

## Remaining Phase 1 work

- Resolve the two open verification items above before declaring the full Phase 1 environment checklist complete.
- Aggregate visitor reporting remains disabled and PostgreSQL authentication fails. A first-party daily-counter store and consent-gated collector are implemented but not live; no fabricated counts or third-party tracking were added.
- The custom map now has an opt-in first-party collector, aggregate report endpoint, and additive daily-counter migration. Collection defaults off and the migration is not applied; PostgreSQL still returns P1000. Country detection needs a trusted proxy source. See [visitor-analytics.md](visitor-analytics.md) before enabling.
- The existing visitor widget now has summary cards, period controls, and responsive empty reporting panels. A read-only database check on 2026-10-19 still returned `P1000`; see [visitor-analytics.md](visitor-analytics.md) for measurement and privacy prerequisites.
- The new additive analytics migration awaits a working database and review before deployment. Destination/place models remain Phase 3 scope.

## Next phase boundary

Authentication and user profiles begin in Phase 2. Destination/place models and pages begin in Phase 3. Do not add those domain features to this foundation.
