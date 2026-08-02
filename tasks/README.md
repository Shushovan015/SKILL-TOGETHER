# Task Phase Index

Implementation must proceed phase by phase. Before starting a phase, read the required documentation listed in that phase file and confirm MVP boundaries from `docs/07-mvp-scope.md`.

Do not mark checkboxes complete unless the implementation, tests, validation, and documentation updates are actually done.

| Phase | File | Objective |
| --- | --- | --- |
| 1 | [Foundation](phase-01-foundation.md) | Bootstrap monorepo, tooling, CI, local infrastructure. |
| 2 | [Authentication](phase-02-authentication.md) | Registration, login, logout, sessions, auth guards. |
| 3 | [Learning Tracks](phase-03-learning-tracks.md) | Content schema, tracks, modules, lessons, admin approval. |
| 4 | [Daily Planner](phase-04-daily-planner.md) | Onboarding, Study Plan, Daily Tasks, scheduling, recovery. |
| 5 | [Lessons](phase-05-lessons.md) | Lesson page, exercises, completion evidence, reflections. |
| 6 | [Assessments](phase-06-assessments.md) | Weekly Assessment attempts, scoring, results, revision. |
| 7 | [Accountability](phase-07-accountability.md) | Partner invitations, connections, privacy-scoped progress. |
| 8 | [AI Features](phase-08-ai-features.md) | Optional AI assistance behind provider interface. |
| 9 | [Testing and Hardening](phase-09-testing.md) | Security, accessibility, observability, E2E, performance. |
| 10 | [Deployment](phase-10-deployment.md) | Production readiness, migrations, health checks, rollback. |

## Required Validation

Run before completing implementation phases once package scripts exist:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
