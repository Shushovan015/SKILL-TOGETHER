# Definition of Done

This definition applies to implementation work after documentation is complete.

## Requirements

- Relevant task file has been read.
- Functional requirements and acceptance criteria are identified.
- MVP and future-scope boundaries are respected.
- Business rules are not silently changed.

## Implementation

- Smallest complete vertical slice is implemented.
- TypeScript strict mode passes.
- No unjustified `any`.
- Domain logic is outside React components.
- GraphQL resolvers remain thin.
- Persistence access is behind repositories or persistence services.
- Historical snapshots are preserved where required.

## Validation

Required commands pass once package scripts exist:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If a command cannot run because the repo is not bootstrapped, the limitation is reported.

## Authorization

- Every private query and mutation checks ownership, role, or Partner Connection.
- Unauthorized access returns safe errors.
- Authorization tests cover positive and negative cases.

## Security

- Inputs are validated.
- Sessions use secure HTTP-only cookies.
- CSRF controls protect mutations.
- Sensitive data is not logged.
- Rate limits cover risky endpoints.
- Secrets are not committed.

## Tests

- Unit tests cover new domain logic.
- Integration tests cover database and transaction behavior.
- GraphQL tests cover operation success and failure.
- Component tests cover user-visible states.
- E2E tests cover critical flows when affected.
- Accessibility checks cover affected pages.

## Accessibility

- Semantic HTML is used.
- Labels and error messages are accessible.
- Keyboard-only operation works.
- Focus is visible.
- Color is not the only status signal.

## Documentation

- Requirements, API, database, security, and task docs are updated when behavior changes.
- Major decisions are recorded in [38 Decisions](38-decisions.md).
- Task checkboxes are marked only when completed and verified.

## Observability

- Important workflows emit logs or audit events.
- Errors include stable codes.
- Sensitive metadata is redacted.
- Health or metrics changes are documented when relevant.

## Migrations

- Schema changes match [10 Database Schema](10-database-schema.md) or document the reason for divergence.
- Generated migration SQL is reviewed.
- Data migrations preserve learner history.
- Rollback or forward-fix plan is known.

## CI

- CI runs required validation commands.
- New failures are fixed before merge.
- Flaky tests are not ignored without documented issue and owner.

## Review

- Code review checks requirements, security, tests, accessibility, docs, and MVP boundaries.
- UI changes include screenshots or equivalent visual evidence.
- Risky changes include rollback notes.

## Deployment Readiness

- Environment variables are documented.
- Health checks pass.
- Database migrations are applied in correct order.
- Backup and rollback plan is confirmed.
- Production cookie and CORS settings are verified.
