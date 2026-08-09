import type { TrackType } from "../domain/content.types.js";
import type { LessonVersionEditorInput } from "../domain/content.types.js";
import {
  professionalContentForLesson,
  projectManagementProfessionalModules,
  softwareEngineeringProfessionalModules
} from "./professional-program-seed.js";

export interface SeedLessonDefinition {
  readonly identifier: string;
  readonly title: string;
  readonly objective: string;
  readonly prerequisites: readonly string[];
  readonly durationMinutes: number;
  readonly level?: string;
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
    modules: softwareEngineeringProfessionalModules
  },
  {
    slug: "project-management",
    type: "PROJECT_MANAGEMENT",
    title: "Project Management",
    description:
      "A practical project-management track covering project foundations, scope, planning, scheduling, resources, risks, issues, stakeholders, and communication.",
    active: true,
    modules: projectManagementProfessionalModules
  },
  {
    slug: "german",
    type: "GERMAN",
    title: "German",
    description:
      "A beginner German track for consistent vocabulary, grammar, pronunciation, reading, listening, writing, and weekly review.",
    active: true,
    modules: [
      module(1, "A1.1 - First Conversations", "Complete beginner sessions covering introductions, spelling, numbers, countries, pronouns, sein, heissen, formal address, and early review.", [
        lesson("DE-A11-S01", "A1.1 Session 1: Introducing Yourself", "Introduce yourself with greetings, ich/du/Sie, sein, and heissen.", [], 60, "A spoken self-introduction checklist and a 5-6 sentence written introduction.", ["A1.1", "introductions", "pronunciation"], "A1.1"),
        lesson("DE-A11-S02", "A1.1 Session 2: Alphabet, Spelling, and Names", "Spell names, recognize German letters, and ask someone to repeat or spell.", ["DE-A11-S01"], 60, "Spelling answers, pronunciation notes, and a short name dialogue.", ["A1.1", "alphabet", "spelling"], "A1.1"),
        lesson("DE-A11-S03", "A1.1 Session 3: Numbers, Countries, and Languages", "Use numbers, countries, languages, and simple origin sentences.", ["DE-A11-S02"], 60, "Number practice, country-language sentences, and a short profile.", ["A1.1", "numbers", "countries"], "A1.1"),
        lesson("DE-A11-S04", "A1.1 Session 4: Personal Information and W-Questions", "Ask and answer basic W-questions about name, origin, language, and age.", ["DE-A11-S03"], 60, "Question-answer table and a short interview dialogue.", ["A1.1", "w-questions", "personal-information"], "A1.1"),
        lesson("DE-A11-S05", "A1.1 Session 5: Formal and Informal Introductions", "Choose du or Sie and hold a polite first-meeting conversation.", ["DE-A11-S04"], 60, "Formal/informal scenario answers and a first-meeting dialogue.", ["A1.1", "du-sie", "review"], "A1.1")
      ]),
      module(2, "A1.1 - Everyday Foundations", "Structured outline: haben, regular present-tense verbs, sentence structure, yes/no questions, articles der/die/das, ein/eine, plural introduction, family, professions, hobbies, days, dates, time, daily routine, food, ordering, shopping, prices, accusative, modal verbs, separable verbs, negation, prepositions, practical dialogues, revision, and A1.1 assessment.", []),
      module(3, "A1.2 - Expanding Daily Communication", "Objectives: describe routines, needs, plans, places, simple past experiences, and everyday problems. Grammar: separable verbs, modal verbs, accusative and dative basics, possessives, more prepositions. Skills: short emails, simple announcements, everyday listening, guided conversations. Prerequisite: A1.1. Completion: A1.2 practical assessment.", germanLevelLessons("A1.2", "DE-A12", "DE-A11-S05", [
        ["Daily Routines and Frequency", "Describe regular daily routines using time expressions and frequency words.", "A daily routine paragraph with five time expressions.", ["routines", "frequency"]],
        ["Places, Directions, and Appointments", "Ask where places are and arrange a simple appointment.", "A short appointment dialogue and direction notes.", ["places", "appointments"]],
        ["Modal Verbs for Needs and Plans", "Use modal verbs to express what you can, must, want, and would like to do.", "Eight modal-verb sentences about study, work, and errands.", ["modal-verbs", "plans"]],
        ["Separable Verbs and Everyday Tasks", "Use common separable verbs in main clauses and simple questions.", "A task list rewritten with separable verbs in sentences.", ["separable-verbs", "word-order"]],
        ["A1.2 Integrated Review and Practical Email", "Write a short practical message using A1.2 routine, place, and plan language.", "A short email plus a self-correction checklist.", ["review", "email"]]
      ])),
      module(4, "A2.1 - Everyday Independence", "Objectives: manage travel, appointments, health, housing, work, and services. Grammar: perfect tense, dative verbs, two-way prepositions, comparatives, subordinate clauses with weil. Skills: longer dialogues, forms, short messages, practical phone calls. Prerequisite: A1.2. Completion: A2.1 scenario assessment.", germanLevelLessons("A2.1", "DE-A21", "DE-A12-S05", [
        ["Travel Planning and Tickets", "Plan a short trip and ask for ticket, platform, and departure information.", "A travel dialogue and itinerary summary.", ["travel", "tickets"]],
        ["Appointments, Health, and Services", "Explain a simple problem and book or change an appointment.", "A service-call script and symptom notes.", ["health", "services"]],
        ["Perfect Tense for Recent Experiences", "Use the perfect tense to describe recent everyday events.", "Ten perfect-tense sentences about yesterday or last week.", ["perfect-tense", "experiences"]],
        ["Dative Verbs and Two-Way Prepositions", "Use high-frequency dative patterns and place/location phrases.", "A room or city description using dative phrases.", ["dative", "prepositions"]],
        ["A2.1 Scenario Review", "Handle a practical travel, service, or appointment scenario from start to finish.", "A complete scenario response with vocabulary checklist.", ["review", "scenario"]]
      ])),
      module(5, "A2.2 - Connected Everyday Speech", "Objectives: explain preferences, tell simple stories, handle common problems, and understand slower authentic material. Grammar: past tense review, adjective endings introduction, wenn clauses, indirect questions. Skills: connected writing, short presentations, everyday listening. Prerequisite: A2.1. Completion: A2.2 communication assessment.", germanLevelLessons("A2.2", "DE-A22", "DE-A21-S05", [
        ["Telling Short Stories in Sequence", "Tell a simple past event with connectors and clear sequence.", "A 10-sentence story using sequence markers.", ["storytelling", "connectors"]],
        ["Preferences, Comparisons, and Reasons", "Compare options and explain preferences with simple reasons.", "A comparison paragraph about two choices.", ["comparisons", "reasons"]],
        ["Adjective Endings for Everyday Descriptions", "Use basic adjective endings in common noun phrases.", "A description table and five corrected sentences.", ["adjective-endings", "descriptions"]],
        ["Indirect Questions and Problem Solving", "Ask polite indirect questions while solving an everyday problem.", "A customer-service dialogue with indirect questions.", ["indirect-questions", "problem-solving"]],
        ["A2.2 Communication Review", "Combine narration, preference, description, and problem-solving language.", "A short presentation script with review notes.", ["review", "presentation"]]
      ])),
      module(6, "B1.1 - Independent Foundations", "Objectives: discuss experiences, plans, opinions, work, study, and social topics. Grammar: subordinate clauses, relative clauses introduction, passive introduction, connectors. Skills: structured reading, everyday media listening, opinion speaking, personal letters. Prerequisite: A2.2. Completion: B1.1 integrated assessment.", germanLevelLessons("B1.1", "DE-B11", "DE-A22-S05", [
        ["Work, Study, and Experience Narratives", "Describe work, study, and learning experiences with useful detail.", "A structured experience narrative with corrections.", ["work", "study", "experiences"]],
        ["Opinions with Reasons and Connectors", "Give opinions and support them with connected reasons.", "An opinion paragraph using at least five connectors.", ["opinions", "connectors"]],
        ["Subordinate Clauses with weil, dass, and wenn", "Use common subordinate clauses to explain causes, facts, and conditions.", "Sentence transformations with subordinate clauses.", ["subordinate-clauses", "grammar"]],
        ["Relative Clauses Introduction", "Add short relative clauses to identify people, places, and things.", "Eight relative-clause sentences from prompts.", ["relative-clauses", "descriptions"]],
        ["B1.1 Integrated Review", "Combine narrative, opinion, and clause control in an integrated response.", "A B1.1 integrated writing and speaking checklist.", ["review", "integrated-skills"]]
      ])),
      module(7, "B1.2 - Independent Communication", "Objectives: sustain conversations, explain reasons, summarize information, and write coherent texts. Grammar: Konjunktiv II for polite requests, passive, relative clauses, nominalization basics. Skills: argumentation, short reports, authentic listening. Prerequisite: B1.1. Completion: B1.2 readiness assessment.", germanLevelLessons("B1.2", "DE-B12", "DE-B11-S05", [
        ["Sustaining Conversations and Follow-up Questions", "Keep a conversation moving with follow-up questions and reactions.", "A conversation script with follow-up moves marked.", ["conversation", "follow-up"]],
        ["Summarizing Short Texts and Audio", "Summarize main points from a short text or listening source.", "A five-sentence summary with key vocabulary.", ["summary", "listening"]],
        ["Polite Requests with Konjunktiv II", "Make polite requests, suggestions, and wishes with Konjunktiv II.", "Ten polite request sentences and a short dialogue.", ["konjunktiv-ii", "politeness"]],
        ["Passive Voice and Process Descriptions", "Describe processes using passive structures where useful.", "A short process description using active and passive forms.", ["passive", "processes"]],
        ["B1.2 Readiness Review", "Produce a coherent B1-level response across conversation, summary, and process tasks.", "A readiness checklist plus one integrated written response.", ["review", "readiness"]]
      ])),
      module(8, "B2.1 - Upper-Intermediate Control", "Objectives: understand complex topics, participate in discussions, and write structured arguments. Grammar: advanced connectors, passive alternatives, participle constructions introduction, style/register. Skills: article reading, presentation, formal correspondence. Prerequisite: B1.2. Completion: B2.1 assessment.", germanLevelLessons("B2.1", "DE-B21", "DE-B12-S05", [
        ["Structured Arguments and Discussion Language", "Build a clear argument with claim, reason, example, and limitation.", "A structured argument paragraph and speaking outline.", ["argumentation", "discussion"]],
        ["Formal Correspondence and Register", "Write formal messages with appropriate register and clear requests.", "A formal email with register notes.", ["formal-writing", "register"]],
        ["Advanced Connectors and Text Cohesion", "Use advanced connectors to link contrast, cause, result, and concession.", "A revised text showing cohesion improvements.", ["advanced-connectors", "cohesion"]],
        ["Presentations on Complex Topics", "Prepare and deliver a short structured presentation on a complex topic.", "A presentation outline with introduction, transitions, and conclusion.", ["presentation", "complex-topics"]],
        ["B2.1 Assessment Preparation", "Review B2.1 argument, register, cohesion, and presentation skills.", "A B2.1 preparation response with self-assessment.", ["review", "assessment-prep"]]
      ])),
      module(9, "B2.2 - Professional and Academic Fluency", "Objectives: follow detailed media, defend viewpoints, write polished texts, and communicate professionally. Grammar: advanced sentence style, nuanced modality, idioms, text cohesion. Skills: debate, reports, interviews, workplace scenarios. Prerequisite: B2.1. Completion: B2.2 assessment.", germanLevelLessons("B2.2", "DE-B22", "DE-B21-S05", [
        ["Professional Meetings and Interviews", "Participate in professional conversations with precise answers and follow-up questions.", "An interview answer bank and meeting response script.", ["interviews", "meetings"]],
        ["Academic and Media Comprehension", "Extract arguments, evidence, and stance from advanced texts or media.", "A comprehension map with thesis, support, and open questions.", ["media", "academic-reading"]],
        ["Debate, Nuance, and Counterarguments", "Defend a viewpoint while acknowledging tradeoffs and counterarguments.", "A debate outline with counterargument responses.", ["debate", "nuance"]],
        ["Reports, Recommendations, and Executive Summaries", "Write a concise report or recommendation with evidence and next steps.", "A one-page report draft with revision notes.", ["reports", "recommendations"]],
        ["B2.2 Fluency Review", "Integrate professional, academic, and debate language in a final B2.2 response.", "A final fluency portfolio entry and self-assessment.", ["review", "fluency"]]
      ]))
    ]
  }
];

