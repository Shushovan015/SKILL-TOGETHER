import type { LessonVersionEditorInput } from "../domain/content.types.js";
import type { SeedLessonDefinition, SeedModuleDefinition } from "./phase-03-seed-data.js";

type LearnerSeedContent = Pick<
  LessonVersionEditorInput,
  | "outcomes"
  | "explanationMarkdown"
  | "relevanceMarkdown"
  | "examples"
  | "commonMistakes"
  | "resources"
  | "exercises"
  | "knowledgeChecks"
>;

type PracticeKind =
  | "coding"
  | "frontend"
  | "graphql"
  | "backend"
  | "database"
  | "security"
  | "testing"
  | "debugging"
  | "dsa"
  | "system-design"
  | "production"
  | "career"
  | "assessment"
  | "capstone";

type ProgressionState = "NEW" | "REVIEW" | "CONSOLIDATION" | "EXPANSION";

interface SoftwareCareerSession {
  readonly id: string;
  readonly phase: number;
  readonly title: string;
  readonly objective: string;
  readonly learningUnit: string;
  readonly scenario: string;
  readonly evidence: string;
  readonly tags: readonly string[];
  readonly practiceKind: PracticeKind;
  readonly resources: readonly ResourceKey[];
  readonly progressionState: ProgressionState;
  readonly projectMilestone: string;
  readonly interviewQuestions: readonly string[];
}

interface SoftwareCareerWeek {
  readonly sequence: number;
  readonly phase: number;
  readonly phaseTitle: string;
  readonly title: string;
  readonly summary: string;
  readonly projectMilestone: string;
  readonly sessions: readonly SoftwareCareerSession[];
}

interface ResourceSeed {
  readonly title: string;
  readonly provider: string;
  readonly url: string;
  readonly resourceType: string;
  readonly difficulty: string;
  readonly estimatedMinutes: number;
  readonly description: string;
  readonly required: boolean;
}

type ResourceKey =
  | "typescript"
  | "mdn-js"
  | "react"
  | "react-reference"
  | "react-router"
  | "react-hook-form"
  | "zod"
  | "graphql"
  | "apollo"
  | "python"
  | "fastapi"
  | "pydantic"
  | "postgres"
  | "owasp-cheatsheet"
  | "owasp-top-ten"
  | "vitest"
  | "testing-library"
  | "playwright"
  | "wcag"
  | "docker"
  | "github-actions"
  | "sre-book"
  | "github-readme"
  | "github-flow";

const resourceCatalog: Record<ResourceKey, ResourceSeed> = {
  typescript: resource(
    "TypeScript Documentation",
    "TypeScript",
    "https://www.typescriptlang.org/docs/",
    "OFFICIAL_DOCS",
    "Foundational",
    30,
    "Official TypeScript documentation for the language, compiler, handbook, and configuration.",
    true
  ),
  "mdn-js": resource(
    "JavaScript Guide",
    "MDN",
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    "REFERENCE",
    "Foundational",
    25,
    "Reference material for JavaScript behavior that TypeScript code still runs on.",
    false
  ),
  react: resource(
    "React Learn",
    "React",
    "https://react.dev/learn",
    "OFFICIAL_DOCS",
    "Intermediate",
    30,
    "Official React learning material for component design, state, effects, and UI thinking.",
    true
  ),
  "react-reference": resource(
    "React API Reference",
    "React",
    "https://react.dev/reference/react",
    "OFFICIAL_DOCS",
    "Intermediate",
    25,
    "Official API reference for hooks, components, and rendering behavior.",
    false
  ),
  "react-router": resource(
    "React Router Documentation",
    "React Router",
    "https://reactrouter.com/home",
    "OFFICIAL_DOCS",
    "Intermediate",
    25,
    "Routing documentation for layouts, route modules, URL state, and navigation behavior.",
    true
  ),
  "react-hook-form": resource(
    "React Hook Form Documentation",
    "React Hook Form",
    "https://react-hook-form.com/get-started",
    "OFFICIAL_DOCS",
    "Intermediate",
    25,
    "Form-state documentation for accessible, validated React forms.",
    true
  ),
  zod: resource(
    "Zod Documentation",
    "Zod",
    "https://zod.dev/",
    "OFFICIAL_DOCS",
    "Intermediate",
    25,
    "Runtime schema validation documentation for inputs, API payloads, and environment data.",
    true
  ),
  graphql: resource(
    "GraphQL Learn",
    "GraphQL Foundation",
    "https://graphql.org/learn/",
    "OFFICIAL_DOCS",
    "Intermediate",
    30,
    "Official GraphQL learning guide for schemas, execution, queries, mutations, and type design.",
    true
  ),
  apollo: resource(
    "Apollo Client Documentation",
    "Apollo GraphQL",
    "https://www.apollographql.com/docs/react",
    "OFFICIAL_DOCS",
    "Intermediate",
    30,
    "Client documentation for cache normalization, fragments, mutations, and React integration.",
    true
  ),
  python: resource(
    "Python Documentation",
    "Python Software Foundation",
    "https://docs.python.org/3/",
    "OFFICIAL_DOCS",
    "Foundational",
    30,
    "Official Python language and standard-library documentation.",
    true
  ),
  fastapi: resource(
    "FastAPI Documentation",
    "FastAPI",
    "https://fastapi.tiangolo.com/",
    "OFFICIAL_DOCS",
    "Intermediate",
    30,
    "Framework documentation for routing, dependency injection, validation, security, testing, and deployment.",
    true
  ),
  pydantic: resource(
    "Pydantic Documentation",
    "Pydantic",
    "https://docs.pydantic.dev/",
    "OFFICIAL_DOCS",
    "Intermediate",
    25,
    "Validation and settings documentation used heavily in modern FastAPI services.",
    true
  ),
  postgres: resource(
    "PostgreSQL Documentation",
    "PostgreSQL Global Development Group",
    "https://www.postgresql.org/docs/",
    "OFFICIAL_DOCS",
    "Intermediate",
    35,
    "Official PostgreSQL documentation for SQL, indexes, transactions, query plans, and administration.",
    true
  ),
  "owasp-cheatsheet": resource(
    "OWASP Cheat Sheet Series",
    "OWASP",
    "https://cheatsheetseries.owasp.org/",
    "REFERENCE",
    "Advanced",
    30,
    "Security reference for authentication, session management, XSS, CSRF, logging, and API protection.",
    true
  ),
  "owasp-top-ten": resource(
    "OWASP Top Ten",
    "OWASP",
    "https://owasp.org/www-project-top-ten/",
    "REFERENCE",
    "Intermediate",
    25,
    "Common web application risk categories used for threat modeling and security review.",
    false
  ),
  vitest: resource(
    "Vitest Guide",
    "Vitest",
    "https://vitest.dev/guide/",
    "OFFICIAL_DOCS",
    "Intermediate",
    25,
    "Testing framework documentation for unit and integration tests in TypeScript projects.",
    true
  ),
  "testing-library": resource(
    "React Testing Library Introduction",
    "Testing Library",
    "https://testing-library.com/docs/react-testing-library/intro/",
    "OFFICIAL_DOCS",
    "Intermediate",
    25,
    "Testing Library guidance for user-centered React component tests.",
    true
  ),
  playwright: resource(
    "Playwright Documentation",
    "Playwright",
    "https://playwright.dev/docs/intro",
    "OFFICIAL_DOCS",
    "Intermediate",
    25,
    "End-to-end testing documentation for browser workflows, assertions, traces, and debugging.",
    true
  ),
  wcag: resource(
    "WCAG Standards and Guidelines",
    "W3C Web Accessibility Initiative",
    "https://www.w3.org/WAI/standards-guidelines/wcag/",
    "REFERENCE",
    "Intermediate",
    30,
    "Accessibility standards reference for perceivable, operable, understandable, and robust user interfaces.",
    true
  ),
  docker: resource(
    "Docker Documentation",
    "Docker",
    "https://docs.docker.com/",
    "OFFICIAL_DOCS",
    "Intermediate",
    30,
    "Container documentation for images, Dockerfiles, Compose, networking, and deployment workflows.",
    true
  ),
  "github-actions": resource(
    "GitHub Actions Documentation",
    "GitHub",
    "https://docs.github.com/en/actions",
    "OFFICIAL_DOCS",
    "Intermediate",
    25,
    "CI/CD documentation for workflows, jobs, secrets, environments, and release gates.",
    true
  ),
  "sre-book": resource(
    "Site Reliability Engineering Book",
    "Google",
    "https://sre.google/sre-book/table-of-contents/",
    "DEEP_DIVE",
    "Advanced",
    35,
    "Reference for production reliability, monitoring, incident response, and operational tradeoffs.",
    false
  ),
  "github-readme": resource(
    "About READMEs",
    "GitHub",
    "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
    "REFERENCE",
    "Foundational",
    20,
    "Guidance for repository README files that explain projects clearly to collaborators and reviewers.",
    true
  ),
  "github-flow": resource(
    "GitHub Flow",
    "GitHub",
    "https://docs.github.com/en/get-started/using-github/github-flow",
    "REFERENCE",
    "Foundational",
    20,
    "Reference for pull request based collaboration and review workflow.",
    false
  )
};

