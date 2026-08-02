# Development Standards

## TypeScript

- Enable `strict: true`.
- Do not use `any` unless a local comment explains why no safer type is practical.
- Prefer explicit domain types over unstructured objects.
- Validate unknown external data before narrowing.
- Keep shared types in a shared package only when both frontend and backend need them.

## Naming

- Use project terms exactly: Learning Track, Module, Lesson, Enrollment, Study Plan, Study Week, Daily Task, Task Attempt, Weekly Assessment, Assessment Attempt, Partner Connection, Learning Reflection.
- Use stable IDs for requirements, acceptance criteria, lessons, and error codes.
- Use `...Service` for application services and `...Repository` or `...Persistence` for database access.

## Modules

- Organize backend by domain module.
- Organize frontend by feature.
- Export only intentional public APIs.
- Keep cross-module dependencies explicit.

## Imports

- Prefer path aliases configured per workspace after bootstrapping.
- Avoid deep imports across feature internals.
- Avoid circular dependencies.

## Errors

- Use stable error codes from [37 API Error Catalogue](37-api-error-catalogue.md).
- Return safe user messages.
- Log internal detail separately with request ID.
- Mark retryability.

## Validation

- Validate all external input at the API boundary.
- Validate complex JSON payloads with schemas.
- Validate environment variables during startup.
- Keep frontend validation aligned with backend validation but do not rely on frontend validation alone.

## Frontend Patterns

- Keep domain logic out of React components.
- Use React Hook Form and Zod for forms.
- Use Apollo Client for server state.
- Show loading, empty, success, and error states.
- Use accessible semantic HTML.
- Keep components focused and testable.

## Backend Patterns

- Keep resolvers thin.
- Put business workflows in application services.
- Put pure rules in domain services.
- Use transactions for multi-write workflows.
- Enforce authorization in services or guards before data return.
- Keep persistence access behind repositories or persistence services.

## GraphQL Rules

- Use input types for mutations.
- Use DTOs that expose only authorized fields.
- Use cursor pagination for large lists.
- Limit depth and complexity.
- Avoid leaking internal exceptions.

## Prisma Rules

- Do not create migrations until schema decisions are reviewed.
- Review generated SQL.
- Use explicit relations and indexes.
- Avoid storing unvalidated JSONB.
- Preserve historical attempt snapshots.

## Testing

- Add tests for new business logic.
- Add authorization tests for private resources.
- Add regression tests for scheduling and assessment bugs.
- Keep fixtures deterministic.
- Run lint, typecheck, test, and build before completing implementation tasks.

## Accessibility

- Use semantic elements.
- Label all controls.
- Keep focus visible.
- Verify keyboard-only operation.
- Do not use color alone.
- Run automated checks for critical pages.

## Security

- No secrets in source code.
- No tokens in localStorage.
- Use HTTP-only cookies.
- Redact sensitive logs.
- Rate-limit risky operations.
- Document new security decisions.

## Documentation

- Update docs when behavior changes.
- Update GraphQL docs before changing API contracts.
- Update database docs before schema changes.
- Record major decisions in [38 Decisions](38-decisions.md).
- Keep task files phase-aligned.

## Commits

- Keep commits focused.
- Use imperative commit messages.
- Do not mix unrelated formatting churn with feature changes.
- Include tests and docs with implementation when relevant.

## Pull Requests

Every PR should include:

- summary;
- linked task phase and requirement IDs;
- screenshots for UI changes;
- tests run;
- security and accessibility notes;
- migration notes if any.

## Code Review Checklist

- Requirements and acceptance criteria are satisfied.
- TypeScript is strict and typed.
- Authorization is enforced server-side.
- Inputs are validated.
- Sensitive data is not logged.
- Tests cover business logic and failure paths.
- UI states are complete and accessible.
- Documentation is updated.
- MVP boundaries are respected.