export function lessonSlug(identifier: string): string {
  return identifier.toLowerCase();
}

export function buildApprovedSeedVersionInput(
  lessonDefinition: SeedLessonDefinition
): LessonVersionEditorInput {
  const content = contentForLesson(lessonDefinition);

  return {
    title: lessonDefinition.title,
    learningObjective: lessonDefinition.objective,
    outcomes: content.outcomes,
    explanationMarkdown: content.explanationMarkdown,
    relevanceMarkdown: content.relevanceMarkdown,
    examples: content.examples,
    commonMistakes: content.commonMistakes,
    assessmentTags: lessonDefinition.tags,
    resources: content.resources,
    exercises: content.exercises,
    knowledgeChecks: content.knowledgeChecks
  };
}

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

function contentForLesson(lessonDefinition: SeedLessonDefinition): LearnerSeedContent {
  if (lessonDefinition.identifier.startsWith("DE-")) {
    return germanContent(lessonDefinition);
  }

  const professionalContent = professionalContentForLesson(lessonDefinition);

  if (professionalContent !== null) {
    return professionalContent;
  }

  if (lessonDefinition.identifier.startsWith("PM-")) {
    return projectManagementContent(lessonDefinition);
  }

  return softwareEngineeringContent(lessonDefinition);
}

function softwareEngineeringContent(lessonDefinition: SeedLessonDefinition): LearnerSeedContent {
  const codeExample = softwareExample(lessonDefinition);
  const resource = softwareResource(lessonDefinition);

  return {
    outcomes: [
      `Explain ${lessonDefinition.title.toLowerCase()} in plain language.`,
      "Recognize when the idea is useful in a real codebase.",
      "Write a small TypeScript example that uses the idea correctly.",
      "Spot one common mistake before it reaches production code."
    ],
    explanationMarkdown: [
      `${lessonDefinition.title} is a practical software-engineering skill, not just a syntax topic.`,
      "Start by naming the problem the concept solves. Then look at the shape of the data, the function, or the UI state you are trying to model. TypeScript is most useful when it makes invalid states difficult to write.",
      codeExample.explanation
    ].join("\n\n"),
    relevanceMarkdown:
      "Professional teams use this skill to make changes safer, reviews clearer, and bugs easier to catch before users see them.",
    examples: codeExample.examples,
    commonMistakes: softwareMistakes(lessonDefinition),
    resources: [
      verifiedResource({
        title: resource.title,
        provider: resource.provider,
        url: resource.url,
        resourceType: resource.resourceType,
        required: true,
        estimatedMinutes: 25,
        description: `Official reference material for ${lessonDefinition.title.toLowerCase()}.`
      })
    ],
    exercises: [
      {
        kind: "guided",
        promptMarkdown: codeExample.guidedPrompt,
        expectedEvidence: "A short code snippet plus one sentence explaining why the types help.",
        solutionNotesMarkdown: codeExample.hint
      },
      {
        kind: "independent",
        promptMarkdown: codeExample.independentPrompt,
        expectedEvidence: lessonDefinition.evidence,
        solutionNotesMarkdown: null
      }
    ],
    knowledgeChecks: softwareChecks(lessonDefinition)
  };
}