const careerWeeks: readonly SoftwareCareerWeek[] = [
  week(1, 1, "TypeScript Professional Foundation", "Compiler mental model and strict JavaScript-to-TypeScript boundaries", "Strict TypeScript boundary checklist", [
    s("Strict TypeScript and Compiler Feedback", "Configure strict TypeScript and use compiler feedback to remove runtime assumptions.", "strict compiler configuration", "An onboarding widget reads optional profile and feature flag data from an API and sometimes crashes on missing nested fields.", "strict tsconfig notes, refactored safe access snippet, and defect-prevention explanation", ["ts-strict", "compiler", "type-safety"], "coding", ["typescript", "mdn-js"]),
    s("Primitive, Array, and Tuple Modeling", "Model primitive values, arrays, tuples, and readonly collections without over-widening data.", "primitive and collection typing", "A settings form stores weekday availability, preferred time, and a fixed pair of start and end dates.", "typed availability model, tuple example, and readonly collection note", ["primitives", "arrays", "tuples"], "coding", ["typescript", "mdn-js"]),
    s("Object Types, Interfaces, and Type Aliases", "Choose object types, interfaces, and type aliases for frontend contracts and domain values.", "object contract design", "A dashboard card needs API data, a view model, and a callback contract for opening a Daily Task.", "API DTO, view model, callback type, and rationale for each boundary", ["object-typing", "interfaces", "type-aliases"], "coding", ["typescript", "react"]),
    s("Function Types, Parameters, and Return Values", "Type functions, optional parameters, default values, callbacks, and explicit return boundaries.", "function contract design", "A form submit helper accepts raw values, optional tracking metadata, and a callback for safe UI feedback.", "typed submit helper with default parameter, callback type, and return-result model", ["functions", "optional-parameters", "return-types"], "coding", ["typescript", "mdn-js"]),
    s("Weekly Assessment: TypeScript Boundary Model", "Demonstrate strict TypeScript basics by reviewing a small feature boundary end to end.", "weekly TypeScript foundation assessment", "A pull request adds a profile editor with loose types, nullable fields, and unclear submit behavior.", "assessment answers, corrected boundary types, and reflection on remaining risks", ["weekly-assessment", "ts-foundation-review", "interview-prep"], "assessment", ["typescript", "mdn-js"])
  ]),
  week(2, 1, "TypeScript Professional Foundation", "Unions, narrowing, safe unknown data, readonly values, and exhausted states", "Typed UI state model", [
    s("Unions, Intersections, and Literal Types", "Use unions, intersections, and literals to express real UI and domain alternatives.", "union and literal modeling", "A lesson page can be planned, in progress, completed, missed, or rescheduled, and each state exposes different actions.", "union state model, allowed transition notes, and invalid-state examples", ["ts-unions", "intersections", "literal-types"], "coding", ["typescript", "react"]),
    s("Narrowing, Type Guards, and Assertion Functions", "Narrow unknown values with type guards and assertion functions before using them.", "safe runtime narrowing", "A browser reads persisted preferences from JSON and must reject malformed schedule data before rendering.", "type guard, assertion function, invalid input cases, and safe error message", ["narrowing", "type-guards", "assertion-functions"], "debugging", ["typescript", "zod"]),
    s("Discriminated Unions and Exhaustive never Checks", "Design discriminated unions and use never checks so unhandled states fail during review.", "exhaustive UI state handling", "A reviewer finds that a new assessment status was added but the result page still shows the wrong action.", "discriminated union renderer, assertNever helper, and missing-state review note", ["discriminated-unions", "never", "state-modeling"], "debugging", ["typescript", "react"]),
    s("unknown, any, Enums, readonly, const Assertions, and satisfies", "Use unknown, avoid unnecessary any, and choose literal objects over enums where they make boundaries clearer.", "boundary-safe TypeScript idioms", "A route registry and assessment tag list are drifting from the UI because values are widened to string.", "route map using satisfies, const assertion example, readonly tag list, and any replacement", ["unknown-vs-any", "readonly", "const-assertions", "satisfies"], "coding", ["typescript", "mdn-js"]),
    s("Weekly Assessment: State Modeling and Validation Readiness", "Review TypeScript state modeling, narrowing, and boundary safety under interview-style constraints.", "weekly TypeScript state assessment", "A teammate asks whether strict union modeling is slowing delivery for a dashboard feature.", "assessment answers, state diagram, tradeoff memo, and interview notes", ["weekly-assessment", "state-modeling-review", "validation-readiness"], "assessment", ["typescript", "zod"])
  ]),
  week(3, 2, "Advanced TypeScript", "Generics, constraints, keyof, indexed access, mapped types, utility types, and API transformations", "Reusable type-safe helper library", [
    s("Generics for Reusable Helpers", "Implement generics that preserve caller-specific information without hiding unsafe assumptions.", "generic helper design", "A feature team duplicated list helpers for users, lessons, and assessment questions, then lost type information in review.", "generic helper library, examples, and failure cases", ["ts-generics", "reusable-abstractions", "api-typing"], "coding", ["typescript"]),
    s("Generic Constraints, keyof, and Indexed Access", "Use constraints, keyof, and indexed access types to build safe selectors and table columns.", "constrained generic APIs", "An admin table allows sorting by a misspelled field and silently sends a bad query variable.", "typed column config, safe pluck helper, and invalid-key demonstration", ["generic-constraints", "keyof", "indexed-access"], "coding", ["typescript"]),
    s("Mapped Types and Utility Types", "Use mapped types and utility types to transform DTOs into form, view, and update models.", "type transformations for application boundaries", "A profile edit flow has separate read DTO, form values, and update input with repeated field definitions.", "DTO-to-form mapped type, update payload type, and explanation of Partial risk", ["mapped-types", "utility-types", "api-typing"], "coding", ["typescript", "zod"]),
    s("Conditional Types and infer", "Use conditional types and infer for reusable library-style helpers while preserving readability.", "type-level branching", "A typed API client needs to extract success payloads from result unions and awaited promises.", "payload extractor, awaited helper, and readability decision note", ["conditional-types", "infer", "type-safe-architecture"], "coding", ["typescript"]),
    s("Weekly Assessment: Advanced Type Utility Review", "Demonstrate advanced TypeScript by reviewing a reusable helper API and explaining tradeoffs.", "weekly advanced TypeScript assessment", "A pull request introduces a clever type utility that works but is hard for teammates to maintain.", "assessment answers, type utility review, simplified alternative, and interview explanation", ["weekly-assessment", "advanced-types-review", "interview-prep"], "assessment", ["typescript"])
  ]),
  week(4, 2, "Advanced TypeScript", "Template literals, overloads, declaration files, branded values, and type-safe architecture", "Type-safe domain model package", [
    s("Template Literal Types and Overloads", "Use template literal types and overloads for public APIs only when they clarify valid calls.", "public API type design", "A routing helper accepts dynamic paths, query keys, and overloaded navigation calls.", "typed route pattern, overload decision, and invalid route examples", ["template-literal-types", "overloads", "public-api-types"], "coding", ["typescript", "react-router"]),
    s("Declaration Files and Module Typing", "Read and author declaration files so third-party integration types stay maintainable.", "module typing and declarations", "A chart library lacks one event type and a teammate proposes adding any across the feature.", "narrow declaration augmentation, local wrapper type, and review note", ["declaration-files", "module-typing", "third-party-types"], "coding", ["typescript"]),
    s("Branded and Opaque Domain Types", "Use branded values where semantically different strings must not be mixed.", "branded domain identifiers", "A task completion mutation accidentally sends a lesson version ID where a daily task ID is required.", "branded ID types, parser boundary, and compile-time misuse example", ["branded-types", "opaque-types", "domain-modeling"], "debugging", ["typescript", "graphql"]),
    s("Type-Safe Errors and Architecture Boundaries", "Model errors as typed results that separate user-safe messages from internal diagnostics.", "error modeling for architecture", "A GraphQL operation returns raw validation details and the UI cannot tell retryable errors from user mistakes.", "typed error catalog, result model, and UI mapping table", ["error-modeling", "result-types", "type-safe-architecture"], "coding", ["typescript", "graphql"]),
    s("Weekly Assessment: Type-Safe Architecture Review", "Review a typed domain boundary and decide what belongs in shared types, validation, and local code.", "weekly TypeScript architecture assessment", "A team wants to export every backend type directly to the frontend without mapping or validation.", "assessment answers, architecture boundary decision, and capstone typing checklist", ["weekly-assessment", "type-safe-architecture-review", "capstone-connection"], "assessment", ["typescript", "zod"])
  ]),
  week(5, 3, "Professional React and Frontend Architecture", "Feature boundaries, component composition, state ownership, hooks, and service extraction", "Frontend feature architecture plan", [
    s("Feature-Based React Architecture", "Organize a React codebase around business features, ownership boundaries, and reusable surfaces.", "feature boundary design", "A growing learning app has pages, GraphQL documents, forms, and helpers scattered across a flat components folder.", "feature folder plan, responsibility table, and review checklist", ["react-architecture", "feature-organization", "frontend-system-design"], "frontend", ["react", "react-reference"]),
    s("Component Composition and Prop Pressure", "Use composition to reduce prop-heavy components and keep rendering responsibilities focused.", "component composition", "A dashboard card receives fifteen props and knows too much about task status, actions, and layout.", "composed component sketch, slot decision, and prop-reduction rationale", ["react-composition", "component-boundaries", "props"], "frontend", ["react"]),
    s("State Ownership: Local, URL, Server, Form, and Derived", "Decide where state belongs and when it should be derived instead of stored.", "state ownership decisions", "A roadmap page stores selected track, filter text, fetched modules, derived progress, and form draft in one component.", "state decision matrix, refactored ownership plan, and derived-state examples", ["state-design", "url-state", "derived-state"], "frontend", ["react", "react-router"]),
    s("Custom Hooks, Services, and Domain Logic", "Move reusable behavior into hooks or services without hiding unrelated UI concerns.", "hook and service boundaries", "A component validates completion evidence, builds GraphQL variables, formats dates, and renders the form.", "hook extraction plan, domain helper boundary, and testable service example", ["custom-hooks", "domain-services", "frontend-logic"], "frontend", ["react", "typescript"]),
    s("Weekly Assessment: React Architecture Review", "Defend frontend structure decisions through code review, testing, and interview explanation.", "weekly React architecture assessment", "A reviewer challenges whether a refactor actually improves ownership or just moves files.", "assessment answers, before-and-after component tree, and tradeoff memo", ["weekly-assessment", "react-architecture-review", "interview-prep"], "assessment", ["react", "testing-library"])
  ]),
  week(6, 3, "Professional React and Frontend Architecture", "Router architecture, accessible forms, server state, Apollo cache, and resilient UI states", "Data-driven frontend workflow", [
    s("React Router Layouts, Route Guards, and URL State", "Design route layouts, protected navigation, and URL-backed state for repeatable workflows.", "router architecture", "An authenticated learner flow needs nested routes for today, roadmap, weekly plan, lesson, and assessment pages.", "route tree, guard behavior, URL state plan, and navigation tests", ["react-router", "route-guards", "url-state"], "frontend", ["react-router", "react"]),
    s("React Hook Form, Zod, and Accessible Validation", "Build forms with accessible labels, field errors, disabled states, and aligned runtime validation.", "form validation architecture", "An onboarding schedule form must validate study days, capacity, assessment day, and German duration without confusing keyboard users.", "Zod schema, React Hook Form wiring notes, error-state checklist, and invalid cases", ["forms", "react-hook-form", "zod", "accessibility"], "frontend", ["react-hook-form", "zod", "wcag"]),
    s("Apollo Client Queries, Fragments, and Cache Normalization", "Separate server state from UI state and design fragment-driven Apollo data access.", "server-state design", "A Today dashboard, Weekly Plan page, and Lesson page share task fields but currently duplicate query shapes.", "fragment plan, cache identity notes, query variable table, and refetch strategy", ["apollo-client", "server-state", "fragments"], "graphql", ["apollo", "graphql"]),
    s("Mutations, Optimistic Updates, and Loading/Error/Empty States", "Design mutation UX with loading, error, retry, optimistic, and rollback decisions.", "mutation state design", "Completing a lesson should update progress immediately only when the evidence payload is safe to trust.", "mutation state matrix, optimistic-update decision, and error fallback plan", ["optimistic-updates", "loading-states", "error-states"], "frontend", ["apollo", "react"]),
    s("Weekly Assessment: Data-Driven Frontend Review", "Review a frontend workflow that combines routing, forms, server state, and resilient UI states.", "weekly frontend data assessment", "A release candidate fails when an assessment query returns no eligible content and the page has no empty state.", "assessment answers, UI state audit, and Apollo cache correction", ["weekly-assessment", "frontend-data-review", "a11y"], "assessment", ["apollo", "testing-library"])
  ]),
  week(7, 3, "Professional React and Frontend Architecture", "Accessibility, error boundaries, performance, memoization, code splitting, and frontend security", "Frontend quality gate", [
    s("Semantic Accessibility and Keyboard Workflows", "Audit and improve semantic HTML, focus order, labels, and keyboard-only task completion.", "accessible workflow review", "A lesson completion form is visually usable but screen reader labels, focus recovery, and error summaries are weak.", "accessibility checklist, fixed markup sketch, and keyboard test notes", ["accessibility", "semantic-html", "keyboard-workflow"], "frontend", ["wcag", "react"]),
    s("Error Boundaries and Recoverable UI Failures", "Use error boundaries and safe messages so frontend failures preserve user progress.", "error recovery design", "A resource card throws when optional metadata is absent and hides the whole lesson page.", "error boundary placement, fallback copy, and recovery test plan", ["error-boundaries", "frontend-resilience", "safe-errors"], "debugging", ["react", "typescript"]),
    s("Rendering Performance, Memoization, and Profiling", "Profile rendering before using memoization and justify performance changes with evidence.", "render performance diagnosis", "A roadmap with many modules feels slow after adding filters and progress badges.", "profiling notes, render cause analysis, memoization decision, and before/after measurement", ["performance", "memoization", "profiling"], "debugging", ["react-reference", "react"]),
    s("Code Splitting, Lazy Loading, and Frontend Security", "Use lazy loading where it improves interaction and identify frontend security risks.", "bundle and browser-risk control", "An assessment bundle loads admin-only editor code and renders external resource links unsafely.", "route-level splitting plan, safe link handling, and bundle-risk note", ["code-splitting", "lazy-loading", "frontend-security"], "frontend", ["react", "owasp-cheatsheet"]),
    s("Weekly Assessment: Frontend Quality Review", "Demonstrate accessibility, performance, and frontend risk reasoning against a release checklist.", "weekly frontend quality assessment", "A team asks whether accessibility and performance work should wait until after feature completion.", "assessment answers, release quality checklist, and interview-quality explanation", ["weekly-assessment", "frontend-quality-review", "portfolio"], "assessment", ["wcag", "react"])
  ]),
  week(8, 4, "GraphQL Professional Engineering", "Schema fundamentals, nullability, queries, mutations, fragments, variables, and resolver boundaries", "GraphQL schema and resolver plan", [
    s("GraphQL Mental Model and Schema Types", "Design object types, scalars, enums, inputs, queries, and mutations around product workflows.", "schema-first API modeling", "A learning app needs to expose tracks, modules, lesson summaries, daily tasks, and assessment attempts without leaking persistence details.", "schema excerpt, type responsibility notes, and field-level rationale", ["graphql-schema", "object-types", "inputs"], "graphql", ["graphql"]),
    s("Nullability, Lists, Relationships, and Error Shape", "Use nullability and lists intentionally so clients can distinguish absence, error, and empty data.", "GraphQL response contract design", "The UI cannot tell whether nextAssessment is unavailable, loading failed, or no assessment is scheduled.", "nullability decision table, list contract examples, and error boundary notes", ["graphql-nullability", "lists", "error-modeling"], "graphql", ["graphql", "apollo"]),
    s("Queries, Mutations, Fragments, and Variables", "Write client operations with fragments and variables that match view data requirements.", "operation design", "The Lesson page and exercise page need shared fields but different actions and cache behavior.", "query, mutation, fragment set, variable list, and cache impact notes", ["graphql-queries", "graphql-mutations", "fragments"], "graphql", ["graphql", "apollo"]),
    s("Resolver Architecture, Context, and Services", "Keep resolvers thin and move authorization, validation, and business workflow into services.", "resolver-to-service layering", "A completeDailyTask resolver performs database writes, snapshot creation, progress updates, and authorization inline.", "resolver refactor sketch, service method contract, and transaction boundary notes", ["resolvers", "services", "context"], "backend", ["graphql", "typescript"]),
    s("Weekly Assessment: GraphQL Schema Review", "Review GraphQL schema and resolver choices through product, client, and backend constraints.", "weekly GraphQL fundamentals assessment", "A schema review finds nullable fields, duplicated payload types, and resolver-level business logic.", "assessment answers, revised schema excerpt, and review comments", ["weekly-assessment", "graphql-fundamentals-review", "interview-prep"], "assessment", ["graphql", "apollo"])
  ]),
  week(9, 4, "GraphQL Professional Engineering", "Authorization, validation, pagination, DataLoader, caching, evolution, security, and performance", "Production GraphQL guardrail pack", [
    s("GraphQL Authentication, Authorization, and Validation", "Protect private resources with context, input validation, and object-level authorization.", "GraphQL access control", "A partner progress query returns details for an unrelated user when a guessed ID is supplied.", "authorization matrix, input schema, resolver guard notes, and forbidden-case test", ["graphql-auth", "authorization", "validation"], "security", ["graphql", "owasp-cheatsheet"]),
    s("Pagination, Filtering, Sorting, and Cursor Design", "Design paginated GraphQL queries with stable cursors, filters, and sorting rules.", "pagination and list contracts", "An admin lesson list grows beyond one page and offset pagination starts duplicating records during edits.", "cursor model, filter input, sort rules, and edge-case examples", ["pagination", "filtering", "sorting"], "graphql", ["graphql", "apollo"]),
    s("DataLoader, N+1, and Cache Boundaries", "Diagnose N+1 query patterns and choose loader, join, and cache boundaries carefully.", "GraphQL performance diagnosis", "The roadmap query fetches every module and then runs a separate query for every lesson prerequisite.", "N+1 trace, DataLoader plan, batching key, and cache invalidation note", ["dataloader", "n-plus-one", "caching"], "debugging", ["graphql", "apollo"]),
    s("Schema Evolution, Deprecation, Persisted Queries, and Security Limits", "Evolve a schema safely while protecting depth, complexity, and abusive operations.", "GraphQL lifecycle security", "A mobile client still uses an old field while a public query can request deeply nested modules repeatedly.", "deprecation plan, persisted query note, depth and complexity limit rationale", ["schema-evolution", "graphql-security", "persisted-queries"], "security", ["graphql", "owasp-cheatsheet"]),
    s("Weekly Assessment: GraphQL Production Review", "Demonstrate production GraphQL reasoning with schema, security, performance, and client tradeoffs.", "weekly GraphQL production assessment", "A release introduces a slow query, an authorization bug, and a field that cannot be removed safely.", "assessment answers, incident diagnosis, schema migration plan, and interview notes", ["weekly-assessment", "graphql-production-review", "performance"], "assessment", ["graphql", "apollo"])
  ]),
  week(10, 5, "Python for Backend Engineers", "Python syntax, typing, data modeling, packages, async basics, and backend conventions for JavaScript engineers", "Python backend readiness workbook", [
    s("Python Syntax for JavaScript and TypeScript Engineers", "Translate JavaScript mental models into Python syntax, control flow, functions, modules, and common idioms.", "Python transition fundamentals", "A frontend engineer joins a FastAPI service and must read handlers, imports, virtual environment notes, and pytest files.", "Python syntax comparison table, small module, and setup notes", ["python-syntax", "js-to-python", "backend-readiness"], "backend", ["python"]),
    s("Python Typing, dataclasses, Collections, and Comprehensions", "Use Python type hints, dataclasses, collections, and comprehensions for clear backend models.", "typed Python data modeling", "A service builds lesson summaries from rows and needs readable typed transformations.", "typed dataclass model, collection transformation, and comprehension review", ["python-typing", "dataclasses", "collections"], "backend", ["python", "pydantic"]),
    s("Exceptions, Modules, Packages, and Virtual Environments", "Structure Python modules and exceptions so service errors are controlled and setup is reproducible.", "Python project structure", "A backend script works on one machine but fails in CI due imports, package layout, and unpinned environment assumptions.", "package tree, exception class, venv notes, and reproducibility checklist", ["python-packages", "exceptions", "virtual-environments"], "debugging", ["python"]),
    s("Async, Iterators, Context Managers, and pytest Conventions", "Use async, iterators, context managers, and pytest patterns needed for FastAPI services.", "Python execution and testing conventions", "A repository function leaks a connection when an exception occurs during an async request.", "async function sketch, context manager use, pytest cases, and failure explanation", ["python-async", "context-managers", "pytest"], "backend", ["python", "fastapi"]),
    s("Weekly Assessment: Python Backend Readiness", "Prove Python readiness by reading, modifying, testing, and explaining a small backend module.", "weekly Python assessment", "A service has a hidden mutable default, broad exception handling, and unclear type hints.", "assessment answers, corrected Python module, tests, and interview explanation", ["weekly-assessment", "python-readiness-review", "backend-testing"], "assessment", ["python"])
  ]),
  week(11, 6, "FastAPI Professional Backend", "FastAPI structure, routing, Pydantic validation, dependencies, services, repositories, and API security", "FastAPI service slice", [
    s("FastAPI Application Structure and Routing", "Design a FastAPI application with routers, request models, response models, and clear boundaries.", "FastAPI routing architecture", "A learning content service exposes track, lesson, and completion endpoints from one crowded file.", "router layout, request-response model sketch, and boundary explanation", ["fastapi", "routing", "api-design"], "backend", ["fastapi", "python"]),
    s("Pydantic Validation, Structured Errors, and Responses", "Validate FastAPI inputs and return structured safe errors without leaking internals.", "request validation and error design", "A malformed enrollment payload raises a stack trace instead of a user-safe validation response.", "Pydantic model, invalid-case table, error response contract, and logging boundary", ["pydantic", "validation", "structured-errors"], "backend", ["fastapi", "pydantic"]),
    s("Dependency Injection, Services, Repositories, and Layering", "Move business logic out of route handlers into application services, domain logic, and repositories.", "FastAPI application layering", "A route completes a task, writes snapshots, calculates progress, and authorizes ownership inline.", "layer diagram, service method, repository interface, and transaction note", ["dependency-injection", "services", "repositories"], "backend", ["fastapi", "python"]),
    s("FastAPI Authentication, Authorization, Sessions, Cookies, and Tokens", "Compare sessions and JWTs, then implement secure dependency-based authorization decisions.", "FastAPI security basics", "A private lesson endpoint trusts a user ID from the request body and does not verify ownership.", "auth dependency sketch, cookie/session tradeoff table, and forbidden-case tests", ["fastapi-auth", "sessions-vs-jwt", "cookies"], "security", ["fastapi", "owasp-cheatsheet"]),
    s("Weekly Assessment: FastAPI API Design Review", "Review FastAPI route, validation, security, and service boundaries under production constraints.", "weekly FastAPI assessment", "An API review finds business logic in handlers, inconsistent errors, and missing authorization tests.", "assessment answers, refactor plan, and reviewed endpoint contract", ["weekly-assessment", "fastapi-review", "api-design"], "assessment", ["fastapi", "pydantic"])
  ]),
  week(12, 6, "FastAPI Professional Backend", "Persistence, transactions, async work, configuration, observability, pytest, integration tests, and deployment", "Production-ready backend service", [
    s("SQLAlchemy-style Repositories and Transaction Boundaries", "Design repositories and transaction boundaries for multi-write backend workflows.", "backend persistence boundaries", "Completing a Daily Task must create an attempt, snapshot lesson content, update task status, and refresh progress atomically.", "repository interface, transaction pseudocode, rollback test, and snapshot checklist", ["sqlalchemy", "transactions", "repositories"], "database", ["fastapi", "postgres"]),
    s("Async Work, Background Tasks, and File Handling", "Use async and background work only where it improves responsiveness without hiding failures.", "async backend workflow design", "A file upload endpoint and assessment notification task must avoid blocking requests and preserve failure visibility.", "async flow diagram, background task decision, and retry risk note", ["async-backend", "background-work", "file-handling"], "backend", ["fastapi", "python"]),
    s("Configuration, Environment Variables, Logging, and Observability", "Validate configuration and design structured logging that redacts private data.", "backend operational settings", "A staging deployment fails because an environment variable is missing and logs include learner reflections.", "settings schema, redaction checklist, log fields, and startup failure behavior", ["configuration", "environment-variables", "logging"], "production", ["fastapi", "pydantic"]),
    s("pytest Integration Tests, Health Checks, and Deployment Readiness", "Test service, API, and database boundaries with fixtures and health-check expectations.", "backend integration testing", "A deployment succeeds but readiness fails when the database is unreachable and tests used only mocks.", "pytest fixture plan, health endpoint expectations, and integration test outline", ["pytest", "integration-tests", "deployment"], "testing", ["fastapi", "python"]),
    s("Weekly Assessment: Backend Service Review", "Demonstrate FastAPI backend maturity by reviewing persistence, configuration, observability, and tests.", "weekly backend service assessment", "A backend release has flaky tests, weak logs, missing migrations, and a hidden transaction bug.", "assessment answers, release risk list, and corrective implementation plan", ["weekly-assessment", "backend-service-review", "observability"], "assessment", ["fastapi", "postgres"])
  ]),
  week(13, 7, "PostgreSQL and Database Engineering", "Relational modeling, normalization, constraints, SQL querying, indexes, and plans", "Database design and query workbook", [
    s("Relational Modeling, Entities, and Relationships", "Model entities, relationships, keys, and cardinality for product workflows.", "relational modeling", "A learning platform needs users, enrollments, study weeks, daily tasks, attempts, and partner connections.", "ER sketch, relationship notes, primary key choices, and cardinality explanation", ["postgresql", "data-modeling", "relationships"], "database", ["postgres"]),
    s("Normalization, Denormalization, Constraints, and Integrity", "Use normalization and constraints while knowing when denormalized snapshots are justified.", "data integrity design", "Task attempts must preserve lesson title and objective even after content is edited.", "normalized table plan, snapshot justification, constraint list, and update-risk note", ["normalization", "constraints", "snapshots"], "database", ["postgres"]),
    s("SQL Joins, Grouping, Aggregation, and Reporting", "Write SQL that joins related data and aggregates progress without confusing counts.", "SQL reporting queries", "A progress dashboard needs planned count, completed count, weekly percentage, and assessment completion.", "SQL query, grouping explanation, and edge-case notes for missed tasks", ["sql-joins", "aggregation", "progress-reporting"], "database", ["postgres"]),
    s("Indexes, Query Plans, Pagination, and Performance", "Read query plans and choose indexes for list and lookup paths.", "query performance analysis", "The weekly plan page slows down after adding status filters and scheduled date ordering.", "EXPLAIN notes, index proposal, cursor pagination plan, and tradeoff explanation", ["indexes", "query-plans", "pagination"], "debugging", ["postgres"]),
    s("Weekly Assessment: Database Design Review", "Review schema, constraints, queries, and indexes for correctness and performance.", "weekly database assessment", "A schema review finds missing uniqueness, slow dashboard queries, and ambiguous deletion rules.", "assessment answers, revised schema notes, SQL query, and index rationale", ["weekly-assessment", "database-design-review", "sql"], "assessment", ["postgres"])
  ]),
  week(14, 7, "PostgreSQL and Database Engineering", "Transactions, isolation, locks, concurrency, migrations, pooling, performance, and SQL security", "Database incident response pack", [
    s("Transactions, ACID, Isolation, Locks, and Concurrency", "Explain transaction guarantees and diagnose concurrency bugs in multi-user workflows.", "transaction and isolation reasoning", "Two requests complete the same Daily Task and create duplicate attempt evidence.", "transaction boundary, isolation risk analysis, lock strategy, and idempotency note", ["transactions", "acid", "concurrency"], "debugging", ["postgres"]),
    s("Migrations, Schema Evolution, and Data Integrity", "Plan schema changes that protect existing data and preserve historical evidence.", "migration design", "A new required snapshot field must be added without breaking old attempts or deployment rollback.", "migration sequence, backfill plan, validation query, and rollback consideration", ["migrations", "schema-evolution", "data-integrity"], "database", ["postgres"]),
    s("Connection Pooling, Query Throughput, and Performance Triage", "Connect pooling, query patterns, and application behavior to database performance.", "database performance triage", "Production sees connection exhaustion during assessment submission after a traffic spike.", "pooling diagram, query count estimate, mitigation plan, and monitoring metric list", ["connection-pooling", "performance", "throughput"], "debugging", ["postgres", "sre-book"]),
    s("SQL Security and Repository Review", "Prevent SQL injection and enforce repository-level authorization assumptions.", "secure database access", "A filter value is concatenated into raw SQL for an admin search endpoint.", "safe parameterized query, repository review checklist, and authorization boundary note", ["sql-security", "repositories", "authorization"], "security", ["postgres", "owasp-cheatsheet"]),
    s("Weekly Assessment: Database Incident Review", "Respond to a realistic database incident with diagnosis, fix plan, and interview explanation.", "weekly database incident assessment", "A failed migration leaves some users without progress snapshots and dashboards return inconsistent totals.", "assessment answers, incident timeline, repair query plan, and prevention checklist", ["weekly-assessment", "database-incident-review", "production-debugging"], "assessment", ["postgres", "sre-book"])
  ]),
  week(15, 8, "Authentication, Authorization, and Security", "Sessions, cookies, CSRF, CORS, XSS, injection, object authorization, permissions, secrets, and threat modeling", "Security review and threat model", [
    s("Authentication, Authorization, Sessions, Tokens, and OAuth Concepts", "Distinguish identity, access decisions, session storage, JWT tradeoffs, and OAuth delegation.", "identity and access model", "A team proposes replacing server sessions with JWTs in localStorage to simplify mobile support later.", "auth comparison table, risk analysis, and current-system recommendation", ["authentication", "authorization", "sessions", "tokens"], "security", ["owasp-cheatsheet", "fastapi"]),
    s("Password Hashing, Secure Cookies, CSRF, and CORS", "Design browser session controls with password hashing, secure cookies, CSRF tokens, and tight CORS rules.", "browser session security", "A login flow works locally but state-changing mutations can be submitted from another site.", "cookie settings, CSRF flow, CORS policy, and attack walkthrough", ["password-hashing", "secure-cookies", "csrf", "cors"], "security", ["owasp-cheatsheet", "owasp-top-ten"]),
    s("XSS, SQL Injection, API Abuse, and Rate Limiting", "Identify common web vulnerabilities and design layered abuse controls.", "web vulnerability mitigation", "An admin lesson preview renders Markdown and an attacker attempts script injection plus rapid login attempts.", "XSS mitigation plan, parameterized-query note, rate-limit design, and test cases", ["xss", "sql-injection", "rate-limiting", "api-abuse"], "debugging", ["owasp-top-ten", "owasp-cheatsheet"]),
    s("Object-Level Authorization, Roles, Permissions, Secrets, and Secure Logging", "Enforce object ownership and role permissions while keeping secrets and private data out of logs.", "authorization and logging review", "A partner can view raw reflections by guessing a task attempt ID and logs include assessment answers.", "authorization matrix, role-permission checks, redaction list, and forbidden-case tests", ["object-authorization", "roles", "secrets", "secure-logging"], "security", ["owasp-cheatsheet"]),
    s("Weekly Assessment: Threat Modeling and Security Review", "Perform a security review that maps threats to mitigations, tests, and residual risk.", "weekly security assessment", "A release includes new upload, assessment, and partner-sharing features with unclear abuse cases.", "assessment answers, threat model, prioritized mitigations, and interview-ready explanation", ["weekly-assessment", "threat-modeling", "security-review"], "assessment", ["owasp-cheatsheet", "owasp-top-ten"])
  ]),
  week(16, 9, "Testing and Software Quality", "Unit, integration, frontend, backend, database, GraphQL, fixtures, fakes, mocks, and business-rule tests", "Cross-layer test strategy", [
    s("Test Boundaries, Unit Tests, Fakes, and Mocks", "Choose test boundaries that protect business rules without over-mocking implementation details.", "test strategy fundamentals", "A scheduler bug escaped because tests mocked the whole repository and never exercised prerequisite ordering.", "test boundary map, fake vs mock decision, and missing-case list", ["unit-tests", "test-boundaries", "fakes", "mocks"], "testing", ["vitest"]),
    s("Vitest Unit Tests for Domain Rules", "Write focused Vitest tests for pure functions, validation, and domain services.", "unit test implementation", "A weak-topic detector marks topics incorrectly when manual scores are pending.", "Vitest cases, edge inputs, and assertion rationale", ["vitest", "domain-testing", "business-rules"], "testing", ["vitest", "typescript"]),
    s("React Component and Integration Testing", "Test visible behavior, user interactions, loading, empty, success, and error states.", "frontend testing", "A Lesson page completion form allows submission without evidence after a refactor.", "React Testing Library test plan, user-event flow, and accessibility assertion", ["react-testing", "component-testing", "integration-testing"], "testing", ["testing-library", "react"]),
    s("Backend, GraphQL, and Database Integration Tests", "Test service, GraphQL, repository, authentication, authorization, and persistence behavior.", "backend integration testing", "A completeDailyTask mutation succeeds for the wrong user in a resolver-level test gap.", "GraphQL integration cases, auth fixtures, database setup, and rollback expectation", ["backend-testing", "graphql-testing", "database-testing"], "testing", ["graphql", "postgres"]),
    s("Weekly Assessment: Testing Strategy Review", "Defend a test strategy that covers critical behavior without brittle implementation coupling.", "weekly testing assessment", "A pull request adds a complex feature with many snapshot tests and no authorization regression test.", "assessment answers, revised test matrix, and review comments", ["weekly-assessment", "testing-strategy-review", "quality"], "assessment", ["vitest", "testing-library"])
  ]),
  week(17, 9, "Testing and Software Quality", "E2E, accessibility checks, contract thinking, CI quality gates, flaky-test avoidance, code review, and refactoring", "Release quality gate", [
    s("Playwright E2E Tests for Critical Happy Paths and Recovery", "Write E2E tests for the flows users depend on most, including recovery paths.", "E2E workflow coverage", "A learner can onboard and start a lesson, but the missed-session recovery flow is not tested through the browser.", "Playwright scenario list, selector strategy, and trace-debug plan", ["playwright", "e2e-testing", "recovery-paths"], "testing", ["playwright"]),
    s("Automated and Manual Accessibility Checks", "Combine automated accessibility checks with keyboard and screen-reader-oriented review.", "accessibility test workflow", "Automated checks pass but keyboard focus disappears after an assessment submission error.", "axe-style checklist, keyboard walkthrough, focus fix notes, and regression cases", ["a11y-testing", "keyboard-testing", "wcag"], "debugging", ["wcag", "playwright"]),
    s("Contract Testing, CI Quality Gates, and Flaky-Test Avoidance", "Use contracts and CI gates to catch incompatible changes while keeping tests stable.", "continuous quality control", "A GraphQL field rename breaks the frontend after backend tests passed independently.", "contract test idea, CI gate list, flaky-test diagnosis, and stabilization plan", ["contract-testing", "ci-quality-gates", "flaky-tests"], "testing", ["github-actions", "vitest"]),
    s("Code Review, Refactoring, and Technical Debt Decisions", "Review code for behavior, risk, and maintainability, then refactor with tests preserving intent.", "professional review and refactoring", "A teammate proposes a broad refactor during a deadline and mixes behavior changes with formatting churn.", "review findings, refactor scope, safety tests, and decision note", ["code-review", "refactoring", "technical-debt"], "frontend", ["github-flow", "typescript"]),
    s("Weekly Assessment: Quality and Review Simulation", "Review a realistic pull request for tests, accessibility, refactoring scope, and release risk.", "weekly quality assessment", "A release branch has a flaky E2E test, accessibility regression, and unclear GraphQL contract change.", "assessment answers, review comment set, risk rating, and release recommendation", ["weekly-assessment", "quality-review", "code-review"], "assessment", ["github-actions", "playwright"])
  ]),
  week(18, 10, "Data Structures and Algorithms", "Complexity, arrays, strings, hash maps, sets, stacks, queues, linked lists, binary search, sorting, and intervals", "DSA pattern workbook part 1", [
    s("Complexity, Arrays, and String Patterns", "Analyze time and space complexity and implement array/string solutions without memorized answers.", "DSA complexity and sequences", "An interview asks for detecting repeated learner activity IDs and explaining Big O tradeoffs.", "guided solution, complexity analysis, edge cases, and mistake notes", ["dsa", "complexity", "arrays", "strings"], "dsa", ["typescript", "mdn-js"]),
    s("Hash Maps, Sets, and Frequency Counting", "Recognize hash-based patterns and choose maps or sets for lookup and counting problems.", "hash-based pattern recognition", "A feature must find duplicate assessment tags and count weak-topic frequency across attempts.", "hash map solution, set alternative, complexity notes, and test cases", ["hash-maps", "sets", "frequency-counting"], "dsa", ["typescript"]),
    s("Stacks, Queues, and Linked Lists", "Use stack, queue, and linked-list ideas where ordering and incremental processing matter.", "linear data structures", "A scheduler needs to process prerequisite tasks in order and track pending recovery work.", "stack or queue implementation, linked-list discussion, and failure case", ["stacks", "queues", "linked-lists"], "dsa", ["typescript"]),
    s("Binary Search, Sorting, Intervals, and Two Pointers", "Solve search, sorting, interval, and two-pointer problems with clear invariants.", "ordered data patterns", "A planner must find the first available date range that can fit a missed lesson.", "binary search or interval solution, invariant explanation, and complexity proof", ["binary-search", "sorting", "intervals", "two-pointers"], "dsa", ["typescript"]),
    s("Weekly Assessment: DSA Pattern Interview Part 1", "Solve and explain foundational DSA patterns with complexity and variation analysis.", "weekly DSA assessment part 1", "A mock interviewer changes constraints after your first array and interval solution.", "assessment answers, two solved problems, complexity analysis, and interview reflection", ["weekly-assessment", "dsa-review", "interview-prep"], "assessment", ["typescript"])
  ]),
  week(19, 10, "Data Structures and Algorithms", "Recursion, trees, heaps, graphs, BFS, DFS, tries, backtracking, greedy, dynamic programming, and union-find", "DSA pattern workbook part 2", [
    s("Recursion, Trees, and Binary Search Trees", "Use recursion and tree traversal patterns while explaining base cases and stack cost.", "tree and recursion patterns", "An interview asks for summarizing a nested module tree and finding a target lesson.", "recursive traversal, iterative alternative, complexity notes, and edge tests", ["recursion", "trees", "bst"], "dsa", ["typescript"]),
    s("Heaps and Priority Queues", "Use heaps and priority queues for top-k and scheduling priority problems.", "priority data structures", "A recovery planner must prioritize required missed tasks before optional review sessions.", "priority queue design, comparator rules, and complexity analysis", ["heaps", "priority-queues", "scheduling"], "dsa", ["typescript"]),
    s("Graphs, BFS, DFS, and Tries", "Model dependency graphs and choose BFS, DFS, or tries based on traversal needs.", "graph traversal patterns", "Lesson prerequisites form a directed graph and the system must detect cycles before scheduling.", "graph representation, BFS or DFS traversal, cycle test, and trie discussion", ["graphs", "bfs", "dfs", "tries"], "dsa", ["typescript"]),
    s("Backtracking, Greedy, Dynamic Programming, and Union-Find", "Recognize advanced patterns and explain why the chosen strategy fits the problem constraints.", "advanced DSA pattern selection", "A capacity planner must choose sessions under constraints and compare greedy selection with dynamic programming.", "pattern decision table, guided problem, independent variation, and complexity proof", ["backtracking", "greedy", "dynamic-programming", "union-find"], "dsa", ["typescript"]),
    s("Weekly Assessment: DSA Mock Interview Part 2", "Complete a DSA mock interview with recognition, implementation, debugging, and complexity explanation.", "weekly DSA assessment part 2", "A mock interview combines graph prerequisites, priority recovery, and dynamic-capacity questions.", "assessment answers, corrected bug, complexity discussion, and interview self-review", ["weekly-assessment", "dsa-mock-interview", "complexity-analysis"], "assessment", ["typescript"])
  ]),
  week(20, 11, "System Design", "Requirements, estimation, latency, throughput, scalability, load balancing, CDN, caching, storage, and data choices", "System design case workbook part 1", [
    s("Requirements, Capacity Estimation, Latency, and Throughput", "Turn vague product goals into requirements, estimates, latency budgets, and throughput assumptions.", "system design requirements", "Design a URL shortener for teams sharing learning resources and explain capacity assumptions.", "requirements list, back-of-envelope estimate, API sketch, and bottleneck notes", ["system-design", "requirements", "capacity-estimation"], "system-design", ["sre-book"]),
    s("Horizontal Scaling, Load Balancing, Reverse Proxies, and CDN", "Explain request flow through scalable web infrastructure and where each layer helps.", "scaling request paths", "A static lesson resource page has global users and traffic spikes after weekly assessment reminders.", "request path diagram, load balancer role, CDN decision, and failure note", ["horizontal-scaling", "load-balancing", "cdn"], "system-design", ["sre-book"]),
    s("Caching, Object Storage, and Search", "Choose caching, object storage, and search components based on access patterns and consistency needs.", "read path optimization", "Design file upload and search for portfolio evidence attached to completed tasks.", "cache plan, object storage metadata, search index strategy, and invalidation tradeoff", ["caching", "object-storage", "search"], "system-design", ["sre-book"]),
    s("SQL vs NoSQL, Replication, Partitioning, and Sharding", "Compare storage choices and partitioning strategies for scale and operational complexity.", "storage architecture tradeoffs", "A progress analytics pipeline outgrows simple dashboard queries and the team proposes sharding first.", "storage comparison, replication note, partitioning option, and avoid-premature-sharding argument", ["sql-vs-nosql", "replication", "partitioning", "sharding"], "system-design", ["postgres", "sre-book"]),
    s("Weekly Assessment: URL Shortener and Notification System Design", "Design URL-shortener and notification systems using requirements, API, data model, scaling, and failure analysis.", "weekly system design assessment part 1", "A mock interviewer asks for a URL shortener, then extends it with reminder notifications and abuse limits.", "assessment answers, diagrams, API and data model, bottlenecks, and tradeoffs", ["weekly-assessment", "url-shortener", "notification-system"], "assessment", ["sre-book"])
  ]),
  week(21, 11, "System Design", "Queues, events, rate limiting, idempotency, consistency, observability, fault tolerance, gateways, and design cases", "System design case workbook part 2", [
    s("Queues, Events, and Asynchronous Processing", "Use queues and event-driven flows where synchronous requests should not own all work.", "asynchronous system design", "Assessment completion should trigger progress updates, partner summaries, and email later without delaying submission.", "event flow, queue choice, retry rule, and duplicate-event handling", ["queues", "event-driven-systems", "async-processing"], "system-design", ["sre-book"]),
    s("Rate Limiting, Idempotency, and Distributed Locks", "Control duplicate and abusive requests using limits, idempotency keys, and lock tradeoffs.", "request safety patterns", "A user double-clicks complete lesson while an attacker floods startAssessment mutations.", "rate-limit design, idempotency key flow, lock tradeoff, and failure behavior", ["rate-limiting", "idempotency", "distributed-locking"], "system-design", ["owasp-cheatsheet", "sre-book"]),
    s("Consistency, CAP Concepts, Failure Modes, and Backpressure", "Reason about consistency and failure behavior without oversimplifying distributed systems.", "failure and consistency reasoning", "Partner progress may lag behind task completion during a partial outage.", "consistency decision, failure-mode table, backpressure strategy, and user messaging", ["consistency", "cap", "backpressure", "failure-analysis"], "system-design", ["sre-book"]),
    s("Observability, Fault Tolerance, API Gateways, and Modular Monolith Tradeoffs", "Design observable, fault-tolerant systems and compare modular monoliths with microservices realistically.", "operable architecture tradeoffs", "A startup wants to split auth, content, scheduling, and assessment into services before the MVP is stable.", "architecture decision record, observability signals, API gateway tradeoff, and modular monolith defense", ["observability", "fault-tolerance", "api-gateways", "microservices-tradeoffs"], "system-design", ["sre-book"]),
    s("Weekly Assessment: Learning Platform, Booking, Checkout, Feed, and Analytics Cases", "Practice multiple system-design cases with requirements, estimates, data model, scaling, and failure analysis.", "weekly system design assessment part 2", "A mock interviewer rotates through learning platform, booking system, e-commerce checkout, activity feed, and analytics pipeline cases.", "assessment answers, case outlines, tradeoff matrix, and revision plan", ["weekly-assessment", "learning-platform-design", "booking-system", "checkout", "activity-feed", "analytics-pipeline"], "assessment", ["sre-book"])
  ]),
  week(22, 12, "Production Engineering", "Docker, environments, CI/CD, migrations, observability, debugging, incidents, documentation, Git, and reviews", "Production readiness packet", [
    s("Docker, Environments, Configuration, and Secrets", "Package services with Docker and validate environment-specific configuration without storing secrets in source.", "container and configuration design", "A new backend service works locally but fails in staging because secrets and ports are handled inconsistently.", "Dockerfile notes, Compose sketch, env validation table, and secret-handling checklist", ["docker", "environments", "configuration", "secrets"], "production", ["docker", "pydantic"]),
    s("CI/CD, Deployments, Migrations, and Rollback", "Design release pipelines with build, test, migration, deployment, and rollback gates.", "release pipeline design", "A database migration deploys before app compatibility is ready and blocks login.", "GitHub Actions workflow sketch, migration sequence, rollback plan, and release checklist", ["ci-cd", "deployments", "migrations", "rollback"], "production", ["github-actions", "postgres"]),
    s("Logging, Metrics, Monitoring, Tracing, and Health Checks", "Choose useful production signals and implement health checks that reveal real readiness.", "observability implementation", "An outage occurs but logs lack request IDs, metrics miss queue depth, and health checks pass without database access.", "log field list, metric set, trace boundary, and readiness check behavior", ["logging", "metrics", "monitoring", "tracing", "health-checks"], "production", ["sre-book", "fastapi"]),
    s("Production Debugging, Incidents, Profiling, Reliability, and Technical Documentation", "Respond to incidents with structured diagnosis, rollback thinking, profiling evidence, and documentation updates.", "incident response and reliability", "Assessment submission latency spikes after a deployment and users report duplicate attempts.", "incident timeline, hypothesis list, profiling plan, rollback decision, and post-incident notes", ["production-debugging", "incidents", "profiling", "reliability"], "debugging", ["sre-book"]),
    s("Weekly Assessment: Production Readiness Review", "Review a release for operational risk, documentation, monitoring, CI, rollback, and review discipline.", "weekly production assessment", "A launch candidate has passing tests but missing dashboards, unreviewed migration SQL, and unclear runbook steps.", "assessment answers, release readiness checklist, ADR note, and interview explanation", ["weekly-assessment", "production-readiness", "adr"], "assessment", ["github-actions", "sre-book"])
  ]),
  week(23, 13, "Interview and Career Preparation", "CV, GitHub, portfolio, project explanation, technical interviews, behavioral answers, debugging, and code review", "Interview readiness portfolio", [
    s("CV, GitHub, LinkedIn, and Portfolio Positioning", "Present project evidence honestly without promising employment or overstating experience.", "career evidence packaging", "A learner has strong exercises but no clear README, project summary, or proof of engineering judgment.", "CV bullet set, GitHub profile checklist, portfolio README outline, and evidence map", ["cv", "github", "portfolio", "linkedin"], "career", ["github-readme", "github-flow"]),
    s("Project Explanation and Technical Storytelling", "Explain a project through problem, constraints, architecture, tradeoffs, tests, and outcomes.", "project narrative design", "An interviewer asks why the capstone uses a particular API, database model, and test strategy.", "project story outline, architecture diagram notes, and tradeoff talking points", ["project-explanation", "technical-storytelling", "portfolio"], "career", ["github-readme"]),
    s("Technical Interview Review: JS, TypeScript, React, GraphQL, FastAPI, Database, and Security", "Practice concise technical explanations grounded in examples, tradeoffs, and verification.", "technical interview synthesis", "A mock interview jumps from TypeScript narrowing to GraphQL auth, React state, PostgreSQL indexes, and CSRF.", "answer bank, weak-topic list, and revision plan", ["technical-interviews", "typescript-interviews", "react-interviews", "graphql-interviews"], "career", ["typescript", "graphql"]),
    s("Debugging, Code Review, Behavioral STAR, and Mock Interview Practice", "Answer debugging, code-review, and behavioral questions with evidence and structured reasoning.", "interview simulation", "A mock interviewer presents a flaky test, a confusing pull request, and a conflict with a product manager.", "debugging transcript, review comments, STAR answer, and self-assessment", ["debugging-interviews", "code-review-exercises", "star", "mock-interviews"], "career", ["github-flow", "testing-library"]),
    s("Weekly Assessment: Interview Readiness Review", "Identify strengths, weak areas, practical gaps, and targeted revision before capstone completion.", "weekly interview readiness assessment", "A final mock interview exposes weak system-design estimation and shallow testing explanations.", "assessment answers, readiness scorecard, revision schedule, and portfolio gap list", ["weekly-assessment", "interview-readiness", "job-preparation"], "assessment", ["github-readme", "sre-book"])
  ]),
  week(24, 14, "Capstone Project", "A production-grade collaborative workflow platform with full-stack delivery, tests, docs, deployment notes, demo, and retrospective", "Capstone delivery package", [
    s("Capstone Requirements, Architecture, Database Design, and ADRs", "Define capstone scope, requirements, architecture, database design, and decision records.", "capstone planning and architecture", "The capstone is a collaborative workflow platform with users, projects, tasks, comments, notifications, and audit history.", "requirements, architecture diagram, database design, API boundary decision, and ADRs", ["capstone", "requirements", "architecture-diagram", "database-design"], "capstone", ["github-readme", "postgres"]),
    s("Capstone Frontend: React, TypeScript, Routing, Forms, Validation, Accessibility, and Tests", "Build the capstone frontend with professional React architecture and verifiable UI quality.", "capstone frontend implementation", "The platform needs project boards, task detail routes, validated forms, accessible status controls, and component tests.", "frontend implementation plan, typed components, form validation, accessibility checks, and tests", ["capstone", "react", "typescript", "frontend-testing"], "capstone", ["react", "react-hook-form", "testing-library"]),
    s("Capstone Backend: FastAPI, GraphQL Boundary, PostgreSQL, Auth, Authorization, and Security", "Build backend services with secure access control, validated APIs, persistence, and operational logging.", "capstone backend implementation", "The backend must protect project membership, expose API operations, store PostgreSQL records, and handle errors safely.", "FastAPI service plan, API contract, repository design, auth checks, migrations, and security tests", ["capstone", "fastapi", "graphql", "postgresql", "authorization"], "capstone", ["fastapi", "graphql", "postgres", "owasp-cheatsheet"]),
    s("Capstone Engineering: Caching, Error Handling, Logging, Docker, CI, Migrations, and Deployment Docs", "Prepare the capstone for production-style review with tests, CI, Docker, migrations, docs, and deployment notes.", "capstone production engineering", "A reviewer should be able to run, test, inspect, and understand the capstone without private setup knowledge.", "Docker setup, CI workflow, migration notes, logging plan, test suite, deployment documentation, and runbook", ["capstone", "docker", "ci", "deployment", "logging"], "capstone", ["docker", "github-actions", "sre-book"]),
    s("Final Capstone Demo, Screenshots, Technical Retrospective, and Mock Interview", "Package and present the capstone with demo evidence, screenshots, retrospective, and interview discussion.", "capstone final assessment", "The learner presents the platform to a senior engineer who asks about architecture, tradeoffs, tests, incidents, and next steps.", "README, screenshots or demo notes, technical retrospective, test results, interview answers, and improvement backlog", ["weekly-assessment", "capstone", "technical-retrospective", "mock-interview"], "assessment", ["github-readme", "github-flow"])
  ])
];

