import type { TrackType } from "../domain/content.types.js";
import type { LessonVersionEditorInput } from "../domain/content.types.js";

export interface SeedLessonDefinition {
  readonly identifier: string;
  readonly title: string;
  readonly objective: string;
  readonly prerequisites: readonly string[];
  readonly durationMinutes: number;
  readonly required: boolean;
  readonly evidence: string;
  readonly tags: readonly string[];
}

export interface SeedModuleDefinition {
  readonly sequence: number;
  readonly title: string;
  readonly summary: string;
  readonly lessons: readonly SeedLessonDefinition[];
}

export interface SeedTrackDefinition {
  readonly slug: string;
  readonly type: TrackType;
  readonly title: string;
  readonly description: string;
  readonly active: boolean;
  readonly modules: readonly SeedModuleDefinition[];
}

export const phase3SeedUsers = {
  contentAdmin: {
    id: "00000000-0000-4000-8000-000000000001",
    email: "content.admin@example.test",
    displayName: "Content Admin",
    timeZone: "Europe/Berlin"
  }
} as const;

export const phase3SeedTracks: readonly SeedTrackDefinition[] = [
  {
    slug: "software-engineering",
    type: "SOFTWARE_ENGINEERING",
    title: "Software Engineering",
    description:
      "A practical software-engineering track covering TypeScript, React, GraphQL, backend architecture, databases, auth, quality, and portfolio readiness.",
    active: true,
    modules: [
      module(1, "Advanced TypeScript Foundations", "Strict typing, state modeling, generics, and runtime validation.", [
        lesson("SE-W01-D01", "TypeScript Strict Mode and Mental Model", "Explain how TypeScript catches errors before runtime and configure strictness.", [], 120, "Type-safe snippet and written explanation.", ["ts-strict", "type-safety"]),
        lesson("SE-W01-D02", "Primitive, Object, Union, and Narrowing Patterns", "Use unions and narrowing to model real UI and API states.", ["SE-W01-D01"], 120, "Discriminated union and state handling notes.", ["ts-unions", "narrowing"]),
        lesson("SE-W01-D03", "Generics for Reusable Functions and Components", "Build safe reusable helpers with generics.", ["SE-W01-D02"], 120, "Generic helper code and examples.", ["ts-generics"]),
        lesson("SE-W01-D04", "Runtime Validation with Zod", "Validate unknown external input before trusting it.", ["SE-W01-D02"], 120, "Zod schema and invalid-case notes.", ["validation", "zod"]),
        lesson("SE-W01-D05", "Weekly Assessment and Reflection", "Demonstrate TypeScript modeling and validation understanding.", ["SE-W01-D01", "SE-W01-D02", "SE-W01-D03", "SE-W01-D04"], 90, "Assessment answers and reflection.", ["weekly-assessment", "ts-review"])
      ]),
      module(2, "React Architecture", "Component boundaries, composition, forms, server state, and testing.", [
        lesson("SE-W02-D01", "React Component Boundaries", "Split UI into focused, testable components.", ["SE-W01-D05"], 120, "Component tree diagram and code.", ["react-components"]),
        lesson("SE-W02-D02", "Props, Composition, and Controlled State", "Use composition instead of prop-heavy components.", ["SE-W02-D01"], 120, "Component code and prop rationale.", ["react-composition"]),
        lesson("SE-W02-D03", "Forms with React Hook Form and Zod", "Build accessible validated forms.", ["SE-W01-D04"], 120, "Form schema, validation cases, UI notes.", ["forms", "zod", "a11y"]),
        lesson("SE-W02-D04", "Server State with Apollo Client", "Separate server state from local UI state.", ["SE-W02-D01"], 120, "Query plan and cache update notes.", ["apollo", "server-state"]),
        lesson("SE-W02-D05", "React Testing Basics", "Test user-visible behavior and states.", ["SE-W02-D01", "SE-W02-D02", "SE-W02-D03", "SE-W02-D04"], 120, "Test cases and coverage notes.", ["rtl", "testing"])
      ]),
      module(3, "GraphQL and Backend Foundations", "GraphQL schema design, NestJS modules, services, repositories, and backend testing.", [
        lesson("SE-W03-D01", "GraphQL Schema Design", "Design clear object, input, query, and mutation types.", ["SE-W02-D04"], 120, "Schema excerpt and validation notes.", ["graphql-schema"]),
        lesson("SE-W03-D02", "NestJS Module Architecture", "Explain NestJS modules, providers, resolvers, and services.", ["SE-W03-D01"], 120, "Module diagram and responsibility table.", ["nestjs", "backend-architecture"]),
        lesson("SE-W03-D03", "Thin Resolvers and Application Services", "Keep business logic out of resolvers.", ["SE-W03-D02"], 120, "Before and after pseudocode.", ["resolvers", "services"]),
        lesson("SE-W03-D04", "Prisma and Repository Boundaries", "Model persistence without leaking database access everywhere.", ["SE-W03-D02"], 120, "Repository interface and transaction notes.", ["prisma", "repositories"]),
        lesson("SE-W03-D05", "Backend Testing", "Test services, GraphQL operations, and database integration.", ["SE-W03-D01", "SE-W03-D02", "SE-W03-D03", "SE-W03-D04"], 120, "Test plan and sample assertions.", ["backend-testing", "authorization"])
      ]),
      module(4, "Database, Auth, and Security Basics", "Relational modeling, transactions, snapshots, authorization, and accessibility.", [
        lesson("SE-W04-D01", "Relational Modeling for Learning Data", "Design normalized tables and relationships.", ["SE-W03-D04"], 120, "ER sketch and constraint list.", ["postgresql", "data-modeling"]),
        lesson("SE-W04-D02", "Transactions and Historical Snapshots", "Preserve completed work through transactional writes.", ["SE-W04-D01"], 120, "Pseudocode and snapshot field list.", ["transactions", "snapshots"]),
        lesson("SE-W04-D03", "Cookie Sessions and Authorization", "Explain secure sessions and object-level authorization.", ["SE-W03-D05"], 120, "Threat cases and test cases.", ["auth", "authorization", "cookies"]),
        lesson("SE-W04-D04", "Accessibility and Frontend Quality", "Apply semantic HTML, focus, and state design.", ["SE-W02-D05"], 120, "Accessibility checklist and fixes.", ["accessibility", "quality"]),
        lesson("SE-W04-D05", "Weekly Assessment and Portfolio Checkpoint", "Demonstrate full-stack design and security reasoning.", ["SE-W04-D01", "SE-W04-D02", "SE-W04-D03", "SE-W04-D04"], 120, "Assessment result and portfolio evidence.", ["weekly-assessment", "portfolio"])
      ])
    ]
  },
  {
    slug: "project-management",
    type: "PROJECT_MANAGEMENT",
    title: "Project Management",
    description:
      "A practical project-management track covering project foundations, scope, planning, scheduling, resources, risks, issues, stakeholders, and communication.",
    active: true,
    modules: [
      module(1, "Project Foundations", "Project ownership, lifecycle, charters, objectives, and constraints.", [
        lesson("PM-W01-D01", "What a Project Manager Owns", "Explain PM responsibilities across outcomes, constraints, and stakeholders.", [], 120, "Responsibility map.", ["pm-foundations", "roles"]),
        lesson("PM-W01-D02", "Project Lifecycle and Delivery Context", "Compare predictive, iterative, and hybrid delivery.", ["PM-W01-D01"], 120, "Scenario decisions with rationale.", ["lifecycle", "delivery-methods"]),
        lesson("PM-W01-D03", "Project Charter Basics", "Create a concise charter.", ["PM-W01-D02"], 120, "Charter document.", ["charter", "objectives"]),
        lesson("PM-W01-D04", "Objectives, Success Criteria, and Constraints", "Write measurable objectives and identify constraints.", ["PM-W01-D03"], 120, "Updated charter section.", ["success-criteria", "constraints"]),
        lesson("PM-W01-D05", "Weekly Assessment and Reflection", "Demonstrate foundation and charter understanding.", ["PM-W01-D01", "PM-W01-D02", "PM-W01-D03", "PM-W01-D04"], 90, "Assessment answers and reflection.", ["weekly-assessment", "charter"])
      ]),
      module(2, "Scope and Work Breakdown", "Requirements, scope boundaries, WBS, milestones, dependencies, and estimation.", [
        lesson("PM-W02-D01", "Requirements and Scope Boundaries", "Distinguish goals, requirements, scope, and exclusions.", ["PM-W01-D05"], 120, "Scope statement.", ["requirements", "scope"]),
        lesson("PM-W02-D02", "Work Breakdown Structure", "Decompose deliverables into manageable work packages.", ["PM-W02-D01"], 120, "WBS artifact.", ["wbs", "planning"]),
        lesson("PM-W02-D03", "Milestones and Dependencies", "Identify milestones and logical dependencies.", ["PM-W02-D02"], 120, "Dependency diagram.", ["milestones", "dependencies"]),
        lesson("PM-W02-D04", "Estimation and Schedule Assumptions", "Estimate effort with explicit assumptions.", ["PM-W02-D03"], 120, "Estimate table.", ["estimation", "schedule"]),
        lesson("PM-W02-D05", "Weekly Scope Assessment", "Apply scope and WBS concepts to a case.", ["PM-W02-D01", "PM-W02-D02", "PM-W02-D03", "PM-W02-D04"], 120, "Assessment answers and revised WBS.", ["weekly-assessment", "wbs"])
      ]),
      module(3, "Scheduling and Resources", "Timeline planning, critical path, resource planning, budgeting, and schedule risk.", [
        lesson("PM-W03-D01", "Gantt Charts and Timeline Planning", "Build a readable timeline.", ["PM-W02-D05"], 120, "Schedule artifact.", ["gantt", "timeline"]),
        lesson("PM-W03-D02", "Critical Path Basics", "Identify tasks that drive project duration.", ["PM-W03-D01"], 120, "Critical path explanation.", ["critical-path"]),
        lesson("PM-W03-D03", "Resource Planning", "Match work to people, availability, and constraints.", ["PM-W03-D01"], 120, "Resource allocation table.", ["resources", "capacity"]),
        lesson("PM-W03-D04", "Budgeting Fundamentals", "Estimate simple project budget and track assumptions.", ["PM-W03-D03"], 120, "Budget table and assumptions.", ["budgeting"]),
        lesson("PM-W03-D05", "Weekly Schedule Assessment", "Analyze schedule risks and resource conflicts.", ["PM-W03-D01", "PM-W03-D02", "PM-W03-D03", "PM-W03-D04"], 120, "Assessment response.", ["weekly-assessment", "schedule"])
      ]),
      module(4, "Risk, Issues, and Stakeholders", "Risk management, RAID, stakeholder mapping, and communication planning.", [
        lesson("PM-W04-D01", "Risk Management", "Identify, assess, and respond to project risks.", ["PM-W03-D05"], 120, "Risk register.", ["risk-register", "risk-management"]),
        lesson("PM-W04-D02", "Issue and RAID Management", "Distinguish risks, assumptions, issues, and dependencies.", ["PM-W04-D01"], 120, "RAID log.", ["raid", "issue-management"]),
        lesson("PM-W04-D03", "Stakeholder Mapping", "Identify influence, interest, and engagement strategy.", ["PM-W04-D02"], 120, "Stakeholder matrix.", ["stakeholders"]),
        lesson("PM-W04-D04", "Communication Plan and Status Reporting", "Plan communication cadence and create status report.", ["PM-W04-D03"], 120, "Communication plan and report.", ["communication", "status-reporting"]),
        lesson("PM-W04-D05", "Weekly Risk and Stakeholder Assessment", "Respond to delivery scenario.", ["PM-W04-D01", "PM-W04-D02", "PM-W04-D03", "PM-W04-D04"], 120, "Assessment response and reflection.", ["weekly-assessment", "stakeholders"])
      ])
    ]
  },
  {
    slug: "german",
    type: "GERMAN",
    title: "German",
    description:
      "A beginner German track for consistent vocabulary, grammar, pronunciation, reading, listening, writing, and weekly review.",
    active: true,
    modules: [
      module(1, "Greetings, Introductions, and Pronunciation", "Greetings, alphabet sounds, introductions, numbers, spelling, and address forms.", [
        lesson("DE-W01-D01", "Greetings and Alphabet Sounds", "Use common greetings and recognize German alphabet sounds.", [], 45, "Short written dialogue and pronunciation self-check.", ["greetings", "pronunciation"]),
        lesson("DE-W01-D02", "Introducing Yourself", "Say name, origin, and basic personal details.", [], 45, "Sentences and speaking checklist.", ["introductions", "sentence-patterns"]),
        lesson("DE-W01-D03", "Numbers 0 to 100 and Spelling", "Use numbers and spell names aloud.", [], 45, "Answer sheet.", ["numbers", "listening"]),
        lesson("DE-W01-D04", "Formal and Informal Address", "Choose du or Sie in basic situations.", [], 45, "Scenario answers.", ["du-sie", "culture"]),
        lesson("DE-W01-D05", "Week 1 Review and Assessment", "Review greetings, introductions, numbers, and address.", [], 45, "Assessment answers and reflection.", ["weekly-assessment", "review"])
      ]),
      module(2, "Basic Grammar and Daily Routine", "Common verbs, word order, days, time, study schedule, and routine listening.", [
        lesson("DE-W02-D01", "Present Tense of Common Verbs", "Conjugate common regular verbs in simple sentences.", [], 45, "Conjugation table and sentences.", ["present-tense", "verbs"]),
        lesson("DE-W02-D02", "Word Order in Main Clauses", "Place the finite verb in second position.", [], 45, "Corrected sentence list.", ["word-order"]),
        lesson("DE-W02-D03", "Days, Time, and Study Schedule", "Talk about study days and times.", [], 45, "Schedule sentences.", ["time", "days"]),
        lesson("DE-W02-D04", "Listening: Daily Routine", "Extract key details from short routine audio.", [], 45, "Listening answers.", ["listening", "routine"]),
        lesson("DE-W02-D05", "Week 2 Review and Assessment", "Review verbs, word order, and routine vocabulary.", [], 45, "Assessment answers.", ["weekly-assessment", "grammar"])
      ]),
      module(3, "Nouns, Articles, and Objects", "Noun gender, articles, negation, accusative, and simple reading.", [
        lesson("DE-W03-D01", "Noun Gender and Definite Articles", "Recognize der, die, and das with common nouns.", [], 45, "Vocabulary table.", ["articles", "nouns"]),
        lesson("DE-W03-D02", "Indefinite Articles and Negation", "Use ein, eine, and kein in simple sentences.", [], 45, "Sentence transformations.", ["negation", "articles"]),
        lesson("DE-W03-D03", "Accusative Case Basics", "Use direct objects with common verbs.", [], 45, "Annotated sentences.", ["accusative"]),
        lesson("DE-W03-D04", "Reading: Simple Profiles", "Read short profiles and answer factual questions.", [], 45, "Reading answers.", ["reading", "profiles"]),
        lesson("DE-W03-D05", "Week 3 Review and Assessment", "Review articles, negation, accusative, and reading.", [], 45, "Assessment answers.", ["weekly-assessment", "articles"])
      ]),
      module(4, "Practical Conversation and Review", "Food ordering, directions, modal verbs, pronunciation review, and conversation assessment.", [
        lesson("DE-W04-D01", "Ordering Food and Drinks", "Use polite phrases for ordering.", [], 45, "Dialogue script.", ["food", "speaking"]),
        lesson("DE-W04-D02", "Directions and Places", "Ask for and understand simple directions.", [], 45, "Direction answers.", ["directions", "places"]),
        lesson("DE-W04-D03", "Modal Verbs: Can and Want", "Use koennen and wollen in simple requests.", [], 45, "Sentence list.", ["modal-verbs"]),
        lesson("DE-W04-D04", "Pronunciation Review", "Practice difficult sounds and sentence rhythm.", [], 45, "Self-assessment checklist.", ["pronunciation", "review"]),
        lesson("DE-W04-D05", "Week 4 Review and Assessment", "Demonstrate practical beginner conversation.", [], 45, "Assessment answers and reflection.", ["weekly-assessment", "conversation"])
      ])
    ]
  }
];