function germanContent(lessonDefinition: SeedLessonDefinition): LearnerSeedContent {
  const topic = germanTopic(lessonDefinition);

  return {
    outcomes: topic.outcomes,
    explanationMarkdown: topic.explanationMarkdown,
    relevanceMarkdown:
      "Short daily practice builds recall. Say the examples aloud, then write your own version so the vocabulary becomes usable.",
    examples: topic.examples,
    commonMistakes: topic.commonMistakes,
    resources: [
      verifiedResource({
        title: topic.resourceTitle,
        provider: topic.resourceProvider,
        url: topic.resourceUrl,
        resourceType: "Learning guide",
        required: false,
        difficulty: lessonDefinition.level ?? "A1.1",
        estimatedMinutes: 15,
        description: "Supplemental German practice from a verified learning provider."
      })
    ],
    exercises: [
      {
        kind: "guided",
        promptMarkdown: topic.guidedPrompt,
        expectedEvidence: "Completed sentences or answers from the guided practice.",
        solutionNotesMarkdown: topic.guidedHint
      },
      {
        kind: "independent",
        promptMarkdown: topic.independentPrompt,
        expectedEvidence: lessonDefinition.evidence,
        solutionNotesMarkdown: null
      }
    ],
    knowledgeChecks: topic.knowledgeChecks
  };
}