export const softwareEngineeringCareerModules: readonly SeedModuleDefinition[] = buildCareerModules();

export const softwareEngineeringCareerProgramStats = careerStats();

const sessionsById = new Map(
  careerWeeks.flatMap((moduleRecord) => moduleRecord.sessions).map((session) => [session.id, session])
);

export function softwareEngineeringCareerContentForLesson(
  lessonDefinition: SeedLessonDefinition
): LearnerSeedContent | null {
  const session = sessionsById.get(lessonDefinition.identifier);

  return session === undefined ? null : contentForSession(session);
}

function buildCareerModules(): readonly SeedModuleDefinition[] {
  let previousIdentifier: string | null = null;

  return careerWeeks.map((moduleRecord) => {
    const lessons = moduleRecord.sessions.map((session): SeedLessonDefinition => {
      const prerequisites = previousIdentifier === null ? [] : [previousIdentifier];
      previousIdentifier = session.id;

      return {
        identifier: session.id,
        title: session.title,
        objective: session.objective,
        prerequisites,
        durationMinutes: 120,
        level: difficultyForPhase(session.phase),
        required: true,
        evidence: session.evidence,
        tags: session.tags
      };
    });

    return {
      sequence: moduleRecord.sequence,
      title: `Phase ${moduleRecord.phase}: ${moduleRecord.title}`,
      summary: `${moduleRecord.summary} Module project: ${moduleRecord.projectMilestone}.`,
      lessons
    };
  });
}

