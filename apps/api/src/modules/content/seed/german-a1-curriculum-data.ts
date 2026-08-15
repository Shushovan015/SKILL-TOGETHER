import type { GermanCurriculumModule } from "./german-curriculum-data.js";

type A1ModuleInput = Omit<GermanCurriculumModule, "code" | "levelSlug" | "moduleSlug">;

const a11Modules: readonly A1ModuleInput[] = [
  module("A1.1", 1, "First meetings and names", "start and close a first meeting, exchange names, and choose du or Sie", "sein with ich/du/Sie; heissen; statements and W-questions", "greetings, names, countries, and polite formulae", "alphabet; h in heissen; ie in Sie", "hold a first-meeting dialogue with greeting, name, origin, and goodbye"),
  module("A1.1", 2, "Spelling, classroom language, and repair", "spell names, ask for repetition, and use classroom instructions", "imperatives as chunks; bitte; Wie bitte; buchstabieren", "letters, classroom objects, learning verbs, and repair phrases", "German alphabet; sch/sp/st; final consonants", "clarify spelling and complete a class registration card"),
  module("A1.1", 3, "Numbers, countries, and languages", "give numbers, countries, languages, and simple contact details", "kommen aus; sprechen; yes/no questions; nicht", "numbers 0-100, countries, languages, phone and email words", "zwei/drei; ich sound; country word stress", "exchange a phone number, country, and languages spoken"),
  module("A1.1", 4, "People and personal profiles", "ask and answer basic profile questions about identity and location", "regular present-tense verbs; W-questions; verb-second word order", "jobs, cities, age, address, and profile fields", "question melody; long and short vowels", "complete and present a simple learner profile"),
  module("A1.1", 5, "Family, friends, and possession", "describe close people and relationships simply", "mein/dein; haben; gender with der/die/das", "family, friends, relationships, and basic traits", "e/ae contrast; family-word stress", "introduce two people and state their relationships"),
  module("A1.1", 6, "Daily routine and time", "state times and describe a basic day", "present tense; time adverb placement; um/am", "clock time, weekdays, routine verbs, and frequency", "u/ue contrast; rhythm in time expressions", "describe today and tomorrow with three routine actions"),
  module("A1.1", 7, "Food, drinks, and preferences", "order simple food and express likes, dislikes, and quantities", "moechte; gern/nicht gern; accusative noticing", "food, drinks, menu language, and quantities", "oe sound; preference sentence stress", "order a snack and answer preference questions"),
  module("A1.1", 8, "Shopping, prices, and basic requests", "ask for items, prices, and quantities in a shop", "haben/moechten; kein; plural noticing", "shops, items, colors, prices, and payment", "eu/ei contrast; prices", "complete a small purchase with price confirmation"),
  module("A1.1", 9, "Around town and simple directions", "name places and ask where something is", "es gibt; prepositions in chunks; wo/wohin noticing", "town places, directions, transport, and landmarks", "ich/ach contrast; compound stress", "ask for a place and follow a simple direction"),
  module("A1.1", 10, "A1.1 integrated survival project", "combine A1.1 language for a first day in a German-speaking setting", "review sein, haben, present tense, questions, and moechte", "personal details, classroom, routine, food, shopping, and town", "vowel length, question melody, sch/sp/st, and ch", "complete a first-day scenario with profile, directions, purchase, and short message")
];

const a12Modules: readonly A1ModuleInput[] = [
  module("A1.2", 1, "Everyday schedules and obligations", "describe a normal week and simple obligations", "muessen/koennen; separable verbs; time phrases", "weekly schedules, chores, study, work, and frequency", "separable-verb stress; time-phrase rhythm", "explain a weekly schedule and one obligation"),
  module("A1.2", 2, "Home, rooms, and household objects", "describe a home and locate objects", "articles; local prepositions in chunks; kein", "rooms, furniture, household objects, and location", "r sounds; household compound nouns", "give a short room tour and locate items"),
  module("A1.2", 3, "Shopping for daily life", "compare simple products and ask for help in a store", "accusative articles; plurals; demonstrative chunks", "clothes, household items, sizes, colors, and materials", "ich/ach review; contrastive choice stress", "ask for a product, size, and price"),
  module("A1.2", 4, "Food planning and invitations", "plan a simple meal and invite someone", "moechten; gern/lieber/am liebsten; und/aber/denn", "meals, ingredients, invitations, acceptance, and refusal", "oe/ue review; invitation intonation", "invite someone and agree on a meal plan"),
  module("A1.2", 5, "Appointments and calendar changes", "make, confirm, and change a simple appointment", "koennen/muessen; time prepositions; sentence-final infinitive", "calendar, dates, appointments, and availability", "month stress; polite intonation", "arrange and reschedule an appointment by message"),
  module("A1.2", 6, "City errands and services", "complete routine errands in town", "dative in fixed phrases; zu/bei/nach", "bank, post office, pharmacy, offices, and services", "compound boundaries; final devoicing", "ask for a service and follow basic instructions"),
  module("A1.2", 7, "Free time and simple opinions", "talk about leisure activities and reasons", "present tense; gern/lieber; denn and weil noticing", "hobbies, sports, media, places, and opinion adjectives", "opinion sentence stress; vowel length", "choose a leisure plan and give one reason"),
  module("A1.2", 8, "Health and wellbeing basics", "describe simple symptoms and ask for help", "haben/sein with symptoms; imperative chunks; seit", "body parts, symptoms, remedies, and pharmacy phrases", "z/ts; symptom-word stress", "describe symptoms and understand basic advice"),
  module("A1.2", 9, "Short messages and everyday notices", "understand and write practical short messages", "short-clause word order; modal chunks; negation", "message openings, notices, confirmations, and apologies", "sentence groups; polite formulae", "write a message to confirm, apologize, or ask"),
  module("A1.2", 10, "A1.2 integrated daily-life project", "combine A1.2 language for a week of daily-life tasks", "review modals, accusative, time phrases, connectors, and prepositions", "home, shopping, food, appointments, city, health, and messages", "compounds, polite intonation, and vowel contrasts", "complete a weekly plan with errands, invitation, appointment change, and message")
];

export const germanA1CurriculumModules: readonly GermanCurriculumModule[] = [
  ...materialize("A11", "a1-1", a11Modules),
  ...materialize("A12", "a1-2", a12Modules)
];

function module(
  level: "A1.1" | "A1.2",
  moduleNumber: number,
  title: string,
  communicativePurpose: string,
  grammarFocus: string,
  vocabularyFocus: string,
  pronunciationFocus: string,
  moduleEvidence: string
): A1ModuleInput {
  return { level, moduleNumber, title, communicativePurpose, grammarFocus, vocabularyFocus, pronunciationFocus, moduleEvidence };
}

function materialize(
  code: "A11" | "A12",
  levelSlug: "a1-1" | "a1-2",
  modules: readonly A1ModuleInput[]
): readonly GermanCurriculumModule[] {
  return modules.map((item) => ({
    ...item,
    code,
    levelSlug,
    moduleSlug: `${levelSlug}-${slugify(item.title)}`
  }));
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "");
}