export function lessonSlug(identifier: string): string {
  return identifier.toLowerCase();
}

export function buildApprovedSeedVersionInput(
  lessonDefinition: SeedLessonDefinition
): LessonVersionEditorInput {
  const referencePath = lessonSlug(lessonDefinition.identifier);

  return {
    title: lessonDefinition.title,
    learningObjective: lessonDefinition.objective,
    outcomes: [`Learner can ${lessonDefinition.objective.charAt(0).toLowerCase()}${lessonDefinition.objective.slice(1)}`],
    explanationMarkdown: `${lessonDefinition.title} introduces the core concepts needed to complete the documented practice for ${lessonDefinition.identifier}.`,
    relevanceMarkdown: "This topic supports the track roadmap and prepares the learner for later scheduled practice.",
    examples: [`Example prompt: apply ${lessonDefinition.title} to the track scenario and explain the result.`],
    commonMistakes: ["Skipping the evidence artifact.", "Moving ahead without checking prerequisites."],
    assessmentTags: lessonDefinition.tags,
    resources: [
      {
        title: `${lessonDefinition.identifier} curriculum reference`,
        url: `https://example.test/skilltogether/curriculum/${referencePath}`,
        resourceType: "curriculum-reference",
        required: false,
        approved: true,
        citation: "SkillTogether MVP curriculum seed reference."
      }
    ],
    exercises: [
      {
        kind: "independent",
        promptMarkdown: `Complete the Phase 3 metadata exercise for ${lessonDefinition.title}.`,
        expectedEvidence: lessonDefinition.evidence,
        solutionNotesMarkdown: null
      }
    ],
    knowledgeChecks: [
      {
        question: `What evidence should be produced for ${lessonDefinition.identifier}?`,
        answerKey: [lessonDefinition.evidence],
        explanation: "The evidence requirement comes from the approved curriculum seed metadata."
      }
    ]
  };
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