function contentForSession(session: SoftwareCareerSession): LearnerSeedContent {
  const resourceKeys = uniqueResourceKeys(["typescript", ...session.resources]);

  return {
    outcomes: [
      session.objective,
      `Produce ${session.evidence}.`,
      `Diagnose the risk in this scenario: ${session.scenario}`,
      `Answer interview questions about ${session.learningUnit} using tradeoffs and verification evidence.`
    ],
    explanationMarkdown: [
      `Learning unit: ${session.learningUnit}.`,
      `Progression state: ${session.progressionState}.`,
      `Professional scenario: ${session.scenario}`,
      durationGuide(session),
      activityPlan(session),
      conceptModel(session),
      `Capstone or portfolio connection: ${session.projectMilestone}.`
    ].join("\n\n"),
    relevanceMarkdown:
      `${session.title} matters because professional engineers are judged by decisions, working artifacts, test evidence, and clear communication. This session turns ${session.learningUnit} into evidence the learner can discuss in reviews and interviews without presenting it as employment certification.`,
    examples: examplesFor(session),
    commonMistakes: commonMistakesFor(session),
    resources: resourceKeys.map((key) => verifiedResource(resourceCatalog[key])),
    exercises: [
      {
        kind: "guided",
        promptMarkdown: guidedPrompt(session),
        expectedEvidence: "Guided notes, working artifact or design artifact, verification notes, and one tradeoff answer.",
        solutionNotesMarkdown: solutionNotes(session, "guided")
      },
      {
        kind: "independent",
        promptMarkdown: independentPrompt(session),
        expectedEvidence: session.evidence,
        solutionNotesMarkdown: solutionNotes(session, "independent")
      }
    ],
    knowledgeChecks: knowledgeChecksFor(session)
  };
}