function projectManagementContent(lessonDefinition: SeedLessonDefinition): LearnerSeedContent {
  const topic = projectManagementTopic(lessonDefinition);

  return {
    outcomes: topic.outcomes,
    explanationMarkdown: topic.explanationMarkdown,
    relevanceMarkdown:
      "Clear project thinking helps teams make tradeoffs early instead of discovering confusion when work is already late.",
    examples: topic.examples,
    commonMistakes: topic.commonMistakes,
    resources: [
      verifiedResource({
        title: topic.resourceTitle,
        provider: topic.resourceProvider,
        url: topic.resourceUrl,
        resourceType: "Guide",
        required: false,
        estimatedMinutes: 20,
        description: `Supplemental project-management reference for ${lessonDefinition.title.toLowerCase()}.`
      })
    ],
    exercises: [
      {
        kind: "guided",
        promptMarkdown: topic.guidedPrompt,
        expectedEvidence: "A short written answer using the lesson vocabulary.",
        solutionNotesMarkdown: topic.guidedHint
      },
      {
        kind: "independent",
        promptMarkdown: topic.independentPrompt,
        expectedEvidence: lessonDefinition.evidence,
        solutionNotesMarkdown: null
      }
    ],
    knowledgeChecks: topic.knowledgeChecks
  };
}

function verifiedResource({
  description,
  difficulty = "Foundational",
  estimatedMinutes,
  provider,
  required,
  resourceType,
  title,
  url
}: {
  readonly description: string;
  readonly difficulty?: string;
  readonly estimatedMinutes: number;
  readonly provider: string;
  readonly required: boolean;
  readonly resourceType: string;
  readonly title: string;
  readonly url: string;
}): Omit<LessonVersionEditorInput["resources"][number], "id"> {
  return {
    title,
    provider,
    url,
    resourceType,
    difficulty,
    estimatedMinutes,
    description,
    verificationStatus: "VERIFIED",
    required,
    approved: true,
    citation: `${provider}: ${title}`
  };
}

function softwareExample(lessonDefinition: SeedLessonDefinition) {
  if (lessonDefinition.tags.includes("ts-generics")) {
    return {
      explanation:
        "A generic lets a function keep information about the type it receives. Use a generic when the function works the same way for many types, but the return type should stay connected to the input type.",
      examples: [
        "function getFirst<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst firstName = getFirst([\"Ada\", \"Grace\"]);\nconst firstScore = getFirst([98, 87]);",
        "Use `T` when the exact type is supplied by the caller. Avoid `any` when you want TypeScript to protect the returned value."
      ],
      guidedPrompt:
        "Complete the helper:\n\nfunction getLast<T>(items: T[]): T | undefined {\n  return ______;\n}\n\nTry it with an array of strings and an array of numbers.",
      independentPrompt:
        "Create a generic function `wrapInArray<T>` that accepts one value and returns an array containing that value.",
      hint: "The return value should be `items[items.length - 1]`."
    };
  }

  if (lessonDefinition.tags.includes("zod") || lessonDefinition.tags.includes("validation")) {
    return {
      explanation:
        "TypeScript checks code while you write it, but data from forms, APIs, and files is still unknown at runtime. Zod lets you check that external data has the shape your code expects before using it.",
      examples: [
        "import { z } from \"zod\";\n\nconst UserInput = z.object({\n  email: z.string().email(),\n  age: z.number().int().min(13)\n});\n\nconst user = UserInput.parse(input);",
        "Use validation at boundaries: form submissions, GraphQL inputs, environment variables, and imported files."
      ],
      guidedPrompt:
        "Write a Zod schema for a registration form with `email`, `password`, and `displayName`.",
      independentPrompt:
        "Add one invalid example and write the error you expect the schema to catch.",
      hint: "`z.string().min(...)` is useful for password and display-name fields."
    };
  }

  if (lessonDefinition.tags.includes("ts-unions") || lessonDefinition.tags.includes("narrowing")) {
    return {
      explanation:
        "A union says a value can be one of several shapes. Narrowing is how TypeScript learns which shape you have before you use it.",
      examples: [
        "type LoadState =\n  | { status: \"loading\" }\n  | { status: \"success\"; data: string[] }\n  | { status: \"error\"; message: string };\n\nfunction render(state: LoadState) {\n  if (state.status === \"success\") {\n    return state.data.join(\", \");\n  }\n  return state.status;\n}",
        "The `status` field makes each branch clear and prevents reading `data` during loading or error states."
      ],
      guidedPrompt:
        "Create a union for a save button with `idle`, `saving`, `saved`, and `error` states.",
      independentPrompt:
        "Write a function that accepts your union and returns the button label for each state.",
      hint: "Give each union member a shared literal field like `status`."
    };
  }

  return {
    explanation:
      "Read the type or component boundary first, then write the smallest example that proves the idea. Good engineers explain both what the code does and why the design keeps future changes safer.",
    examples: [
      "type ApiResult<T> =\n  | { ok: true; value: T }\n  | { ok: false; error: string };",
      "A clear type makes success and failure explicit, so calling code has to handle both."
    ],
    guidedPrompt:
      `Write a tiny example that demonstrates ${lessonDefinition.title.toLowerCase()}. Add one sentence explaining the design choice.`,
    independentPrompt:
      `Apply ${lessonDefinition.title.toLowerCase()} to a small UI, API, or data-model example of your own.`,
    hint: "Keep the example small enough that every line supports the lesson goal."
  };
}

