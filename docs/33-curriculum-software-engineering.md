# Curriculum: Software Engineering

## Goal

Build strong practical full-stack software-engineering capability, portfolio evidence, and interview readiness across a serious five-to-six-month Learning Track. The track is for a learner who already knows JavaScript, has frontend and React experience, understands HTML/CSS and basic APIs, has basic Git experience, and is nearly new to TypeScript.

The programme must not promise employment. It provides structured knowledge, practical evidence, professional judgment practice, and interview preparation expected from a job-oriented engineering course.

## Current Implementation Status

The seed now implements the complete Software Engineering career programme as approved learner-facing Lesson Versions in the existing SkillTogether content system. It does not introduce a second curriculum architecture.

Implemented seed coverage:

- 14 professional phases.
- 24 weekly modules.
- 120 daily learning units.
- 5 study days per week.
- Complete 120-minute source sessions with 30, 60, 90, and 120-minute completion paths in every lesson.
- 24 weekly professional assessments.
- 360 embedded interview questions.
- 24 portfolio or capstone project milestones.
- 8 DSA problem-pattern sessions.
- 8 system-design case sessions.
- 5-session final capstone.
- Verified supplemental resources from official or reputable providers.

Canonical implementation file:

- `apps/api/src/modules/content/seed/software-engineering-career-program.ts`

## Learning Architecture

The implemented hierarchy is:

Software Engineering programme -> Phase -> Weekly Module -> Learning Unit -> Activity Plan -> Daily Session.

Each daily session includes:

- learner-facing objective;
- prerequisites through sequential Lesson links;
- difficulty;
- priority-style activity plan;
- skill and assessment tags;
- progression state;
- 30/60/90/120-minute duration guidance;
- explanation and conceptual model;
- realistic engineering scenario;
- guided exercise with answer notes;
- independent transfer exercise with answer notes;
- knowledge checks;
- common mistakes;
- professional relevance;
- resources;
- interview questions;
- project or capstone connection.

## Phase and Module Map

| Week | Phase | Module Focus | Project Evidence |
| --- | --- | --- | --- |
| 1 | TypeScript Professional Foundation | Compiler mental model and strict JavaScript-to-TypeScript boundaries | Strict TypeScript boundary checklist |
| 2 | TypeScript Professional Foundation | Unions, narrowing, safe unknown data, readonly values, and exhausted states | Typed UI state model |
| 3 | Advanced TypeScript | Generics, constraints, keyof, indexed access, mapped types, utility types, and API transformations | Reusable type-safe helper library |
| 4 | Advanced TypeScript | Template literals, overloads, declaration files, branded values, and type-safe architecture | Type-safe domain model package |
| 5 | Professional React and Frontend Architecture | Feature boundaries, component composition, state ownership, hooks, and service extraction | Frontend feature architecture plan |
| 6 | Professional React and Frontend Architecture | Router architecture, accessible forms, server state, Apollo cache, and resilient UI states | Data-driven frontend workflow |
| 7 | Professional React and Frontend Architecture | Accessibility, error boundaries, performance, memoization, code splitting, and frontend security | Frontend quality gate |
| 8 | GraphQL Professional Engineering | Schema fundamentals, nullability, queries, mutations, fragments, variables, and resolver boundaries | GraphQL schema and resolver plan |
| 9 | GraphQL Professional Engineering | Authorization, validation, pagination, DataLoader, caching, evolution, security, and performance | Production GraphQL guardrail pack |
| 10 | Python for Backend Engineers | Python syntax, typing, data modeling, packages, async basics, and backend conventions | Python backend readiness workbook |
| 11 | FastAPI Professional Backend | FastAPI structure, routing, Pydantic validation, dependencies, services, repositories, and API security | FastAPI service slice |
| 12 | FastAPI Professional Backend | Persistence, transactions, async work, configuration, observability, pytest, integration tests, and deployment | Production-ready backend service |
| 13 | PostgreSQL and Database Engineering | Relational modeling, normalization, constraints, SQL querying, indexes, and plans | Database design and query workbook |
| 14 | PostgreSQL and Database Engineering | Transactions, isolation, locks, concurrency, migrations, pooling, performance, and SQL security | Database incident response pack |
| 15 | Authentication, Authorization, and Security | Sessions, cookies, CSRF, CORS, XSS, injection, object authorization, permissions, secrets, and threat modeling | Security review and threat model |
| 16 | Testing and Software Quality | Unit, integration, frontend, backend, database, GraphQL, fixtures, fakes, mocks, and business-rule tests | Cross-layer test strategy |
| 17 | Testing and Software Quality | E2E, accessibility checks, contract thinking, CI quality gates, flaky-test avoidance, code review, and refactoring | Release quality gate |
| 18 | Data Structures and Algorithms | Complexity, arrays, strings, hash maps, sets, stacks, queues, linked lists, binary search, sorting, and intervals | DSA pattern workbook part 1 |
| 19 | Data Structures and Algorithms | Recursion, trees, heaps, graphs, BFS, DFS, tries, backtracking, greedy, dynamic programming, and union-find | DSA pattern workbook part 2 |
| 20 | System Design | Requirements, estimation, latency, throughput, scalability, load balancing, CDN, caching, storage, and data choices | System design case workbook part 1 |
| 21 | System Design | Queues, events, rate limiting, idempotency, consistency, observability, fault tolerance, gateways, and design cases | System design case workbook part 2 |
| 22 | Production Engineering | Docker, environments, CI/CD, migrations, observability, debugging, incidents, documentation, Git, and reviews | Production readiness packet |
| 23 | Interview and Career Preparation | CV, GitHub, portfolio, project explanation, technical interviews, behavioral answers, debugging, and code review | Interview readiness portfolio |
| 24 | Capstone Project | Full-stack delivery, tests, docs, deployment notes, demo, and retrospective | Capstone delivery package |

