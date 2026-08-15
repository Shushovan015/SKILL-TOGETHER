import { buildApprovedSeedVersionInput, phase3SeedTracks } from "./modules/content/seed/phase-03-seed-data.js";

const tracks = phase3SeedTracks.filter((track) => ["software-engineering", "project-management"].includes(track.slug));
const records = tracks.flatMap((track) => track.modules.flatMap((moduleRecord) => moduleRecord.lessons.map((lesson) => ({
  track: track.slug,
  lesson,
  content: buildApprovedSeedVersionInput(lesson)
}))));

const text = (record: (typeof records)[number]): string => [
  record.content.explanationMarkdown,
  record.content.relevanceMarkdown,
  ...record.content.examples,
  ...record.content.exercises.flatMap((exercise) => [exercise.promptMarkdown, exercise.expectedEvidence, exercise.solutionNotesMarkdown ?? ""]),
  ...record.content.knowledgeChecks.flatMap((check) => [check.question, ...check.answerKey, check.explanation])
].join("\n");
const imperative = /\b(create|implement|design|build|analy[sz]e|refactor|debug|configure|write|define|plan|estimate|prioritize|review|develop)\b/iu;
const teaching = /mental model|problem|means|definition|why|core model|what and why/iu;
const example = /example|worked|model artifact|scenario/iu;
const successCriteria = /success criteria|review (?:the response )?against|score the result|expected behavior|strong response|strong answer|evaluate:/iu;

const flagged = records.map((record) => ({
  id: record.lesson.identifier,
  track: record.track,
  text: text(record),
  hasTask: record.content.exercises.some((exercise) => imperative.test(exercise.promptMarkdown)),
  hasTeaching: teaching.test(record.content.explanationMarkdown),
  hasExample: example.test(record.content.examples.join("\n")),
  hasSuccessCriteria: record.content.exercises.every((exercise) => successCriteria.test(`${exercise.promptMarkdown}\n${exercise.solutionNotesMarkdown ?? ""}`)),
  hasFeedback: record.content.exercises.every((exercise) => exercise.solutionNotesMarkdown !== null) && record.content.knowledgeChecks.every((check) => check.explanation.length > 0)
}));

console.log(JSON.stringify({
  sessionsAudited: flagged.length,
  tasksWithoutSufficientTeaching: flagged.filter((record) => record.hasTask && !record.hasTeaching).length,
  tasksWithoutExamples: flagged.filter((record) => record.hasTask && !record.hasExample).length,
  tasksWithoutSuccessCriteria: flagged.filter((record) => record.hasTask && !record.hasSuccessCriteria).length,
  exercisesWithoutFeedback: flagged.filter((record) => !record.hasFeedback).length,
  sessionsFlaggedAsTooShort: flagged.filter((record) => record.text.length < 2_500).length,
  caveat: "Automated signals identify suspicious sessions; representative manual learner review remains required.",
  flaggedSessions: flagged.filter((record) => !record.hasTeaching || !record.hasExample || !record.hasSuccessCriteria || !record.hasFeedback).map(({ id, track }) => ({ id, track }))
}, null, 2));
