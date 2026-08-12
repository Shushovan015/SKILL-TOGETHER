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
      "Suggested 120-minute session composition: 10 minutes review, 25 minutes concept learning, 20 minutes walkthrough, 30 minutes guided practical work, 25 minutes independent work, and 10 minutes interview questions.",
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
        solutionNotesMarkdown: null
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
  return {
    outcomes: [
      lessonDefinition.objective,
      "Identify the professional artifact or decision this session should produce.",
      "Explain how this topic connects to interviews and the capstone.",
      "Record open questions for future detailed authoring."
    ],
    explanationMarkdown: [
      `${lessonDefinition.title} is currently seeded as a professional roadmap session outline for ${trackTitle}.`,
      `Learning objective: ${lessonDefinition.objective}`,
      `Practical task: ${lessonDefinition.evidence}`,
      `Assessment tags: ${lessonDefinition.tags.join(", ")}`,
      "Interview relevance: prepare to explain the concept, apply it to a scenario, compare tradeoffs, and describe evidence you would create.",
      "Capstone connection: this session should either strengthen the final project, produce a portfolio artifact, or prepare a realistic interview explanation.",
      "Detailed lesson authoring should add full walkthroughs, examples, exercises, resource notes, and scoring rubrics before this roadmap outline is treated as final course content."
    ].join("\n\n"),
    relevanceMarkdown:
      "This outline keeps the long-term professional progression visible while detailed content is authored in verified batches.",
    examples: [
      `Professional scenario: apply ${lessonDefinition.title.toLowerCase()} to a real product or project constraint.`,
      `Portfolio artifact: ${lessonDefinition.evidence}`,
      "Interview prompt: explain the decision, the tradeoff, and how you would verify the result."
    ],
    commonMistakes: [
      "Skipping the practical artifact.",
      "Answering with terminology only.",
      "Ignoring tradeoffs, risks, or stakeholder context."
    ],
    resources: resources.slice(0, 3).map(verifiedResource),
    exercises: [
      {
        kind: "guided",
        promptMarkdown: `Draft a session outline for ${lessonDefinition.title}: concept notes, example, practical task, expected evidence, and interview question.`,
        expectedEvidence: "Session outline notes and one example.",
        solutionNotesMarkdown: "Use the objective and tags as constraints; do not add unrelated topics."
      },
      {
        kind: "independent",
        promptMarkdown: `Create the practical artifact for ${lessonDefinition.title.toLowerCase()} at outline fidelity. Include assumptions and open questions.`,
        expectedEvidence: lessonDefinition.evidence,
        solutionNotesMarkdown: null
      }
    ],
    knowledgeChecks: [
      {
        question: `What professional decision does ${lessonDefinition.title} support?`,
        answerKey: [lessonDefinition.objective],
        explanation: "A useful answer connects the lesson to a work decision or artifact."
      },
      {
        question: "What evidence should the learner produce?",
        answerKey: [lessonDefinition.evidence],
        explanation: "Professional completion requires evidence, not passive reading."
      },
      {
        question: "How does this topic connect to interviews?",
        answerKey: ["Explain tradeoffs, scenario decisions, and verification evidence."],
        explanation: "Interview readiness is built through repeated explanation practice."
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
    tags
  };
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
