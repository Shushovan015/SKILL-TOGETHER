import type { JsonValue } from "../../../common/graphql/json.scalar.js";
import type { DailyTaskRecord } from "../../planning/domain/planning.types.js";

export type AssessmentAttemptStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "NEEDS_MANUAL_GRADING"
  | "GRADED"
  | "PASSED"
  | "FAILED";

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "MULTIPLE_SELECT"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "CODE_CHALLENGE"
  | "DEBUGGING_CHALLENGE"
  | "SCENARIO"
  | "CASE_STUDY"
  | "PRACTICAL_ASSIGNMENT"
  | "REFLECTION";

export interface AssessmentQuestionRecord {
  readonly id: string;
  readonly type: QuestionType;
  readonly promptMarkdown: string;
  readonly options: JsonValue | null;
  readonly points: number;
  readonly assessmentTags: readonly string[];
}

export interface AssessmentAttemptResultRecord {
  readonly scoreEarned: number | null;
  readonly scorePossible: number | null;
  readonly percentage: number | null;
  readonly passed: boolean | null;
  readonly weakTopics: readonly string[];
  readonly revisionRecommendations: readonly DailyTaskRecord[];
}

export interface AssessmentAttemptRecord {
  readonly id: string;
  readonly studyWeekId: string;
  readonly studyWeekNumber: number;
  readonly attemptNumber: number;
  readonly status: AssessmentAttemptStatus;
  readonly startedAt: Date;
  readonly submittedAt: Date | null;
  readonly gradedAt: Date | null;
  readonly questions: readonly AssessmentQuestionRecord[];
  readonly result: AssessmentAttemptResultRecord | null;
}

export interface AssessmentAnswerInput {
  readonly questionId: string;
  readonly response: JsonValue;
}

export interface SubmitAssessmentInput {
  readonly attemptId: string;
  readonly answers: readonly AssessmentAnswerInput[];
}

export interface AssessmentResultRecord extends AssessmentAttemptResultRecord {
  readonly attemptId: string;
  readonly status: AssessmentAttemptStatus;
}
