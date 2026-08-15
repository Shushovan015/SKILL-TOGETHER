import type { LessonVersionEditorInput } from "../domain/content.types.js";
import type { SeedLessonDefinition, SeedModuleDefinition } from "./phase-03-seed-data.js";
import {
  softwareEngineeringCareerContentForLesson,
  softwareEngineeringCareerModules,
  softwareEngineeringCareerProgramStats
} from "./software-engineering-career-program.js";

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

interface DetailedSession {
  readonly id: string;
  readonly title: string;
  readonly objective: string;
  readonly evidence: string;
  readonly tags: readonly string[];
  readonly review: string;
  readonly concepts: readonly string[];
  readonly walkthrough: string;
  readonly guidedPrompt: string;
  readonly guidedHint: string;
  readonly independentPrompt: string;
  readonly interviewQuestions: readonly string[];
  readonly projectConnection: string;
  readonly resources: readonly ResourceSeed[];
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

export { softwareEngineeringCareerProgramStats };

export const softwareEngineeringProfessionalModules: readonly SeedModuleDefinition[] =
  softwareEngineeringCareerModules;

export const projectManagementProfessionalModules: readonly SeedModuleDefinition[] = [
  module(1, "Project Management Fundamentals", "Beginner-friendly foundation in project work, roles, lifecycle thinking, constraints, governance, and professional terminology.", [
    lesson("PM-P01-S01", "What a Project Manager Owns", "Explain the project manager role across outcomes, constraints, stakeholders, risks, and decision flow.", [], 120, "Responsibility map and scenario analysis.", ["pm-foundations", "roles", "professional-terminology"]),
    lesson("PM-P01-S02", "Project vs Operations and the Project Lifecycle", "Distinguish projects from operations and compare predictive, iterative, and hybrid lifecycles.", ["PM-P01-S01"], 120, "Lifecycle choice table for three scenarios.", ["project-lifecycle", "delivery-methods", "traditional-vs-agile"]),
    lesson("PM-P01-S03", "Objectives, SMART Goals, and Success Criteria", "Write measurable objectives, success criteria, assumptions, and constraints for a project.", ["PM-P01-S02"], 120, "SMART objective set and constraint register.", ["smart-goals", "success-criteria", "constraints"]),
    lesson("PM-P01-S04", "Business Case and Project Charter", "Draft a practical business case and project charter that aligns sponsors and delivery teams.", ["PM-P01-S03"], 120, "Business case summary and charter draft.", ["business-case", "charter", "governance"]),
    lesson("PM-P01-S05", "Governance, Roles, and Kickoff Readiness", "Prepare a kickoff-ready role map, decision path, meeting cadence, and open-question list.", ["PM-P01-S04"], 120, "Kickoff pack with RACI-style notes and open decisions.", ["governance", "raci", "kickoff"])
  ]),
  module(2, "Project Initiation and Scope", "Requirements, scope boundaries, deliverables, exclusions, WBS, milestones, assumptions, and scope-change discipline.", [
    lesson("PM-P02-S01", "Requirements Discovery and Requirements Log", "Elicit and structure requirements so stakeholders can validate scope before delivery starts.", ["PM-P01-S05"], 120, "Requirements log with acceptance notes.", ["requirements", "elicitation", "requirements-log"]),
    lesson("PM-P02-S02", "Scope Statement and Scope Creep Control", "Write scope boundaries, exclusions, assumptions, and change triggers.", ["PM-P02-S01"], 120, "Scope statement plus scope-creep response.", ["scope", "scope-creep", "change-control"]),
    lesson("PM-P02-S03", "Work Breakdown Structure", "Decompose deliverables into work packages without confusing work, phases, and activities.", ["PM-P02-S02"], 120, "WBS artifact and decomposition rationale.", ["wbs", "scope-decomposition", "planning"]),
    lesson("PM-P02-S04", "Milestones, Dependencies, and Assumption Log", "Identify milestones, dependencies, assumptions, and dependency risks.", ["PM-P02-S03"], 120, "Milestone list, dependency map, and assumption log.", ["milestones", "dependencies", "assumptions"]),
    lesson("PM-P02-S05", "Scope Baseline and Stakeholder Signoff", "Prepare a signoff-ready scope baseline and explain how to handle late changes.", ["PM-P02-S04"], 120, "Scope baseline checklist and signoff communication.", ["scope-baseline", "stakeholder-signoff", "change-control"])
  ]),
  module(3, "Planning and Scheduling", "Estimation, sequencing, Gantt-style planning, critical path, resources, budget, baselines, and schedule-risk decisions.", [
    lesson("PM-P03-S01", "Estimating Work and Planning Assumptions", "Estimate work packages and document uncertainty, confidence, and assumptions.", ["PM-P02-S05"], 120, "Estimate table with confidence and assumptions.", ["estimation", "planning-assumptions", "schedule"]),
    lesson("PM-P03-S02", "Gantt-Style Schedule and Dependency Logic", "Convert WBS work packages into a readable schedule with dependency logic.", ["PM-P03-S01"], 120, "Gantt-style schedule and dependency explanation.", ["gantt", "timeline", "dependencies"]),
    lesson("PM-P03-S03", "Critical Path and Schedule Tradeoffs", "Identify critical path, float, and tradeoff options when a schedule is squeezed.", ["PM-P03-S02"], 120, "Critical-path analysis and tradeoff memo.", ["critical-path", "float", "schedule-risk"]),
    lesson("PM-P03-S04", "Resource Planning and Budget Baseline", "Plan people, capacity, costs, and budget assumptions without hiding constraints.", ["PM-P03-S03"], 120, "Resource plan and budget baseline.", ["resources", "capacity", "budgeting"]),
    lesson("PM-P03-S05", "Plan Review and Schedule Defense", "Defend a project plan against stakeholder pressure using evidence, tradeoffs, and governance.", ["PM-P03-S04"], 120, "Plan review response and updated RAID entries.", ["plan-review", "stakeholder-communication", "raid"])
  ]),
  ...buildProjectManagementOutlineModules()
];

export function professionalContentForLesson(
  lessonDefinition: SeedLessonDefinition
): LearnerSeedContent | null {
  const softwareCareerContent = softwareEngineeringCareerContentForLesson(lessonDefinition);

  if (softwareCareerContent !== null) {
    return softwareCareerContent;
  }

  const detailed = detailedSessionById.get(lessonDefinition.identifier);

  if (detailed !== undefined) {
    return detailedContent(detailed);
  }

  if (lessonDefinition.identifier.startsWith("SE-P")) {
    return null;
  }

  if (lessonDefinition.identifier.startsWith("PM-P")) {
    return outlineContent(lessonDefinition, "Project Management", projectManagementResourceBundle(["project"]));
  }

  return null;
}

function buildProjectManagementOutlineModules(): readonly SeedModuleDefinition[] {
  return [
    outlineModule("PM", 4, "Cost and Resources", "Resource allocation, capacity planning, budget baselines, cost assumptions, vendor constraints, variance thinking, and resource-risk communication.", ["Resource Planning", "Budget Baselines", "Capacity and Constraints", "Cost Variance Scenarios", "Resource Review"]),
    outlineModule("PM", 5, "Risk and Issues", "Risk identification, qualitative scoring, response strategies, issue management, RAID logs, escalation, contingency, and decision records.", ["Risk Register", "Risk Response Planning", "Issue and RAID Management", "Escalation Decisions", "Risk Review"]),
    outlineModule("PM", 6, "Stakeholder Management", "Stakeholder registers, power-interest analysis, engagement strategy, difficult stakeholder conversations, negotiation, conflict, and sponsor alignment.", ["Stakeholder Register", "Power-Interest Matrix", "Engagement Planning", "Conflict and Negotiation", "Stakeholder Scenario Review"]),
    outlineModule("PM", 7, "Communication", "Communication plans, meeting design, decision logs, status reports, executive summaries, conflict messaging, escalation paths, and presentation practice.", ["Communication Plan", "Meeting Management", "Status Reporting", "Escalation Writing", "Presentation Practice"]),
    outlineModule("PM", 8, "Agile, Scrum and Kanban", "Agile principles, Scrum roles, events, artifacts, sprint planning, backlog refinement, story points, Kanban flow, WIP limits, metrics, and retrospectives.", ["Agile Foundations", "Scrum Roles and Events", "Backlog and Sprint Planning", "Kanban and Flow Metrics", "Retrospective and Hybrid Delivery"]),
    outlineModule("PM", 9, "Quality and Change Management", "Quality criteria, acceptance, change requests, change-control boards, impact analysis, configuration control, lessons learned, and decision discipline.", ["Quality Planning", "Acceptance and Verification", "Change Request Analysis", "Change Control Governance", "Quality and Change Review"]),
    outlineModule("PM", 10, "Project Monitoring and Reporting", "KPIs, burndown, earned value basics, RAID updates, forecast thinking, stakeholder reporting, corrective actions, and governance reviews.", ["Project Metrics", "Progress and Forecasting", "RAID and Decision Updates", "Executive Status Reporting", "Corrective Action Review"]),
    outlineModule("PM", 11, "Tools and Professional Workflows", "Jira, Confluence, Trello, spreadsheet trackers, dashboard design, documentation hygiene, templates, meeting notes, and tool-neutral workflows.", ["Tool Selection", "Jira and Backlog Workflows", "Documentation Systems", "Dashboard and Tracker Design", "Workflow Audit"]),
    outlineModule("PM", 12, "Interview and Career Preparation", "PM CV, project portfolio, terminology, situational answers, behavioral questions, Agile questions, risk scenarios, stakeholder cases, and case interviews.", ["PM CV and Portfolio", "Terminology Interview Practice", "Situational Questions", "Behavioral Answer Structure", "Case Interview Practice"]),
    outlineModule("PM", 13, "Project Management Capstone", "Simulated SaaS launch with charter, business case, stakeholders, requirements, scope, WBS, schedule, budget, risks, RAID, communications, status, changes, sprint plan, retrospective, and closure.", ["Capstone Setup and Charter", "Planning Artifact Pack", "Risk, Stakeholder, and Communication Pack", "Live Scenario Decisions", "Closure Report and Interview Story"]),
    outlineModule("PM", 14, "Final Professional Review", "Review fundamentals, initiation, planning, risk, stakeholders, Agile, reporting, tools, artifact portfolio, capstone decisions, and mock PM interview readiness.", ["Foundations Review", "Planning and Risk Review", "Agile and Reporting Review", "Artifact Portfolio Review", "Mock PM Interview"])
  ];
}

const softwareDetailedSessions: readonly DetailedSession[] = [
  detailed("SE-P01-S01", "Strict TypeScript for JavaScript Engineers", "Configure strict TypeScript and explain how compile-time checks reduce production defects.", "Strict tsconfig notes, before/after code, and three tradeoff observations.", ["ts-strict", "type-safety", "professional-workflow"], "Review your JavaScript habits: dynamic data, implicit nulls, and runtime-only feedback.", ["Strict mode is a professional safety baseline, not a badge.", "`noImplicitAny`, `strictNullChecks`, and `noUncheckedIndexedAccess` expose assumptions.", "A useful type explains a domain rule; a noisy type repeats implementation detail."], "Start with a JavaScript function that reads `user.profile.name`. In strict TypeScript, the compiler forces you to decide whether `profile` can be missing and what fallback is acceptable.", "Convert a loose JavaScript user-card helper to strict TypeScript. Add explicit return types only where they clarify the boundary.", "Use `type User = { id: string; profile?: { name: string } }` and handle the missing profile before reading `name`.", "Create a strict-mode checklist for a frontend repository and refactor one unsafe function.", ["What TypeScript strictness option has saved you from a production bug?", "How do you explain TypeScript value to a JavaScript teammate?"], "The capstone will use strict mode from the first commit.", softwareResourceBundle(["typescript", "mdn"])),
  detailed("SE-P01-S02", "Type Inference, Explicit Types, and Nullability", "Use inference, explicit annotations, and nullability rules to model values without over-typing.", "Typed API response model plus notes on inferred and explicit types.", ["type-inference", "nullability", "unknown-vs-any"], "Review strict-mode errors from the previous session and identify which were real design decisions.", ["Inference is useful inside implementation blocks.", "Explicit types are valuable at module, API, and domain boundaries.", "`unknown` is safer than `any` because it forces narrowing before use.", "Nullability should represent an actual product state, not accidental absence."], "Model `UserProfile | null` from an API and show how the UI should handle loading, missing profile, and loaded profile separately.", "Annotate a public helper return type, leave local variables inferred, and replace one `any` with `unknown` plus validation.", "Use `typeof value === \"object\"` and null checks before reading unknown data.", "Write a short rule set for when your team should annotate types explicitly.", ["When does inference improve readability?", "Why is `unknown` safer than `any`?"], "Capstone API clients will use explicit response boundaries and inferred local implementation.", softwareResourceBundle(["typescript", "mdn"])),
  detailed("SE-P01-S03", "Objects, Functions, Tuples, and API Shapes", "Model frontend data, callback contracts, tuples, and API DTOs with precise TypeScript types.", "Typed user-card props, API DTO, and function signatures.", ["object-typing", "functions", "api-typing"], "Review where explicit types belong: API boundary, reusable helper, and component props.", ["Object types should describe a stable contract.", "Function types communicate responsibility and callback shape.", "Tuples are useful for fixed-position pairs, but they become unreadable when overused.", "DTO types should match transport data; view models can be separate."], "Design separate `ApiUser`, `UserCardViewModel`, and `OnSelectUser` types. Map transport data into UI-friendly shape before rendering.", "Type a user-card component, a mapper function, and a callback that receives the selected user ID.", "Keep API DTOs immutable with readonly fields where mutation is not intended.", "Create a small DTO-to-view-model mapper and explain why the separation helps testing.", ["Why should API DTOs not always be reused directly as component props?", "When is a tuple better than an object?"], "Capstone API contracts will distinguish DTOs, domain models, and view models.", softwareResourceBundle(["typescript", "react"])),
  detailed("SE-P01-S04", "Unions, Narrowing, and Discriminated UI States", "Design discriminated unions and narrowing logic for loading, success, empty, and error states.", "Discriminated union state model and renderer with exhaustive checks.", ["ts-unions", "narrowing", "state-modeling"], "Review how nullability alone can blur real UI states.", ["A discriminated union gives every state an explicit name.", "Narrowing lets TypeScript prove which fields are available.", "`never` can enforce exhaustive handling.", "UI state should make impossible combinations impossible, such as loading with stale error text."], "Build a `RemoteData<T>` union with `idle`, `loading`, `success`, `empty`, and `error`. Render each branch with an exhaustive switch.", "Write the union and a render function. Add an `assertNever` helper for unhandled states.", "Make every union member share a `status` field.", "Refactor one component state object that currently uses multiple booleans.", ["How do discriminated unions reduce UI bugs?", "What does an exhaustive switch prove during review?"], "Capstone frontend state will use explicit state machines for risky flows.", softwareResourceBundle(["typescript", "react"])),
  detailed("SE-P01-S05", "Runtime Validation and Error Modeling", "Validate unknown inputs with Zod and model safe user-facing errors.", "Zod schemas, invalid cases, and a typed error-result helper.", ["validation", "zod", "error-modeling"], "Review why TypeScript cannot prove the shape of data from a form, URL, file, or network response.", ["Runtime validation belongs at boundaries.", "A parser should return typed data or a controlled error.", "User-facing errors should be safe; internal details belong in logs.", "Domain error codes are easier to test than raw exception strings."], "Parse an onboarding payload with Zod, return a typed success result or a safe validation error, and map that error to UI copy.", "Create a Zod schema for a schedule preference object and test two invalid payloads.", "Use `safeParse` when you need to control error formatting.", "Add a typed `Result<T>` wrapper for a form submission boundary.", ["Where should runtime validation happen?", "How should a production app avoid leaking raw validation internals?"], "Capstone inputs, environment variables, and API payloads will be validated at boundaries.", softwareResourceBundle(["zod", "typescript"])),
  detailed("SE-P02-S01", "Generics and Reusable Type-Safe Helpers", "Implement reusable helpers and components that preserve caller-specific type information.", "Generic helper library with examples and failure cases.", ["ts-generics", "reusable-abstractions", "api-typing"], "Review basic function typing and ask where repeated helper logic is losing type information.", ["A generic connects input type to output type.", "Avoid generics that do not influence parameters or return values.", "Prefer clear generic names once there are multiple roles.", "A reusable helper must preserve information rather than collapse it to broad types."], "Build `groupBy<T, K extends string>` for typed lists and discuss where the key type matters.", "Implement `firstOrFallback<T>` and `groupBy<T, K extends string>` with examples.", "Test with strings, numbers, and object arrays.", "Replace one duplicated list helper with a generic helper and document constraints.", ["When is `any` hiding a broken generic?", "How do you know a generic abstraction is worth keeping?"], "Capstone shared utilities will be generic only when they remove real duplication.", softwareResourceBundle(["typescript"])),
  detailed("SE-P02-S02", "Generic Constraints, keyof, and Indexed Access", "Use constraints, keyof, and indexed access types to build safe property and selector utilities.", "Type-safe property selector and form-field helper.", ["generic-constraints", "keyof", "indexed-access"], "Review the generic helper from the previous session and identify what assumptions it needs.", ["Constraints limit a generic to values that support the operation.", "`keyof T` represents valid property names.", "`T[K]` returns the property type for a selected key.", "These tools power table columns, form fields, sorting, and API selectors."], "Build a `pluck<T, K extends keyof T>` helper and a typed table-column definition.", "Implement `pluck`, then create column definitions that cannot reference missing fields.", "Use a small `UserRow` type and intentionally try one invalid key.", "Design a typed filter config for an admin table.", ["How does `keyof` prevent a runtime property typo?", "When do constraints make an API easier to use?"], "Capstone tables, filters, and forms will use constrained keys where useful.", softwareResourceBundle(["typescript"])),
  detailed("SE-P02-S03", "Mapped Types, Utility Types, and API Transformations", "Use mapped and utility types to transform DTOs into form, view, and update models.", "DTO-to-form mapped type and update payload utility.", ["mapped-types", "utility-types", "api-typing"], "Review why API DTOs, edit forms, and update payloads rarely have identical shapes.", ["Mapped types iterate over keys.", "`Pick`, `Omit`, `Partial`, and `Readonly` are production workhorses.", "Utility types should communicate intent, not hide the model.", "Transform types are useful only when the relationship stays clear."], "Turn a `UserDto` into `UserFormValues` and `UserUpdateInput` without duplicating every field manually.", "Create a mapped type that converts selected nullable DTO fields into required form strings.", "Keep the transformation small and name the domain reason.", "Refactor one create/update payload pair using utility types.", ["What is the risk of overusing `Partial`?", "How do mapped types reduce drift between DTO and UI models?"], "Capstone edit flows will use typed create/update input relationships.", softwareResourceBundle(["typescript"])),
  detailed("SE-P02-S04", "Conditional Types, infer, and Type-Level Decisions", "Use conditional types and infer when a library or API type must branch safely.", "Conditional response extractor and notes on readability limits.", ["conditional-types", "infer", "type-safe-architecture"], "Review a DTO transformation and ask whether the type relation is direct or conditional.", ["Conditional types model `if this type, then that type`.", "`infer` extracts a type from a larger structure.", "Use conditional types for reusable libraries and boundary helpers, not every domain rule.", "Readability is part of type safety."], "Create `ApiValue<T>` that extracts the success payload from an API result union.", "Implement an extractor for `Promise<T>` and an API result helper. Add comments for why it exists.", "Name the helper by the business purpose, not the TypeScript trick.", "Write a decision note explaining when not to use conditional types.", ["What problem does `infer` solve?", "How can advanced types become a maintenance problem?"], "Capstone architecture will use advanced types where they keep contracts stable.", softwareResourceBundle(["typescript"])),
  detailed("SE-P02-S05", "Branded Types, satisfies, const Assertions, and Boundaries", "Use branded values, satisfies, const assertions, unknown, never, and assertion functions at application boundaries.", "Branded ID model, route map using satisfies, and assertion boundary.", ["branded-types", "satisfies", "assertion-functions"], "Review advanced type tools and separate boundary safety from internal convenience.", ["Branded types prevent mixing semantically different strings.", "`satisfies` checks an object without widening it too much.", "`as const` preserves literal values for route maps and config.", "Assertion functions are useful after validated runtime checks.", "`never` helps prove impossible states."], "Model `UserId` and `TaskId`, define a route map with `satisfies`, and add an assertion for parsed IDs.", "Create two branded ID types and show that TypeScript rejects mixing them.", "Keep the runtime value as a string; the brand exists for compile-time safety.", "Write a boundary helper for parsing a route param into a branded ID.", ["How do branded types reduce accidental cross-resource bugs?", "When should you prefer `satisfies` over a type annotation?"], "Capstone IDs, route maps, and config will use boundary-safe patterns.", softwareResourceBundle(["typescript"])),
  detailed("SE-P03-S01", "Feature-Based React Architecture", "Organize a React codebase by feature, ownership boundary, and reusable UI surface.", "Feature folder plan and component responsibility table.", ["react-architecture", "feature-organization", "frontend-system-design"], "Review a flat components folder and identify ownership confusion.", ["Feature folders group pages, GraphQL, validation, and UI helpers by business capability.", "Reusable UI belongs in shared components only after repeated use is clear.", "Pages coordinate data; smaller components render focused surfaces.", "Architecture should scale from five pages to one hundred without global clutter."], "Restructure a small dashboard into app routes, feature pages, feature components, and shared primitives.", "Draw a folder tree and annotate each folder's responsibility.", "Move code by ownership, not by file type alone.", "Create a feature-boundary checklist for future pull requests.", ["How would this frontend scale from five pages to one hundred?", "What belongs in a shared component library?"], "Capstone frontend will use feature ownership and intentional shared components.", softwareResourceBundle(["react"])),
  detailed("SE-P03-S02", "Component Composition and State Ownership", "Decide whether state belongs locally, in a hook, in URL state, or on the server.", "State ownership decision matrix and refactored component sketch.", ["react-composition", "state-design", "url-state"], "Review a component with too many props and mixed data ownership.", ["Composition reduces prop drilling by letting callers provide structure.", "Local state is for temporary UI concerns.", "URL state is for shareable navigation and filters.", "Server state belongs to the data-fetching layer.", "Custom hooks should own reusable behavior, not hide unrelated UI."], "Refactor a status dashboard into composed sections and decide where filter, modal, and fetched data state belong.", "Build a state decision matrix with local, hook, URL, and server columns.", "Write one rule for when state should move up or move out.", "Refactor a prop-heavy component into composition slots.", ["Should this state live locally, in URL, in a hook, or on the server?", "When does composition beat more props?"], "Capstone pages will use state ownership decisions before implementation.", softwareResourceBundle(["react"])),
  detailed("SE-P03-S03", "Forms with React Hook Form and Zod", "Build accessible forms with aligned client and server validation.", "Validated form schema, error states, and accessibility notes.", ["forms", "react-hook-form", "zod", "a11y"], "Review runtime validation and connect it to accessible form feedback.", ["React Hook Form keeps form state efficient and explicit.", "Zod schemas align field rules with server validation.", "Each input needs label, error, and disabled/loading behavior.", "Frontend validation improves UX but does not replace server validation."], "Create a project settings form with required fields, time capacity, and error states.", "Implement schema, default values, field errors, disabled submit, and success state.", "Use `aria-invalid` and clear text errors near each field.", "Write test cases for valid submit, invalid submit, loading, and server error.", ["How do you keep frontend and backend validation aligned?", "What makes a form accessible beyond visual styling?"], "Capstone forms will include validation, loading, success, and safe error states.", softwareResourceBundle(["react-hook-form", "zod", "react"])),
  detailed("SE-P03-S04", "Server State, Apollo Client, and Cache Updates", "Separate local UI state from GraphQL server state and plan cache updates.", "Query/mutation plan with cache update and error strategy.", ["apollo-client", "server-state", "graphql-client"], "Review state ownership and identify which values are remote facts.", ["Server state has ownership outside the browser.", "Apollo cache normalization works best with stable IDs and types.", "Mutation UX needs loading, optimistic decisions, error rollback, and refetch strategy.", "Fragments keep UI data requirements visible."], "Plan a Today dashboard query, a complete-task mutation, and the cache behavior after completion.", "Write a query/mutation table with variables, affected screens, cache update, and error fallback.", "Decide which mutations are safe for optimistic updates.", "Add fragment boundaries to a feature GraphQL plan.", ["How does Apollo know whether two objects are the same entity?", "When is refetching better than manual cache updates?"], "Capstone GraphQL client code will be fragment-driven and cache-aware.", softwareResourceBundle(["apollo", "graphql"])),
  detailed("SE-P03-S05", "Frontend Testing, Accessibility, and Performance Review", "Test visible behavior, accessibility states, and performance-sensitive rendering decisions.", "RTL test plan, accessibility checklist, and performance review notes.", ["frontend-testing", "accessibility", "performance"], "Review recent form and data-fetching work and list user-visible states.", ["Test behavior the user can observe.", "A component test should cover loading, empty, success, error, and disabled states when relevant.", "Accessibility is a functional requirement, not a polish task.", "Performance review starts with measurement: bundle size, render frequency, and expensive work."], "Create tests for a dashboard card and perform a manual accessibility and performance checklist.", "Write test cases first, then identify one rendering risk and one accessibility risk.", "Prefer role and label queries over implementation details.", "Create a pull-request quality checklist for frontend changes.", ["How do you test loading and error states?", "How would you explain a frontend performance regression?"], "Capstone frontend delivery will require tests, accessibility notes, and performance checks.", softwareResourceBundle(["react", "mdn"]))
];

const projectDetailedSessions: readonly DetailedSession[] = [
  detailed("PM-P01-S01", "What a Project Manager Owns", "Explain the project manager role across outcomes, constraints, stakeholders, risks, and decision flow.", "Responsibility map and scenario analysis.", ["pm-foundations", "roles", "professional-terminology"], "Review what you already know about projects from everyday work: someone wants an outcome, constraints exist, and people need decisions.", ["A project manager does not personally do every task.", "The PM owns coordination, visibility, decision flow, risk awareness, and stakeholder communication.", "Professional PM language turns vague concern into trackable work.", "The PM must know when to escalate rather than hide uncertainty."], "Analyze a customer portal launch with sponsor, engineering, support, and compliance stakeholders. Identify what the PM owns versus what specialists own.", "Create a responsibility map with outcome, constraint, stakeholder, decision, risk, and artifact columns.", "Keep each responsibility as a verb phrase, such as `clarify scope` or `escalate dependency`.", "Apply the responsibility map to a small project you know.", ["What does a project manager own when they do not manage the engineers directly?", "How do you explain the PM role to a skeptical team?"], "The PM capstone will start with a clear PM responsibility map.", projectManagementResourceBundle(["pmi", "atlassian"])),
  detailed("PM-P01-S02", "Project vs Operations and the Project Lifecycle", "Distinguish projects from operations and compare predictive, iterative, and hybrid lifecycles.", "Lifecycle choice table for three scenarios.", ["project-lifecycle", "delivery-methods", "traditional-vs-agile"], "Review the PM responsibility map and ask which work is temporary versus ongoing.", ["A project is temporary and creates a unique outcome.", "Operations are ongoing repeatable work.", "Predictive delivery works when scope is stable and sequencing matters.", "Iterative delivery works when learning and feedback are central.", "Hybrid delivery combines governance milestones with iterative product work."], "Compare office relocation, SaaS feature launch, and monthly support reporting. Choose project, operation, or hybrid context.", "Build a table with scenario, uncertainty, stakeholders, regulatory pressure, delivery style, and rationale.", "Do not choose Agile because it sounds modern; choose based on uncertainty and feedback needs.", "Write a lifecycle recommendation for a stakeholder in plain language.", ["When would predictive planning still be appropriate?", "How do you explain hybrid delivery without jargon?"], "The capstone will use a hybrid SaaS launch lifecycle.", projectManagementResourceBundle(["pmi", "scrum", "atlassian-agile"])),
  detailed("PM-P01-S03", "Objectives, SMART Goals, and Success Criteria", "Write measurable objectives, success criteria, assumptions, and constraints for a project.", "SMART objective set and constraint register.", ["smart-goals", "success-criteria", "constraints"], "Review lifecycle choice and identify what success should mean before work starts.", ["A goal states direction; an objective defines a measurable outcome.", "SMART means specific, measurable, achievable, relevant, and time-bound.", "Success criteria define how stakeholders will judge completion.", "Constraints are limits such as budget, deadline, compliance, or staff capacity.", "Assumptions must be visible because they can become risks."], "Turn `improve onboarding` into measurable objectives for activation rate, support tickets, deadline, and budget.", "Write three SMART objectives, three success criteria, two constraints, and two assumptions.", "Use numbers where the project can reasonably measure them.", "Rewrite one vague objective into a measurable objective with a test.", ["What makes a project objective measurable?", "How do constraints change your plan?"], "The capstone charter will include measurable objectives and constraints.", projectManagementResourceBundle(["pmi", "atlassian"])),
  detailed("PM-P01-S04", "Business Case and Project Charter", "Draft a practical business case and project charter that aligns sponsors and delivery teams.", "Business case summary and charter draft.", ["business-case", "charter", "governance"], "Review objectives and ask why the organization should fund this work.", ["A business case explains why the project is worth doing.", "A charter authorizes the project and gives the PM a mandate.", "A useful charter is concise: purpose, objectives, scope summary, key stakeholders, constraints, risks, milestones, and approval.", "Charters prevent teams from starting execution while still debating purpose."], "Draft a charter for a SaaS onboarding improvement project using sponsor, customer, support, and engineering concerns.", "Create a one-page charter with purpose, objectives, scope summary, stakeholders, risks, assumptions, and approval question.", "Keep the charter readable by executives and delivery team members.", "Write a sponsor approval email summarizing the charter.", ["What belongs in a charter but not a detailed project plan?", "How does a business case affect prioritization?"], "The capstone will require a charter and business case artifact.", projectManagementResourceBundle(["pmi", "atlassian"])),
  detailed("PM-P01-S05", "Governance, Roles, and Kickoff Readiness", "Prepare a kickoff-ready role map, decision path, meeting cadence, and open-question list.", "Kickoff pack with RACI-style notes and open decisions.", ["governance", "raci", "kickoff"], "Review the charter and identify who can approve changes, resolve conflicts, and provide resources.", ["Governance defines how decisions are made.", "Roles clarify who is responsible, accountable, consulted, and informed.", "A kickoff aligns purpose, scope, working agreements, communication cadence, and next actions.", "Open questions are not weakness; hidden questions are risk."], "Prepare a kickoff pack for the SaaS onboarding project with roles, decision path, meeting cadence, and open decisions.", "Write a RACI-style table and a kickoff agenda.", "Do not overcomplicate RACI; use it to clarify decision friction.", "Create a stakeholder-ready kickoff summary.", ["How do you handle unclear decision ownership?", "What should a kickoff accomplish beyond introductions?"], "The capstone kickoff will use this governance pack.", projectManagementResourceBundle(["pmi", "atlassian"])),
  detailed("PM-P02-S01", "Requirements Discovery and Requirements Log", "Elicit and structure requirements so stakeholders can validate scope before delivery starts.", "Requirements log with acceptance notes.", ["requirements", "elicitation", "requirements-log"], "Review charter objectives and ask what the product must do to achieve them.", ["Requirements describe needs, conditions, and capabilities.", "Good elicitation asks stakeholders what problem they need solved and how they will verify success.", "A requirements log needs ID, stakeholder, requirement, priority, acceptance note, status, and open questions.", "Requirements should be testable enough to support scope decisions."], "Interview sponsor, support, and engineering perspectives for onboarding requirements.", "Create a requirements log with five requirements and acceptance notes.", "Separate business requirement from implementation idea.", "Prioritize requirements using must, should, could, will not.", ["How do you handle conflicting stakeholder requirements?", "What makes a requirement testable?"], "The capstone will include a requirements log and prioritization rationale.", projectManagementResourceBundle(["atlassian", "pmi"])),
  detailed("PM-P02-S02", "Scope Statement and Scope Creep Control", "Write scope boundaries, exclusions, assumptions, and change triggers.", "Scope statement plus scope-creep response.", ["scope", "scope-creep", "change-control"], "Review the requirements log and decide what is in the current release.", ["Scope defines what work and deliverables are included.", "Exclusions are as important as inclusions.", "Scope creep is uncontrolled expansion without tradeoff approval.", "Change control does not mean saying no; it means making impact visible before deciding."], "Write scope for onboarding activation and exclude billing, mobile app redesign, and analytics rebuild unless approved.", "Draft in-scope, out-of-scope, assumptions, constraints, and change triggers.", "Make exclusions specific enough to prevent misunderstanding.", "Respond to a stakeholder who requests an unplanned billing feature.", ["How do you push back on scope creep professionally?", "Why should exclusions be written down?"], "The capstone will include a scope statement and change-control decisions.", projectManagementResourceBundle(["pmi", "atlassian"])),
  detailed("PM-P02-S03", "Work Breakdown Structure", "Decompose deliverables into work packages without confusing work, phases, and activities.", "WBS artifact and decomposition rationale.", ["wbs", "scope-decomposition", "planning"], "Review the scope statement and identify deliverables, not just tasks.", ["A WBS decomposes deliverables into manageable work packages.", "It is not a chronological task list.", "Each work package should be clear enough to estimate, assign, and verify.", "A good WBS exposes missing work before schedule pressure starts."], "Create a WBS for onboarding: research, UX, frontend, backend, data, testing, rollout, support readiness.", "Build a three-level WBS and explain two decomposition choices.", "Use nouns for deliverables before turning them into scheduled activities.", "Find three missing deliverables in a flawed WBS.", ["How is a WBS different from a schedule?", "What makes a work package manageable?"], "The capstone planning pack will include a WBS.", projectManagementResourceBundle(["atlassian", "pmi"])),
  detailed("PM-P02-S04", "Milestones, Dependencies, and Assumption Log", "Identify milestones, dependencies, assumptions, and dependency risks.", "Milestone list, dependency map, and assumption log.", ["milestones", "dependencies", "assumptions"], "Review the WBS and ask which deliverables unlock other work.", ["A milestone is a significant checkpoint, not every task.", "Dependencies determine sequencing and risk.", "Assumptions are unverified beliefs the plan depends on.", "Dependency risks should be visible before they become issues."], "Map dependencies between UX approval, API readiness, frontend integration, QA, compliance review, and rollout.", "Create milestone list, dependency map, and assumption log.", "Name the owner and validation date for each assumption.", "Write a risk note for one dependency likely to slip.", ["How do dependencies affect stakeholder communication?", "When does an assumption become a risk?"], "The capstone will include dependency and assumption tracking.", projectManagementResourceBundle(["atlassian", "pmi"])),
  detailed("PM-P02-S05", "Scope Baseline and Stakeholder Signoff", "Prepare a signoff-ready scope baseline and explain how to handle late changes.", "Scope baseline checklist and signoff communication.", ["scope-baseline", "stakeholder-signoff", "change-control"], "Review requirements, scope, WBS, milestones, and assumptions as one baseline package.", ["A scope baseline combines approved scope statement, WBS, and WBS dictionary or equivalent detail.", "Signoff creates a shared reference point for future changes.", "Late changes need impact analysis: scope, time, cost, quality, risk, and stakeholder impact.", "Professional PMs communicate options, not just problems."], "Prepare a baseline summary and respond to a stakeholder requesting new analytics just before development starts.", "Write a signoff email, impact-analysis table, and recommendation.", "Frame the decision as options with tradeoffs.", "Update the change log after the decision.", ["How do you keep signoff from becoming bureaucracy?", "What should impact analysis include?"], "The capstone will require baseline signoff and change scenarios.", projectManagementResourceBundle(["pmi", "atlassian"])),
  detailed("PM-P03-S01", "Estimating Work and Planning Assumptions", "Estimate work packages and document uncertainty, confidence, and assumptions.", "Estimate table with confidence and assumptions.", ["estimation", "planning-assumptions", "schedule"], "Review the WBS and identify which work packages are ready to estimate.", ["Estimates are forecasts under uncertainty, not promises.", "A good estimate states basis, confidence, and assumptions.", "Use ranges when uncertainty is high.", "Estimating should involve the people closest to the work."], "Estimate onboarding work packages with best-case, likely, worst-case, owner, and confidence.", "Create an estimate table and highlight the three highest-uncertainty items.", "Avoid false precision; show confidence and assumptions.", "Write a stakeholder note explaining why one estimate is a range.", ["How do you explain estimate uncertainty?", "What should you do when estimates are politically pressured?"], "The capstone schedule will include estimate assumptions.", projectManagementResourceBundle(["atlassian", "pmi"])),
  detailed("PM-P03-S02", "Gantt-Style Schedule and Dependency Logic", "Convert WBS work packages into a readable schedule with dependency logic.", "Gantt-style schedule and dependency explanation.", ["gantt", "timeline", "dependencies"], "Review estimates and dependencies before placing tasks on a timeline.", ["A schedule turns work packages into sequenced activities.", "A Gantt-style view helps stakeholders see timing and overlap.", "Dependencies must be logical, not just visually convenient.", "A schedule is useful only if updates reveal real delivery risk."], "Create a six-week timeline for onboarding work with dependencies and milestones.", "Draft a text-based Gantt table with start, finish, owner, dependency, and milestone.", "Keep parallel work realistic based on resource constraints.", "Identify two schedule risks created by dependency timing.", ["What makes a schedule credible?", "How do you communicate timeline uncertainty?"], "The capstone will include a schedule and dependency rationale.", projectManagementResourceBundle(["atlassian", "pmi"])),
  detailed("PM-P03-S03", "Critical Path and Schedule Tradeoffs", "Identify critical path, float, and tradeoff options when a schedule is squeezed.", "Critical-path analysis and tradeoff memo.", ["critical-path", "float", "schedule-risk"], "Review the schedule and identify which tasks drive the final date.", ["The critical path is the chain of work that determines project duration.", "Float is schedule flexibility before a task delays the project.", "Crashing adds resources; fast-tracking overlaps work; both add risk.", "Tradeoffs should be explicit and approved."], "Analyze a schedule where API completion, QA, and compliance review drive the launch date.", "Mark critical path items, identify float, and propose two recovery options.", "Do not hide quality or risk costs when compressing a schedule.", "Write a tradeoff memo to a sponsor.", ["What is the difference between crashing and fast-tracking?", "How do you defend schedule tradeoffs?"], "The capstone will include schedule pressure events.", projectManagementResourceBundle(["pmi", "atlassian"])),
  detailed("PM-P03-S04", "Resource Planning and Budget Baseline", "Plan people, capacity, costs, and budget assumptions without hiding constraints.", "Resource plan and budget baseline.", ["resources", "capacity", "budgeting"], "Review critical path items and ask whether the right people are available at the right time.", ["Resource planning matches work to skills and availability.", "Over-allocation creates hidden schedule risk.", "A budget baseline records expected costs and assumptions.", "Resource and budget plans should connect to scope and schedule."], "Create a resource plan for PM, design, frontend, backend, QA, support, and compliance with availability constraints.", "Build a capacity table and simple budget baseline.", "Flag any role over 80 percent allocation for review.", "Write an option if one engineer is unavailable for a week.", ["How do you identify resource over-allocation?", "What belongs in a budget assumption?"], "The capstone will include resource and budget artifacts.", projectManagementResourceBundle(["pmi", "atlassian"])),
  detailed("PM-P03-S05", "Plan Review and Schedule Defense", "Defend a project plan against stakeholder pressure using evidence, tradeoffs, and governance.", "Plan review response and updated RAID entries.", ["plan-review", "stakeholder-communication", "raid"], "Review estimates, schedule, critical path, resources, and budget as one integrated plan.", ["A plan review tests whether scope, schedule, resources, budget, risks, and communication are aligned.", "Stakeholder pressure should be answered with options and impact.", "RAID logs keep risks, assumptions, issues, and dependencies visible.", "Professional communication separates facts, analysis, recommendation, and decision needed."], "Respond to a sponsor who wants the same scope two weeks earlier without extra budget.", "Create a plan-review summary with options, impacts, RAID updates, and recommendation.", "Use calm language and decision framing.", "Prepare two interview-style answers about schedule pressure.", ["How do you handle unrealistic deadlines?", "How do you escalate without sounding unhelpful?"], "The capstone will include realistic pressure events and decision memos.", projectManagementResourceBundle(["pmi", "atlassian"]))
];

const detailedSessionById = new Map(
  [...softwareDetailedSessions, ...projectDetailedSessions].map((session) => [session.id, session])
);

function detailedContent(session: DetailedSession): LearnerSeedContent {
  return {
    outcomes: [
      session.objective,
      "Apply the concept to a realistic professional scenario.",
      "Produce portfolio-ready evidence from the practical exercise.",
      "Answer interview-style questions about tradeoffs and judgment."
    ],
    explanationMarkdown: [
      `Previous-topic review: ${session.review}`,
      "Core teaching:",
      ...session.concepts.map((concept) => `- ${concept}`),
      `Professional walkthrough: ${session.walkthrough}`,
      "Duration paths:",
      "- 30 minutes: retrieve the prerequisite, learn the mental model, inspect the walkthrough, and begin the guided artifact.",
      "- 60 minutes: complete the core guided artifact, make one decision, and answer the primary interview question.",
      "- 90 minutes: add the independent task, a review pass, and stakeholder or reviewer communication.",
      "- 120 minutes: complete all work, test a complication or failure mode, revise the artifact, and add portfolio notes.",
      "Professional review standard: verify that the artifact is internally consistent, names assumptions and constraints, assigns ownership, defines observable evidence, and makes the next decision clear. Then challenge the first answer with a changed deadline, unavailable person, quality concern, or stakeholder objection and record what must change.",
      `Capstone connection: ${session.projectConnection}`
    ].join("\n\n"),
    relevanceMarkdown:
      "This session is designed as job-oriented practice. The goal is not to memorize terms, but to make a decision, build or document an artifact, explain tradeoffs, and leave evidence that can support a portfolio or interview discussion.",
    examples: [
      session.walkthrough,
      `Portfolio evidence example: ${session.evidence}`,
      `Interview framing: ${session.interviewQuestions[0] ?? "Explain the tradeoff and the evidence you used."}`
    ],
    commonMistakes: [
      "Treating the topic as vocabulary instead of a professional decision.",
      "Producing an artifact without explaining assumptions and tradeoffs.",
      "Skipping verification, review, or stakeholder-facing explanation.",
      "Giving an interview answer that states a tool choice without context."
    ],
    resources: session.resources.map(verifiedResource),
    exercises: [
      {
        kind: "guided",
        promptMarkdown: `${session.guidedPrompt}\n\nInterview practice:\n${session.interviewQuestions.map((question) => `- ${question}`).join("\n")}`,
        expectedEvidence: "Guided notes, working artifact, and written tradeoff answer.",
        solutionNotesMarkdown: session.guidedHint
      },
      {
        kind: "independent",
        promptMarkdown: session.independentPrompt,
        expectedEvidence: session.evidence,
        solutionNotesMarkdown: "Review the response against seven criteria: correct concept use, complete artifact fields, explicit assumptions, realistic tradeoffs, named owner, verification or acceptance evidence, and a concise explanation suitable for a stakeholder or interviewer. Revise any answer that only repeats terminology."
      }
    ],
    knowledgeChecks: session.interviewQuestions.slice(0, 3).map((question) => ({
      question,
      answerKey: ["A strong answer names the situation, decision, tradeoff, evidence, and verification step."],
      explanation: "Professional readiness depends on explaining judgment, not only naming the concept."
    }))
  };
}

function outlineContent(
  lessonDefinition: SeedLessonDefinition,
  trackTitle: string,
  resources: readonly ResourceSeed[]
): LearnerSeedContent {
  const model = projectManagementModel(lessonDefinition);

  return {
    outcomes: [
      lessonDefinition.objective,
      `Use the ${model.frameworkName} framework against an ambiguous delivery scenario.`,
      `Create and review ${lessonDefinition.evidence}`,
      "Communicate a recommendation with its impact, risk, owner, and next decision."
    ],
    explanationMarkdown: [
      `Today's outcome: ${lessonDefinition.objective}`,
      `Mental model: ${model.mentalModel}`,
      `${model.frameworkName}: ${model.framework.join(" -> ")}.`,
      `What and why: ${model.teaching}`,
      `When to use it: ${model.whenToUse}`,
      `When not to use it: ${model.whenNotToUse}`,
      `Failure mode: ${model.failureMode}`,
      `Trade-off: ${model.tradeoff}`,
      "Duration paths:",
      `- 30 minutes: retrieve the prior decision, learn the mental model, analyze the core facts in the scenario, and start ${lessonDefinition.evidence}`,
      "- 60 minutes: complete the core artifact, make one recommendation, and write the stakeholder message.",
      "- 90 minutes: add competing stakeholder constraints, impact analysis, and an artifact review pass.",
      "- 120 minutes: add a second scenario change, executive communication, interview defense, and portfolio-quality revision.",
      `Professional scenario: ${model.scenario}`,
      `What you should remember: ${model.durableRules.join(" ")}`,
      `Portfolio and capstone transfer: retain ${lessonDefinition.evidence} as evidence for the ${trackTitle} capstone.`
    ].join("\n\n"),
    relevanceMarkdown:
      `${lessonDefinition.title} appears in real delivery work whenever a project manager must reduce uncertainty, align people, document a decision, and protect an outcome. A hiring manager can test this skill through an ambiguous scenario rather than a terminology question.`,
    examples: [
      model.scenario,
      `Model artifact structure: ${model.artifactFields.join(" | ")}.`,
      `Model communication: ${model.communicationExample}`,
      `Interview angle: Tell me how you used ${lessonDefinition.title.toLowerCase()} when the preferred plan was no longer viable.`
    ],
    commonMistakes: [
      model.failureMode,
      "Recording information without an owner, decision, deadline, or follow-up.",
      "Presenting one recommendation without showing alternatives and consequences.",
      "Sending the same level of detail to delivery teams and executive stakeholders."
    ],
    resources: resources.slice(0, 3).map(verifiedResource),
    exercises: [
      {
        kind: "guided",
        promptMarkdown: [
          `Scenario: ${model.scenario}`,
          `1. Apply ${model.frameworkName}: ${model.framework.join(" -> ")}.`,
          `2. Create ${lessonDefinition.evidence}`,
          `3. Include these fields: ${model.artifactFields.join(", ")}.`,
          "4. Identify one assumption, one risk, one owner, and one decision deadline.",
          "5. Write a stakeholder message using FACT -> IMPACT -> OPTIONS -> RECOMMENDATION -> DECISION NEEDED."
        ].join("\n"),
        expectedEvidence: lessonDefinition.evidence,
        solutionNotesMarkdown: `A strong response separates facts from assumptions, names the affected outcome, compares at least two options, assigns ownership, and requests a time-bound decision. Example communication: ${model.communicationExample}`
      },
      {
        kind: "independent",
        promptMarkdown: `A new constraint appears: ${model.complication} Revise the artifact, record what changed, choose an option, and defend the recommendation to both the delivery team and sponsor. End with what you would monitor next.`,
        expectedEvidence: lessonDefinition.evidence,
        solutionNotesMarkdown: `Review against: complete facts, explicit assumptions, realistic options, impact on time/cost/quality/resources/risk, named owner, decision deadline, audience-appropriate communication, and a follow-up measure.`
      }
    ],
    knowledgeChecks: [
      {
        question: `What is the mental model for ${lessonDefinition.title}?`,
        answerKey: [model.mentalModel],
        explanation: "The mental model should guide action when the scenario changes."
      },
      {
        question: `What is the most dangerous failure mode in this scenario?`,
        answerKey: [model.failureMode],
        explanation: "Recognizing the failure pattern helps the PM intervene before status becomes a surprise."
      },
      {
        question: "How should the recommendation be communicated?",
        answerKey: ["Facts, impact, options, recommendation, decision needed, owner, and next review."],
        explanation: "Professional communication reduces uncertainty and makes the next action explicit."
      }
    ]
  };
}

function outlineModule(
  prefix: "SE" | "PM",
  sequence: number,
  title: string,
  summary: string,
  lessonTitles: readonly string[]
): SeedModuleDefinition {
  const previous = sequence === 4 ? `${prefix}-P03-S05` : `${prefix}-P${String(sequence - 1).padStart(2, "0")}-S05`;

  return module(
    sequence,
    title,
    summary,
    lessonTitles.map((lessonTitle, index) => {
      const id = `${prefix}-P${String(sequence).padStart(2, "0")}-S${String(index + 1).padStart(2, "0")}`;
      const prerequisites = index === 0 ? [previous] : [`${prefix}-P${String(sequence).padStart(2, "0")}-S${String(index).padStart(2, "0")}`];
      const baseTag = lessonTitle.toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "");

      return lesson(
        id,
        lessonTitle,
        prefix === "SE"
          ? `Apply ${lessonTitle.toLowerCase()} to a professional full-stack engineering scenario.`
          : `Apply ${lessonTitle.toLowerCase()} to a realistic project-management scenario.`,
        prerequisites,
        120,
        prefix === "SE"
          ? `${lessonTitle} implementation notes, tradeoff explanation, and capstone connection.`
          : `${lessonTitle} artifact, stakeholder-facing explanation, and capstone connection.`,
        [baseTag, prefix === "SE" ? "interview-prep" : "pm-interview-prep", "capstone-connection"]
      );
    })
  );
}