function durationGuide(session: SoftwareCareerSession): string {
  return [
    "Duration architecture:",
    `- 60 minutes: review prerequisites, study the core model for ${session.learningUnit}, complete the smallest guided artifact, and answer one knowledge check.`,
    "- 90 minutes: add the full guided task, one debugging or review pass, and a concise explanation of the tradeoff.",
    "- 120 minutes: complete the guided task, independent challenge, verification evidence, interview prompts, and portfolio or capstone notes."
  ].join("\n");
}

function activityPlan(session: SoftwareCareerSession): string {
  return [
    "Activity plan:",
    `- CORE review: name the prior concept that this ${session.practiceKind} session depends on and one risk it reduces.`,
    `- CORE concept: define ${session.learningUnit} in terms of a production decision, not just terminology.`,
    `- CORE guided work: work through the scenario and create ${session.evidence}.`,
    "- RECOMMENDED verification: run or describe a typecheck, test, query plan, accessibility check, or design review that would prove the artifact is acceptable.",
    "- EXTENSION interview practice: answer the interview prompts with situation, decision, tradeoff, evidence, and follow-up."
  ].join("\n");
}

function conceptModel(session: SoftwareCareerSession): string {
  const practice = practiceKindModel(session.practiceKind);

  return [
    "Core model:",
    `- Start with the product or engineering problem: ${session.scenario}`,
    `- Name the boundary: ${practice.boundary}.`,
    `- Produce evidence: ${session.evidence}.`,
    `- Verify it: ${practice.verification}.`,
    `- Communicate the decision: explain the tradeoff, risk, and next check in language a teammate can review.`
  ].join("\n");
}

