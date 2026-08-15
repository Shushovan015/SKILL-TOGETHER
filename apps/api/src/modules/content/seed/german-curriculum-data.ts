import { germanA1CurriculumModules } from "./german-a1-curriculum-data.js";

export type GermanImplementedLevel = "A1.1" | "A1.2" | "A2.1" | "A2.2" | "B1.1" | "B1.2" | "B2.1" | "B2.2" | "C1.1" | "C1.2" | "C2.1" | "C2.2";
export type GermanLevelCode = "A11" | "A12" | "A21" | "A22" | "B11" | "B12" | "B21" | "B22" | "C11" | "C12" | "C21" | "C22";
export type GermanUnitNumber = 1 | 2 | 3 | 4 | 5;

export interface GermanCurriculumModule {
  readonly level: GermanImplementedLevel;
  readonly code: GermanLevelCode;
  readonly levelSlug: string;
  readonly moduleNumber: number;
  readonly title: string;
  readonly communicativePurpose: string;
  readonly grammarFocus: string;
  readonly vocabularyFocus: string;
  readonly pronunciationFocus: string;
  readonly moduleEvidence: string;
  readonly moduleSlug: string;
}

export interface GermanUnitTemplate {
  readonly unitNumber: GermanUnitNumber;
  readonly title: string;
  readonly progressionStatus: "NEW" | "REVIEW" | "CONSOLIDATION" | "EXPANSION";
  readonly durationMinutes: number;
  readonly competency: string;
}

export interface GermanCurriculumLessonDefinition {
  readonly module: GermanCurriculumModule;
  readonly unit: GermanUnitTemplate;
  readonly identifier: string;
  readonly title: string;
  readonly objective: string;
  readonly evidence: string;
  readonly tags: readonly string[];
}

export const germanImplementedLevels = [
  "A1.1",
  "A1.2",
  "A2.1",
  "A2.2",
  "B1.1",
  "B1.2",
  "B2.1",
  "B2.2",
  "C1.1",
  "C1.2",
  "C2.1",
  "C2.2"
] as const;

export const germanUnitTemplates: readonly GermanUnitTemplate[] = [
  {
    "unitNumber": 1,
    "title": "Core input and phrases",
    "progressionStatus": "NEW",
    "durationMinutes": 60,
    "competency": "input-phrases"
  },
  {
    "unitNumber": 2,
    "title": "Grammar in context",
    "progressionStatus": "EXPANSION",
    "durationMinutes": 60,
    "competency": "grammar-context"
  },
  {
    "unitNumber": 3,
    "title": "Listening, reading, and pronunciation detail",
    "progressionStatus": "REVIEW",
    "durationMinutes": 60,
    "competency": "receptive-detail"
  },
  {
    "unitNumber": 4,
    "title": "Guided interaction and production",
    "progressionStatus": "CONSOLIDATION",
    "durationMinutes": 60,
    "competency": "guided-production"
  },
  {
    "unitNumber": 5,
    "title": "Integrated real-world task",
    "progressionStatus": "CONSOLIDATION",
    "durationMinutes": 60,
    "competency": "integrated-task"
  }
] as const;