function softwareMistakes(lessonDefinition: SeedLessonDefinition): readonly string[] {
  if (lessonDefinition.tags.includes("ts-generics")) {
    return [
      "Using `any` instead of a generic and losing type safety.",
      "Adding a generic parameter that is not connected to an input or return type.",
      "Forgetting that `T[]` can still be empty."
    ];
  }

  if (lessonDefinition.tags.includes("zod") || lessonDefinition.tags.includes("validation")) {
    return [
      "Trusting external data because TypeScript compiled successfully.",
      "Validating too late after the value has already been used.",
      "Showing raw validation errors directly to users."
    ];
  }

  return [
    "Writing types that are broader than the real business rule.",
    "Skipping the error or empty state in examples.",
    "Naming a type after its implementation instead of the concept it represents."
  ];
}

function softwareChecks(lessonDefinition: SeedLessonDefinition) {
  if (lessonDefinition.tags.includes("ts-generics")) {
    return [
      {
        question: "Why would you use a generic instead of `any`?",
        answerKey: ["A generic keeps the caller's type information while `any` discards it."],
        explanation: "Generics preserve relationships between input and output types."
      },
      {
        question: "What should `getFirst<T>(items: T[])` return when the array is empty?",
        answerKey: ["undefined"],
        explanation: "The safe return type is `T | undefined` because an array may have no first item."
      },
      {
        question: "Where does the type `T` come from when a generic function is called?",
        answerKey: ["It is inferred from the argument or supplied by the caller."],
        explanation: "TypeScript usually infers generic types from function inputs."
      }
    ];
  }

  return [
    {
      question: `What problem does ${lessonDefinition.title.toLowerCase()} help solve?`,
      answerKey: [lessonDefinition.objective],
      explanation: "A useful answer names the practical problem, not just the syntax."
    },
    {
      question: "What is one realistic mistake a teammate might make with this topic?",
      answerKey: ["A topic-specific mistake with a prevention strategy."],
      explanation: "Professional learning includes knowing how the concept fails in real work."
    },
    {
      question: "How would you prove your example works?",
      answerKey: ["Run it, type-check it, and explain the expected result."],
      explanation: "Verification turns an example into reliable learning."
    }
  ];
}

function softwareResource(lessonDefinition: SeedLessonDefinition) {
  if (lessonDefinition.tags.includes("react-components") || lessonDefinition.tags.includes("react-composition")) {
    return {
      title: "React Learn",
      url: "https://react.dev/learn",
      resourceType: "Documentation",
      provider: "React"
    };
  }

  if (lessonDefinition.tags.includes("zod")) {
    return {
      title: "Zod Documentation",
      url: "https://zod.dev/",
      resourceType: "Documentation",
      provider: "Zod"
    };
  }

  if (lessonDefinition.tags.includes("graphql-schema")) {
    return {
      title: "GraphQL Learn",
      url: "https://graphql.org/learn/",
      resourceType: "Guide",
      provider: "GraphQL Foundation"
    };
  }

  return {
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    resourceType: "Documentation",
    provider: "TypeScript"
  };
}