function examplesFor(session: SoftwareCareerSession): readonly string[] {
  const practice = practiceKindModel(session.practiceKind);

  return [
    practice.example,
    `Scenario example: ${session.scenario}`,
    `Artifact example: ${session.evidence}`,
    `Interview framing: ${firstInterviewQuestion(session)}`
  ];
}

function guidedPrompt(session: SoftwareCareerSession): string {
  const practice = practiceKindModel(session.practiceKind);

  return [
    `${practice.label}: ${session.scenario}`,
    "Requirements:",
    `- Create ${session.evidence}.`,
    `- Include the concept name, the boundary you are protecting, and one realistic failure mode.`,
    `- Add verification evidence: ${practice.verification}.`,
    "- Write a three-sentence tradeoff note for a reviewer.",
    "Constraints:",
    "- Keep the artifact small enough for a focused session.",
    "- Do not use broad any, raw secrets, inaccessible UI assumptions, or unbounded database/API behavior.",
    "- Prefer explicit checks, named decisions, and testable behavior over cleverness.",
    "Expected behavior:",
    `- A reviewer can see how ${session.learningUnit} changes the implementation or design decision.`,
    "- The evidence is specific enough to be checked later."
  ].join("\n");
}

function independentPrompt(session: SoftwareCareerSession): string {
  const practice = practiceKindModel(session.practiceKind);

  return [
    `Transfer challenge for ${session.title}:`,
    `Choose a similar feature, service, data model, interview problem, or production incident from your own portfolio project and produce ${session.evidence}.`,
    `Include ${practice.transferRequirement}.`,
    "Finish with two bullet points: one decision you are confident about and one issue you would ask a teammate to review."
  ].join("\n");
}