export const germanCurriculumModules: readonly GermanCurriculumModule[] = [
  ...germanA1CurriculumModules,
  {
    "level": "A2.1",
    "code": "A21",
    "levelSlug": "a2-1",
    "moduleNumber": 1,
    "title": "Travel planning and booking",
    "communicativePurpose": "plan a short trip and ask for travel information",
    "grammarFocus": "Perfekt recognition; comparative chunks; prepositions nach/in/mit",
    "vocabularyFocus": "travel, tickets, accommodation, departure/arrival",
    "pronunciationFocus": "train-station numbers; unstressed endings",
    "moduleEvidence": "compare two travel options and book one",
    "moduleSlug": "travel-planning-and-booking"
  },
  {
    "level": "A2.1",
    "code": "A21",
    "levelSlug": "a2-1",
    "moduleNumber": 2,
    "title": "Changing plans and explaining reasons",
    "communicativePurpose": "change arrangements and explain simple reasons",
    "grammarFocus": "weil clauses with verb-final order; modal verbs review; Perfekt with haben",
    "vocabularyFocus": "delays, reasons, apologies, alternatives, availability",
    "pronunciationFocus": "clause-final verb rhythm; polite apology intonation",
    "moduleEvidence": "send a message changing a plan with a reason",
    "moduleSlug": "changing-plans-and-explaining-reasons"
  },
  {
    "level": "A2.1",
    "code": "A21",
    "levelSlug": "a2-1",
    "moduleNumber": 3,
    "title": "Health appointments and advice",
    "communicativePurpose": "make a health appointment and report symptoms",
    "grammarFocus": "Perfekt with sein/haben; dative pronouns in chunks; imperative advice",
    "vocabularyFocus": "doctor, symptoms, medicine, appointment logistics",
    "pronunciationFocus": "long compound stress; ach/ich contrast in medical words",
    "moduleEvidence": "book a doctor appointment and summarize symptoms",
    "moduleSlug": "health-appointments-and-advice"
  },
  {
    "level": "A2.1",
    "code": "A21",
    "levelSlug": "a2-1",
    "moduleNumber": 4,
    "title": "Housing search and neighborhood",
    "communicativePurpose": "describe housing needs and understand listings",
    "grammarFocus": "adjective position noticing; es gibt; comparative forms",
    "vocabularyFocus": "apartment features, rent, neighborhood, utilities",
    "pronunciationFocus": "compound noun stress; schwa endings",
    "moduleEvidence": "select an apartment listing and ask follow-up questions",
    "moduleSlug": "housing-search-and-neighborhood"
  },
  {
    "level": "A2.1",
    "code": "A21",
    "levelSlug": "a2-1",
    "moduleNumber": 5,
    "title": "Past experiences with Perfekt",
    "communicativePurpose": "narrate common past events in simple sequence",
    "grammarFocus": "Perfekt with regular/irregular participles; haben/sein auxiliaries; time markers",
    "vocabularyFocus": "weekend activities, travel events, sequence words",
    "pronunciationFocus": "ge- prefix stress; participle endings",
    "moduleEvidence": "tell a short past-event story with three events",
    "moduleSlug": "past-experiences-with-perfekt"
  },
  {
    "level": "A2.1",
    "code": "A21",
    "levelSlug": "a2-1",
    "moduleNumber": 6,
    "title": "Work and learning routines",
    "communicativePurpose": "describe tasks, abilities, and learning progress",
    "grammarFocus": "koennen/muessen/wollen; dass clauses as noticing; frequency adverbs",
    "vocabularyFocus": "work tasks, study habits, skills, progress language",
    "pronunciationFocus": "modal sentence rhythm; word stress in abstract nouns",
    "moduleEvidence": "explain current learning/work routine and one goal",
    "moduleSlug": "work-and-learning-routines"
  },
  {
    "level": "A2.1",
    "code": "A21",
    "levelSlug": "a2-1",
    "moduleNumber": 7,
    "title": "Services, complaints, and requests",
    "communicativePurpose": "make a simple complaint and request a solution",
    "grammarFocus": "dative/accusative in fixed service phrases; negation with nicht/kein; polite subjunctive chunks",
    "vocabularyFocus": "service problems, repairs, refunds, customer phrases",
    "pronunciationFocus": "polite stress; final consonants in service words",
    "moduleEvidence": "report a service problem and request a repair or refund",
    "moduleSlug": "services-complaints-and-requests"
  },
  {
    "level": "A2.1",
    "code": "A21",
    "levelSlug": "a2-1",
    "moduleNumber": 8,
    "title": "Comparing options and making choices",
    "communicativePurpose": "compare options and justify a practical choice",
    "grammarFocus": "comparative/superlative basics; als/wie; preference structures",
    "vocabularyFocus": "prices, quality, distance, features, pros/cons",
    "pronunciationFocus": "contrastive stress; comparative endings",
    "moduleEvidence": "compare three options and choose one with reasons",
    "moduleSlug": "comparing-options-and-making-choices"
  },
  {
    "level": "A2.1",
    "code": "A21",
    "levelSlug": "a2-1",
    "moduleNumber": 9,
    "title": "Short factual texts and summaries",
    "communicativePurpose": "read short factual texts and summarize key information",
    "grammarFocus": "main/subordinate clause recognition; connector review; pronoun reference",
    "vocabularyFocus": "public information, simple reports, facts, categories",
    "pronunciationFocus": "chunking for reading aloud; pause groups",
    "moduleEvidence": "summarize a short factual text for a partner",
    "moduleSlug": "short-factual-texts-and-summaries"
  },
  {
    "level": "A2.1",
    "code": "A21",
    "levelSlug": "a2-1",
    "moduleNumber": 10,
    "title": "A2.1 integrated travel-and-services project",
    "communicativePurpose": "combine A2.1 language for a short trip with a service problem",
    "grammarFocus": "review: Perfekt, weil, modals, comparison, prepositions, negation",
    "vocabularyFocus": "travel, health, housing, services, work/study, factual texts",
    "pronunciationFocus": "review: participles, compounds, clause rhythm",
    "moduleEvidence": "plan a trip, change a booking, report a problem, and summarize a notice",
    "moduleSlug": "a2-1-integrated-travel-and-services-project"
  },
  {
    "level": "A2.2",
    "code": "A22",
    "levelSlug": "a2-2",
    "moduleNumber": 1,
    "title": "Life events and short biographies",
    "communicativePurpose": "tell a simple life story and ask about milestones",
    "grammarFocus": "Perfekt/Praeteritum of sein/haben; time connectors; preterite recognition",
    "vocabularyFocus": "life stages, education, work, family events",
    "pronunciationFocus": "past-tense rhythm; stress in dates",
    "moduleEvidence": "present a short biography with timeline details",
    "moduleSlug": "life-events-and-short-biographies"
  },
  {
    "level": "A2.2",
    "code": "A22",
    "levelSlug": "a2-2",
    "moduleNumber": 2,
    "title": "Preferences, opinions, and reasons",
    "communicativePurpose": "express preferences and give connected reasons",
    "grammarFocus": "weil/dass clauses; adjective comparison review; pronoun reference",
    "vocabularyFocus": "opinions, tastes, entertainment, reasons, evaluation words",
    "pronunciationFocus": "sentence stress for stance; connectors in speech",
    "moduleEvidence": "recommend an activity or product with reasons",
    "moduleSlug": "preferences-opinions-and-reasons"
  },
  {
    "level": "A2.2",
    "code": "A22",
    "levelSlug": "a2-2",
    "moduleNumber": 3,
    "title": "Describing people, places, and objects",
    "communicativePurpose": "describe features and compare alternatives",
    "grammarFocus": "adjective endings recognition; relative clauses as chunks; comparative review",
    "vocabularyFocus": "appearance, personality, places, object features, dimensions",
    "pronunciationFocus": "ending reduction; compound stress",
    "moduleEvidence": "describe a lost item, person, or place clearly",
    "moduleSlug": "describing-people-places-and-objects"
  },
  {
    "level": "A2.2",
    "code": "A22",
    "levelSlug": "a2-2",
    "moduleNumber": 4,
    "title": "Problems, solutions, and instructions",
    "communicativePurpose": "explain a problem and understand simple instructions",
    "grammarFocus": "imperatives; wenn clauses as noticing; modal verbs for advice",
    "vocabularyFocus": "technical problems, instructions, repair, troubleshooting",
    "pronunciationFocus": "imperative intonation; word groups in instructions",
    "moduleEvidence": "explain a device problem and follow repair steps",
    "moduleSlug": "problems-solutions-and-instructions"
  },
  {
    "level": "A2.2",
    "code": "A22",
    "levelSlug": "a2-2",
    "moduleNumber": 5,
    "title": "News, weather, and public information",
    "communicativePurpose": "understand simple news and public updates",
    "grammarFocus": "passive recognition; time/place/manner word order; reported information chunks",
    "vocabularyFocus": "weather, transport updates, local news, public notices",
    "pronunciationFocus": "news-reading rhythm; vowel length in public terms",
    "moduleEvidence": "summarize a local update and say what action is needed",
    "moduleSlug": "news-weather-and-public-information"
  },
  {
    "level": "A2.2",
    "code": "A22",
    "levelSlug": "a2-2",
    "moduleNumber": 6,
    "title": "Invitations, events, and social plans",
    "communicativePurpose": "organize a social event and respond appropriately",
    "grammarFocus": "subordinate clauses review; prepositions with events; modal verbs",
    "vocabularyFocus": "events, invitations, venue, schedule, social phrases",
    "pronunciationFocus": "polite intonation; reductions in RSVP phrases",
    "moduleEvidence": "plan an event and respond to an invitation",
    "moduleSlug": "invitations-events-and-social-plans"
  },
  {
    "level": "A2.2",
    "code": "A22",
    "levelSlug": "a2-2",
    "moduleNumber": 7,
    "title": "Experiences and recommendations",
    "communicativePurpose": "describe experiences and make practical recommendations",
    "grammarFocus": "Perfekt consolidation; connectors deshalb/trotzdem; adverbial order",
    "vocabularyFocus": "travel, restaurants, courses, services, recommendation language",
    "pronunciationFocus": "contrastive stress for pros/cons; participle review",
    "moduleEvidence": "write a short review with recommendation",
    "moduleSlug": "experiences-and-recommendations"
  },
  {
    "level": "A2.2",
    "code": "A22",
    "levelSlug": "a2-2",
    "moduleNumber": 8,
    "title": "Media, hobbies, and learning strategies",
    "communicativePurpose": "talk about media use and describe learning strategies",
    "grammarFocus": "reflexive verbs as chunks; infinitive with zu recognition; frequency structures",
    "vocabularyFocus": "media, hobbies, apps, learning actions, strategies",
    "pronunciationFocus": "loanword pronunciation; sentence melody in explanations",
    "moduleEvidence": "explain a learning routine and recommend a resource",
    "moduleSlug": "media-hobbies-and-learning-strategies"
  },
  {
    "level": "A2.2",
    "code": "A22",
    "levelSlug": "a2-2",
    "moduleNumber": 9,
    "title": "Practical email and formality",
    "communicativePurpose": "write a practical email with suitable opening and closing",
    "grammarFocus": "formal requests; word order after connectors; pronoun reference",
    "vocabularyFocus": "email formulae, requests, attachments, deadlines, confirmations",
    "pronunciationFocus": "reading formal text aloud; polite rhythm",
    "moduleEvidence": "write an email requesting information or support",
    "moduleSlug": "practical-email-and-formality"
  },
  {
    "level": "A2.2",
    "code": "A22",
    "levelSlug": "a2-2",
    "moduleNumber": 10,
    "title": "A2.2 integrated independence project",
    "communicativePurpose": "combine A2.2 language for everyday independence and correspondence",
    "grammarFocus": "review: Perfekt, subordinate clauses, comparison, connectors, imperatives, formal email",
    "vocabularyFocus": "biography, opinions, problems, news, events, media, email",
    "pronunciationFocus": "review: clause rhythm, compounds, polite intonation",
    "moduleEvidence": "complete a multi-step scenario with event planning, problem report, summary, and email",
    "moduleSlug": "a2-2-integrated-independence-project"
  },
  {
    "level": "B1.1",
    "code": "B11",
    "levelSlug": "b1-1",
    "moduleNumber": 1,
    "title": "Plans, goals, and future intentions",
    "communicativePurpose": "explain goals and plan next steps",
    "grammarFocus": "werden future; infinitive with zu; purpose clauses damit/um zu as noticing",
    "vocabularyFocus": "goals, milestones, planning verbs, priorities",
    "pronunciationFocus": "intonation in longer explanations; schwa reduction",
    "moduleEvidence": "present a personal or learning plan with next steps",
    "moduleSlug": "plans-goals-and-future-intentions"
  },
  {
    "level": "B1.1",
    "code": "B11",
    "levelSlug": "b1-1",
    "moduleNumber": 2,
    "title": "Education and training choices",
    "communicativePurpose": "compare training options and explain suitability",
    "grammarFocus": "comparatives review; relative clauses; adjective endings productive intro",
    "vocabularyFocus": "courses, qualifications, requirements, strengths, support",
    "pronunciationFocus": "compound stress in education terms; endings",
    "moduleEvidence": "choose a course and justify suitability",
    "moduleSlug": "education-and-training-choices"
  },
  {
    "level": "B1.1",
    "code": "B11",
    "levelSlug": "b1-1",
    "moduleNumber": 3,
    "title": "Workplace communication basics",
    "communicativePurpose": "handle routine workplace requests and updates",
    "grammarFocus": "modal verbs in polite requests; subordinate clauses; indirect questions as chunks",
    "vocabularyFocus": "work tasks, deadlines, feedback, requests, meeting words",
    "pronunciationFocus": "polite intonation; reduced unstressed syllables",
    "moduleEvidence": "send and discuss a workplace status update",
    "moduleSlug": "workplace-communication-basics"
  },
  {
    "level": "B1.1",
    "code": "B11",
    "levelSlug": "b1-1",
    "moduleNumber": 4,
    "title": "Travel disruption and problem solving",
    "communicativePurpose": "manage disruptions and negotiate alternatives",
    "grammarFocus": "wenn clauses; deshalb/trotzdem; dative/accusative review",
    "vocabularyFocus": "delays, cancellations, alternatives, compensation, service desk phrases",
    "pronunciationFocus": "stress in problem/solution sequences; final devoicing",
    "moduleEvidence": "resolve a travel disruption with a service employee",
    "moduleSlug": "travel-disruption-and-problem-solving"
  },
  {
    "level": "B1.1",
    "code": "B11",
    "levelSlug": "b1-1",
    "moduleNumber": 5,
    "title": "Opinions in familiar discussions",
    "communicativePurpose": "state and support opinions in a familiar discussion",
    "grammarFocus": "weil/obwohl; connectors; pronoun reference across sentences",
    "vocabularyFocus": "society, everyday issues, advantages, disadvantages, stance phrases",
    "pronunciationFocus": "contrastive stress; turn-taking intonation",
    "moduleEvidence": "participate in a short opinion discussion",
    "moduleSlug": "opinions-in-familiar-discussions"
  },
  {
    "level": "B1.1",
    "code": "B11",
    "levelSlug": "b1-1",
    "moduleNumber": 6,
    "title": "Narrating experiences with detail",
    "communicativePurpose": "narrate experiences with sequence and evaluation",
    "grammarFocus": "Perfekt/Praeteritum contrast; plusquamperfekt recognition; temporal clauses",
    "vocabularyFocus": "events, emotions, sequence, evaluation, reflection",
    "pronunciationFocus": "narrative pacing; participle stress",
    "moduleEvidence": "tell an experience and explain what changed",
    "moduleSlug": "narrating-experiences-with-detail"
  },
  {
    "level": "B1.1",
    "code": "B11",
    "levelSlug": "b1-1",
    "moduleNumber": 7,
    "title": "Health, habits, and advice",
    "communicativePurpose": "discuss habits and give simple advice",
    "grammarFocus": "reflexive verbs; sollen/du solltest chunks; wenn clauses",
    "vocabularyFocus": "lifestyle, habits, stress, advice, routines",
    "pronunciationFocus": "sentence rhythm with reflexive pronouns; medical compounds",
    "moduleEvidence": "give advice for a routine health or learning issue",
    "moduleSlug": "health-habits-and-advice"
  },
  {
    "level": "B1.1",
    "code": "B11",
    "levelSlug": "b1-1",
    "moduleNumber": 8,
    "title": "Media reports and summaries",
    "communicativePurpose": "summarize accessible media and distinguish main ideas",
    "grammarFocus": "reported information with dass; passive recognition; connector review",
    "vocabularyFocus": "news topics, media genres, evidence, summary phrases",
    "pronunciationFocus": "news intonation; pausing in summaries",
    "moduleEvidence": "summarize an accessible article or audio report",
    "moduleSlug": "media-reports-and-summaries"
  },
  {
    "level": "B1.1",
    "code": "B11",
    "levelSlug": "b1-1",
    "moduleNumber": 9,
    "title": "Forms, applications, and formal requests",
    "communicativePurpose": "complete forms and make formal written requests",
    "grammarFocus": "formal Sie; indirect questions; nominal phrases as recognition",
    "vocabularyFocus": "applications, forms, documents, requests, attachments",
    "pronunciationFocus": "formal reading rhythm; spelling names and IDs",
    "moduleEvidence": "complete a form and write a formal request",
    "moduleSlug": "forms-applications-and-formal-requests"
  },
  {
    "level": "B1.1",
    "code": "B11",
    "levelSlug": "b1-1",
    "moduleNumber": 10,
    "title": "B1.1 integrated threshold project",
    "communicativePurpose": "combine B1.1 language for planning, discussion, disruption, and formal request",
    "grammarFocus": "review: future, relative clauses, wenn/weil/obwohl, Perfekt/Praeteritum, indirect questions",
    "vocabularyFocus": "goals, education, workplace, travel, opinions, health, media, forms",
    "pronunciationFocus": "review: longer sentence rhythm, contrastive stress, formal intonation",
    "moduleEvidence": "complete a study/work scenario with plan, discussion, summary, and formal email",
    "moduleSlug": "b1-1-integrated-threshold-project"
  },
  {
    "level": "B1.2",
    "code": "B12",
    "levelSlug": "b1-2",
    "moduleNumber": 1,
    "title": "Civic services and official communication",
    "communicativePurpose": "navigate official services and explain needs",
    "grammarFocus": "passive recognition; nominalization recognition; formal request structures",
    "vocabularyFocus": "registration, offices, documents, permissions, deadlines",
    "pronunciationFocus": "formal compound stress; polite repair",
    "moduleEvidence": "ask an office for information and summarize requirements",
    "moduleSlug": "civic-services-and-official-communication"
  },
  {
    "level": "B1.2",
    "code": "B12",
    "levelSlug": "b1-2",
    "moduleNumber": 2,
    "title": "Workplace collaboration and meetings",
    "communicativePurpose": "contribute to meetings and clarify tasks",
    "grammarFocus": "Konjunktiv II polite forms; indirect questions; dass/ob clauses",
    "vocabularyFocus": "agenda, responsibilities, clarification, decisions, follow-up",
    "pronunciationFocus": "turn-entry intonation; weak endings in long utterances",
    "moduleEvidence": "participate in a meeting and write follow-up actions",
    "moduleSlug": "workplace-collaboration-and-meetings"
  },
  {
    "level": "B1.2",
    "code": "B12",
    "levelSlug": "b1-2",
    "moduleNumber": 3,
    "title": "Arguments with examples",
    "communicativePurpose": "build a structured argument with examples",
    "grammarFocus": "connectors einerseits/andererseits; obwohl/trotzdem; relative clauses review",
    "vocabularyFocus": "argument, examples, evidence, concession, conclusion",
    "pronunciationFocus": "intonation for contrast; paragraph rhythm",
    "moduleEvidence": "present a short argument with two examples",
    "moduleSlug": "arguments-with-examples"
  },
  {
    "level": "B1.2",
    "code": "B12",
    "levelSlug": "b1-2",
    "moduleNumber": 4,
    "title": "Learning and career development",
    "communicativePurpose": "describe development, feedback, and next steps",
    "grammarFocus": "zu-infinitive; reflexive verbs; adjective endings review",
    "vocabularyFocus": "career goals, feedback, strengths, improvement, learning resources",
    "pronunciationFocus": "word stress in abstract nouns; fluent chunking",
    "moduleEvidence": "write a development plan from feedback",
    "moduleSlug": "learning-and-career-development"
  },
  {
    "level": "B1.2",
    "code": "B12",
    "levelSlug": "b1-2",
    "moduleNumber": 5,
    "title": "Consumer choices and complaints",
    "communicativePurpose": "compare offers and escalate a complaint politely",
    "grammarFocus": "comparatives/superlatives; relative clauses; passive as recognition",
    "vocabularyFocus": "contracts, subscriptions, warranties, complaint language",
    "pronunciationFocus": "formal complaint intonation; numbers and dates",
    "moduleEvidence": "write and role-play a complaint with requested solution",
    "moduleSlug": "consumer-choices-and-complaints"
  },
  {
    "level": "B1.2",
    "code": "B12",
    "levelSlug": "b1-2",
    "moduleNumber": 6,
    "title": "Culture, leisure, and reviews",
    "communicativePurpose": "discuss cultural experiences and write reviews",
    "grammarFocus": "adjective endings productive consolidation; causal/concessive connectors",
    "vocabularyFocus": "films, books, events, evaluation, atmosphere, recommendation",
    "pronunciationFocus": "expressive intonation; adjective endings",
    "moduleEvidence": "write a structured review and discuss it",
    "moduleSlug": "culture-leisure-and-reviews"
  },
  {
    "level": "B1.2",
    "code": "B12",
    "levelSlug": "b1-2",
    "moduleNumber": 7,
    "title": "Environment and local issues",
    "communicativePurpose": "understand and discuss local environmental topics",
    "grammarFocus": "passive intro; wenn/damit; noun-verb collocations",
    "vocabularyFocus": "transport, recycling, energy, local policy, public action",
    "pronunciationFocus": "compound stress; public-topic vocabulary",
    "moduleEvidence": "summarize a local issue and propose one action",
    "moduleSlug": "environment-and-local-issues"
  },
  {
    "level": "B1.2",
    "code": "B12",
    "levelSlug": "b1-2",
    "moduleNumber": 8,
    "title": "Mediating practical information",
    "communicativePurpose": "mediate instructions, rules, and recommendations",
    "grammarFocus": "reported speech chunks; dass/ob clauses; pronoun reference",
    "vocabularyFocus": "rules, procedures, requirements, recommendations, constraints",
    "pronunciationFocus": "clear delivery of summarized information; pause groups",
    "moduleEvidence": "relay practical information from one source to another person",
    "moduleSlug": "mediating-practical-information"
  },
  {
    "level": "B1.2",
    "code": "B12",
    "levelSlug": "b1-2",
    "moduleNumber": 9,
    "title": "Longer personal and formal writing",
    "communicativePurpose": "write organized personal and formal texts",
    "grammarFocus": "paragraph connectors; tense review; cohesive pronouns",
    "vocabularyFocus": "email, blog, statement, application, request vocabulary",
    "pronunciationFocus": "reading drafts aloud for rhythm; sentence groups",
    "moduleEvidence": "draft and revise a 180-220 word practical text",
    "moduleSlug": "longer-personal-and-formal-writing"
  },
  {
    "level": "B1.2",
    "code": "B12",
    "levelSlug": "b1-2",
    "moduleNumber": 10,
    "title": "B1.2 integrated independence project",
    "communicativePurpose": "combine B1.2 language for civic, workplace, argument, and mediation tasks",
    "grammarFocus": "review: passive recognition, Konjunktiv II, connectors, relative clauses, formal writing",
    "vocabularyFocus": "civic services, meetings, arguments, career, consumer, culture, environment, mediation",
    "pronunciationFocus": "review: formal rhythm, contrastive stress, pause groups",
    "moduleEvidence": "complete an integrated B1 scenario with meeting, summary, complaint, and recommendation",
    "moduleSlug": "b1-2-integrated-independence-project"
  },
  {
    "level": "B2.1",
    "code": "B21",
    "levelSlug": "b2-1",
    "moduleNumber": 1,
    "title": "Academic and professional self-presentation",
    "communicativePurpose": "present background, expertise, and goals with precision",
    "grammarFocus": "nominal style recognition; participial adjectives; advanced word order review",
    "vocabularyFocus": "professional profile, academic fields, achievements, motivation",
    "pronunciationFocus": "rhetorical stress; reduced function words",
    "moduleEvidence": "deliver a structured professional self-presentation",
    "moduleSlug": "academic-and-professional-self-presentation"
  },
  {
    "level": "B2.1",
    "code": "B21",
    "levelSlug": "b2-1",
    "moduleNumber": 2,
    "title": "Evidence-based opinions",
    "communicativePurpose": "argue from evidence and respond to counterpoints",
    "grammarFocus": "Konjunktiv II review; connectors zwar/jedoch/dennoch; passive voice",
    "vocabularyFocus": "evidence, claim, counterargument, data, evaluation",
    "pronunciationFocus": "intonation for concession and contrast; pausing",
    "moduleEvidence": "write and discuss an evidence-based opinion",
    "moduleSlug": "evidence-based-opinions"
  },
  {
    "level": "B2.1",
    "code": "B21",
    "levelSlug": "b2-1",
    "moduleNumber": 3,
    "title": "Complex listening and note-taking",
    "communicativePurpose": "follow extended standard input and produce usable notes",
    "grammarFocus": "reported speech recognition; reference chains; discourse markers",
    "vocabularyFocus": "lectures, interviews, panels, key-point language",
    "pronunciationFocus": "listening for reductions; discourse-marker stress",
    "moduleEvidence": "take notes from an interview and summarize action points",
    "moduleSlug": "complex-listening-and-note-taking"
  },
  {
    "level": "B2.1",
    "code": "B21",
    "levelSlug": "b2-1",
    "moduleNumber": 4,
    "title": "Reading reports and expert articles",
    "communicativePurpose": "read dense factual texts and identify argument structure",
    "grammarFocus": "nominalizations; passive; relative clauses with prepositions",
    "vocabularyFocus": "reports, research summaries, policy, expert vocabulary",
    "pronunciationFocus": "reading aloud complex noun phrases; sentence grouping",
    "moduleEvidence": "annotate a report and extract the argument map",
    "moduleSlug": "reading-reports-and-expert-articles"
  },
  {
    "level": "B2.1",
    "code": "B21",
    "levelSlug": "b2-1",
    "moduleNumber": 5,
    "title": "Formal email and professional requests",
    "communicativePurpose": "write precise formal communication with register control",
    "grammarFocus": "subjunctive politeness; nominal phrases; cohesive reference",
    "vocabularyFocus": "formal requests, deadlines, attachments, negotiations",
    "pronunciationFocus": "formal intonation; compound stress",
    "moduleEvidence": "write a formal email negotiating conditions",
    "moduleSlug": "formal-email-and-professional-requests"
  },
  {
    "level": "B2.1",
    "code": "B21",
    "levelSlug": "b2-1",
    "moduleNumber": 6,
    "title": "Processes, systems, and explanations",
    "communicativePurpose": "explain processes and causal relationships clearly",
    "grammarFocus": "passive productive use; causal connectors; prepositional phrases",
    "vocabularyFocus": "processes, systems, stages, causes, effects, metrics",
    "pronunciationFocus": "chunking long explanations; technical compound stress",
    "moduleEvidence": "explain a process to a non-specialist",
    "moduleSlug": "processes-systems-and-explanations"
  },
  {
    "level": "B2.1",
    "code": "B21",
    "levelSlug": "b2-1",
    "moduleNumber": 7,
    "title": "Discussion strategy and turn management",
    "communicativePurpose": "manage discussion turns and build on others ideas",
    "grammarFocus": "modal particles recognition; ellipsis in speech; connector variety",
    "vocabularyFocus": "discussion moves, agreement, disagreement, clarification, synthesis",
    "pronunciationFocus": "turn-taking intonation; repair phrases",
    "moduleEvidence": "moderate a short discussion and summarize consensus",
    "moduleSlug": "discussion-strategy-and-turn-management"
  },
  {
    "level": "B2.1",
    "code": "B21",
    "levelSlug": "b2-1",
    "moduleNumber": 8,
    "title": "Data, trends, and visual description",
    "communicativePurpose": "describe charts and interpret trends",
    "grammarFocus": "comparatives; prepositions with data; passive/nominal style",
    "vocabularyFocus": "charts, trends, percentages, increase/decrease, interpretation",
    "pronunciationFocus": "numbers and percentages; contrastive stress",
    "moduleEvidence": "present a chart and explain two implications",
    "moduleSlug": "data-trends-and-visual-description"
  },
  {
    "level": "B2.1",
    "code": "B21",
    "levelSlug": "b2-1",
    "moduleNumber": 9,
    "title": "Problem proposals and recommendations",
    "communicativePurpose": "propose solutions with rationale and limitations",
    "grammarFocus": "conditional structures; concessive clauses; infinitive clauses",
    "vocabularyFocus": "problems, options, risks, benefits, recommendations",
    "pronunciationFocus": "rhetorical emphasis; sentence-final verbs",
    "moduleEvidence": "write a recommendation memo with options",
    "moduleSlug": "problem-proposals-and-recommendations"
  },
  {
    "level": "B2.1",
    "code": "B21",
    "levelSlug": "b2-1",
    "moduleNumber": 10,
    "title": "B2.1 integrated professional project",
    "communicativePurpose": "combine B2.1 language for evidence, reports, discussion, and recommendations",
    "grammarFocus": "review: passive, nominal style, concessive/causal connectors, conditionals, formal register",
    "vocabularyFocus": "professional profile, evidence, lectures, reports, email, systems, data, recommendations",
    "pronunciationFocus": "review: rhetorical stress, discourse markers, complex noun phrases",
    "moduleEvidence": "complete a professional briefing with notes, chart summary, discussion, and memo",
    "moduleSlug": "b2-1-integrated-professional-project"
  },
  {
    "level": "B2.2",
    "code": "B22",
    "levelSlug": "b2-2",
    "moduleNumber": 1,
    "title": "Nuanced stance and hedging",
    "communicativePurpose": "express nuanced stance and degrees of certainty",
    "grammarFocus": "modal verbs subjective use recognition; hedging adverbs; Konjunktiv II nuance",
    "vocabularyFocus": "certainty, probability, stance, limitation, nuance",
    "pronunciationFocus": "intonation for hedging; weak forms in fluent speech",
    "moduleEvidence": "state a nuanced position and qualify claims",
    "moduleSlug": "nuanced-stance-and-hedging"
  },
  {
    "level": "B2.2",
    "code": "B22",
    "levelSlug": "b2-2",
    "moduleNumber": 2,
    "title": "Negotiation and compromise",
    "communicativePurpose": "negotiate priorities and reach compromise",
    "grammarFocus": "conditional clauses; concessive connectors; indirect formulations",
    "vocabularyFocus": "negotiation, priorities, tradeoffs, compromise, conditions",
    "pronunciationFocus": "polite firmness; contrastive stress",
    "moduleEvidence": "negotiate a project decision and write agreement points",
    "moduleSlug": "negotiation-and-compromise"
  },
  {
    "level": "B2.2",
    "code": "B22",
    "levelSlug": "b2-2",
    "moduleNumber": 3,
    "title": "Synthesis from multiple sources",
    "communicativePurpose": "combine information from multiple sources coherently",
    "grammarFocus": "reported speech; nominalization; reference management",
    "vocabularyFocus": "source comparison, synthesis verbs, evidence quality, citations",
    "pronunciationFocus": "pausing in synthesized summaries; source-attribution rhythm",
    "moduleEvidence": "synthesize two texts and one audio source",
    "moduleSlug": "synthesis-from-multiple-sources"
  },
  {
    "level": "B2.2",
    "code": "B22",
    "levelSlug": "b2-2",
    "moduleNumber": 4,
    "title": "Specialized vocabulary building",
    "communicativePurpose": "infer, record, and use specialized vocabulary",
    "grammarFocus": "word formation; prefixes/suffixes; compound analysis",
    "vocabularyFocus": "discipline vocabulary, collocations, word families, register markers",
    "pronunciationFocus": "stress in derived words; loanword adaptation",
    "moduleEvidence": "build a specialized vocabulary map and use it in explanation",
    "moduleSlug": "specialized-vocabulary-building"
  },
  {
    "level": "B2.2",
    "code": "B22",
    "levelSlug": "b2-2",
    "moduleNumber": 5,
    "title": "Long-form argument writing",
    "communicativePurpose": "produce a coherent argumentative text with counterargument",
    "grammarFocus": "paragraph architecture; concessive clauses; cohesive devices",
    "vocabularyFocus": "argument, thesis, counterpoint, evidence, conclusion language",
    "pronunciationFocus": "reading draft for flow; sentence group stress",
    "moduleEvidence": "write a 300-350 word argument with rebuttal",
    "moduleSlug": "long-form-argument-writing"
  },
  {
    "level": "B2.2",
    "code": "B22",
    "levelSlug": "b2-2",
    "moduleNumber": 6,
    "title": "Professional presentations",
    "communicativePurpose": "deliver structured presentations with audience adaptation",
    "grammarFocus": "discourse markers; relative clauses; participial attributes recognition",
    "vocabularyFocus": "presentation structure, signposting, visuals, audience questions",
    "pronunciationFocus": "presentation prosody; emphasis and pauses",
    "moduleEvidence": "give a short presentation and handle questions",
    "moduleSlug": "professional-presentations"
  },
  {
    "level": "B2.2",
    "code": "B22",
    "levelSlug": "b2-2",
    "moduleNumber": 7,
    "title": "Complex service and institutional communication",
    "communicativePurpose": "manage complex requests with institutions or services",
    "grammarFocus": "formal passive; nominal style; subjunctive politeness",
    "vocabularyFocus": "contracts, institutions, requirements, evidence, escalation",
    "pronunciationFocus": "formal precision; dates and legalistic compounds",
    "moduleEvidence": "write and role-play a complex institutional request",
    "moduleSlug": "complex-service-and-institutional-communication"
  },
  {
    "level": "B2.2",
    "code": "B22",
    "levelSlug": "b2-2",
    "moduleNumber": 8,
    "title": "Intercultural pragmatics and register shifts",
    "communicativePurpose": "adapt tone across familiar, formal, and professional contexts",
    "grammarFocus": "register-sensitive word order; modal particles; politeness strategies",
    "vocabularyFocus": "register markers, softeners, directness, relationship language",
    "pronunciationFocus": "intonation shifts by register; pragmatic stress",
    "moduleEvidence": "rewrite the same message for three audiences",
    "moduleSlug": "intercultural-pragmatics-and-register-shifts"
  },
  {
    "level": "B2.2",
    "code": "B22",
    "levelSlug": "b2-2",
    "moduleNumber": 9,
    "title": "Critical media literacy",
    "communicativePurpose": "evaluate claims, bias, and source credibility",
    "grammarFocus": "reported claims; passive; modal language for uncertainty",
    "vocabularyFocus": "media bias, credibility, framing, evidence, fact-checking",
    "pronunciationFocus": "critical reading aloud; emphasis on source terms",
    "moduleEvidence": "evaluate a media claim and present credibility judgment",
    "moduleSlug": "critical-media-literacy"
  },
  {
    "level": "B2.2",
    "code": "B22",
    "levelSlug": "b2-2",
    "moduleNumber": 10,
    "title": "B2.2 integrated autonomy project",
    "communicativePurpose": "combine B2.2 language for negotiation, synthesis, presentation, and critical evaluation",
    "grammarFocus": "review: hedging, conditionals, reported speech, nominal style, register control",
    "vocabularyFocus": "stance, negotiation, sources, specialized vocabulary, presentations, institutions, media",
    "pronunciationFocus": "review: hedging intonation, presentation prosody, register shifts",
    "moduleEvidence": "complete an integrated B2 scenario with negotiation, source synthesis, presentation, and written argument",
    "moduleSlug": "b2-2-integrated-autonomy-project"
  },
  {
    "level": "C1.1",
    "code": "C11",
    "levelSlug": "c1-1",
    "moduleNumber": 1,
    "title": "Advanced discourse organization",
    "communicativePurpose": "structure complex spoken and written discourse strategically",
    "grammarFocus": "advanced connector systems; information structure; clefting recognition",
    "vocabularyFocus": "discourse moves, framing, transitions, meta-commentary",
    "pronunciationFocus": "prosodic paragraphing; emphasis and de-emphasis",
    "moduleEvidence": "reorganize a complex explanation for a specific audience",
    "moduleSlug": "advanced-discourse-organization"
  },
  {
    "level": "C1.1",
    "code": "C11",
    "levelSlug": "c1-1",
    "moduleNumber": 2,
    "title": "Academic argument and critique",
    "communicativePurpose": "critique arguments and build sophisticated claims",
    "grammarFocus": "nominal style; concessive/conditional complexity; stance markers",
    "vocabularyFocus": "critique, methodology, assumptions, implication, limitation",
    "pronunciationFocus": "intonation for critique; long noun phrase rhythm",
    "moduleEvidence": "write a critical response to an academic-style text",
    "moduleSlug": "academic-argument-and-critique"
  },
  {
    "level": "C1.1",
    "code": "C11",
    "levelSlug": "c1-1",
    "moduleNumber": 3,
    "title": "Policy and public debate",
    "communicativePurpose": "participate in public-topic debate with evidence and nuance",
    "grammarFocus": "passive alternatives; impersonal constructions; modal verbs subjective use",
    "vocabularyFocus": "policy, public interest, stakeholders, tradeoffs, feasibility",
    "pronunciationFocus": "debate prosody; strategic pausing",
    "moduleEvidence": "debate a policy option and summarize opposing views",
    "moduleSlug": "policy-and-public-debate"
  },
  {
    "level": "C1.1",
    "code": "C11",
    "levelSlug": "c1-1",
    "moduleNumber": 4,
    "title": "Advanced listening with implicit meaning",
    "communicativePurpose": "infer stance and implied meaning in complex audio",
    "grammarFocus": "ellipsis, pronoun reference, discourse particles, idiomatic chunks",
    "vocabularyFocus": "interviews, debate, irony, implication, stance clues",
    "pronunciationFocus": "fast-speech reductions; accent tolerance",
    "moduleEvidence": "produce annotated notes on speaker stance and implication",
    "moduleSlug": "advanced-listening-with-implicit-meaning"
  },
  {
    "level": "C1.1",
    "code": "C11",
    "levelSlug": "c1-1",
    "moduleNumber": 5,
    "title": "Genre-sensitive professional writing",
    "communicativePurpose": "write for genre, audience, and institutional expectations",
    "grammarFocus": "register-specific nominalization; passive/active choice; cohesive chains",
    "vocabularyFocus": "briefings, proposals, executive summaries, professional tone",
    "pronunciationFocus": "editing by reading aloud; rhythm of formal prose",
    "moduleEvidence": "produce a genre-appropriate professional briefing",
    "moduleSlug": "genre-sensitive-professional-writing"
  },
  {
    "level": "C1.1",
    "code": "C11",
    "levelSlug": "c1-1",
    "moduleNumber": 6,
    "title": "Mediation of complex information",
    "communicativePurpose": "mediate complex source material for a non-specialist audience",
    "grammarFocus": "reported speech; paraphrase structures; terminological precision",
    "vocabularyFocus": "complex concepts, definitions, simplification, caveats, examples",
    "pronunciationFocus": "clarity prosody; signposting in mediation",
    "moduleEvidence": "convert a specialist source into accessible guidance",
    "moduleSlug": "mediation-of-complex-information"
  },
  {
    "level": "C1.1",
    "code": "C11",
    "levelSlug": "c1-1",
    "moduleNumber": 7,
    "title": "Idiomatic and figurative language",
    "communicativePurpose": "understand and use idiomatic language selectively",
    "grammarFocus": "fixed expressions; metaphor patterns; pragmatic constraints",
    "vocabularyFocus": "idioms, metaphors, collocations, informal/formal equivalents",
    "pronunciationFocus": "intonation for idioms; stress in fixed expressions",
    "moduleEvidence": "interpret idioms in context and choose appropriate alternatives",
    "moduleSlug": "idiomatic-and-figurative-language"
  },
  {
    "level": "C1.1",
    "code": "C11",
    "levelSlug": "c1-1",
    "moduleNumber": 8,
    "title": "Research reading and source evaluation",
    "communicativePurpose": "evaluate dense texts for relevance, reliability, and argument quality",
    "grammarFocus": "nominalizations, participial constructions, embedded clauses",
    "vocabularyFocus": "research claims, evidence hierarchy, bias, validity, scope",
    "pronunciationFocus": "complex text chunking; source-term stress",
    "moduleEvidence": "build an annotated source matrix",
    "moduleSlug": "research-reading-and-source-evaluation"
  },
  {
    "level": "C1.1",
    "code": "C11",
    "levelSlug": "c1-1",
    "moduleNumber": 9,
    "title": "High-level interaction and facilitation",
    "communicativePurpose": "facilitate discussion and resolve complex communication problems",
    "grammarFocus": "repair formulations; indirect disagreement; conditional framing",
    "vocabularyFocus": "facilitation, conflict, consensus, clarification, action points",
    "pronunciationFocus": "facilitation prosody; neutral intonation",
    "moduleEvidence": "facilitate a problem-solving discussion and summarize outcomes",
    "moduleSlug": "high-level-interaction-and-facilitation"
  },
  {
    "level": "C1.1",
    "code": "C11",
    "levelSlug": "c1-1",
    "moduleNumber": 10,
    "title": "C1.1 integrated advanced project",
    "communicativePurpose": "combine C1.1 language for critique, debate, mediation, and professional writing",
    "grammarFocus": "review: discourse organization, nominal style, subjective modality, idiom control, embedded clauses",
    "vocabularyFocus": "academic critique, policy, implicit listening, professional writing, mediation, research, facilitation",
    "pronunciationFocus": "review: prosodic paragraphing, debate prosody, complex chunking",
    "moduleEvidence": "complete an advanced briefing with source evaluation, debate, mediation, and written recommendation",
    "moduleSlug": "c1-1-integrated-advanced-project"
  },
  {
    "level": "C1.2",
    "code": "C12",
    "levelSlug": "c1-2",
    "moduleNumber": 1,
    "title": "Rhetorical style and emphasis",
    "communicativePurpose": "shape emphasis, rhythm, and audience response deliberately",
    "grammarFocus": "fronting; inversion for emphasis; discourse particles; stylistic variation",
    "vocabularyFocus": "rhetoric, emphasis, nuance, audience adaptation, style labels",
    "pronunciationFocus": "rhetorical pacing; expressive stress",
    "moduleEvidence": "revise a message for stronger rhetorical effect",
    "moduleSlug": "rhetorical-style-and-emphasis"
  },
  {
    "level": "C1.2",
    "code": "C12",
    "levelSlug": "c1-2",
    "moduleNumber": 2,
    "title": "Advanced negotiation and diplomacy",
    "communicativePurpose": "manage disagreement diplomatically in complex situations",
    "grammarFocus": "indirectness strategies; conditionals; concession and mitigation",
    "vocabularyFocus": "diplomacy, disagreement, conditions, concessions, face-saving language",
    "pronunciationFocus": "diplomatic intonation; softening stress",
    "moduleEvidence": "negotiate a sensitive decision and preserve relationship tone",
    "moduleSlug": "advanced-negotiation-and-diplomacy"
  },
  {
    "level": "C1.2",
    "code": "C12",
    "levelSlug": "c1-2",
    "moduleNumber": 3,
    "title": "Dense academic and technical prose",
    "communicativePurpose": "unpack and restate dense academic or technical prose",
    "grammarFocus": "participial attributes; nominal chains; embedded clauses",
    "vocabularyFocus": "technical terms, abstraction, methodology, constraints, implications",
    "pronunciationFocus": "chunking dense prose; term stress",
    "moduleEvidence": "convert dense prose into accessible explanation",
    "moduleSlug": "dense-academic-and-technical-prose"
  },
  {
    "level": "C1.2",
    "code": "C12",
    "levelSlug": "c1-2",
    "moduleNumber": 4,
    "title": "Stylistic editing and revision",
    "communicativePurpose": "edit texts for precision, coherence, and register",
    "grammarFocus": "cohesion chains; substitution; ellipsis; parallelism",
    "vocabularyFocus": "editing vocabulary, precision verbs, register shifts, coherence markers",
    "pronunciationFocus": "read-aloud revision; flow diagnostics",
    "moduleEvidence": "revise a draft for clarity and register",
    "moduleSlug": "stylistic-editing-and-revision"
  },
  {
    "level": "C1.2",
    "code": "C12",
    "levelSlug": "c1-2",
    "moduleNumber": 5,
    "title": "Leadership communication",
    "communicativePurpose": "communicate strategy, change, and feedback professionally",
    "grammarFocus": "modal nuance; passive/active responsibility; nominal style",
    "vocabularyFocus": "strategy, feedback, change, risk, motivation, accountability",
    "pronunciationFocus": "leadership prosody; controlled emphasis",
    "moduleEvidence": "deliver a strategy update and answer critical questions",
    "moduleSlug": "leadership-communication"
  },
  {
    "level": "C1.2",
    "code": "C12",
    "levelSlug": "c1-2",
    "moduleNumber": 6,
    "title": "Literary and cultural interpretation",
    "communicativePurpose": "interpret style, perspective, and cultural references",
    "grammarFocus": "narrative perspective; metaphor; modality in literary contexts",
    "vocabularyFocus": "literary terms, cultural references, symbolism, interpretation",
    "pronunciationFocus": "expressive reading; intonation for quoted text",
    "moduleEvidence": "interpret a short literary or cultural text",
    "moduleSlug": "literary-and-cultural-interpretation"
  },
  {
    "level": "C1.2",
    "code": "C12",
    "levelSlug": "c1-2",
    "moduleNumber": 7,
    "title": "Advanced media and discourse analysis",
    "communicativePurpose": "analyze framing, ideology, and discourse strategies",
    "grammarFocus": "agentless passive; nominalizations; evaluative language",
    "vocabularyFocus": "framing, ideology, discourse, narrative, persuasion",
    "pronunciationFocus": "emphasis on evaluative terms; critical prosody",
    "moduleEvidence": "present a discourse analysis of a media excerpt",
    "moduleSlug": "advanced-media-and-discourse-analysis"
  },
  {
    "level": "C1.2",
    "code": "C12",
    "levelSlug": "c1-2",
    "moduleNumber": 8,
    "title": "Expert mediation across registers",
    "communicativePurpose": "mediate complex information across expert, public, and interpersonal registers",
    "grammarFocus": "paraphrase families; condensation; register transformation",
    "vocabularyFocus": "expert terms, public explanation, interpersonal framing, caveats",
    "pronunciationFocus": "register-shift prosody; clarity in condensation",
    "moduleEvidence": "produce three register-specific versions of one source",
    "moduleSlug": "expert-mediation-across-registers"
  },
  {
    "level": "C1.2",
    "code": "C12",
    "levelSlug": "c1-2",
    "moduleNumber": 9,
    "title": "High-stakes writing portfolio",
    "communicativePurpose": "produce polished texts for high-stakes contexts",
    "grammarFocus": "genre conventions; advanced cohesion; stylistic accuracy",
    "vocabularyFocus": "applications, proposals, statements, executive summaries, cover notes",
    "pronunciationFocus": "editing rhythm; formal stress patterns",
    "moduleEvidence": "assemble and defend a high-stakes writing portfolio item",
    "moduleSlug": "high-stakes-writing-portfolio"
  },
  {
    "level": "C1.2",
    "code": "C12",
    "levelSlug": "c1-2",
    "moduleNumber": 10,
    "title": "C1.2 integrated fluency project",
    "communicativePurpose": "combine C1.2 language for rhetoric, diplomacy, dense prose, and high-stakes writing",
    "grammarFocus": "review: fronting, mitigation, participial attributes, cohesion, discourse analysis, register transformation",
    "vocabularyFocus": "rhetoric, negotiation, technical prose, editing, leadership, culture, media, mediation, portfolio",
    "pronunciationFocus": "review: rhetorical pacing, diplomatic intonation, register-shift prosody",
    "moduleEvidence": "complete a C1 capstone with discourse analysis, mediation, negotiation, and polished writing",
    "moduleSlug": "c1-2-integrated-fluency-project"
  },
  {
    "level": "C2.1",
    "code": "C21",
    "levelSlug": "c2-1",
    "moduleNumber": 1,
    "title": "Subtle stance and implicature",
    "communicativePurpose": "interpret and express subtle stance, implication, and subtext",
    "grammarFocus": "pragmatic modality; ellipsis; discourse particles; marked word order",
    "vocabularyFocus": "subtext, implication, irony, stance, evaluative nuance",
    "pronunciationFocus": "micro-intonation for implication; fast-speech decoding",
    "moduleEvidence": "identify subtext and respond with calibrated stance",
    "moduleSlug": "subtle-stance-and-implicature"
  },
  {
    "level": "C2.1",
    "code": "C21",
    "levelSlug": "c2-1",
    "moduleNumber": 2,
    "title": "Expert synthesis and compression",
    "communicativePurpose": "compress complex source sets without losing nuance",
    "grammarFocus": "advanced nominalization; condensation; reference chains",
    "vocabularyFocus": "synthesis, abstraction, prioritization, source hierarchy, caveats",
    "pronunciationFocus": "dense summary prosody; precision pausing",
    "moduleEvidence": "produce an executive synthesis from demanding sources",
    "moduleSlug": "expert-synthesis-and-compression"
  },
  {
    "level": "C2.1",
    "code": "C21",
    "levelSlug": "c2-1",
    "moduleNumber": 3,
    "title": "Specialized professional domains",
    "communicativePurpose": "operate in unfamiliar specialized domains through disciplined language strategies",
    "grammarFocus": "terminology management; definition structures; hedging and certainty scales",
    "vocabularyFocus": "specialized terminology, definitions, domain constraints, risk",
    "pronunciationFocus": "specialist term stress; loanword precision",
    "moduleEvidence": "brief a non-specialist on an unfamiliar domain",
    "moduleSlug": "specialized-professional-domains"
  },
  {
    "level": "C2.1",
    "code": "C21",
    "levelSlug": "c2-1",
    "moduleNumber": 4,
    "title": "Legal, administrative, and institutional nuance",
    "communicativePurpose": "interpret institutional language and respond appropriately",
    "grammarFocus": "legalistic nominal style; passive; obligation/permission modality",
    "vocabularyFocus": "institutional terms, obligations, exemptions, deadlines, evidence",
    "pronunciationFocus": "formal legalistic rhythm; number/date precision",
    "moduleEvidence": "explain institutional requirements and draft a response",
    "moduleSlug": "legal-administrative-and-institutional-nuance"
  },
  {
    "level": "C2.1",
    "code": "C21",
    "levelSlug": "c2-1",
    "moduleNumber": 5,
    "title": "Crisis and high-pressure communication",
    "communicativePurpose": "communicate clearly under time pressure and uncertainty",
    "grammarFocus": "imperatives/mitigation balance; concise conditionals; responsibility framing",
    "vocabularyFocus": "crisis, uncertainty, priorities, instructions, escalation, risk",
    "pronunciationFocus": "calm prosody; concise delivery",
    "moduleEvidence": "deliver a concise crisis update and action plan",
    "moduleSlug": "crisis-and-high-pressure-communication"
  },
  {
    "level": "C2.1",
    "code": "C21",
    "levelSlug": "c2-1",
    "moduleNumber": 6,
    "title": "Advanced interpreting-style mediation",
    "communicativePurpose": "mediate spoken and written meaning with high fidelity",
    "grammarFocus": "reported speech accuracy; paraphrase under constraint; discourse compression",
    "vocabularyFocus": "interpreting moves, fidelity, omission risk, clarification, summary",
    "pronunciationFocus": "memory chunking; clear relay delivery",
    "moduleEvidence": "mediate a complex spoken exchange into concise notes",
    "moduleSlug": "advanced-interpreting-style-mediation"
  },
  {
    "level": "C2.1",
    "code": "C21",
    "levelSlug": "c2-1",
    "moduleNumber": 7,
    "title": "Critical review and peer feedback",
    "communicativePurpose": "give precise expert feedback without losing interpersonal appropriateness",
    "grammarFocus": "evaluation language; mitigation; contrastive structures",
    "vocabularyFocus": "peer review, criteria, strengths, weaknesses, revision priorities",
    "pronunciationFocus": "feedback intonation; respectful emphasis",
    "moduleEvidence": "provide detailed peer feedback and justify priorities",
    "moduleSlug": "critical-review-and-peer-feedback"
  },
  {
    "level": "C2.1",
    "code": "C21",
    "levelSlug": "c2-1",
    "moduleNumber": 8,
    "title": "Public speaking and debate mastery",
    "communicativePurpose": "speak persuasively in demanding public formats",
    "grammarFocus": "rhetorical question structures; parallelism; concession and refutation",
    "vocabularyFocus": "public speaking, debate, rebuttal, audience engagement, framing",
    "pronunciationFocus": "speech prosody; rhetorical pauses",
    "moduleEvidence": "deliver a persuasive speech and respond to challenges",
    "moduleSlug": "public-speaking-and-debate-mastery"
  },
  {
    "level": "C2.1",
    "code": "C21",
    "levelSlug": "c2-1",
    "moduleNumber": 9,
    "title": "Stylistic range and voice",
    "communicativePurpose": "shift voice and style across genres deliberately",
    "grammarFocus": "register transformation; metaphor control; syntactic variation",
    "vocabularyFocus": "voice, tone, genre, style labels, expressive choices",
    "pronunciationFocus": "voice-specific prosody; rhythm variation",
    "moduleEvidence": "rewrite one message in four distinct styles",
    "moduleSlug": "stylistic-range-and-voice"
  },
  {
    "level": "C2.1",
    "code": "C21",
    "levelSlug": "c2-1",
    "moduleNumber": 10,
    "title": "C2.1 integrated expert project",
    "communicativePurpose": "combine C2.1 language for implicature, synthesis, institutional nuance, and public performance",
    "grammarFocus": "review: marked word order, condensation, legalistic nominal style, crisis framing, rhetorical structures",
    "vocabularyFocus": "implicature, synthesis, specialized domains, institutions, crisis, mediation, feedback, debate, style",
    "pronunciationFocus": "review: micro-intonation, dense summary prosody, public speech prosody",
    "moduleEvidence": "complete an expert scenario with synthesis, institutional response, crisis briefing, and public defense",
    "moduleSlug": "c2-1-integrated-expert-project"
  },
  {
    "level": "C2.2",
    "code": "C22",
    "levelSlug": "c2-2",
    "moduleNumber": 1,
    "title": "Mastery of nuance and ambiguity",
    "communicativePurpose": "handle ambiguity, double meaning, and layered intent with precision",
    "grammarFocus": "full-system review through pragmatic effect; ambiguity management",
    "vocabularyFocus": "ambiguity, layered meaning, double reading, stance, implication",
    "pronunciationFocus": "fine-grained intonation; ambiguity signaling",
    "moduleEvidence": "interpret ambiguous input and craft an exact response",
    "moduleSlug": "mastery-of-nuance-and-ambiguity"
  },
  {
    "level": "C2.2",
    "code": "C22",
    "levelSlug": "c2-2",
    "moduleNumber": 2,
    "title": "Expert critique and intellectual debate",
    "communicativePurpose": "conduct expert critique and defend positions under pressure",
    "grammarFocus": "advanced argument architecture; refutation; epistemic modality",
    "vocabularyFocus": "critique, epistemology, counterfactuals, assumptions, intellectual stance",
    "pronunciationFocus": "debate stress under pressure; timing and pauses",
    "moduleEvidence": "defend a sophisticated position in expert discussion",
    "moduleSlug": "expert-critique-and-intellectual-debate"
  },
  {
    "level": "C2.2",
    "code": "C22",
    "levelSlug": "c2-2",
    "moduleNumber": 3,
    "title": "Translation-aware mediation",
    "communicativePurpose": "mediate meaning across languages and cultures without literalism",
    "grammarFocus": "semantic equivalence; register transformation; cultural adaptation",
    "vocabularyFocus": "translation choices, equivalence, loss, compensation, cultural framing",
    "pronunciationFocus": "prosody for clarified meaning; source-target contrast",
    "moduleEvidence": "produce a translation-aware mediation note",
    "moduleSlug": "translation-aware-mediation"
  },
  {
    "level": "C2.2",
    "code": "C22",
    "levelSlug": "c2-2",
    "moduleNumber": 4,
    "title": "Editorial and publishing standards",
    "communicativePurpose": "edit and polish texts to publishable quality",
    "grammarFocus": "advanced cohesion; stylistic economy; punctuation and rhythm choices",
    "vocabularyFocus": "editorial standards, style guide, consistency, concision, voice",
    "pronunciationFocus": "read-aloud copyediting; cadence control",
    "moduleEvidence": "edit a text to publication standard and explain choices",
    "moduleSlug": "editorial-and-publishing-standards"
  },
  {
    "level": "C2.2",
    "code": "C22",
    "levelSlug": "c2-2",
    "moduleNumber": 5,
    "title": "Humor, irony, and rhetorical play",
    "communicativePurpose": "understand and selectively use humor, irony, and rhetorical play",
    "grammarFocus": "irony markers; double syntax; pragmatic risk management",
    "vocabularyFocus": "humor, irony, understatement, allusion, rhetorical play",
    "pronunciationFocus": "comic timing; ironic intonation",
    "moduleEvidence": "explain rhetorical effect and create an appropriate variant",
    "moduleSlug": "humor-irony-and-rhetorical-play"
  },
  {
    "level": "C2.2",
    "code": "C22",
    "levelSlug": "c2-2",
    "moduleNumber": 6,
    "title": "Strategic leadership and conflict language",
    "communicativePurpose": "manage conflict, trust, and strategy at executive level",
    "grammarFocus": "framing choices; accountability language; diplomatic ambiguity",
    "vocabularyFocus": "strategy, conflict, trust, accountability, escalation, alignment",
    "pronunciationFocus": "executive calm; stance control",
    "moduleEvidence": "lead a conflict-resolution briefing with nuanced follow-up",
    "moduleSlug": "strategic-leadership-and-conflict-language"
  },
  {
    "level": "C2.2",
    "code": "C22",
    "levelSlug": "c2-2",
    "moduleNumber": 7,
    "title": "Advanced cultural literacy",
    "communicativePurpose": "interpret culturally dense references and communicative norms",
    "grammarFocus": "intertextual reference; register and identity markers; discourse history",
    "vocabularyFocus": "cultural references, historical context, identity, norms, allusion",
    "pronunciationFocus": "quoted speech prosody; reference emphasis",
    "moduleEvidence": "explain a culturally dense text to a non-specialist",
    "moduleSlug": "advanced-cultural-literacy"
  },
  {
    "level": "C2.2",
    "code": "C22",
    "levelSlug": "c2-2",
    "moduleNumber": 8,
    "title": "Expert oral performance portfolio",
    "communicativePurpose": "perform demanding oral tasks with polish and spontaneity",
    "grammarFocus": "full spoken grammar control; repair without loss of flow; rhetorical syntax",
    "vocabularyFocus": "oral portfolio, spontaneous response, moderation, Q&A, persuasion",
    "pronunciationFocus": "voice control, pacing, stress, spontaneous repair",
    "moduleEvidence": "complete an oral portfolio task with live follow-up",
    "moduleSlug": "expert-oral-performance-portfolio"
  },
  {
    "level": "C2.2",
    "code": "C22",
    "levelSlug": "c2-2",
    "moduleNumber": 9,
    "title": "Expert written portfolio",
    "communicativePurpose": "produce a polished cross-genre written portfolio",
    "grammarFocus": "full written grammar control; advanced genre conventions; precision editing",
    "vocabularyFocus": "portfolio genres, publication, policy, critique, executive summary",
    "pronunciationFocus": "editing by cadence; punctuation rhythm",
    "moduleEvidence": "submit and defend a polished written portfolio item",
    "moduleSlug": "expert-written-portfolio"
  },
  {
    "level": "C2.2",
    "code": "C22",
    "levelSlug": "c2-2",
    "moduleNumber": 10,
    "title": "C2.2 final integrated mastery assessment",
    "communicativePurpose": "demonstrate expert-level control across all major communicative modes",
    "grammarFocus": "review: full grammar system for rhetorical, pragmatic, and stylistic control",
    "vocabularyFocus": "all major vocabulary domains with idiom, register, and specialized terminology",
    "pronunciationFocus": "review: full pronunciation system for clarity, nuance, and performance",
    "moduleEvidence": "complete the final integrated mastery scenario with synthesis, mediation, oral defense, and publishable writing",
    "moduleSlug": "c2-2-final-integrated-mastery-assessment"
  }
] as const;