## Covered Domains

The implemented programme covers:

- TypeScript mental model, compiler, inference, primitives, arrays, tuples, object typing, function typing, optional/default parameters, return types, interfaces, type aliases, unions, intersections, literals, narrowing, discriminated unions, unknown, never, any avoidance, enum alternatives, readonly, const assertions, satisfies, nullability, type guards, and assertion functions.
- Advanced TypeScript generics, constraints, keyof, typeof-style boundary thinking, indexed access, mapped types, conditional types, infer, utility types, template literal types, overloads, declaration files, module typing, API typing, domain models, branded types, error modeling, architecture, inference, and public API type design.
- Professional React architecture, component composition, feature boundaries, hooks, custom hooks, state ownership, URL state, form state, derived state, routing, React Hook Form, Zod, data fetching, caching, optimistic updates, loading/error/empty states, error boundaries, accessibility, performance, memoization, code splitting, frontend security, and testing.
- GraphQL schema design, scalars, enums, inputs, queries, mutations, fragments, variables, nullability, relationships, resolver architecture, context, authentication, authorization, validation, pagination, filtering, sorting, errors, DataLoader, N+1, caching, schema evolution, deprecation, persisted queries, depth/complexity protection, Apollo Client, cache policies, and GraphQL architecture.
- Python and FastAPI for backend engineers, including typed Python, dataclasses, packages, virtual environments, async, FastAPI routing, Pydantic, dependencies, services, repositories, layering, structured errors, middleware, sessions vs JWT, cookies, security, REST design, pagination, caching, logging, observability, pytest, integration tests, and deployment.
- PostgreSQL and database engineering, including modeling, normalization, denormalization, constraints, indexes, joins, grouping, aggregation, transactions, ACID, isolation, locks, concurrency, migrations, query plans, pooling, performance, SQL security, integrity, and schema evolution.
- Security, testing, DSA, system design, production engineering, debugging, code review, portfolio development, and interview preparation.

## Weekly Assessments

Every study week ends with an assessment lesson in the content sequence. The reviewed Software Engineering assessment question bank now creates these professional item types for every studied assessment tag:

- Part A - Knowledge.
- Part B - Explain concepts/application.
- Part C - Coding challenge.
- Part D - Debugging challenge.
- Part E - Architecture/design case study.
- Part F - Interview question.
- Part F - Interview feedback and revision reflection.

Objective items are auto-scored. Coding, debugging, design, interview, and reflection items use manual grading mode under the current MVP assessment engine.

## Capstone

The final capstone is a production-style collaborative workflow platform, not a basic todo application. It requires:

- React and TypeScript frontend;
- routing, forms, validation, accessibility, and frontend tests;
- GraphQL boundary where appropriate;
- FastAPI and Python backend;
- PostgreSQL database design and migrations;
- authentication, authorization, security review, caching where justified, error handling, logging, Docker, CI, deployment notes, and tests;
- README, architecture diagram, API documentation, ADRs, screenshots or demo notes, and technical retrospective.

The capstone is implemented as five final sessions covering architecture, frontend, backend/API/database/security, production engineering, and final demo/interview retrospective.
