import { buildApprovedSeedVersionInput, phase3SeedTracks } from "./modules/content/seed/phase-03-seed-data.js";

const track = phase3SeedTracks.find((candidate) => candidate.slug === "project-management");

if (track === undefined) {
  throw new Error("Project Management seed track is missing.");
}

const records = track.modules.flatMap((moduleRecord) =>
  moduleRecord.lessons.map((lesson) => ({
    module: moduleRecord,
    lesson,
    content: buildApprovedSeedVersionInput(lesson)
  }))
);
const textFor = (record: (typeof records)[number]): string => [
  record.content.explanationMarkdown,
  record.content.relevanceMarkdown,
  ...record.content.examples,
  ...record.content.commonMistakes,
  ...record.content.exercises.flatMap((exercise) => [exercise.promptMarkdown, exercise.solutionNotesMarkdown ?? ""]),
  ...record.content.knowledgeChecks.flatMap((check) => [check.question, ...check.answerKey, check.explanation])
].join("\n");
const has = (record: (typeof records)[number], pattern: RegExp): boolean => pattern.test(textFor(record));
const count = (pattern: RegExp): number => records.filter((record) => has(record, pattern)).length;
const placeholderPattern = /roadmap session outline|future detailed authoring|draft a session outline|at outline fidelity/iu;

const report = {
  phases: track.modules.length,
  modules: track.modules.length,
  learningUnits: records.length,
  coreUnits: records.filter((record) => record.lesson.required).length,
  recommendedUnits: 0,
  extensionUnits: 0,
  projectScenarios: count(/scenario:/iu),
  stakeholderExercises: count(/stakeholder/iu),
  riskExercises: count(/risk/iu),
  planningExercises: count(/plan|schedule|estimate|forecast/iu),
  communicationExercises: count(/communication|message|status|email|presentation/iu),
  artifactCreationTasks: records.filter((record) => record.content.exercises.some((exercise) => exercise.expectedEvidence.length > 20)).length,
  weeklyAssessments: records.filter((record) => record.lesson.tags.includes("weekly-assessment")).length,
  interviewQuestions: count(/interview/iu),
  portfolioArtifacts: count(/portfolio/iu),
  caseStudies: count(/scenario/iu),
  capstoneUnits: records.filter((record) => record.lesson.identifier.startsWith("PM-P13-")).length,
  durationCoverage: {
    "30": count(/30 minutes:/iu),
    "60": count(/60 minutes:/iu),
    "90": count(/90 minutes:/iu),
    "120": count(/120 minutes:/iu)
  },
  sessionsFlaggedAsTooShort: records.filter((record) => textFor(record).length < 2_500).length,
  placeholdersRemaining: records.filter((record) => placeholderPattern.test(textFor(record))).length,
  sessionsMissingSolutionRubric: records.filter((record) =>
    record.content.exercises.some((exercise) => exercise.solutionNotesMarkdown === null)
  ).length,
  shortestSessions: records
    .map((record) => ({ id: record.lesson.identifier, learnerCharacters: textFor(record).length }))
    .sort((left, right) => left.learnerCharacters - right.learnerCharacters)
    .slice(0, 10)
};

console.log(JSON.stringify(report, null, 2));
