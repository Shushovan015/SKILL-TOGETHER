# Decisions

This document records initial architecture decision records. Status values: Proposed, Accepted, Superseded.

## ADR-001: Use a pnpm Workspace Monorepo

- Status: Accepted
- Context: The project needs frontend, backend, and shared tooling with consistent TypeScript rules.
- Decision: Use pnpm workspaces.
- Consequences: Shared scripts and dependencies are centralized; workspace boundaries must remain clear.

## ADR-002: Use a Modular Monolith for MVP

- Status: Accepted
- Context: The MVP needs speed, consistency, and simple deployment for a small team.
- Decision: Build one backend application with domain modules.
- Consequences: Avoids microservice overhead; module boundaries must be protected in code review.

## ADR-003: Use NestJS for Backend

- Status: Accepted
- Context: The backend needs GraphQL, dependency injection, guards, modules, and testable services.
- Decision: Use NestJS with TypeScript.
- Consequences: Developers must keep resolvers thin and domain logic in services.

## ADR-004: Use GraphQL API

- Status: Accepted
- Context: Frontend pages need structured, typed access to nested learning data.
- Decision: Use GraphQL for application API.
- Consequences: Must enforce query complexity, authorization, and stable error codes.

## ADR-005: Use PostgreSQL and Prisma

- Status: Accepted
- Context: The domain is relational and needs transactions, constraints, and typed access.
- Decision: Use PostgreSQL with Prisma ORM.
- Consequences: Schema design must preserve snapshots and constraints; migrations require review.

## ADR-006: Use Secure Cookie Sessions

- Status: Accepted
- Context: Browser app needs secure authentication without exposing bearer tokens to JavaScript.
- Decision: Use server-side sessions with secure HTTP-only cookies.
- Consequences: Requires CSRF controls, CORS discipline, and session storage.

## ADR-007: Use Deterministic Scheduling

- Status: Accepted
- Context: Learners need explainable recovery and predictable plans.
- Decision: MVP scheduling and missed-session recovery use deterministic rules.
- Consequences: AI cannot control schedule; edge cases must return reviewable conflicts.

## ADR-008: Use Predefined Curricula for MVP

- Status: Accepted
- Context: Official curriculum quality matters and full generated curricula are excluded.
- Decision: Seed predefined Software Engineering, Project Management, and German curricula.
- Consequences: Admin review workflow and content versioning are required.

## ADR-009: Isolate AI Behind Provider Interface

- Status: Accepted
- Context: AI features are optional and must not block core learning flows.
- Decision: Encapsulate AI in provider interface with validation, rate limiting, and fallback.
- Consequences: Core workflows must work with AI disabled.

## ADR-010: Version Lessons

- Status: Accepted
- Context: Lesson edits must not alter completed learner history.
- Decision: Lessons have immutable Lesson Versions and Task Attempt snapshots.
- Consequences: Scheduling uses approved versions; editing approved content creates a new draft version.

## ADR-011: Version Assessments

- Status: Accepted
- Context: Assessment fairness and historical scoring require stable question sets.
- Decision: Use Assessment Versions and question snapshots on attempts.
- Consequences: Submitted attempts remain interpretable after question changes.

## ADR-012: MVP Password Reset and Email Verification Timing

- Status: Proposed
- Context: Secure production accounts usually need reset and verification, but core MVP can be validated without email infrastructure.
- Decision: Document both flows; implement by hardening or before production launch if email is available.
- Consequences: Production launch must confirm account recovery policy.

## ADR-013: Main Dashboard Scope

- Status: Accepted
- Context: The core product promise is today's lesson, not calendar management.
- Decision: The dashboard prioritizes today's tasks, progress, missed sessions, assessment, and partner summary; the long roadmap lives separately.
- Consequences: UX must avoid overwhelming five-month calendar views on the dashboard.

## ADR-014: Phase 2 CSRF Bootstrap

- Status: Accepted
- Context: Authentication mutations are anonymous but still state-changing, and the GraphQL contract required CSRF without defining a browser bootstrap path.
- Decision: Add an anonymous `csrfToken` GraphQL query that sets a non-HTTP-only CSRF cookie. Mutations must send the same value in the configured CSRF header. Session identifiers remain HTTP-only.
- Consequences: Frontend auth forms can obtain CSRF before registration, login, and logout. The CSRF token is not an authentication token and must not grant access by itself.

