# Deployment

## Local Development

Current Phase 1 local services:

- frontend Vite dev server;
- backend NestJS dev server;
- PostgreSQL through Docker Compose;
- optional local mail catcher later;
- optional disabled AI provider later.

Install dependencies and run validation from the repository root:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Start the local database:

```bash
docker compose up -d postgres
```

## Docker Compose

Docker Compose currently defines:

- PostgreSQL database;
- named `postgres_data` volume;
- health check using `pg_isready`;
- environment-variable overrides for database name, user, password, and host port.

Docker Compose may later add:

- API service once deployment containerization is scoped;
- web service once useful for local orchestration;
- local mail service if password reset or verification is enabled.

## CI

GitHub Actions should run:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Add database-backed integration tests when Prisma and Docker services exist.

## Preview Environments

Preview deployments should:

- use isolated environment variables;
- use preview database or safe seeded ephemeral database;
- disable production email sending unless explicitly configured;
- disable or rate-limit AI;
- not contain production user data.

## Staging

Staging should mirror production configuration:

- managed PostgreSQL;
- secure cookies;
- production-like CORS;
- migrations applied through CI;
- error monitoring enabled;
- non-production secrets.

## Production

Vendor-neutral recommended options:

| Component | Options |
| --- | --- |
| Frontend | Vercel, Netlify, Cloudflare Pages, equivalent. |
| Backend | Railway, Render, Fly.io, container platform, equivalent. |
| Database | Managed PostgreSQL provider. |
| Error monitoring | Sentry or equivalent. |
| Logs and metrics | Hosting provider plus external monitoring if needed. |

Do not lock to a vendor until deployment constraints are known.

## Environment Variables

Categories:

- database URLs;
- session and CSRF secrets;
- frontend and API origins;
- CORS allow list;
- email provider configuration;
- optional AI provider settings;
- observability DSNs and log level.

See `.env.example`.

## Database Migrations

- Migrations are generated only during implementation.
- Review generated SQL before production.
- Apply migrations through CI/CD.
- Back up production before risky migrations.
- Use reversible or forward-fix migration plans.

## Backups

- Enable daily managed PostgreSQL backups.
- Retain backups according to provider plan and policy.
- Test restore before production launch.
- Restrict backup access.

## Rollback

Application rollback:

- redeploy previous frontend and backend artifact;
- verify health checks;
- monitor error rate.

Database rollback:

- prefer forward fixes;
- restore backup only for severe data corruption;
- preserve audit trail.

## Health Checks

- `/health/live`: process is running.
- `/health/ready`: database reachable and migrations compatible.
- `/version`: build metadata when available.

## Deployment Verification

After deployment:

1. Health checks pass.
2. Registration works in target environment.
3. Login and logout work with secure cookies.
4. Onboarding creates Study Plan.
5. Daily Task can be completed.
6. Assessment can be opened for seeded eligible week.
7. Partner invitation flow works in non-production.
8. Error monitoring receives test event.

## Production Readiness Gate

Do not launch production until authentication, authorization, CSRF, backups, logging, health checks, and critical tests are complete.
