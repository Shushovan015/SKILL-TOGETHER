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
  "A1.2": "A1.1",
  "A2.1": "A1.2",
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
  ...germanCurriculumModules.map((module, index) => detailedGermanModule(index + 1, module))
];

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
  if (definition.module.level === "A1.1" && definition.module.moduleNumber === 1 && definition.unit.unitNumber === 1) {
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
