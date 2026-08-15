import { toDailyTaskDto } from "../planning/planning.mapper.js";
import type {
  AssessmentAttemptRecord,
  AssessmentResultRecord
} from "./domain/assessment.types.js";
import {
  AssessmentAttemptDto,
  AssessmentAttemptResultDto,
  AssessmentAttemptStatusDto,
  AssessmentQuestionDto,
  AssessmentResultDto,
  QuestionTypeDto
} from "./dto/assessment.dto.js";

export function toAssessmentAttemptDto(attempt: AssessmentAttemptRecord): AssessmentAttemptDto {
  return {
    id: attempt.id,
    studyWeekId: attempt.studyWeekId,
    studyWeekNumber: attempt.studyWeekNumber,
    attemptNumber: attempt.attemptNumber,
    status: attempt.status as AssessmentAttemptStatusDto,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    gradedAt: attempt.gradedAt,
    questions: attempt.questions.map((question): AssessmentQuestionDto => ({
      id: question.id,
      type: question.type as QuestionTypeDto,
      promptMarkdown: question.promptMarkdown,
      options: question.options,
      points: question.points,
      assessmentTags: [...question.assessmentTags]
    })),
    result: attempt.result === null ? null : toAttemptResultDto(attempt.result)
  };
}

export function toAssessmentResultDto(result: AssessmentResultRecord): AssessmentResultDto {
  return {
    attemptId: result.attemptId,
    status: result.status as AssessmentAttemptStatusDto,
    scoreEarned: result.scoreEarned,
    scorePossible: result.scorePossible,
    percentage: result.percentage,
    passed: result.passed,
    weakTopics: [...result.weakTopics],
    revisionRecommendations: result.revisionRecommendations.map(toDailyTaskDto),
    answerFeedback: result.answerFeedback.map((answer) => ({ ...answer }))
  };
}

function toAttemptResultDto(result: AssessmentAttemptRecord["result"]): AssessmentAttemptResultDto {
  if (result === null) {
    throw new Error("Assessment result is required.");
  }

  return {
    scoreEarned: result.scoreEarned,
    scorePossible: result.scorePossible,
    percentage: result.percentage,
    passed: result.passed,
    weakTopics: [...result.weakTopics],
    revisionRecommendations: result.revisionRecommendations.map(toDailyTaskDto),
    answerFeedback: result.answerFeedback.map((answer) => ({ ...answer }))
  };
}