function solutionNotes(session: SoftwareCareerSession, mode: "guided" | "independent"): string {
  const practice = practiceKindModel(session.practiceKind);

  return [
    `Reference approach for the ${mode} task: start by restating the scenario, then define the boundary and expected artifact.`,
    `A strong answer for ${session.learningUnit} includes ${practice.solutionCriteria}.`,
    "Score the result against five checks: concept accuracy, realistic constraints, working or reviewable artifact, verification evidence, and clear tradeoff explanation.",
    `Interview checkpoint: ${firstInterviewQuestion(session)}`
  ].join("\n");
}

function commonMistakesFor(session: SoftwareCareerSession): readonly string[] {
  const practice = practiceKindModel(session.practiceKind);

  return [
    "Explaining terminology without tying it to a concrete engineering decision.",
    `Producing ${session.evidence} without verification evidence.`,
    practice.commonMistake,
    "Skipping the communication step a reviewer or interviewer would need."
  ];
}

function knowledgeChecksFor(session: SoftwareCareerSession): LearnerSeedContent["knowledgeChecks"] {
  return [
    {
      question: `What problem does ${session.learningUnit} solve in this session?`,
      answerKey: [session.objective],
      explanation: "A strong answer connects the concept to the stated scenario and decision boundary."
    },
    {
      question: "What evidence should prove that this session was completed professionally?",
      answerKey: [session.evidence],
      explanation: "Professional completion requires reviewable artifacts, not passive reading."
    },
    {
      question: firstInterviewQuestion(session),
      answerKey: ["Situation, decision, tradeoff, evidence, and verification."],
      explanation: "Interview readiness improves when the answer names both the implementation and the judgment behind it."
    }
  ];
}

function firstInterviewQuestion(session: SoftwareCareerSession): string {
  return (
    session.interviewQuestions[0] ??
    `How would you explain ${session.learningUnit} with a tradeoff and verification step?`
  );
}

