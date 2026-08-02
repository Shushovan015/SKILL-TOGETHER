# SkillTogether

SkillTogether is a web-based learning accountability platform for people following structured four-to-six-month programmes. It helps learners know exactly what to study today, complete lesson content and exercises, record completion evidence, recover missed sessions, and share progress with an accountability partner.

## Key Features

- Predefined Learning Tracks for Software Engineering, Project Management, and German.
- Daily Tasks generated from a configurable Study Plan.
- Complete Lesson content with objectives, examples, exercises, knowledge checks, and approved resources.
- Weekly Assessments based on completed approved lessons.
- Missed-session recovery that preserves completed work and respects available study time.
- Partner accountability with privacy-preserving shared progress.
- Basic administrator content management for lessons and assessments.
- Optional AI assistance isolated behind a provider interface.

## Architecture Summary

The target MVP is a modular monolith in a pnpm workspace monorepo. The frontend is a React/Vite app using Apollo Client and Tailwind CSS when those feature phases are implemented. The backend is a NestJS GraphQL API with Prisma and PostgreSQL. Authentication will use secure HTTP-only cookie sessions.

AI features are optional for the MVP and must be grounded in approved lesson content. Scheduling is deterministic and must not depend on AI.

## Intended Stack

| Area | Technology |
| --- | --- |
| Monorepo | pnpm workspaces |
| Frontend | React, TypeScript, Vite, React Router, Tailwind CSS |
| Forms | React Hook Form, Zod |
| API client | Apollo Client |
| Backend | Node.js, TypeScript, NestJS |
| API | GraphQL |
| Database | PostgreSQL |
| ORM | Prisma |
| Tests | Vitest, React Testing Library, Playwright |
| Infrastructure | Docker, Docker Compose, GitHub Actions |

## Repository Structure

```text
.
|-- apps/
|   |-- api/   NestJS API shell
|   `-- web/   Vite React web shell
|-- docs/      Product, architecture, security, curriculum, and delivery docs
|-- packages/
|   `-- shared/ Shared TypeScript utilities
|-- tasks/     Phase-by-phase implementation task files
|-- docker-compose.yml
|-- AGENTS.md
`-- README.md
```

Phase 1 has created package shells only. Authentication, learning tracks, lessons, assessments, accountability, and AI features are not implemented yet.

## Local Development

Install dependencies:

```bash
pnpm install
```

Start local PostgreSQL:

```bash
docker compose up -d postgres
```

Run the API shell:

```bash
pnpm dev:api
```

Run the web shell:

```bash
pnpm dev:web
```

Validation commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Environment Variables

See `.env.example` for planned variables. Required categories are database connection, session signing, frontend origin, CORS, optional AI provider settings, and observability configuration.

## Testing Strategy

The project will use a layered test strategy:

- Unit tests for scheduling, assessment scoring, visibility rules, and domain services.
- Backend integration tests for GraphQL operations, repositories, authentication, and authorization.
- Component tests for page states and form behavior.
- Playwright tests for registration, onboarding, daily lesson completion, missed-session recovery, assessment completion, and partner invitation.

Phase 1 currently includes smoke tests for the package shell, API health response shape, route shell boundaries, and shared environment validation helper.

## Documentation Links

Start with [`docs/00-index.md`](docs/00-index.md). Phase work begins in [`tasks/README.md`](tasks/README.md).

## Project Status

Phase 1 foundation scaffold. The repository has a pnpm workspace, strict TypeScript configuration, Vite React shell, NestJS API shell, shared environment validation helper, Docker Compose PostgreSQL service, smoke tests, and CI workflow. Product features begin in later phases.
