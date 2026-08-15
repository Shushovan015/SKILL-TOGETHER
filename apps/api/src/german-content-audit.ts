import { buildApprovedSeedVersionInput, phase3SeedTracks } from "./modules/content/seed/phase-03-seed-data.js";

const germanTrack = phase3SeedTracks.find((track) => track.slug === "german");

if (germanTrack === undefined) {
  throw new Error("German seed track is missing.");
}

const lessons = germanTrack.modules.flatMap((moduleRecord) => moduleRecord.lessons);
const records = lessons.map((lesson) => ({
  lesson,
  content: buildApprovedSeedVersionInput(lesson)
}));
const searchableText = (record: (typeof records)[number]): string => [
  record.content.explanationMarkdown,
  ...record.content.examples,
  ...record.content.exercises.flatMap((exercise) => [
    exercise.promptMarkdown,
    exercise.solutionNotesMarkdown ?? ""
  ]),
  ...record.content.knowledgeChecks.flatMap((check) => [
    check.question,
    ...check.answerKey,
    check.explanation
  ])
].join("\n");
const learnerCharacters = (record: (typeof records)[number]): number => searchableText(record).length;
const countMissing = (pattern: RegExp): number => records.filter((record) => !pattern.test(searchableText(record))).length;
const placeholderPattern = /practice this concept|apply the grammar|complete the activity|produce the evidence|target scenario|curriculum reference|professional relevance/iu;

const report = {
  levels: Object.fromEntries(
    ["A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B1.2", "B2.1", "B2.2", "C1.1", "C1.2", "C2.1", "C2.2"]
      .map((level) => [level, lessons.filter((lesson) => lesson.level === level).length])
  ),
  totalModules: germanTrack.modules.length,
  totalLearningUnits: lessons.length,
  totalActivities: records.reduce(
    (sum, record) => sum + record.content.exercises.length + record.content.knowledgeChecks.length + 4,
    0
  ),
  sessionsFlaggedAsTooShort: records.filter((record) => learnerCharacters(record) < 4_000).length,
  learnerFacingPlaceholders: records.filter((record) => placeholderPattern.test(searchableText(record))).length,
  missingAnswers: records.filter((record) => record.content.knowledgeChecks.some((check) => check.answerKey.length === 0)).length,
  missingRubrics: records.filter((record) => record.content.exercises.some((exercise) => exercise.solutionNotesMarkdown === null)).length,
  readingTasksWithoutText: countMissing(/reading text/iu),
  listeningTasksWithoutAudioOrTranscript: countMissing(/audio script|transcript/iu),
  speakingTasksWithoutRealPrompt: countMissing(/speaking task|role-play|dialogue/iu),
  writingTasksWithoutRealPrompt: countMissing(/writing task|write an? /iu),
  shortestSessions: records
    .map((record) => ({ id: record.lesson.identifier, learnerCharacters: learnerCharacters(record) }))
    .sort((left, right) => left.learnerCharacters - right.learnerCharacters)
    .slice(0, 10)
};

console.log(JSON.stringify(report, null, 2));
