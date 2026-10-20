# Phase 1 Technical Decisions

- Use the approved Next.js modular monolith with TypeScript, Tailwind CSS, PostgreSQL, and Prisma.
- Use Prisma 6 in the initial bootstrap because the available Node.js 22.11 runtime is below the engine floor required by newer Prisma releases. Upgrade with a supported Node runtime when appropriate.
- Keep `DATABASE_URL` optional for serving the initial homepage. When configured, the health endpoint verifies database connectivity. Database tooling requires the variable.
- Keep the Phase 1 Prisma schema free of domain tables. The architecture baseline requires incremental schema design; destination/place models are Phase 3 scope.
- Do not configure Auth.js, maps, AI, email, or media credentials until their corresponding features enter scope.
- Use the existing Next.js server for the API boundary; no separate backend service is needed for the initial application.
