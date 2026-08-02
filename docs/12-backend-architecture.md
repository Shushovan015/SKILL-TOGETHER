# Backend Architecture

## Target Framework

The backend will use NestJS with TypeScript strict mode, GraphQL resolvers, Prisma persistence, and PostgreSQL. It is a modular monolith: modules are deployed together but own clear application boundaries.

## Module Structure

| Module | Responsibilities |
| --- | --- |
| AuthModule | Registration, login, logout, sessions, CSRF, password hashing, current user. |
| UsersModule | Profiles, roles, preferences, user lookup. |
| ContentModule | Tracks, Modules, Lessons, Lesson Versions, resources, exercises, content approval. |
| PlanningModule | Enrollment, Study Plan, Study Weeks, Daily Tasks, completion, recovery scheduling. |
| AssessmentModule | Weekly Assessment eligibility, attempts, answers, scoring, revision recommendations. |
| AccountabilityModule | Partner invitations, Partner Connections, shared progress. |
| AiModule | Provider interface, prompt creation, output validation, rate limiting, fallback. |
| ObservabilityModule | Logging, metrics, health checks, audit events. |

## Application Services

- `AuthService`: account creation, credential verification, session lifecycle.
- `OnboardingService`: validates learner preferences and activates Enrollment.
- `LessonCompletionService`: validates task ownership and evidence, snapshots Lesson Version, creates Task Attempt.
- `SchedulingService`: creates plans, marks misses, proposes recovery, applies learner-approved changes.
- `AssessmentService`: creates attempts, validates answers, scores objective questions, queues manual grading.
- `ProgressService`: recalculates Progress Snapshots from authoritative records.
- `PartnerService`: manages invitations, connections, visibility rules.
- `ContentReviewService`: manages content status transitions and audit events.
- `AiAssistanceService`: runs optional AI actions behind feature flags.

## Domain Services

Domain services contain deterministic business rules independent of NestJS:

- lesson prerequisite ordering;
- daily capacity calculation;
- missed-session recovery proposal;
- assessment eligibility;
- objective scoring;
- weak-topic detection;
- partner visibility filtering.

## Persistence Boundaries

- Use Prisma inside repositories or clearly named persistence services.
- Do not call Prisma directly from GraphQL resolvers.
- Keep transactions inside application services that coordinate multiple writes.
- Use optimistic checks for status transitions where concurrent submissions are possible.
- Store snapshots at completion and assessment submission boundaries.

## GraphQL Resolver Boundaries

Resolvers should:

- declare GraphQL operation shape;
- apply authentication guards;
- accept validated inputs;
- delegate to services;
- return DTOs scoped to authorization.

Resolvers should not:

- contain scheduling algorithms;
- contain scoring algorithms;
- select raw partner-private data;
- call external AI providers directly.

## Validation

- Validate GraphQL input types structurally.
- Validate semantic rules in services.
- Use Zod or equivalent schemas for complex JSONB payloads, AI responses, and environment variables.
- Return stable error codes from [37 API Error Catalogue](37-api-error-catalogue.md).

## Authorization

- Use role guards for administrator operations.
- Use object ownership checks for user-owned records.
- Use Partner Connection visibility checks for shared progress.
- Apply authorization before returning resource existence details.
- Add tests for every private GraphQL operation.

## Transactions

Use transactions for:

- registration with profile/session creation;
- onboarding Enrollment, Study Plan, Study Week, and Daily Task creation;
- task completion and Progress Snapshot update;
- assessment submission and scoring status update;
- partner invitation acceptance and connection creation;
- content approval and audit event creation.

## Error Handling

- Convert domain errors to stable API error codes.
- Log internal details with request ID and redacted metadata.
- Return safe user messages.
- Mark retryable errors explicitly where the client can retry.

## Background Work

MVP background jobs can be implemented as scheduled backend tasks before introducing a separate worker:

- mark missed Daily Tasks;
- expire partner invitations;
- recalculate stale Progress Snapshots;
- purge expired sessions;
- send email placeholders once email is configured.

Jobs must be idempotent.

## Testing

- Unit tests for domain services.
- Integration tests for repositories and transactions.
- GraphQL tests for operations and authorization.
- Security tests for session, CSRF, and private resource access.
- Contract tests for AI provider output validation.

## Proposed Directory Tree

```text
apps/api/src/
├── app.module.ts
├── common/
│   ├── errors/
│   ├── guards/
│   ├── logging/
│   └── validation/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── content/
│   ├── planning/
│   ├── assessment/
│   ├── accountability/
│   ├── ai/
│   └── observability/
└── prisma/
    └── prisma.service.ts
```
