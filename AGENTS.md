# AGENTS.md

## Project Summary

SkillTogether is a web-based learning accountability platform for people following structured four-to-six-month learning programmes. The MVP supports predefined Software Engineering, Project Management, and German Learning Tracks with daily lessons, weekly assessments, missed-session recovery, progress tracking, partner accountability, and optional AI-assisted explanations.

The product promise is: open the application, complete today's lesson, prove what you learned, and let the system guide the next session.

## Mandatory Reading Order

Before implementing any task, read these files in order:

1. `docs/00-index.md`
2. `docs/02-product-requirements.md`
3. `docs/07-mvp-scope.md`
4. `docs/11-system-architecture.md`
5. `docs/29-development-standards.md`
6. The matching phase file in `tasks/`

For feature-specific work, also read the domain document linked from the task file. Do not begin implementation until the relevant documentation has been read.

## Approved Stack

- Monorepo: pnpm workspaces
- Frontend: React, TypeScript, Vite, React Router, Tailwind CSS
- Forms: React Hook Form with Zod validation
- GraphQL client: Apollo Client
- Backend: Node.js, TypeScript, NestJS
- API: GraphQL with Apollo Server integration where suitable
- ORM and database: Prisma with PostgreSQL
- Authentication: email/password with secure HTTP-only cookie sessions
- Testing: Vitest, React Testing Library, backend integration tests, Playwright
- Infrastructure: Docker, Docker Compose, GitHub Actions, managed PostgreSQL in production

Do not replace these technologies unless a documented decision in `docs/38-decisions.md` approves the change.

## Repository Rules

- Keep the application in a pnpm workspace monorepo.
- Keep frontend and backend code in separate workspace packages when implementation begins.
- Keep domain terminology consistent with `docs/09-domain-model.md`.
- Do not store secrets in source control.
- Do not commit generated build output.
- Do not delete, rename, or overwrite documentation without preserving useful content.
- Update documentation in the same task when behavior, schemas, security rules, or user flows change.

## Architecture Rules

- Use a modular monolith for the MVP.
- Keep GraphQL resolvers thin.
- Keep business logic in application or domain services.
- Keep database access behind repositories or clearly named persistence services.
- Keep complex domain logic outside React components.
- Validate all external input at boundaries.
- Enforce authorization server-side for every private resource.
- Keep AI optional and isolated behind a provider interface.
- Use deterministic scheduling for MVP recovery and planning.
- Do not implement microservices or future-scope features during MVP work.

## Testing Requirements

- Add or update tests for new business logic.
- Include unit tests for domain services.
- Include integration tests for repositories, GraphQL operations, authentication, and authorization.
- Include component tests for user-facing frontend states.
- Include Playwright tests for critical happy paths and recovery paths.
- Add accessibility checks for core pages and reusable controls.

## Security Requirements

- Use secure HTTP-only cookies for sessions.
- Do not store authentication tokens in localStorage.
- Hash passwords with Argon2id or another documented modern password hasher.
- Normalize emails before persistence.
- Validate input with Zod, GraphQL input types, and server-side rules.
- Protect state-changing operations from CSRF.
- Redact secrets, credentials, session identifiers, private notes, assessment answers, and AI prompts from logs.
- Apply partner visibility rules from `docs/20-accountability-system.md`.

## Documentation Update Rules

- Update requirements when feature behavior changes.
- Update `docs/10-database-schema.md` before introducing schema changes.
- Update `docs/14-graphql-api-design.md` before changing API contracts.
- Record significant tradeoffs in `docs/38-decisions.md`.
- Keep task files phase-by-phase; do not mark implementation checkboxes complete unless code was implemented and verified.

## Task Workflow

For every implementation task:

1. Read the mandatory documentation and phase task file.
2. Inspect the current implementation.
3. Write a short implementation plan.
4. Implement the smallest complete vertical slice.
5. Add or update tests.
6. Run validation commands.
7. Update task status only for completed work.
8. Report changed files, decisions, validation results, and remaining concerns.

## Validation Commands

Run these before completing implementation tasks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If the repository has not yet been bootstrapped with package scripts, report that the command could not run and do not install dependencies unless the user asks.

## Git Rules

- Keep commits focused on one task or phase.
- Do not rewrite unrelated user changes.
- Do not use destructive Git commands unless explicitly requested.
- Include documentation changes in the same pull request as the behavior they describe.

## Future Scope Guardrail

Features listed as excluded from the MVP in `docs/07-mvp-scope.md` and `docs/08-future-scope.md` must not be implemented during MVP phases unless the documentation is intentionally revised first.
