# Deployment

This repository is prepared for a free public deployment using:

- Frontend: Vercel Hobby.
- Backend/API: Render free Web Service.
- Database: Neon free PostgreSQL.

The application remains a pnpm monorepo. Deploy from the repository root.

## Local Development

Start the local PostgreSQL database:

```bash
docker compose up -d postgres
```

Run local validation:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The frontend can use `VITE_GRAPHQL_URL`; if it is unset locally, the app falls back to `http://localhost:4000/graphql`.

## Production Commands

Frontend build command:

```bash
pnpm --filter @skilltogether/web build
```

Backend build command:

```bash
pnpm --filter @skilltogether/api build
```

Backend start command:

```bash
pnpm --filter @skilltogether/api start:prod
```

Migration command:

```bash
pnpm db:migrate:deploy
```

Seed command:

```bash
pnpm db:seed
```

The seed command uses existing upsert-based content and assessment seed paths. It is intended to be safe to rerun.

## A. Create Neon Database

1. Create a Neon project on the free plan.
2. Create or use the default PostgreSQL database for SkillTogether.
3. Copy the Neon PostgreSQL connection string from the Neon dashboard.
4. Use the direct connection string for `DATABASE_URL`. Do not commit it.
5. Ensure the URL includes the SSL settings Neon provides.

Neon's API documentation describes connection URI retrieval and notes that connection strings can be generated with a pooled option when needed: https://api-docs.neon.tech/reference/getconnectionuri

## B. Deploy API To Render

Create a Render Web Service from the repository.

Recommended settings:

| Setting | Value |
| --- | --- |
| Root directory | repository root |
| Runtime | Node |
| Build command | `pnpm install --frozen-lockfile && pnpm --filter @skilltogether/api build` |
| Start command | `pnpm --filter @skilltogether/api start:prod` |
| Health check path | `/health/ready` |

Render sets a `PORT` value for web services. The API reads `PORT` and binds to `0.0.0.0` in production.

Render documents that web services must bind to a host and port, with `0.0.0.0` required for public traffic and `PORT` provided by the platform: https://render.com/docs/web-services

## C. Render Environment Variables

Set these in Render:

```bash
NODE_ENV=production
DATABASE_URL=<Neon connection string>
SESSION_SECRET=<long random secret>
CSRF_SECRET=<long random secret>
FRONTEND_URL=https://skill-together.vercel.app
CORS_ALLOWED_ORIGINS=https://skill-together.vercel.app
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAME_SITE=none
AUTH_PERSISTENCE=prisma
CONTENT_PERSISTENCE=prisma
SEED_ON_STARTUP=false
```

`PORT` is normally provided by Render. Set it manually only if Render requires it for the service.

Use a placeholder `FRONTEND_URL` until the Vercel URL exists, then update it and redeploy the API.

## D. Run Migrations

After Render has the Neon `DATABASE_URL`, run migrations against Neon from a trusted local terminal or deployment job:

```bash
pnpm install --frozen-lockfile
pnpm db:migrate:deploy
```

Do not use `prisma migrate dev` in production.

## E. Run Seed Data

After migrations succeed, seed the predefined tracks, lessons, content versions, and reviewed assessment questions:

```bash
pnpm db:seed
```

Keep `DATABASE_URL` pointed at the Neon database while running this command.

## F. Deploy Frontend To Vercel

Create a Vercel project from the repository root.

The repository includes `vercel.json` with:

- install command: `pnpm install --frozen-lockfile`;
- build command: `pnpm --filter @skilltogether/web build`;
- output directory: `apps/web/dist`;
- rewrite from all routes to `/index.html` for React Router direct navigation.

Vercel documents SPA rewrites through `vercel.json`: https://vercel.com/docs/project-configuration/vercel-json

## G. Vercel Environment Variables

Set this in Vercel:

```bash
VITE_GRAPHQL_URL=https://skill-together-api.onrender.com/graphql
```

Replace the hostname with the actual Render service URL.

## H. Update API Frontend Origin

After the Vercel deployment URL is known, update Render:

```bash
FRONTEND_URL=https://skill-together.vercel.app
CORS_ALLOWED_ORIGINS=https://skill-together.vercel.app
```

Redeploy the API after changing these values. Never use `*` for CORS while credentials are enabled.

## I. Verify Authentication

1. Open the Vercel frontend URL.
2. Register a new account.
3. Confirm the GraphQL request goes to the Render `/graphql` endpoint.
4. Confirm session cookies are `HttpOnly`, `Secure`, and `SameSite=None`.
5. Refresh a protected page and confirm the session persists.
6. Log out and confirm protected data is no longer available.

## J. Share URL

After authentication and core MVP flows work, share the Vercel URL with your friend.

## Free-Tier Constraints

- Render free web services can sleep while idle, so the first request after idle can be slow. Render documents free service spin-down behavior here: https://render.com/docs/free
- Neon free databases are suitable for development and small personal use, but have usage limits. Check current limits in the Neon dashboard before sharing widely.
- Vercel Hobby is intended for personal, non-commercial use. Vercel documents Hobby plan usage here: https://vercel.com/docs/plans/hobby

## Health Checks

- `/health/live`: process is running.
- `/health/ready`: database is reachable.

Do not expose secrets or database details from health endpoints.