function module(
  sequence: number,
  title: string,
  summary: string,
  lessons: readonly SeedLessonDefinition[]
): SeedModuleDefinition {
  return {
    sequence,
    title,
    summary,
    lessons
  };
}

function lesson(
  identifier: string,
  title: string,
  objective: string,
  prerequisites: readonly string[],
  durationMinutes: number,
  evidence: string,
  tags: readonly string[]
): SeedLessonDefinition {
  return {
    identifier,
    title,
    objective,
    prerequisites,
    durationMinutes,
    required: true,
    evidence,
    tags: identifier.startsWith("PM-") && identifier.endsWith("S05")
      ? [...new Set([...tags, "weekly-assessment"])]
      : tags
  };
}

interface ProjectManagementModel {
  readonly mentalModel: string;
  readonly frameworkName: string;
  readonly framework: readonly string[];
  readonly teaching: string;
  readonly whenToUse: string;
  readonly whenNotToUse: string;
  readonly failureMode: string;
  readonly tradeoff: string;
  readonly scenario: string;
  readonly complication: string;
  readonly artifactFields: readonly string[];
  readonly communicationExample: string;
  readonly durableRules: readonly string[];
}

function projectManagementModel(lesson: SeedLessonDefinition): ProjectManagementModel {
  const phase = Number(lesson.identifier.slice(4, 6));
  const models: Record<number, ProjectManagementModel> = {
    4: pmModel("Capacity is a delivery constraint, not a percentage to maximize.", "RESOURCE PLAN", ["WORK", "SKILLS", "AVAILABILITY", "COST", "CONFLICT", "OPTION"], "Resource and cost planning connect approved scope to people, availability, rates, procurement, and financial tolerance. Variance is meaningful only against an agreed baseline and current forecast.", "Use it before committing dates, when staffing changes, and during every reforecast.", "Do not use utilization alone as proof that a plan is healthy; flow, bottlenecks, and specialist availability matter.", "Planning the same person at full capacity across several critical activities.", "More capacity can shorten work, but onboarding, coordination, and cost may erase the benefit.", "A six-week customer-portal launch needs design, two engineers, QA, legal review, and a vendor integration, but the backend specialist is available only two days per week.", "The vendor raises its price by 20% while the sponsor refuses to increase the budget.", ["work package", "required skill", "owner", "availability", "rate/cost", "constraint", "option"], "The current staffing plan misses the integration milestone by five days. We can reduce scope, move the date, or fund temporary specialist support. I recommend reducing the non-critical reporting scope; sponsor decision is needed by Thursday.", ["If nobody owns it, it probably will not happen.", "Do not hide uncertainty behind precise dates."]),
    5: pmModel("Risk is future uncertainty; an issue is a problem that already exists.", "RISK / ISSUE", ["IDENTIFY", "ASSESS", "PRIORITIZE", "RESPOND", "OWN", "MONITOR"], "Risk work converts uncertainty into an owned response. Issues require action and deadlines; assumptions require validation; dependencies require monitoring and escalation paths.", "Use it continuously from initiation through closure and whenever assumptions or dependencies change.", "Do not create a register merely to satisfy governance; low-value entries can obscure the threats needing decisions.", "Listing risks without triggers, owners, responses, or review dates.", "Mitigation consumes time or money now to reduce possible future loss; acceptance preserves capacity but retains exposure.", "A payment vendor has not completed security review, QA time is shrinking, and a key requirement still depends on legal interpretation.", "The vendor misses its milestone, converting the highest risk into an active launch-blocking issue.", ["description", "cause", "event", "impact", "probability", "owner", "response", "trigger", "review date"], "Security approval is now an issue and blocks release readiness. The owner is procurement; the recovery deadline is Wednesday. If evidence is not received, I recommend activating the backup vendor and moving the launch decision to the steering group.", ["Risks need owners.", "Issues need actions.", "Communicate bad news early."]),
    6: pmModel("Stakeholder management is deliberate expectation and influence management, not keeping everyone happy.", "STAKEHOLDER", ["IDENTIFY", "INTEREST", "INFLUENCE", "EXPECTATIONS", "ENGAGEMENT", "REVIEW"], "Stakeholders differ in authority, impact, information needs, and ability to help or block delivery. Engagement strategies must change as the project and relationships change.", "Use it at initiation and revisit it before decisions, changes, conflict, release, and closure.", "Do not reduce people to a power-interest box or share sensitive political judgments broadly.", "Sending equal detail and cadence to everyone while ignoring hidden influence or conflicting success criteria.", "High-touch engagement improves alignment but costs time and can slow teams when every stakeholder joins delivery decisions.", "Sales wants an early public launch, compliance requires evidence, engineering wants scope reduction, and the sponsor expects the original date.", "Sales announces the date to a customer before the steering group approves the launch plan.", ["stakeholder", "interest", "influence", "impact", "expectation", "strategy", "cadence", "owner"], "The announced date is not yet an approved commitment. Compliance evidence and QA remain open. I recommend a sponsor-led customer correction today and a go/no-go review Friday with explicit acceptance criteria.", ["A stakeholder needs the right detail, not every detail.", "Escalate decisions, not emotions."]),
    7: pmModel("Project communication should reduce uncertainty and make action or decisions easier.", "STATUS", ["WHAT CHANGED", "CURRENT STATE", "RISK", "DECISION NEEDED", "NEXT"], "Communication is designed for audience, purpose, timing, channel, and required response. Meetings need decisions or coordinated work; written records preserve ownership and rationale.", "Use it for status, decisions, escalation, meetings, handoffs, and any material change.", "Do not schedule a meeting when an asynchronous update can produce the same outcome without ambiguity.", "Reporting activity instead of outcome, impact, decisions, and next actions.", "Concise updates improve attention but can remove context; link detail while keeping the decision visible.", "An executive asks for an immediate update after QA reports a critical defect two days before launch.", "Engineering and product disagree whether the defect is release-blocking and neither owns the decision.", ["overall status", "outcomes", "milestones", "risks/issues", "decisions", "actions", "owners", "dates"], "Launch is red because the checkout defect can create duplicate charges. Engineering can patch by Thursday or we can disable the feature. I recommend disabling it for launch; product-owner approval is needed by 14:00.", ["Meetings need a purpose, owner, and outcome.", "A status report should make decisions easier."]),
    8: pmModel("Agile reduces the size of commitment before feedback; it does not remove planning or accountability.", "DELIVERY METHOD", ["UNCERTAINTY", "FEEDBACK", "BATCH SIZE", "FLOW", "GOVERNANCE", "ADAPT"], "Scrum provides accountabilities, events, artifacts, and commitments for iterative product work. Kanban manages flow with explicit policies and WIP limits. Hybrid delivery can combine governance milestones with iterative execution.", "Use iterative methods where feedback changes the solution; use flow methods where work arrives continuously.", "Do not force Scrum onto interrupt-driven support work or use Agile language to avoid scope, dates, quality, and ownership.", "Treating velocity as productivity or committing more work without respecting capacity and definition of done.", "Short iterations increase feedback and ceremony; predictive coordination can improve external commitments but reacts slowly to learning.", "A product team has planned feature work, urgent support requests, a fixed compliance milestone, and shared QA capacity.", "Halfway through the sprint, the sponsor demands an urgent feature while two committed items remain unfinished.", ["goal", "ordered work", "definition of done", "capacity", "WIP", "dependencies", "review measure"], "The request is valuable but displacing committed work has a cost. Product should choose which item moves out; compliance work remains fixed. I recommend an expedited Kanban lane only for production-critical requests.", ["Agile does not mean unplanned.", "Limit work in progress to finish more reliably."]),
    9: pmModel("Quality is fitness for agreed use; change control makes the cost of changed promises visible.", "CHANGE", ["REQUEST", "REASON", "IMPACT", "OPTIONS", "DECISION", "UPDATE", "COMMUNICATE"], "Quality criteria translate expectations into verifiable acceptance. Change control evaluates effects on scope, time, cost, quality, resources, and risk before an authorized decision.", "Use it when baselines, acceptance expectations, or controlled deliverables may change.", "Do not apply heavyweight approval to reversible low-risk team decisions already inside delegated authority.", "Accepting a 'small' change without analysis, updated acceptance criteria, ownership, or baseline changes.", "Control improves predictability and traceability but excessive gates slow learning and encourage workarounds.", "A customer requests three extra reports two weeks before release; engineering estimates five days and QA identifies regression risk.", "The sponsor insists the reports were always implied, but no approved requirement or acceptance criterion includes them.", ["request", "business reason", "scope impact", "schedule", "cost", "quality/risk", "options", "approver"], "The reports are outside the approved baseline. Options are reduced launch scope, a five-day delay, or post-launch delivery. I recommend post-launch delivery; sponsor approval and customer communication are needed today.", ["A change is not free.", "Scope changes require impact analysis."]),
    10: pmModel("Monitoring compares current evidence with the baseline and forecast so the team can adapt before failure.", "CONTROL LOOP", ["BASELINE", "ACTUAL", "VARIANCE", "FORECAST", "CAUSE", "ACTION", "REVIEW"], "Useful metrics connect delivery evidence to an outcome or decision. Forecasts should change when evidence changes; corrective actions need owners, dates, and an expected effect.", "Use it throughout execution and at a cadence appropriate to delivery risk.", "Do not collect vanity metrics or use a dashboard as a substitute for investigation and conversation.", "Reporting green because tasks are busy while milestones, quality, budget, or outcomes are deteriorating.", "Frequent monitoring improves reaction time but creates reporting cost and can encourage local optimization.", "The team reports 80% of tasks complete, but the integration milestone slipped, defect discovery is rising, and spend is ahead of plan.", "A steering meeting begins in two hours and the previous report still shows green status.", ["metric", "baseline", "actual", "variance", "forecast", "cause", "corrective action", "owner"], "Overall status is amber: task completion is high but integration drives the forecast two weeks late. I recommend reallocating QA and deferring low-value reporting work; decisions are needed at today's steering meeting.", ["Plans should change when reality changes.", "Status colors require evidence and thresholds."]),
    11: pmModel("A tool should support a delivery workflow; the tool is not the workflow.", "INFORMATION FLOW", ["DECISION", "SOURCE OF TRUTH", "OWNER", "UPDATE", "AUDIENCE", "ARCHIVE"], "Professional systems make current work, decisions, risks, ownership, and history discoverable. Jira, Confluence, spreadsheets, and dashboards each serve different information needs.", "Use tools where shared visibility, history, automation, or coordination outweigh maintenance cost.", "Do not introduce a platform for a small temporary need that a clear document or conversation handles better.", "Duplicating status across tools until nobody knows which record is authoritative.", "Structured tooling improves traceability and reporting but increases administration and can constrain useful conversation.", "The team tracks work in Jira, decisions in chat, risks in a private spreadsheet, and status in slides copied every Friday.", "A senior stakeholder challenges a decision, but the chat history has expired and the dashboard contradicts the spreadsheet.", ["information type", "system of record", "owner", "update trigger", "audience", "retention"], "The fragmented records are causing decision risk. I recommend Jira for delivery work, a linked decision/RAID register in Confluence, and a dashboard generated from those sources rather than manually copied status.", ["One fact should have one source of truth.", "Documentation should support decisions, not bureaucracy."]),
    12: pmModel("Career evidence is a specific decision and result demonstrated through artifacts, not a list of PM vocabulary.", "PROJECT STORY", ["CONTEXT", "CONSTRAINT", "OPTIONS", "DECISION", "ACTION", "RESULT", "LEARNING"], "Strong PM portfolios and interviews show scope, stakeholder complexity, judgment, communication, artifacts, and measurable outcomes while accurately describing personal responsibility.", "Use it for CV bullets, portfolio case studies, applications, interviews, and performance discussions.", "Do not disclose confidential material, inflate authority, or memorize answers that cannot survive follow-up questions.", "Claiming broad leadership without a concrete constraint, decision, action, artifact, or result.", "Concise stories are memorable but may hide complexity; prepare deeper evidence for follow-up questions.", "A candidate must explain how they recovered a delayed digital-project launch involving engineering, a vendor, and an unhappy sponsor.", "The interviewer challenges whether the candidate personally made the decision or merely attended meetings.", ["objective", "role", "stakeholders", "constraint", "options", "decision", "artifact", "result", "learning"], "My role was coordination and decision preparation, not technical implementation. I made the dependency and options visible, secured sponsor approval for reduced scope, and tracked the recovery plan to launch one week later without the critical defect.", ["Show evidence, not adjectives.", "State your role precisely."]),
    13: pmModel("A capstone proves integrated delivery judgment across the complete project lifecycle.", "PROJECT LIFECYCLE", ["INITIATE", "PLAN", "EXECUTE", "MONITOR", "ADAPT", "CLOSE"], "The capstone combines business context, charter, scope, WBS, schedule, resources, budget, RAID, stakeholders, communication, quality, change, release, recovery, and closure into one coherent case.", "Use it to integrate and demonstrate the program rather than introduce disconnected new theory.", "Do not polish isolated templates that contradict one another or hide unresolved project decisions.", "Producing attractive documents with inconsistent scope, dates, owners, risks, and acceptance criteria.", "Greater realism strengthens evidence but increases scope; prioritize a coherent decision trail over decorative volume.", "Lead delivery of a multilingual learning platform release involving engineering, design, QA, support, executives, customers, a payment vendor, and a fixed campaign date.", "The vendor slips, a key engineer becomes unavailable, and a stakeholder requests new analytics before launch.", ["business outcome", "scope/baseline", "schedule", "owners", "RAID", "stakeholders", "status", "change", "release", "closure"], "The forecast changed after vendor and staffing events. I recommend protecting the core learner journey, deferring analytics, activating the contingency integration, and holding a criteria-based go/no-go review.", ["Artifacts must tell one consistent project story.", "Closure includes learning, ownership, and transition."]),
    14: pmModel("Professional readiness means independently analyzing, deciding, communicating, and defending an integrated project response.", "READINESS REVIEW", ["RETRIEVE", "APPLY", "CHALLENGE", "DEFEND", "FEEDBACK", "REVISE"], "Final review should expose weak judgment and artifact gaps across initiation, scope, planning, stakeholders, risk, delivery methods, monitoring, change, recovery, and closure.", "Use it before interviews and periodically after the program to direct revision.", "Do not reread everything equally; use evidence from scenarios and assessments to target weak capabilities.", "Mistaking recognition of terminology for the ability to handle an ambiguous project situation.", "Broad review finds integration gaps but gives less depth; follow it with targeted deliberate practice.", "A mock panel asks the learner to diagnose a failing launch, present options, write an executive update, and defend the capstone decision trail.", "The panel changes the budget, deadline, and stakeholder constraints after the first recommendation.", ["skill", "evidence", "confidence", "observed gap", "feedback", "revision task", "deadline"], "My first recommendation underweighted customer communication. I revised the plan to add an owner, message, and timing before the operational change, then updated the RAID and decision logs.", ["Revise from evidence, not confidence alone.", "Defend decisions while remaining open to new facts."])
  };

  const selected = models[phase] ?? models[14];

  if (selected === undefined) {
    throw new Error("Project Management content model is missing.");
  }

  return selected;
}