## ADR-015: Authenticated Current User Query

- Status: Accepted
- Context: The initial GraphQL sketch defined `me: User`, but FR-AUTH-004 and AC-AUTH-004 require missing, expired, or revoked sessions to return `AUTH_REQUIRED`.
- Decision: Implement and document `me: User!` as an authenticated query. Anonymous screens should use auth form state or handle `AUTH_REQUIRED` rather than relying on nullable `me`.
- Consequences: Auth checks are explicit and testable. Public routes remain available through `csrfToken`, `register`, and `login`.

## ADR-016: Use `@node-rs/argon2` for Argon2id

- Status: Accepted
- Context: The native `argon2` package failed to build in the Windows development environment because node-gyp required local compiler/Python setup.
- Decision: Use `@node-rs/argon2`, configured for Argon2id with memory cost 19,456 KiB, time cost 3, parallelism 1, and 32-byte output.
- Consequences: Password storage keeps the documented Argon2id algorithm while avoiding fragile local native builds.

## ADR-017: Use Prisma 7 Config and PostgreSQL Adapter

- Status: Accepted
- Context: The installed Prisma 7 CLI no longer accepts datasource URLs inside `schema.prisma` and requires a driver adapter for direct database connections.
- Decision: Keep the Prisma schema provider-only, define datasource and migration paths in `prisma.config.ts`, generate the client to `apps/api/src/generated/prisma`, and construct `PrismaClient` with `@prisma/adapter-pg`.
- Consequences: Validation scripts run Prisma generation before typecheck, tests, E2E, and build. Generated Prisma files are ignored and regenerated locally/CI.

## ADR-018: Use Test-Only In-Memory Auth Persistence

- Status: Accepted
- Context: Docker/PostgreSQL may be unavailable in local sandboxed test runs, but Phase 2 still needs GraphQL and browser auth-flow coverage.
- Decision: Add `AUTH_PERSISTENCE=memory` for tests and E2E only. Normal runtime defaults to Prisma/PostgreSQL.
- Consequences: Auth service and resolver tests can validate session, CSRF, and error behavior without a database process. Repository and migration SQL remain the production persistence path.

## ADR-019: Split Phase 3 Track Selection from Phase 4 Scheduling

- Status: Accepted
- Context: The GraphQL sketch originally modeled `completeOnboarding` as creating Enrollment, Study Plan, Study Weeks, and Daily Tasks together, while Phase 3 is limited to Learning Tracks, content metadata, minimal Enrollment state, and track selection.
- Decision: Implement Phase 3 `selectLearningTrack` as an authenticated mutation that creates or updates a DRAFT Enrollment with Learning Track, start date, experience level, and target outcome only. Defer Study Plan, Study Week, Daily Task creation, capacity validation, and activation to Phase 4 `completeOnboarding`.
- Consequences: Learners can choose and browse a track in Phase 3 without creating scheduling records. Phase 4 must convert draft enrollment preferences into an ACTIVE scheduled Study Plan.

## ADR-020: Store Lesson Prerequisites Explicitly

- Status: Accepted
- Context: The domain model and GraphQL API expose Lesson prerequisites, but the planned database schema did not include a relationship for reusable Lesson prerequisite metadata.
- Decision: Add `lesson_prerequisites` as a self-referential join table on `lessons`.
- Consequences: Track and roadmap queries can return stable prerequisite Lesson IDs without introducing Daily Tasks or scheduling records.

## ADR-021: Use Test-Only In-Memory Content Persistence

- Status: Accepted
- Context: Phase 3 GraphQL and browser tests need seeded Learning Track content without requiring a local PostgreSQL process in sandboxed runs.
- Decision: Add `CONTENT_PERSISTENCE=memory` for tests and E2E only. Normal runtime defaults to Prisma/PostgreSQL and uses the idempotent seed script for development data.
- Consequences: Content tests can validate authorization, ordering, status filtering, and enrollment behavior without a database process. Production remains backed by PostgreSQL migrations and Prisma repositories.