function germanTopic(lessonDefinition: SeedLessonDefinition) {
  if (lessonDefinition.identifier === "DE-A11-S01") {
    return {
      outcomes: [
        "Use common greetings and goodbye phrases.",
        "Introduce yourself with `ich bin` and `ich heiße`.",
        "Ask someone's name with `Wie heißt du?` and `Wie heißen Sie?`.",
        "Choose between `ich`, `du`, and `Sie`.",
        "Write and say a short first introduction."
      ],
      explanationMarkdown:
        [
          "Review: This is your first German session, so there is no previous vocabulary to review yet. Read each German example aloud twice before writing.",
          "Vocabulary: `Hallo` means hello. `Guten Morgen` is good morning, `Guten Tag` is good day or a polite hello, and `Guten Abend` is good evening. `Tschüss` is an informal goodbye. `Auf Wiedersehen` is a polite goodbye. `Danke` means thank you. `Bitte` can mean please or you're welcome.",
          "Pronunciation: German vowels can change with umlauts: `ä`, `ö`, `ü`. The letter `ß` is called Eszett and sounds like a sharp `s`. In `heiße`, the `ß` sounds like `ss`: `hai-se`. Say `Guten Tag` with a clear final `g` that is softer than English `g` in many regions.",
          "Grammar: `ich` means I, `du` means informal you, and `Sie` means formal you. The verb `sein` changes: `ich bin`, `du bist`, `Sie sind`. The verb `heißen` also changes: `ich heiße`, `du heißt`, `Sie heißen`.",
          "Use informal forms with classmates, friends, and people who invite you to use `du`. Use `Sie` with strangers, officials, teachers, and formal settings."
        ].join("\n\n"),
      examples: [
        "German: Hallo! Ich heiße Anna.\nEnglish: Hello! My name is Anna.",
        "German: Ich bin Lukas. Wie heißt du?\nEnglish: I am Lukas. What is your name?",
        "German: Guten Tag. Wie heißen Sie?\nEnglish: Good day. What is your name?",
        "Mini-dialogue:\nA: Hallo! Ich heiße Emma. Wie heißt du?\nB: Ich heiße Nico.\nA: Schön. Tschüss!\nB: Tschüss!"
      ],
      commonMistakes: [
        "Using `du` in a formal first meeting.",
        "Forgetting that the verb changes: `ich bin`, but `du bist`.",
        "Writing `ich heisse` when the correct spelling is `ich heiße`.",
        "Using `Guten Morgen` late in the day."
      ],
      guidedPrompt:
        "Complete the introduction:\n\nHallo!\nIch ______ Anna.\nIch ______ Anna.\nWie ______ du?\n\nNow make it formal:\nGuten Tag. Wie ______ Sie?",
      guidedHint: "Use `bin`, `heiße`, `heißt`, and `heißen`.",
      independentPrompt:
        "Write a 5-6 sentence introduction. Include a greeting, your name with `ich heiße`, your name with `ich bin`, one informal question, one formal question, and a goodbye. Then say it aloud.",
      resourceTitle: "Practise German for free",
      resourceUrl: "https://www.goethe.de/en/spr/ueb.html",
      resourceProvider: "Goethe-Institut",
      knowledgeChecks: [
        {
          question: "Which greeting is most appropriate in the morning?",
          answerKey: ["Guten Morgen"],
          explanation: "`Guten Morgen` is the morning greeting."
        },
        {
          question: "How do you say `My name is Anna`?",
          answerKey: ["Ich heiße Anna."],
          explanation: "`Ich heiße ...` is the standard name pattern."
        },
        {
          question: "Which is formal: `Wie heißt du?` or `Wie heißen Sie?`",
          answerKey: ["Wie heißen Sie?"],
          explanation: "`Sie` is the formal form of you."
        }
      ]
    };
  }

  if (lessonDefinition.identifier === "DE-A11-S02") {
    return {
      outcomes: [
        "Review greetings and name questions from Session 1.",
        "Say the German alphabet aloud.",
        "Spell your name using German letter names.",
        "Ask someone to repeat or spell a word.",
        "Use polite repair phrases when you do not understand."
      ],
      explanationMarkdown:
        [
          "Review: Say these from memory before reading: `Hallo`, `Guten Tag`, `Ich heiße ...`, `Wie heißt du?`, `Wie heißen Sie?`.",
          "Alphabet focus: German uses the same basic alphabet as English plus umlauts `ä`, `ö`, `ü` and `ß`. Letter names matter because you often spell names, email addresses, streets, and usernames.",
          "Useful phrases: `Wie schreibt man das?` means how do you write that? `Buchstabieren Sie bitte` means please spell it. `Noch einmal, bitte` means one more time, please. `Langsam, bitte` means slowly, please.",
          "Pronunciation: `ei` sounds like English eye, as in `heiße`. `ie` sounds like a long ee, as in `Sie`. Keep these two apart."
        ].join("\n\n"),
      examples: [
        "German: Wie schreibt man Anna?\nEnglish: How do you write Anna?",
        "German: Buchstabieren Sie bitte.\nEnglish: Please spell it.",
        "Mini-dialogue:\nA: Guten Tag. Wie heißen Sie?\nB: Ich heiße Sara Müller.\nA: Wie schreibt man Müller?\nB: M-U-L-L-E-R. Mit Ü: Müller."
      ],
      commonMistakes: [
        "Confusing `ei` and `ie` sounds.",
        "Forgetting to use `bitte` in polite repair phrases.",
        "Spelling with English letter names instead of German letter names."
      ],
      guidedPrompt:
        "Fill the gaps:\n\nA: Wie ______ man das?\nB: M-A-R-I-A.\nA: Noch einmal, ______.\nB: Maria.\n\nNow spell your own first name.",
      guidedHint: "Use `schreibt` and `bitte`.",
      independentPrompt:
        "Write a short name dialogue. Include a greeting, a name question, one spelling request, one repeat request, and a polite goodbye.",
      resourceTitle: "Goethe-Institut German Practice",
      resourceUrl: "https://www.goethe.de/en/spr/ueb.html",
      resourceProvider: "Goethe-Institut",
      knowledgeChecks: [
        {
          question: "What does `Noch einmal, bitte` mean?",
          answerKey: ["One more time, please."],
          explanation: "Use this when you need repetition."
        },
        {
          question: "Which sound is in `Sie`: `ei` or `ie`?",
          answerKey: ["ie"],
          explanation: "`ie` sounds like a long ee."
        },
        {
          question: "How do you ask `How do you write that?`",
          answerKey: ["Wie schreibt man das?"],
          explanation: "This is a practical spelling question."
        }
      ]
    };
  }

  if (lessonDefinition.identifier === "DE-A11-S03") {
    return {
      outcomes: [
        "Review greetings, names, and spelling.",
        "Use numbers 0-100 in simple contexts.",
        "Say where you come from with `Ich komme aus ...`.",
        "Name countries and languages in simple profile sentences.",
        "Write a short personal profile."
      ],
      explanationMarkdown:
        [
          "Review: Introduce yourself aloud, then spell your first name. Use `Noch einmal, bitte` once.",
          "Numbers are practical immediately: phone numbers, ages, prices, room numbers, and addresses. Practise in chunks, not as a long list.",
          "Origin pattern: `Ich komme aus Nepal` means I come from Nepal. To ask informally, say `Woher kommst du?` Formally, say `Woher kommen Sie?`",
          "Language pattern: `Ich spreche Englisch` means I speak English. `Ich lerne Deutsch` means I am learning German."
        ].join("\n\n"),
      examples: [
        "German: Ich komme aus Nepal. Ich spreche Nepali und Englisch.\nEnglish: I come from Nepal. I speak Nepali and English.",
        "German: Woher kommst du?\nEnglish: Where do you come from?",
        "German: Meine Nummer ist null-eins-sieben-sechs.\nEnglish: My number is zero-one-seven-six."
      ],
      commonMistakes: [
        "Trying to memorize all numbers without saying them aloud.",
        "Using English country names when a German name is already known.",
        "Forgetting the verb in `Ich spreche ...` and `Ich lerne ...`."
      ],
      guidedPrompt:
        "Complete:\n\nIch komme aus ______.\nIch spreche ______.\nIch lerne Deutsch.\nMeine Nummer ist ______.\n\nSay your number as separate digits.",
      guidedHint: "Use a country, one language, and 4-6 digits.",
      independentPrompt:
        "Write a six-line profile with your name, country, language(s), German learning goal, and one number. Add one question for another person.",
      resourceTitle: "Super Easy German",
      resourceUrl: "https://www.easygerman.org/",
      resourceProvider: "Easy German",
      knowledgeChecks: [
        {
          question: "How do you ask informally `Where do you come from?`",
          answerKey: ["Woher kommst du?"],
          explanation: "`du` uses `kommst`."
        },
        {
          question: "What does `Ich lerne Deutsch` mean?",
          answerKey: ["I am learning German."],
          explanation: "`lernen` means to learn."
        },
        {
          question: "What kind of information are numbers useful for in this lesson?",
          answerKey: ["Phone numbers, ages, prices, room numbers, or addresses."],
          explanation: "Numbers become useful when connected to real tasks."
        }
      ]
    };
  }

  if (lessonDefinition.identifier === "DE-A11-S04") {
    return {
      outcomes: [
        "Review introductions, spelling, numbers, and origin.",
        "Ask W-questions with `wie`, `woher`, `was`, and `wer`.",
        "Answer basic personal-information questions.",
        "Recognize verb position in simple German questions.",
        "Create a short interview dialogue."
      ],
      explanationMarkdown:
        [
          "Review: Write three facts about yourself: name, country, and language. Then ask one name question and one origin question.",
          "W-questions begin with a question word. `Wie?` asks how or what name. `Woher?` asks from where. `Was?` asks what. `Wer?` asks who.",
          "In many simple German questions, the verb comes right after the question word: `Wie heißt du?`, `Woher kommst du?`, `Was sprichst du?`",
          "Keep answers short and accurate first. You can expand later."
        ].join("\n\n"),
      examples: [
        "German: Wie heißt du? - Ich heiße Lina.\nEnglish: What is your name? - My name is Lina.",
        "German: Woher kommen Sie? - Ich komme aus Indien.\nEnglish: Where do you come from? - I come from India.",
        "German: Was sprichst du? - Ich spreche Englisch und ein bisschen Deutsch.\nEnglish: What do you speak? - I speak English and a little German."
      ],
      commonMistakes: [
        "Putting the verb at the end of a basic W-question.",
        "Answering formal questions with informal forms.",
        "Trying to make long answers before the short pattern is secure."
      ],
      guidedPrompt:
        "Match and answer:\n\nWie heißt du?\nWoher kommst du?\nWas sprichst du?\nWer bist du?\n\nWrite one short answer for each.",
      guidedHint: "Use `Ich heiße`, `Ich komme aus`, `Ich spreche`, and `Ich bin`.",
      independentPrompt:
        "Write a six-line interview dialogue between two learners. Include at least three W-questions and three answers.",
      resourceTitle: "Practise German for free",
      resourceUrl: "https://www.goethe.de/en/spr/ueb.html",
      resourceProvider: "Goethe-Institut",
      knowledgeChecks: [
        {
          question: "Which question word asks `from where`?",
          answerKey: ["Woher"],
          explanation: "`Woher` asks origin."
        },
        {
          question: "Where is the verb in `Wie heißt du?`",
          answerKey: ["After the question word."],
          explanation: "The verb `heißt` follows `Wie`."
        },
        {
          question: "How do you answer `Was sprichst du?`",
          answerKey: ["Ich spreche ..."],
          explanation: "Use `Ich spreche` plus the language."
        }
      ]
    };
  }

  if (lessonDefinition.identifier === "DE-A11-S05") {
    return {
      outcomes: [
        "Review the first four sessions.",
        "Choose `du` or `Sie` in first-meeting situations.",
        "Use formal and informal introductions accurately.",
        "Read a short first-meeting dialogue.",
        "Write and speak a short practical conversation."
      ],
      explanationMarkdown:
        [
          "Review: Without looking, write two greetings, one name question, one origin question, and one repair phrase.",
          "`du` is informal. Use it with friends, classmates, children, and people who suggest it. `Sie` is formal. Use it with adults you do not know, officials, teachers, and workplace contacts until invited otherwise.",
          "Formal verbs often match plural-looking forms: `Sie sind`, `Sie heißen`, `Sie kommen`. Informal forms change differently: `du bist`, `du heißt`, `du kommst`.",
          "A good first conversation does not need many words. It needs the right greeting, the right form of you, clear pronunciation, and a polite close."
        ].join("\n\n"),
      examples: [
        "Informal:\nA: Hallo! Ich heiße Ben. Wie heißt du?\nB: Ich heiße Mia. Ich komme aus Polen.\nA: Schön. Tschüss!",
        "Formal:\nA: Guten Tag. Ich heiße Frau Bauer. Wie heißen Sie?\nB: Ich heiße Ahmed Khan. Ich komme aus Ägypten.\nA: Danke. Auf Wiedersehen.",
        "Repair:\nA: Wie heißen Sie?\nB: Noch einmal, bitte.\nA: Wie heißen Sie?"
      ],
      commonMistakes: [
        "Mixing `du` and `Sie` in the same conversation.",
        "Using `du bist` after `Sie`.",
        "Forgetting polite words like `bitte` and `danke`.",
        "Reading silently and skipping speaking practice."
      ],
      guidedPrompt:
        "Choose `du` or `Sie`:\n\n1. A new teacher asks your name.\n2. A classmate asks your name.\n3. A city-office employee asks where you come from.\n\nThen write one matching question for each.",
      guidedHint: "Use `Sie` for teacher and city office; `du` for classmate unless told otherwise.",
      independentPrompt:
        "Write two short dialogues: one informal and one formal. Each must include greeting, name, origin, one repair phrase, thank you, and goodbye. Say both aloud.",
      resourceTitle: "Practise German: Everyday Life",
      resourceUrl: "https://www.goethe.de/en/spr/ueb.html",
      resourceProvider: "Goethe-Institut",
      knowledgeChecks: [
        {
          question: "Which form should you use with an adult stranger: `du` or `Sie`?",
          answerKey: ["Sie"],
          explanation: "`Sie` is the safer formal choice."
        },
        {
          question: "Complete the formal sentence: `Sie ____ Ahmed.`",
          answerKey: ["heißen"],
          explanation: "Formal `Sie` uses `heißen`."
        },
        {
          question: "Why should you practise the dialogue aloud?",
          answerKey: ["To connect pronunciation, rhythm, and meaning."],
          explanation: "Speaking makes the session active, not just visual."
        }
      ]
    };
  }

  return {
    outcomes: [
      `Understand the key idea in ${lessonDefinition.title.toLowerCase()}.`,
      "Use the new words or grammar in short sentences.",
      "Say at least one example aloud.",
      "Write a short answer without copying the examples."
    ],
    explanationMarkdown:
      `${lessonDefinition.title} gives you a focused, usable piece of German for ${lessonDefinition.level ?? "your current level"}. Focus on controlled sentences, clear pronunciation, and repeating the pattern until it becomes usable.`,
    examples: [
      "German: Ich lerne Deutsch.\nEnglish: I am learning German.",
      "German: Das ist gut.\nEnglish: That is good.",
      "German: Noch einmal, bitte.\nEnglish: One more time, please."
    ],
    commonMistakes: [
      "Trying to memorize too many words at once.",
      "Skipping pronunciation practice.",
      "Writing English word order into every German sentence."
    ],
    guidedPrompt:
      `Write three short sentences using the new idea from ${lessonDefinition.title}. Say each sentence aloud once.`,
    guidedHint: "Keep every sentence short: subject, verb, one detail.",
    independentPrompt:
      "Write a short mini-dialogue or answer that uses today's vocabulary in your own words.",
    resourceTitle: "Practise German for free",
    resourceUrl: "https://www.goethe.de/en/spr/ueb.html",
    resourceProvider: "Goethe-Institut",
    knowledgeChecks: [
      {
        question: `What is one phrase or grammar pattern from ${lessonDefinition.title}?`,
        answerKey: ["A phrase or pattern from the lesson."],
        explanation: "Recall is stronger when you can produce the pattern without looking."
      },
      {
        question: "What should you do after writing a new German sentence?",
        answerKey: ["Say it aloud."],
        explanation: "Speaking practice connects spelling, sound, and meaning."
      },
      {
        question: "Why should beginner German sentences stay short?",
        answerKey: ["Short sentences make word order and verb placement easier to control."],
        explanation: "Accuracy first, then longer sentences."
      }
    ]
  };
}