function pmModel(
  mentalModel: string,
  frameworkName: string,
  framework: readonly string[],
  teaching: string,
  whenToUse: string,
  whenNotToUse: string,
  failureMode: string,
  tradeoff: string,
  scenario: string,
  complication: string,
  artifactFields: readonly string[],
  communicationExample: string,
  durableRules: readonly string[]
): ProjectManagementModel {
  return { mentalModel, frameworkName, framework, teaching, whenToUse, whenNotToUse, failureMode, tradeoff, scenario, complication, artifactFields, communicationExample, durableRules };
}

function detailed(
  id: string,
  title: string,
  objective: string,
  evidence: string,
  tags: readonly string[],
  review: string,
  concepts: readonly string[],
  walkthrough: string,
  guidedPrompt: string,
  guidedHint: string,
  independentPrompt: string,
  interviewQuestions: readonly string[],
  projectConnection: string,
  resources: readonly ResourceSeed[]
): DetailedSession {
  return {
    id,
    title,
    objective,
    evidence,
    tags,
    review,
    concepts,
    walkthrough,
    guidedPrompt,
    guidedHint,
    independentPrompt,
    interviewQuestions,
    projectConnection,
    resources
  };
}

function softwareResourceBundle(tags: readonly string[]): readonly ResourceSeed[] {
  const base = [
    resource("TypeScript Handbook", "TypeScript", "https://www.typescriptlang.org/docs/handbook/intro.html", "OFFICIAL_DOCS", "Foundational", 25, "Official TypeScript reference for language concepts.", true),
    resource("MDN Web Docs", "MDN", "https://developer.mozilla.org/en-US/docs/Web", "REFERENCE", "Foundational", 20, "Browser and web-platform reference for professional frontend work.", false)
  ];

  if (tags.includes("react") || tags.includes("react-hook-form")) {
    return [
      resource("React Learn", "React", "https://react.dev/learn", "OFFICIAL_DOCS", "Intermediate", 30, "Official React learning material for component and state architecture.", true),
      resource("React Hook Form Get Started", "React Hook Form", "https://react-hook-form.com/get-started", "OFFICIAL_DOCS", "Intermediate", 20, "Official form-state documentation for React forms.", tags.includes("react-hook-form")),
      ...base
    ];
  }

  if (tags.includes("zod")) {
    return [
      resource("Zod Documentation", "Zod", "https://zod.dev/", "OFFICIAL_DOCS", "Intermediate", 25, "Official validation documentation for runtime schemas.", true),
      ...base
    ];
  }

  if (tags.includes("apollo") || tags.includes("graphql")) {
    return [
      resource("GraphQL Learn", "GraphQL Foundation", "https://graphql.org/learn/", "OFFICIAL_DOCS", "Intermediate", 30, "Official GraphQL learning guide.", true),
      resource("Apollo Client Caching", "Apollo GraphQL", "https://www.apollographql.com/docs/react/caching/overview", "OFFICIAL_DOCS", "Advanced", 30, "Apollo Client cache behavior and normalization reference.", true),
      ...base
    ];
  }

  return base;
}

function projectManagementResourceBundle(tags: readonly string[]): readonly ResourceSeed[] {
  const base = [
    resource("What is Project Management?", "Project Management Institute", "https://www.pmi.org/about/learn-about-pmi/what-is-project-management", "OFFICIAL_DOCS", "Foundational", 20, "PMI overview of project-management responsibilities and value.", true),
    resource("Project Management Resources", "Atlassian", "https://www.atlassian.com/project-management", "ARTICLE", "Foundational", 20, "Tool-neutral project-management guidance and examples.", false)
  ];

  if (tags.includes("scrum") || tags.includes("atlassian-agile")) {
    return [
      resource("The Scrum Guide", "Scrum.org", "https://scrumguides.org/scrum-guide.html", "OFFICIAL_DOCS", "Intermediate", 30, "Official Scrum Guide for roles, events, artifacts, and commitments.", true),
      resource("Agile Project Management", "Atlassian", "https://www.atlassian.com/agile", "ARTICLE", "Foundational", 20, "Practical Agile concepts and workflow explanations.", false),
      ...base
    ];
  }

  return base;
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
