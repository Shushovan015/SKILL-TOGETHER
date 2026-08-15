import { describe, expect, it } from "vitest";

import { validateLessonVersionEditorInput } from "../domain/content.validation.js";
import type { LessonVersionEditorInput } from "../domain/content.types.js";
import { buildApprovedSeedVersionInput, phase3SeedTracks, type SeedLessonDefinition } from "./phase-03-seed-data.js";
import { softwareEngineeringCareerProgramStats } from "./professional-program-seed.js";

const selectableGermanLevels = [
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

const implementedGermanLevels = [
  ["A1.1", "A11"],
  ["A1.2", "A12"],
  ["A2.1", "A21"],
  ["A2.2", "A22"],
  ["B1.1", "B11"],
  ["B1.2", "B12"],
  ["B2.1", "B21"],
  ["B2.2", "B22"],
  ["C1.1", "C11"],
  ["C1.2", "C12"],
  ["C2.1", "C21"],
  ["C2.2", "C22"]
] as const;

const blockedPlaceholderPhrases = [
  "Practice the target grammar",
  "Apply the concept",
  "Complete an exercise",
  "Review this material",
  "Produce the evidence",
  "Complete the target scenario",
  "Use the target language",
  "Professional relevance",
  "Curriculum reference"
] as const;

const blockedSoftwarePlaceholderPhrases = [
  ...blockedPlaceholderPhrases,
  "Practice this concept",
  "Implement the exercise",
  "Apply what you learned",
  "currently seeded as a professional roadmap session outline",
  "Detailed lesson authoring should add",
  "Record open questions for future detailed authoring",
  "at outline fidelity"
] as const;

describe("phase 3 Software Engineering career seed data", () => {
  const softwareTrack = phase3SeedTracks.find((track) => track.slug === "software-engineering");
  const softwareLessons = softwareTrack?.modules.flatMap((moduleRecord) => moduleRecord.lessons) ?? [];

  it("provides a gold-standard DTO boundary session that teaches before practice", () => {
    const lesson = softwareLessons.find((candidate) => candidate.identifier === "SE-P01-M01-S03");

    expect(lesson).toBeDefined();
    if (lesson === undefined) throw new Error("Gold-standard DTO lesson is missing.");
    const content = buildApprovedSeedVersionInput(lesson);

    expect(content.explanationMarkdown).toContain("External data");
    expect(content.explanationMarkdown).toContain("runtime validation");
    expect(content.examples.join("\n")).toContain("ApiUserDto");
    expect(content.exercises[0]?.promptMarkdown).toContain("Checkpoint");
    expect(content.exercises[0]?.promptMarkdown).toContain("Success criteria");
    expect(content.knowledgeChecks[0]?.explanation).toContain("Compile-time");
  });

  it("materializes a complete five-to-six month professional career program", () => {
    expect(softwareTrack).toBeDefined();
    expect(softwareTrack?.modules).toHaveLength(24);
    expect(softwareLessons).toHaveLength(120);
    expect(softwareEngineeringCareerProgramStats.phases).toHaveLength(14);
    expect(softwareEngineeringCareerProgramStats.modules).toBe(24);
    expect(softwareEngineeringCareerProgramStats.learningUnits).toBe(120);
    expect(softwareEngineeringCareerProgramStats.weeklyAssessments).toBe(24);
    expect(softwareEngineeringCareerProgramStats.capstoneComplete).toBe(true);
    expect(softwareEngineeringCareerProgramStats.placeholdersRemaining).toBe(0);
  });

  it("covers the requested professional engineering domains", () => {
    const tags = new Set(softwareLessons.flatMap((lesson) => lesson.tags));

    for (const requiredTag of [
      "ts-strict",
      "ts-generics",
      "react-architecture",
      "graphql-schema",
      "fastapi",
      "python-typing",
      "postgresql",
      "authentication",
      "testing-strategy-review",
      "dsa",
      "system-design",
      "production-readiness",
      "debugging-interviews",
      "job-preparation",
      "capstone"
    ]) {
      expect(tags.has(requiredTag)).toBe(true);
    }
  });

  it("links the full Software Engineering sequence through prerequisites", () => {
    expect(softwareLessons[0]?.prerequisites).toEqual([]);

    for (let index = 1; index < softwareLessons.length; index += 1) {
      expect(softwareLessons[index]?.prerequisites).toEqual([softwareLessons[index - 1]?.identifier]);
    }
  });

  it("keeps all Software Engineering career lesson versions valid and learner-facing", () => {
    for (const lesson of softwareLessons) {
      const content = buildApprovedSeedVersionInput(lesson);

      expect(() => validateLessonVersionEditorInput(content)).not.toThrow();
      expect(content.explanationMarkdown).toContain("Duration architecture:");
      expect(content.explanationMarkdown).toContain("Activity plan:");
      expect(content.explanationMarkdown).toContain("30 minutes:");
      expect(content.explanationMarkdown).toContain("60 minutes:");
      expect(content.explanationMarkdown).toContain("90 minutes:");
      expect(content.explanationMarkdown).toContain("120 minutes:");
      expect(content.resources.length).toBeGreaterThanOrEqual(1);
      expect(content.exercises).toHaveLength(2);
      expect(content.exercises[0]?.solutionNotesMarkdown).toContain("Reference approach");
      expect(content.exercises[1]?.solutionNotesMarkdown).toContain("Score the result");
      expect(content.knowledgeChecks).toHaveLength(3);
    }
  });

  it("includes professional assessments, interview practice, projects, DSA, system design, and capstone evidence", () => {
    expect(softwareEngineeringCareerProgramStats.codingExercises).toBeGreaterThanOrEqual(80);
    expect(softwareEngineeringCareerProgramStats.debuggingExercises).toBeGreaterThanOrEqual(10);
    expect(softwareEngineeringCareerProgramStats.dsaProblems).toBe(8);
    expect(softwareEngineeringCareerProgramStats.systemDesignCases).toBe(8);
    expect(softwareEngineeringCareerProgramStats.interviewQuestions).toBe(360);
    expect(softwareEngineeringCareerProgramStats.projects).toBe(24);
    expect(softwareEngineeringCareerProgramStats.resources).toBeGreaterThanOrEqual(20);

    const capstoneLessons = softwareLessons.filter((lesson) => lesson.tags.includes("capstone"));
    const capstoneText = capstoneLessons
      .map((lesson) => searchableContentText(buildApprovedSeedVersionInput(lesson)))
      .join("\n");

    expect(capstoneLessons).toHaveLength(5);
    expect(capstoneText).toContain("README");
    expect(capstoneText).toContain("architecture diagram");
    expect(capstoneText).toContain("database design");
    expect(capstoneText).toContain("test suite");
    expect(capstoneText).toContain("deployment documentation");
    expect(capstoneText).toContain("technical retrospective");
  });

  it("does not ship placeholder instructional copy in Software Engineering career lessons", () => {
    for (const lesson of softwareLessons) {
      const content = buildApprovedSeedVersionInput(lesson);
      const text = searchableContentText(content);

      for (const phrase of blockedSoftwarePlaceholderPhrases) {
        expect(text).not.toContain(phrase);
      }
    }
  });
});

describe("phase 3 Project Management career seed data", () => {
  const projectTrack = phase3SeedTracks.find((track) => track.slug === "project-management");
  const projectLessons = projectTrack?.modules.flatMap((moduleRecord) => moduleRecord.lessons) ?? [];
  const forbiddenOutlineCopy = [
    "roadmap session outline",
    "future detailed authoring",
    "Detailed lesson authoring should add",
    "at outline fidelity",
    "Draft a session outline"
  ] as const;

  it("provides a gold-standard RAID session with a model artifact and feedback", () => {
    const lesson = projectLessons.find((candidate) => candidate.identifier === "PM-P05-S03");

    expect(lesson).toBeDefined();
    if (lesson === undefined) throw new Error("Gold-standard RAID lesson is missing.");
    const content = buildApprovedSeedVersionInput(lesson);

    expect(content.explanationMarkdown).toContain("Could happen later");
    expect(content.examples.join("\n")).toContain("| ID | Type | Description |");
    expect(content.exercises[0]?.promptMarkdown).toContain("one issue, one assumption, one dependency, and one risk");
    expect(content.exercises[1]?.solutionNotesMarkdown).toContain("correct reclassification");
  });

  it("materializes a coherent fourteen-week professional pathway", () => {
    expect(projectTrack?.modules).toHaveLength(14);
    expect(projectLessons).toHaveLength(70);
    expect(projectLessons.filter((lesson) => lesson.tags.includes("weekly-assessment"))).toHaveLength(14);
  });

  it("ships learner-facing content and real duration paths for every PM session", () => {
    for (const lesson of projectLessons) {
      const content = buildApprovedSeedVersionInput(lesson);
      const text = searchableContentText(content);

      expect(() => validateLessonVersionEditorInput(content)).not.toThrow();
      expect(content.explanationMarkdown).toContain("30 minutes:");
      expect(content.explanationMarkdown).toContain("60 minutes:");
      expect(content.explanationMarkdown).toContain("90 minutes:");
      expect(content.explanationMarkdown).toContain("120 minutes:");
      expect(content.exercises).toHaveLength(2);
      expect(content.knowledgeChecks.length).toBeGreaterThanOrEqual(2);

      for (const phrase of forbiddenOutlineCopy) {
        expect(text).not.toContain(phrase);
      }
    }
  });

  it("covers professional artifacts, judgment, communication, risk, stakeholders, Agile, and capstone delivery", () => {
    const text = projectLessons
      .map((lesson) => searchableContentText(buildApprovedSeedVersionInput(lesson)))
      .join("\n");

    for (const requiredTerm of [
      "charter",
      "scope",
      "WBS",
      "risk register",
      "stakeholder",
      "status",
      "Scrum",
      "Kanban",
      "change",
      "budget",
      "capstone",
      "interview"
    ]) {
      expect(text.toLowerCase()).toContain(requiredTerm.toLowerCase());
    }
  });
});

describe("phase 3 German seed data", () => {
  const germanTrack = phase3SeedTracks.find((track) => track.slug === "german");
  const germanLessons = germanTrack?.modules.flatMap((moduleRecord) => moduleRecord.lessons) ?? [];
  const implementedLessons = implementedGermanLevels.flatMap(([, code]) =>
    germanLessons.filter((lesson) => lesson.identifier.startsWith(`DE-${code}-`))
  );

  it("contains roadmap modules for every selectable German level", () => {
    expect(germanTrack).toBeDefined();

    for (const level of selectableGermanLevels) {
      expect(germanTrack?.modules.some((moduleRecord) => moduleRecord.title.startsWith(level))).toBe(true);
    }
  });

  it("materializes the complete A1.1 through C2.2 pathway", () => {
    expect(germanLessons.slice(0, 3).map((lesson) => lesson.identifier)).toEqual([
      "DE-A11-M01-S01",
      "DE-A11-M01-S02",
      "DE-A11-M01-S03"
    ]);
    expect(implementedLessons).toHaveLength(600);

    for (const [level, code] of implementedGermanLevels) {
      const levelModules = germanTrack?.modules.filter((moduleRecord) =>
        moduleRecord.title.startsWith(`${level} Module`)
      );
      const levelLessons = germanLessons.filter((lesson) => lesson.identifier.startsWith(`DE-${code}-`));

      expect(levelModules).toHaveLength(10);
      expect(levelLessons).toHaveLength(50);
      expect(levelLessons[0]?.identifier).toBe(`DE-${code}-M01-S01`);
      expect(levelLessons.at(-1)?.identifier).toBe(`DE-${code}-M10-S05`);
    }
  });

  it("preserves the detailed A2.1 Modules 1-2 benchmark identifiers", () => {
    const a21BenchmarkLessons = germanLessons
      .filter((lesson) => /^DE-A21-M0[12]-S0[1-5]$/u.test(lesson.identifier))
      .map((lesson) => lesson.identifier);

    expect(a21BenchmarkLessons).toEqual([
      "DE-A21-M01-S01",
      "DE-A21-M01-S02",
      "DE-A21-M01-S03",
      "DE-A21-M01-S04",
      "DE-A21-M01-S05",
      "DE-A21-M02-S01",
      "DE-A21-M02-S02",
      "DE-A21-M02-S03",
      "DE-A21-M02-S04",
      "DE-A21-M02-S05"
    ]);
  });

  it("links generated German sessions with sequential prerequisites", () => {
    expect(findLesson("DE-A11-M01-S01").prerequisites).toEqual([]);
    expect(findLesson("DE-A12-M01-S01").prerequisites).toEqual(["DE-A11-M10-S05"]);
    expect(findLesson("DE-A21-M01-S01").prerequisites).toEqual(["DE-A12-M10-S05"]);
    expect(findLesson("DE-A21-M01-S02").prerequisites).toEqual(["DE-A21-M01-S01"]);
    expect(findLesson("DE-A21-M03-S01").prerequisites).toEqual(["DE-A21-M02-S05"]);
    expect(findLesson("DE-A22-M01-S01").prerequisites).toEqual(["DE-A21-M10-S05"]);
    expect(findLesson("DE-B11-M01-S01").prerequisites).toEqual(["DE-A22-M10-S05"]);
    expect(findLesson("DE-C22-M01-S01").prerequisites).toEqual(["DE-C21-M10-S05"]);
  });

  it("provides in-app A2.1 teaching content, feedback, and supplemental resources", () => {
    const travelLesson = findLesson("DE-A21-M01-S01");
    const content = buildApprovedSeedVersionInput(travelLesson);

    expect(content.explanationMarkdown).toContain("Audio script for later recording");
    expect(content.explanationMarkdown).toContain("30 minutes:");
    expect(content.exercises[0]?.solutionNotesMarkdown).toContain("Expected answers");
    expect(content.knowledgeChecks.length).toBeGreaterThanOrEqual(6);
    expect(content.knowledgeChecks[0]?.explanation).not.toHaveLength(0);
    expect(content.resources.map((resource) => resource.provider)).toEqual(["Goethe-Institut"]);
  });

  it("keeps every implemented German session compatible with 30/45/60/90 minute scheduling", () => {
    for (const lesson of implementedLessons) {
      const content = buildApprovedSeedVersionInput(lesson);

      expect(content.explanationMarkdown).toContain("30 minutes:");
      expect(content.explanationMarkdown).toContain("45 minutes:");
      expect(content.explanationMarkdown).toContain("60 minutes:");
      expect(content.explanationMarkdown).toContain("90 minutes:");
      expect(content.explanationMarkdown).toContain("55-65 active minutes");
    }
  });

  it("keeps all implemented German lesson versions inside content validation constraints", () => {
    for (const lesson of implementedLessons) {
      const content = buildApprovedSeedVersionInput(lesson);

      expect(() => validateLessonVersionEditorInput(content)).not.toThrow();
      expect(content.resources).toHaveLength(1);
      expect(content.exercises.length).toBeGreaterThanOrEqual(2);
      if (!isA21BenchmarkLesson(lesson)) {
        expect(content.examples.length).toBeGreaterThanOrEqual(6);
        expect(content.knowledgeChecks.length).toBeGreaterThanOrEqual(5);
        expect(content.exercises.every((exercise) => exercise.solutionNotesMarkdown !== null)).toBe(true);
        expect(content.explanationMarkdown).toContain("Audio script for later recording");
      }
    }
  });

  it("does not ship placeholder instructional copy in implemented German lessons", () => {
    for (const lesson of implementedLessons) {
      const content = buildApprovedSeedVersionInput(lesson);
      const text = searchableContentText(content);

      for (const phrase of blockedPlaceholderPhrases) {
        expect(text).not.toContain(phrase);
      }
    }
  });

  it("marks each sublevel final integrated assessment", () => {
    for (const [level, code] of implementedGermanLevels) {
      const finalLesson = findLesson(`DE-${code}-M10-S05`);
      const content = buildApprovedSeedVersionInput(finalLesson);

      expect(searchableContentText(content)).toMatch(/Sublevel final integrated assessment/i);
      expect(finalLesson.title).toContain(level);
    }
  });

  it("uses unique German lesson identifiers", () => {
    const identifiers = germanLessons.map((lesson) => lesson.identifier);

    expect(new Set(identifiers).size).toBe(identifiers.length);
  });

  function findLesson(identifier: string): SeedLessonDefinition {
    const lesson = germanLessons.find((candidate) => candidate.identifier === identifier);

    expect(lesson).toBeDefined();

    if (lesson === undefined) {
      throw new Error(`Missing German lesson ${identifier}`);
    }

    return lesson;
  }
});

function isA21BenchmarkLesson(lesson: SeedLessonDefinition): boolean {
  return /^DE-A21-M0[12]-S0[1-5]$/u.test(lesson.identifier);
}

function searchableContentText(content: LessonVersionEditorInput): string {
  return [
    content.title,
    content.learningObjective,
    ...content.outcomes,
    content.explanationMarkdown,
    content.relevanceMarkdown,
    ...content.examples,
    ...content.commonMistakes,
    ...content.assessmentTags,
    ...content.resources.flatMap((resource) => [
      resource.title,
      resource.provider,
      resource.url,
      resource.resourceType,
      resource.difficulty,
      resource.description,
      resource.verificationStatus,
      resource.citation
    ]),
    ...content.exercises.flatMap((exercise) => [
      exercise.kind,
      exercise.promptMarkdown,
      exercise.expectedEvidence,
      exercise.solutionNotesMarkdown ?? ""
    ]),
    ...content.knowledgeChecks.flatMap((check) => [
      check.question,
      ...check.answerKey,
      check.explanation
    ])
  ].join("\n");
}