function projectManagementTopic(lessonDefinition: SeedLessonDefinition) {
  return {
    outcomes: [
      `Explain ${lessonDefinition.title.toLowerCase()} in practical language.`,
      "Identify the decision or artifact this topic supports.",
      "Apply the idea to a small project scenario.",
      "Name one risk caused by unclear project thinking."
    ],
    explanationMarkdown:
      `${lessonDefinition.title} helps a project manager turn unclear work into shared decisions.\n\nStart with the outcome: what should be true when the work is done? Then name the constraints, stakeholders, assumptions, and risks. A good project artifact is short enough to read and specific enough to guide action.`,
    examples: [
      "Scenario: A team is launching a customer portal in eight weeks. The sponsor wants faster onboarding, support wants fewer tickets, and engineering has two developers available.",
      "Good PM note: `Success means 80% of new customers can activate accounts without support help. Scope excludes billing changes for this release.`",
      "Weak PM note: `Build a better portal soon.`"
    ],
    commonMistakes: [
      "Writing broad goals that cannot be measured.",
      "Confusing assumptions with confirmed facts.",
      "Hiding tradeoffs until the schedule is already at risk."
    ],
    guidedPrompt:
      "For the customer-portal scenario, write one clear objective, one constraint, and one open question.",
    guidedHint: "Use measurable language for the objective and plain language for the constraint.",
    independentPrompt:
      `Apply ${lessonDefinition.title.toLowerCase()} to a small project you know. Keep it to five bullet points.`,
    resourceTitle: "What is Project Management?",
    resourceUrl: "https://www.pmi.org/about/learn-about-pmi/what-is-project-management",
    resourceProvider: "Project Management Institute",
    knowledgeChecks: [
      {
        question: "Why should a project objective be measurable?",
        answerKey: ["So stakeholders can agree whether the outcome was achieved."],
        explanation: "Measurement reduces subjective status debates."
      },
      {
        question: "What is one difference between a risk and an issue?",
        answerKey: ["A risk might happen; an issue is already happening."],
        explanation: "The response changes depending on whether the problem is potential or current."
      },
      {
        question: "Who needs to understand the project tradeoffs?",
        answerKey: ["The project team and relevant stakeholders."],
        explanation: "Shared tradeoff awareness prevents surprises."
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

function germanLevelLessons(
  level: string,
  identifierPrefix: string,
  firstPrerequisite: string,
  definitions: readonly [
    title: string,
    objective: string,
    evidence: string,
    tags: readonly string[]
  ][]
): readonly SeedLessonDefinition[] {
  return definitions.map(([title, objective, evidence, tags], index) => {
    const identifier = `${identifierPrefix}-S${String(index + 1).padStart(2, "0")}`;
    const prerequisite = index === 0
      ? firstPrerequisite
      : `${identifierPrefix}-S${String(index).padStart(2, "0")}`;

    return lesson(
      identifier,
      `${level} Session ${index + 1}: ${title}`,
      objective,
      [prerequisite],
      60,
      evidence,
      [level, ...tags],
      level
    );
  });
}

function lesson(
  identifier: string,
  title: string,
  objective: string,
  prerequisites: readonly string[],
  durationMinutes: number,
  evidence: string,
  tags: readonly string[],
  level?: string
): SeedLessonDefinition {
  return {
    identifier,
    title,
    objective,
    prerequisites,
    durationMinutes,
    required: true,
    evidence,
    tags,
    ...(level === undefined ? {} : { level })
  };
}