function practiceKindModel(kind: PracticeKind): {
  readonly label: string;
  readonly boundary: string;
  readonly verification: string;
  readonly transferRequirement: string;
  readonly solutionCriteria: string;
  readonly commonMistake: string;
  readonly example: string;
} {
  switch (kind) {
    case "frontend":
      return {
        label: "Frontend implementation task",
        boundary: "component responsibility, user-visible state, and accessible interaction",
        verification: "component tests, keyboard review, and loading/error/empty-state checks",
        transferRequirement: "a component or route sketch with state ownership and accessibility notes",
        solutionCriteria: "focused components, explicit state ownership, accessible markup, and tests for user-visible behavior",
        commonMistake: "Moving state around without naming who owns the source of truth.",
        example: "type RemoteData<T> = { status: \"loading\" } | { status: \"success\"; data: T } | { status: \"error\"; message: string };"
      };
    case "graphql":
      return {
        label: "GraphQL design task",
        boundary: "schema contract, resolver responsibility, client data requirement, and authorization context",
        verification: "operation examples, resolver tests, and authorization failure cases",
        transferRequirement: "a schema or operation excerpt with nullability, variables, and error behavior",
        solutionCriteria: "clear types, intentional nullability, thin resolvers, validated inputs, and client cache reasoning",
        commonMistake: "Designing fields around database tables instead of product behavior and client needs.",
        example: "type Mutation { completeDailyTask(input: CompleteDailyTaskInput!): DailyTask! }"
      };
    case "backend":
      return {
        label: "Backend implementation task",
        boundary: "API input, application service, domain logic, repository, and database transaction",
        verification: "service tests, API tests, and repository or transaction assertions",
        transferRequirement: "a service or endpoint sketch with validation, errors, and test cases",
        solutionCriteria: "validated inputs, thin routes or resolvers, explicit service boundaries, controlled errors, and integration tests",
        commonMistake: "Putting business logic directly in a route or resolver because it works in the first example.",
        example: "async def complete_task(input: CompleteTaskInput, user: CurrentUser) -> DailyTaskResponse: ..."
      };
    case "database":
      return {
        label: "Database engineering task",
        boundary: "schema, query, transaction, index, and data-integrity rule",
        verification: "SQL examples, constraints, EXPLAIN reasoning, and migration checks",
        transferRequirement: "a schema or query artifact with constraints, indexes, and data-integrity notes",
        solutionCriteria: "correct relationships, constraints, transaction behavior, measured query access, and safe migration sequence",
        commonMistake: "Treating database design as storage only and forgetting integrity, concurrency, and historical records.",
        example: "CREATE INDEX daily_tasks_study_week_scheduled_on_idx ON daily_tasks (study_week_id, scheduled_on);"
      };
    case "security":
      return {
        label: "Security review task",
        boundary: "identity, authorization, input trust, browser behavior, secrets, and audit-safe logging",
        verification: "negative tests, threat model checks, and redaction review",
        transferRequirement: "a threat model or authorization matrix with at least two rejected requests",
        solutionCriteria: "server-side enforcement, validated input, least privilege, secure browser controls, and safe logs",
        commonMistake: "Checking access in the UI and assuming the API is protected.",
        example: "if task.user_id != current_user.id: raise ForbiddenError(\"Daily task is not owned by this user\")"
      };
    case "testing":
      return {
        label: "Testing task",
        boundary: "behavior under test, fixture data, assertion level, and regression risk",
        verification: "unit, integration, component, E2E, or accessibility test output",
        transferRequirement: "a test matrix with at least one happy path, one failure path, and one regression case",
        solutionCriteria: "tests assert behavior, keep fixtures deterministic, avoid over-mocking, and cover critical risks",
        commonMistake: "Writing tests that mirror implementation while missing the behavior users or services rely on.",
        example: "expect(screen.getByRole(\"button\", { name: /complete lesson/i })).toBeDisabled();"
      };
    case "debugging":
      return {
        label: "Debugging task",
        boundary: "symptom, reproduction, hypothesis, evidence, fix, and regression test",
        verification: "minimal reproduction, failing test, fixed behavior, and prevention note",
        transferRequirement: "a debugging log with hypotheses, evidence, rejected causes, fix, and regression test",
        solutionCriteria: "reproduces the issue, narrows cause with evidence, fixes the root cause, and adds a prevention check",
        commonMistake: "Changing code before proving the failure mode.",
        example: "Reproduction -> failing test -> root cause -> smallest fix -> regression test -> release note."
      };
    case "dsa":
      return {
        label: "DSA problem task",
        boundary: "input constraints, pattern recognition, algorithm, edge cases, and complexity",
        verification: "example cases, edge cases, and time and space complexity analysis",
        transferRequirement: "a solved variation with complexity and a note on why the pattern fits",
        solutionCriteria: "recognizes the pattern, implements the invariant, tests edge cases, and explains complexity",
        commonMistake: "Memorizing a solution shape without explaining why the pattern fits the constraints.",
        example: "function hasDuplicate(ids: readonly string[]): boolean { return new Set(ids).size !== ids.length; }"
      };
    case "system-design":
      return {
        label: "System design task",
        boundary: "requirements, estimates, API, data model, architecture, bottlenecks, scaling, and failure modes",
        verification: "capacity assumptions, component responsibilities, and tradeoff analysis",
        transferRequirement: "a design outline with requirements, API, data model, bottlenecks, and failure handling",
        solutionCriteria: "asks clarifying questions, estimates scale, chooses components for reasons, and handles failure explicitly",
        commonMistake: "Listing technologies before defining requirements and constraints.",
        example: "Requirements -> estimation -> API -> data model -> architecture -> bottlenecks -> tradeoffs -> failure analysis."
      };
    case "production":
      return {
        label: "Production engineering task",
        boundary: "build, config, deployment, observability, rollback, and operational documentation",
        verification: "CI output, health checks, logs, metrics, runbook, and rollback evidence",
        transferRequirement: "a release or operations artifact with checks, risks, and rollback steps",
        solutionCriteria: "automates repeatable checks, protects secrets, exposes useful signals, and documents recovery steps",
        commonMistake: "Treating a passing local build as proof that production is ready.",
        example: "build -> test -> migrate safely -> deploy -> verify health -> monitor -> rollback path."
      };
    case "career":
      return {
        label: "Career readiness task",
        boundary: "honest evidence, project narrative, interview question, weak topic, and revision plan",
        verification: "portfolio artifact review, mock answer, feedback, and revision checklist",
        transferRequirement: "a portfolio or interview artifact grounded in real work from this program",
        solutionCriteria: "specific evidence, honest scope, clear tradeoffs, technical depth, and targeted revision",
        commonMistake: "Claiming broad expertise without showing concrete artifacts and decisions.",
        example: "Problem -> constraints -> implementation -> tests -> tradeoffs -> outcome -> what you would improve next."
      };
    case "assessment":
      return {
        label: "Professional assessment task",
        boundary: "studied objectives, practical artifact, interview explanation, weak-topic feedback, and revision plan",
        verification: "answers, corrected artifact, rubric self-check, and revision recommendations",
        transferRequirement: "a corrected artifact plus notes on strong areas and weak areas",
        solutionCriteria: "covers the week, maps answers to evidence, identifies weak topics, and plans revision",
        commonMistake: "Treating the weekly review as a quiz instead of a professional checkpoint.",
        example: "Knowledge -> explanation -> practical task -> debugging or design review -> interview answer -> revision plan."
      };
    case "capstone":
      return {
        label: "Capstone delivery task",
        boundary: "requirements, architecture, frontend, API, backend, database, security, tests, CI, deployment, and demo evidence",
        verification: "working feature, test suite, docs, screenshots or demo notes, and technical retrospective",
        transferRequirement: "a capstone artifact that can be inspected and discussed in a mock interview",
        solutionCriteria: "coherent scope, working implementation, security checks, test evidence, docs, and defensible tradeoffs",
        commonMistake: "Building a basic todo clone without production-style architecture, security, or evidence.",
        example: "README sections: purpose, architecture, setup, API, database, tests, deployment notes, screenshots, ADRs, retrospective."
      };
    case "coding":
      return {
        label: "Coding task",
        boundary: "typed interface, implementation, invalid input, expected output, and review note",
        verification: "typecheck, focused tests, and example outputs",
        transferRequirement: "a small implementation with types, examples, and a failure case",
        solutionCriteria: "clear types, no broad any, named failure behavior, readable implementation, and verification evidence",
        commonMistake: "Writing code that passes one happy path but leaves invalid states possible.",
        example: "type ApiResult<T> = { ok: true; value: T } | { ok: false; error: { code: string; message: string } };"
      };
  }
}

function careerStats(): {
  readonly phases: readonly string[];
  readonly modules: number;
  readonly learningUnits: number;
  readonly codingExercises: number;
  readonly debuggingExercises: number;
  readonly dsaProblems: number;
  readonly systemDesignCases: number;
  readonly weeklyAssessments: number;
  readonly interviewQuestions: number;
  readonly projects: number;
  readonly capstoneComplete: boolean;
  readonly resources: number;
  readonly placeholdersRemaining: number;
} {
  const sessions = careerWeeks.flatMap((moduleRecord) => moduleRecord.sessions);
  const phases = [
    ...new Map(
      careerWeeks.map((moduleRecord) => [
        moduleRecord.phase,
        `Phase ${moduleRecord.phase}: ${moduleRecord.phaseTitle} - complete`
      ])
    ).values()
  ];
  const projectMilestones = new Set(careerWeeks.map((moduleRecord) => moduleRecord.projectMilestone));
  const resourceKeys = new Set(sessions.flatMap((session) => session.resources));
  const codingKinds: readonly PracticeKind[] = [
    "coding",
    "frontend",
    "graphql",
    "backend",
    "database",
    "security",
    "testing",
    "debugging",
    "dsa",
    "capstone"
  ];

  return {
    phases,
    modules: careerWeeks.length,
    learningUnits: sessions.length,
    codingExercises: sessions.filter((session) => codingKinds.includes(session.practiceKind)).length,
    debuggingExercises: sessions.filter((session) => session.practiceKind === "debugging").length,
    dsaProblems: sessions.filter((session) => session.practiceKind === "dsa").length,
    systemDesignCases: sessions.filter((session) => session.practiceKind === "system-design").length,
    weeklyAssessments: sessions.filter((session) => session.practiceKind === "assessment").length,
    interviewQuestions: sessions.reduce((total, session) => total + session.interviewQuestions.length, 0),
    projects: projectMilestones.size,
    capstoneComplete:
      sessions.filter((session) => session.phase === 14).length === 5 &&
      sessions.some((session) => session.tags.includes("technical-retrospective")),
    resources: resourceKeys.size,
    placeholdersRemaining: 0
  };
}

function week(
  sequence: number,
  phase: number,
  phaseTitle: string,
  title: string,
  projectMilestone: string,
  sessions: readonly Omit<SoftwareCareerSession, "id" | "phase" | "progressionState" | "projectMilestone" | "interviewQuestions">[]
): SoftwareCareerWeek {
  const moduleSessions = sessions.map((session, index): SoftwareCareerSession => ({
    ...session,
    id: `SE-P${String(phase).padStart(2, "0")}-M${String(sequence).padStart(2, "0")}-S${String(index + 1).padStart(2, "0")}`,
    phase,
    progressionState: progressionState(index),
    projectMilestone,
    interviewQuestions: interviewQuestionsFor(session.title, session.learningUnit, session.practiceKind)
  }));

  return {
    sequence,
    phase,
    phaseTitle,
    title,
    summary: `Week ${sequence} builds ${title.toLowerCase()} through five sequenced daily sessions with active implementation, diagnosis, review, interview practice, and a weekly assessment.`,
    projectMilestone,
    sessions: moduleSessions
  };
}

function s(
  title: string,
  objective: string,
  learningUnit: string,
  scenario: string,
  evidence: string,
  tags: readonly string[],
  practiceKind: PracticeKind,
  resources: readonly ResourceKey[]
): Omit<SoftwareCareerSession, "id" | "phase" | "progressionState" | "projectMilestone" | "interviewQuestions"> {
  return {
    title,
    objective,
    learningUnit,
    scenario,
    evidence,
    tags,
    practiceKind,
    resources
  };
}

function progressionState(index: number): ProgressionState {
  if (index === 0) {
    return "NEW";
  }

  if (index === 1) {
    return "EXPANSION";
  }

  if (index === 4) {
    return "CONSOLIDATION";
  }

  return "REVIEW";
}

function interviewQuestionsFor(
  title: string,
  learningUnit: string,
  practiceKind: PracticeKind
): readonly string[] {
  return [
    `How would you explain ${learningUnit} to a teammate during review?`,
    `What tradeoff matters most in ${title}, and how would you verify your decision?`,
    `Describe a ${practiceKind} failure mode this session helps prevent.`
  ];
}

function difficultyForPhase(phase: number): string {
  if (phase <= 2) {
    return "JavaScript Frontend Developer - TypeScript New";
  }

  if (phase <= 6) {
    return "Intermediate";
  }

  return "Advanced";
}

function uniqueResourceKeys(keys: readonly ResourceKey[]): readonly ResourceKey[] {
  return [...new Set(keys)];
}

function resource(
  title: string,
  provider: string,
  url: string,
  resourceType: string,
  difficulty: string,
  estimatedMinutes: number,
  description: string,
  required: boolean
): ResourceSeed {
  return {
    title,
    provider,
    url,
    resourceType,
    difficulty,
    estimatedMinutes,
    description,
    required
  };
}

function verifiedResource(resourceSeed: ResourceSeed): Omit<LessonVersionEditorInput["resources"][number], "id"> {
  return {
    ...resourceSeed,
    verificationStatus: "VERIFIED",
    approved: true,
    citation: `${resourceSeed.provider}: ${resourceSeed.title}`
  };
}