export function germanLessonIdentifier(levelCode: GermanLevelCode, moduleNumber: number, unitNumber: GermanUnitNumber): string {
  return `DE-${levelCode}-M${moduleNumber.toString().padStart(2, "0")}-S${unitNumber.toString().padStart(2, "0")}`;
}

export function germanLessonDefinitionsForModule(module: GermanCurriculumModule): readonly GermanCurriculumLessonDefinition[] {
  return germanUnitTemplates.map((unit) => germanLessonDefinition(module, unit));
}

export function findGermanCurriculumLesson(identifier: string): GermanCurriculumLessonDefinition | null {
  const match = /^DE-([ABC]\d{2})-M(\d{2})-S(\d{2})$/u.exec(identifier);

  if (match === null) {
    return null;
  }

  const levelCode = match[1] as GermanLevelCode;
  const moduleNumber = Number(match[2]);
  const unitNumber = Number(match[3]) as GermanUnitNumber;
  const module = germanCurriculumModules.find(
    (candidate) => candidate.code === levelCode && candidate.moduleNumber === moduleNumber
  );
  const unit = germanUnitTemplates.find((candidate) => candidate.unitNumber === unitNumber);

  if (module === undefined || unit === undefined) {
    return null;
  }

  return germanLessonDefinition(module, unit);
}

