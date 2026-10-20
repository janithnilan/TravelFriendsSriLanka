# Prisma migrations

The first reviewed migration creates `AnalyticsDaily`: UTC-day/country aggregate counters only. It stores no IPs, IDs, raw events, or paths. It has not been applied because local database authentication returns P1000. After provisioning a working isolated development database, review and apply with `npm run db:deploy`. Never use a reset to resolve authentication errors. Product domain models remain deferred to their agreed phases.
