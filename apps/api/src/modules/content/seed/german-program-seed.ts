import {
  germanCurriculumModules,
  germanLessonDefinitionsForModule,
  germanLessonIdentifier,
  type GermanCurriculumLessonDefinition,
  type GermanCurriculumModule,
  type GermanImplementedLevel
} from "./german-curriculum-data.js";
import type { SeedLessonDefinition, SeedModuleDefinition } from "./phase-03-seed-data.js";

const germanLevelPredecessors: Partial<Record<GermanImplementedLevel, GermanImplementedLevel>> = {
  "A2.2": "A2.1",
  "B1.1": "A2.2",
  "B1.2": "B1.1",
  "B2.1": "B1.2",
  "B2.2": "B2.1",
  "C1.1": "B2.2",
  "C1.2": "C1.1",
  "C2.1": "C1.2",
  "C2.2": "C2.1"
};

export const germanProgramModules: readonly SeedModuleDefinition[] = [
  levelModule(
    1,
    "A1.1",
    "First Contact and Personal Information",
    "Complete beginner foundation: greetings, introductions, spelling, numbers, origin, basic sentence patterns, pronunciation habits, and short controlled exchanges.",
    [
      germanProofSliceLesson(
        "DE-A11-M01-S01",
        "A1.1 Module 1 Session 1: Greetings, Names, and First Introductions",
        "Greet someone, give your name, ask for a name informally and formally, and notice the basic ich/du/Sie distinction.",
        [],
        "A short written dialogue, a personal introduction, and a pronunciation self-check.",
        ["a1-1", "m01", "greetings", "introductions", "du-sie", "pronunciation"]
      ),
      germanProofSliceLesson(
        "DE-A11-M01-S02",
        "A1.1 Module 1 Session 2: Alphabet, Spelling, and Repair Phrases",
        "Spell names, recognize key German letter sounds, and ask someone to repeat or spell information politely.",
        ["DE-A11-M01-S01"],
        "A spelling practice sheet, a short name dialogue, and repair-phrase notes.",
        ["a1-1", "m01", "alphabet", "spelling", "repair-phrases", "pronunciation"]
      ),
      germanProofSliceLesson(
        "DE-A11-M01-S03",
        "A1.1 Module 1 Session 3: Numbers, Countries, Languages, and Mini Profiles",
        "Use numbers, countries, languages, and simple origin patterns to create a short personal profile.",
        ["DE-A11-M01-S02"],
        "Number answers, country-language sentences, and a six-line profile.",
        ["a1-1", "m01", "numbers", "countries", "languages", "personal-information"]
      )
    ]
  ),
  levelModule(
    2,
    "A1.2",
    "Everyday Routines and Practical Needs",
    "Routine, time, home, food, shopping, places, simple needs, modal verbs, separable verbs, accusative/dative foundations, short messages, and controlled practical dialogues."
  ),
  ...germanCurriculumModules.map((module, index) => detailedGermanModule(index + 3, module))
];

function levelModule(
  sequence: number,
  level: string,
  title: string,
  summary: string,
  lessons: readonly SeedLessonDefinition[] = []
): SeedModuleDefinition {
  return {
    sequence,
    title: `${level} - ${title}`,
    summary,
    lessons
  };
}

function detailedGermanModule(sequence: number, module: GermanCurriculumModule): SeedModuleDefinition {
  return {
    sequence,
    title: `${module.level} Module ${module.moduleNumber.toString().padStart(2, "0")} - ${module.title}`,
    summary: [
      `Purpose: ${module.communicativePurpose}.`,
      `Grammar: ${module.grammarFocus}.`,
      `Vocabulary: ${module.vocabularyFocus}.`,
      `Pronunciation: ${module.pronunciationFocus}.`,
      `Evidence: ${module.moduleEvidence}.`
    ].join(" "),
    lessons: germanLessonDefinitionsForModule(module).map(detailedGermanLesson)
  };
}

function detailedGermanLesson(definition: GermanCurriculumLessonDefinition): SeedLessonDefinition {
  return {
    identifier: definition.identifier,
    title: definition.title,
    objective: definition.objective,
    prerequisites: prerequisitesFor(definition),
    durationMinutes: definition.unit.durationMinutes,
    level: definition.module.level,
    required: true,
    evidence: definition.evidence,
    tags: definition.tags
  };
}

function prerequisitesFor(definition: GermanCurriculumLessonDefinition): readonly string[] {
  if (definition.module.level === "A2.1" && definition.module.moduleNumber === 1 && definition.unit.unitNumber === 1) {
    return [];
  }

  if (definition.unit.unitNumber > 1) {
    return [
      germanLessonIdentifier(
        definition.module.code,
        definition.module.moduleNumber,
        (definition.unit.unitNumber - 1) as 1 | 2 | 3 | 4 | 5
      )
    ];
  }

  if (definition.module.moduleNumber > 1) {
    return [germanLessonIdentifier(definition.module.code, definition.module.moduleNumber - 1, 5)];
  }

  const predecessor = germanLevelPredecessors[definition.module.level];

  if (predecessor === undefined) {
    return [];
  }

  const predecessorModule = germanCurriculumModules.find(
    (module) => module.level === predecessor && module.moduleNumber === 10
  );

  return predecessorModule === undefined ? [] : [germanLessonIdentifier(predecessorModule.code, 10, 5)];
}

function germanProofSliceLesson(
  identifier: string,
  title: string,
  objective: string,
  prerequisites: readonly string[],
  evidence: string,
  tags: readonly string[]
): SeedLessonDefinition {
  return {
    identifier,
    title,
    objective,
    prerequisites,
    durationMinutes: 60,
    level: title.slice(0, 4),
    required: true,
    evidence,
    tags
  };
}
