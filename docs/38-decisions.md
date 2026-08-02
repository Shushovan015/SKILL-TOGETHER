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