function germanLessonDefinition(
  module: GermanCurriculumModule,
  unit: GermanUnitTemplate
): GermanCurriculumLessonDefinition {
  const identifier = germanLessonIdentifier(module.code, module.moduleNumber, unit.unitNumber);
  const title = `${module.level} Module ${module.moduleNumber} Session ${unit.unitNumber}: ${module.title} - ${unit.title}`;

  return {
    module,
    unit,
    identifier,
    title,
    objective: objectiveForUnit(module, unit),
    evidence: evidenceForUnit(module, unit),
    tags: [
      module.levelSlug,
      `m${module.moduleNumber.toString().padStart(2, "0")}`,
      module.moduleSlug,
      unit.competency,
      assessmentTagForModule(module)
    ]
  };
}

function objectiveForUnit(module: GermanCurriculumModule, unit: GermanUnitTemplate): string {
  switch (unit.unitNumber) {
    case 1:
      return `Recognize and use core phrases for ${module.communicativePurpose}`;
    case 2:
      return `Use ${module.grammarFocus} in controlled German sentences for ${module.communicativePurpose}`;
    case 3:
      return `Extract useful listening and reading details about ${module.communicativePurpose} and report them accurately`;
    case 4:
      return `Handle guided speaking, writing, and interaction that prepares ${module.moduleEvidence}`;
    case 5:
      return `Complete the integrated module task: ${module.moduleEvidence}`;
  }
}

function evidenceForUnit(module: GermanCurriculumModule, unit: GermanUnitTemplate): string {
  switch (unit.unitNumber) {
    case 1:
      return `Phrase bank, listening notes, and five original German sentences for ${module.communicativePurpose}`;
    case 2:
      return `Corrected grammar answers and a short paragraph using ${module.grammarFocus}`;
    case 3:
      return "Completed listening detail table, reading answers, pronunciation notes, and mediation summary";
    case 4:
      return "Partner or self-study role-play, supporting written text, and success-criteria self-review";
    case 5:
      return `Final task evidence for ${module.moduleEvidence}, including answer checks and reflection`;
  }
}

function assessmentTagForModule(module: GermanCurriculumModule): string {
  if (module.moduleSlug.startsWith(`${module.levelSlug}-`)) {
    return module.moduleSlug;
  }

  return `${module.levelSlug}-${module.moduleSlug}`;
}
