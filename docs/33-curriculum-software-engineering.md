# Curriculum: Software Engineering

## Goal

Build advanced practical software-engineering capability, portfolio evidence, and employment readiness across a four-to-six-month Learning Track.

## Structure

- Five study days per week.
- Default duration: 120 minutes per session.
- Weekly Assessment on Friday.
- Recovery day on Saturday.
- First four weeks are detailed for MVP seed data.
- Later months are module-level outlines.

## Professional Phase Overview

| Phase | Focus | Outcome |
| --- | --- | --- |
| Phase 1 | TypeScript Professional Foundation | Strict TypeScript, inference, nullability, object/function typing, unions, narrowing, validation, and error modeling for JavaScript-experienced frontend developers. |
| Phase 2 | Advanced TypeScript | Generics, constraints, keyof, mapped types, conditional types, infer, utility types, branded types, satisfies, const assertions, and type-safe architecture. |
| Phase 3 | Professional React and Frontend Architecture | Feature organization, composition, state ownership, forms, server state, accessibility, testing, and performance. |
| Phase 4 | Testing, Accessibility and Performance | Unit, integration, E2E, accessibility, profiling, code splitting, and quality gates. |
| Phase 5 | GraphQL Professional Development | Schema design, resolvers, authorization, pagination, DataLoader, caching, security, Apollo Client, and GraphQL testing. |
| Phase 6 | Backend Engineering with FastAPI | Python typing, FastAPI, Pydantic, services, repositories, SQLAlchemy, transactions, async work, errors, logging, and tests. |
| Phase 7 | Databases and Data Modeling | PostgreSQL, schema design, constraints, indexes, joins, query planning, transactions, concurrency, migrations, and SQL interview practice. |
| Phase 8 | Authentication, Authorization and Security | Sessions, cookies, JWT tradeoffs, object authorization, CSRF, CORS, secrets, GraphQL security, and threat modeling. |
| Phase 9 | Full-Stack Architecture | Modular monoliths, layered design, API contracts, domain services, transactions, errors, and ADRs. |
| Phase 10 | Data Structures and Algorithms | DSA patterns for interviews and practical problem solving. |
| Phase 11 | System Design | Scalability, caching, queues, consistency, rate limiting, observability, failure handling, and design cases. |
| Phase 12 | Production Engineering | Docker, CI/CD, environments, logging, monitoring, debugging, incidents, dependencies, and release readiness. |
| Phase 13 | Interview Preparation | CV, GitHub, portfolio, DSA, system design, technical, debugging, code-review, and behavioral interviews. |
| Phase 14 | Capstone Project | Production-grade collaborative workflow platform with React, TypeScript, GraphQL, FastAPI, PostgreSQL, Docker, CI, tests, docs, deployment notes, demo, and retrospective. |

The current seed fully authors the first 15 professional sessions and stores the remaining phases as structured roadmap/session outlines. Detailed later-phase sessions should be authored in reviewed batches.

## Detailed MVP Seed Curriculum

### Week 1: Advanced TypeScript Foundations

| Lesson ID | Lesson | Objective | Prerequisites | Duration | Required | Practical Exercise | Completion Evidence | Tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SE-W01-D01 | TypeScript Strict Mode and Mental Model | Explain how TypeScript catches errors before runtime and configure strictness. | None | 120 | Yes | Convert loose JavaScript examples to strict TypeScript. | Type-safe snippet and written explanation. | `ts-strict`, `type-safety` |
| SE-W01-D02 | Primitive, Object, Union, and Narrowing Patterns | Use unions and narrowing to model real UI and API states. | SE-W01-D01 | 120 | Yes | Model loading, success, empty, and error states. | Discriminated union and state handling notes. | `ts-unions`, `narrowing` |
| SE-W01-D03 | Generics for Reusable Functions and Components | Build safe reusable helpers with generics. | SE-W01-D02 | 120 | Yes | Write generic list and API result helpers. | Generic helper code and examples. | `ts-generics` |
| SE-W01-D04 | Runtime Validation with Zod | Validate unknown external input before trusting it. | SE-W01-D02 | 120 | Yes | Create schemas for registration and schedule preferences. | Zod schema and invalid-case notes. | `validation`, `zod` |
| SE-W01-D05 | Weekly Assessment and Reflection | Demonstrate TypeScript modeling and validation understanding. | SE-W01-D01 to SE-W01-D04 | 90 | Yes | Complete quiz and refactor a typed form model. | Assessment answers and reflection. | `weekly-assessment`, `ts-review` |

### Week 2: React Architecture

