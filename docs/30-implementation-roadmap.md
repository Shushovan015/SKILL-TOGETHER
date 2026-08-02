# Implementation Roadmap

Each phase must be implemented through the matching task file in `tasks/`. Do not mark tasks complete until code, tests, validation, and documentation are done.

## Phase 1: Foundation

| Field | Detail |
| --- | --- |
| Objective | Bootstrap monorepo, shared tooling, CI skeleton, environment validation, and local database plan. |
| Dependencies | Documentation baseline. |
| Deliverables | pnpm workspace, frontend/backend package shells, TypeScript strict config, lint/test/build scripts, Docker Compose for PostgreSQL, CI workflow. |
| Risks | Premature feature code; inconsistent tooling. |
| Exit Criteria | Required commands run, packages compile, local database starts, docs updated. |
| Non-Goals | Authentication, UI feature pages, Prisma domain schema beyond foundation if not ready. |

## Phase 2: Authentication

| Field | Detail |
| --- | --- |
| Objective | Implement secure registration, login, logout, sessions, current user, and auth guards. |
| Dependencies | Phase 1. |
| Deliverables | User schema, password hashing, session table, secure cookies, CSRF, GraphQL auth operations, auth forms. |
| Risks | Session leakage, weak CSRF, poor error messages. |
| Exit Criteria | Auth tests pass, private query rejects anonymous users, cookies are HTTP-only. |
| Non-Goals | Social login, payments, organization accounts. |

## Phase 3: Learning Tracks

| Field | Detail |
| --- | --- |
| Objective | Model predefined tracks, modules, lessons, versions, resources, exercises, and admin content states. |
| Dependencies | Phases 1 and 2. |
| Deliverables | Content schema, seed data, track browsing, admin draft/review/approval basics. |
| Risks | Unversioned content altering history later. |
| Exit Criteria | Approved lesson versions can be queried and unapproved content is excluded from learner scheduling. |
| Non-Goals | Full rich text CMS, marketplace, generated curricula. |

## Phase 4: Daily Planner and Scheduling

| Field | Detail |
| --- | --- |
| Objective | Implement onboarding, Enrollment, Study Plan, Study Weeks, Daily Tasks, dashboard, weekly plan, missed-session recovery. |
| Dependencies | Phase 3 approved content. |
| Deliverables | Deterministic scheduler, capacity validation, task statuses, recovery proposals, audit events. |
| Risks | Hidden schedule changes; prerequisite violations. |
| Exit Criteria | Learner can create a plan, see today/week, miss a task, and apply valid recovery. |
| Non-Goals | AI scheduling, calendar integration. |

## Phase 5: Lessons

| Field | Detail |
| --- | --- |
| Objective | Implement scheduled Lesson page, exercises, completion evidence, study-time recording, and Learning Reflection. |
| Dependencies | Phase 4 Daily Tasks. |
| Deliverables | Lesson page, completion mutation, Task Attempt snapshots, progress update. |
| Risks | Incomplete snapshots; evidence not validated. |
| Exit Criteria | Completed tasks preserve lesson snapshots and cannot be auto-rescheduled. |
| Non-Goals | File uploads unless explicitly scoped; video hosting. |

## Phase 6: Assessments

| Field | Detail |
| --- | --- |
| Objective | Implement Weekly Assessment attempts, question selection, answer submission, scoring, results, and revision recommendations. |
| Dependencies | Phases 3 and 5. |
| Deliverables | Assessment schema, reviewed question bank, attempt flow, objective scoring, weak-topic detection. |
| Risks | Unapproved content in assessments; manual grading ambiguity. |
| Exit Criteria | Eligible learner completes a weekly assessment and receives result or pending manual state. |
| Non-Goals | Production AI grading without review controls. |

## Phase 7: Accountability

| Field | Detail |
| --- | --- |
| Objective | Implement partner invitations, Partner Connections, shared progress dashboard, removal, and blocking. |
| Dependencies | Progress snapshots from Phases 4 to 6. |
| Deliverables | Invitation lifecycle, scoped progress DTOs, privacy tests. |
| Risks | Private data leakage. |
| Exit Criteria | Partner sees only approved progress fields and cannot access private notes or exact answers. |
| Non-Goals | Public profiles, leaderboards, real-time messaging. |

## Phase 8: AI Assistance

| Field | Detail |
| --- | --- |
| Objective | Add optional AI explanation and formative feedback behind provider interface and feature flag. |
| Dependencies | Approved content and core flows complete. |
| Deliverables | Provider interface, prompt builder, schema validation, rate limiting, fallback UI. |
| Risks | Prompt injection, privacy leakage, over-reliance on AI. |
| Exit Criteria | AI can be disabled without breaking app; invalid output is rejected. |
| Non-Goals | AI scheduling, official autonomous grading, full curriculum generation. |

## Phase 9: Hardening

| Field | Detail |
| --- | --- |
| Objective | Strengthen testing, accessibility, security, observability, and operational readiness. |
| Dependencies | Functional MVP flows. |
| Deliverables | E2E suite, accessibility review, rate limits, query complexity limits, audit coverage, monitoring hooks. |
| Risks | Late discovery of security or accessibility gaps. |
| Exit Criteria | Critical flows pass tests and documented security review. |
| Non-Goals | Major product expansion. |

## Phase 10: Deployment

| Field | Detail |
| --- | --- |
| Objective | Prepare production deployment and runbooks. |
| Dependencies | Phase 9. |
| Deliverables | Production env docs, deployment pipeline, migrations, backup verification, health checks, rollback plan. |
| Risks | Environment drift, cookie/CORS misconfiguration. |
| Exit Criteria | Staging or preview deployment passes verification checklist. |
| Non-Goals | Vendor lock-in without documented decision. |
