# Travel Friends Sri Lanka

A Sri Lanka-focused travel companion for discovering places, planning trips, and travelling with more context.

**Current phase:** Phase 1 - project foundation, branding, development environment, and initial homepage.

## Technology stack

- Next.js App Router and React
- TypeScript and Tailwind CSS
- PostgreSQL with Prisma ORM
- Zod for environment validation
- Vitest, ESLint, and Prettier
- npm

## Project structure

```text
app/                 Next.js pages and API routes
components/          Shared presentation components
features/homepage/   Homepage composition and local featured-place search
lib/                 Environment and database infrastructure
services/            Application services, including visitor-statistics data boundary
prisma/              PostgreSQL schema and migration workflow
public/images/       Bundled homepage photography and brand/logo.png
tests/               Foundation tests
types/               Shared TypeScript types
docs/                Product baselines and development status
```

## Requirements

- Node.js 22.13 or newer in the Node 22 line, or a current supported Node.js LTS release
- npm
- PostgreSQL 15 or newer for database-backed development

The homepage and health endpoint can run before PostgreSQL is configured. Database validation and migrations require a local development database; keep it separate from production.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your local PostgreSQL database. The database must already exist.
3. Generate the Prisma client with `npm run db:generate`.
4. Start the application with `npm run dev` and open [http://localhost:3000](http://localhost:3000).
5. Check application/database status at [http://localhost:3000/api/health](http://localhost:3000/api/health).

The health endpoint returns `database: "not_configured"` when `DATABASE_URL` is absent. When it is set, the endpoint checks PostgreSQL and returns a generic unavailable response if the connection fails; it never returns connection details.

## Environment configuration

`.env.example` documents `DATABASE_URL`. It contains placeholders only and is safe to commit. `.env.local` and other `.env*` files are ignored by Git. Authentication, maps, AI, email, and storage credentials are deferred until their features enter scope.

Public brand/contact details are centralized in `lib/site-config.ts`. The header and footer use the supplied local logo at `public/images/brand/logo.png`.

## Database

The Prisma schema includes `AnalyticsDaily`, storing only UTC-day/country visit and page-view counters. The reviewed additive migration has not been applied because local PostgreSQL authentication is blocked. Apply reviewed migrations to a working isolated database with `npm run db:deploy`. Destination/place entities remain Phase 3 scope.

Visitor reporting defaults off. The first-party `/api/analytics` endpoint and consent-gated homepage collector require `ANALYTICS_ENABLED=true`, working PostgreSQL, and the reviewed migration. The local world map uses published aggregates only. Country detection defaults to unknown: configure `ANALYTICS_COUNTRY_HEADER` only behind a trusted proxy that strips client-supplied values and supplies verified country codes. Review [docs/visitor-analytics.md](docs/visitor-analytics.md) before enabling collection. No external counters or geolocation services are called.

## Commands

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start the development server                         |
| `npm run build`        | Generate Prisma Client and create a production build |
| `npm run start`        | Serve the production build                           |
| `npm run lint`         | Run ESLint                                           |
| `npm run typecheck`    | Run TypeScript without emitting files                |
| `npm test`             | Run tests once                                       |
| `npm run test:watch`   | Run tests in watch mode                              |
| `npm run format`       | Format project files with Prettier                   |
| `npm run format:check` | Check formatting without modifying files             |
| `npm run db:generate`  | Generate Prisma Client                               |
| `npm run db:validate`  | Validate the Prisma schema                           |
| `npm run db:migrate`   | Create/apply a local development migration           |
| `npm run db:deploy`    | Apply reviewed migrations in deployment              |

## Phase 1 status

The project foundation and branded homepage are implemented. No application domain tables or authentication have been added. See [docs/status.md](docs/status.md) for verified completion and remaining blockers.