| Lesson ID | Lesson | Objective | Prerequisites | Duration | Required | Practical Exercise | Completion Evidence | Tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SE-W02-D01 | React Component Boundaries | Split UI into focused, testable components. | SE-W01-D05 | 120 | Yes | Refactor a dashboard into page, section, and item components. | Component tree diagram and code. | `react-components` |
| SE-W02-D02 | Props, Composition, and Controlled State | Use composition instead of prop-heavy components. | SE-W02-D01 | 120 | Yes | Build reusable status card and action area. | Component code and prop rationale. | `react-composition` |
| SE-W02-D03 | Forms with React Hook Form and Zod | Build accessible validated forms. | SE-W01-D04 | 120 | Yes | Implement onboarding schedule form model. | Form schema, validation cases, UI notes. | `forms`, `zod`, `a11y` |
| SE-W02-D04 | Server State with Apollo Client | Separate server state from local UI state. | SE-W02-D01 | 120 | Yes | Design query and mutation usage for Today dashboard. | Query plan and cache update notes. | `apollo`, `server-state` |
| SE-W02-D05 | React Testing Basics | Test user-visible behavior and states. | SE-W02-D01 to SE-W02-D04 | 120 | Yes | Write tests for loading, empty, success, and error states. | Test cases and coverage notes. | `rtl`, `testing` |

### Week 3: GraphQL and Backend Foundations

| Lesson ID | Lesson | Objective | Prerequisites | Duration | Required | Practical Exercise | Completion Evidence | Tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SE-W03-D01 | GraphQL Schema Design | Design clear object, input, query, and mutation types. | SE-W02-D04 | 120 | Yes | Draft schema for Daily Task completion. | Schema excerpt and validation notes. | `graphql-schema` |
| SE-W03-D02 | NestJS Module Architecture | Explain NestJS modules, providers, resolvers, and services. | SE-W03-D01 | 120 | Yes | Map SkillTogether modules to NestJS structure. | Module diagram and responsibility table. | `nestjs`, `backend-architecture` |
| SE-W03-D03 | Thin Resolvers and Application Services | Keep business logic out of resolvers. | SE-W03-D02 | 120 | Yes | Refactor resolver pseudocode into service methods. | Before/after pseudocode. | `resolvers`, `services` |
| SE-W03-D04 | Prisma and Repository Boundaries | Model persistence without leaking database access everywhere. | SE-W03-D02 | 120 | Yes | Design repository methods for Daily Tasks. | Repository interface and transaction notes. | `prisma`, `repositories` |
| SE-W03-D05 | Backend Testing | Test services, GraphQL operations, and database integration. | SE-W03-D01 to SE-W03-D04 | 120 | Yes | Define tests for task completion and authorization. | Test plan and sample assertions. | `backend-testing`, `authorization` |

### Week 4: Database, Auth, and Security Basics

| Lesson ID | Lesson | Objective | Prerequisites | Duration | Required | Practical Exercise | Completion Evidence | Tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SE-W04-D01 | Relational Modeling for Learning Data | Design normalized tables and relationships. | SE-W03-D04 | 120 | Yes | Model Enrollment, Study Week, Daily Task, Task Attempt. | ER sketch and constraint list. | `postgresql`, `data-modeling` |
| SE-W04-D02 | Transactions and Historical Snapshots | Preserve completed work through transactional writes. | SE-W04-D01 | 120 | Yes | Write transaction pseudocode for task completion. | Pseudocode and snapshot field list. | `transactions`, `snapshots` |
| SE-W04-D03 | Cookie Sessions and Authorization | Explain secure sessions and object-level authorization. | SE-W03-D05 | 120 | Yes | Design auth checks for lesson and partner queries. | Threat cases and test cases. | `auth`, `authorization`, `cookies` |
| SE-W04-D04 | Accessibility and Frontend Quality | Apply semantic HTML, focus, and state design. | SE-W02-D05 | 120 | Yes | Audit a lesson page design for accessibility. | Accessibility checklist and fixes. | `accessibility`, `quality` |
| SE-W04-D05 | Weekly Assessment and Portfolio Checkpoint | Demonstrate full-stack design and security reasoning. | SE-W04-D01 to SE-W04-D04 | 120 | Yes | Complete scenario assessment and update portfolio notes. | Assessment result and portfolio evidence. | `weekly-assessment`, `portfolio` |

## Remaining Roadmap

### Month 2: Frontend Engineering Depth

- React Router layouts and route guards.
- Apollo cache normalization and invalidation.
- Advanced form flows.
- Component accessibility patterns.
- Performance profiling and bundle analysis.
- Frontend error boundaries and observability.

### Month 3: Backend and Database Depth

- GraphQL authorization and query complexity.
- Prisma schema implementation.
- PostgreSQL indexes, constraints, and migrations.
- Integration testing with test database.
- Background jobs.
- Audit logging.

### Month 4: Product-Grade Features

- Authentication hardening.
- Scheduling and assessment domain services.
- Partner visibility and privacy.
- Security testing.
- CI and deployment pipeline.
- Error monitoring.

### Month 5: System Design and Portfolio

- Caching.
- Queues.
- Scalability fundamentals.
- Failure handling.
- Architecture documentation.
- Portfolio project hardening.

### Month 6: Employment Preparation

- Data structures and algorithms review.
- Debugging practice.
- Technical interviews.
- Behavioral interviews.
- CV and GitHub preparation.
- Job application workflow.

## Assessment Approach

Weekly assessments include:

- multiple choice and multiple select on concepts;
- code challenges;
- debugging challenges;
- architecture scenarios;
- short written tradeoff explanations.

Official questions must be reviewed and tied to approved lesson assessment tags.
