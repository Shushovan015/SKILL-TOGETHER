import { gql } from "@apollo/client";

import { DAILY_TASK_FIELDS, type DailyTask } from "../planning/graphql.js";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | readonly JsonValue[] | { readonly [key: string]: JsonValue };

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

export interface AssessmentQuestion {
  readonly id: string;
  readonly type: QuestionType;
  readonly promptMarkdown: string;
  readonly options: JsonValue | null;
  readonly points: number;
  readonly assessmentTags: readonly string[];
}

export interface AssessmentAttemptResult {
  readonly scoreEarned: number | null;
  readonly scorePossible: number | null;
  readonly percentage: number | null;
  readonly passed: boolean | null;
  readonly weakTopics: readonly string[];
  readonly revisionRecommendations: readonly DailyTask[];
}

export interface AssessmentAttempt {
  readonly id: string;
  readonly studyWeekId: string;
  readonly studyWeekNumber: number;
  readonly attemptNumber: number;
  readonly status: AssessmentAttemptStatus;
  readonly startedAt: string;
  readonly submittedAt: string | null;
  readonly gradedAt: string | null;
  readonly questions: readonly AssessmentQuestion[];
  readonly result: AssessmentAttemptResult | null;
}

export interface AssessmentResult extends AssessmentAttemptResult {
  readonly attemptId: string;
  readonly status: AssessmentAttemptStatus;
}

export interface WeeklyAssessmentQueryData {
  readonly weeklyAssessment: AssessmentAttempt;
}

export interface WeeklyAssessmentVariables {
  readonly studyWeekId: string;
}

export interface StartWeeklyAssessmentMutationData {
  readonly startWeeklyAssessment: AssessmentAttempt;
}

export interface SubmitAssessmentMutationData {
  readonly submitAssessment: AssessmentAttempt;
}

export interface SubmitAssessmentMutationVariables {
  readonly input: {
    readonly attemptId: string;
    readonly answers: readonly {
      readonly questionId: string;
      readonly response: JsonValue;
    }[];
  };
}

export interface AssessmentResultQueryData {
  readonly assessmentResult: AssessmentResult;
}

export interface AssessmentResultQueryVariables {
  readonly attemptId: string;
}

export const ASSESSMENT_ATTEMPT_FIELDS = gql`
  fragment AssessmentAttemptFields on AssessmentAttempt {
    id
    studyWeekId
    studyWeekNumber
    attemptNumber
    status
    startedAt
    submittedAt
    gradedAt
    questions {
      id
      type
      promptMarkdown
      options
      points
      assessmentTags
    }
    result {
      scoreEarned
      scorePossible
      percentage
      passed
      weakTopics
      revisionRecommendations {
        ...DailyTaskFields
      }
    }
  }
  ${DAILY_TASK_FIELDS}
`;

export const WEEKLY_ASSESSMENT_QUERY = gql`
  query WeeklyAssessment($studyWeekId: ID!) {
    weeklyAssessment(studyWeekId: $studyWeekId) {
      ...AssessmentAttemptFields
    }
  }
  ${ASSESSMENT_ATTEMPT_FIELDS}
`;

export const START_WEEKLY_ASSESSMENT_MUTATION = gql`
  mutation StartWeeklyAssessment($studyWeekId: ID!) {
    startWeeklyAssessment(studyWeekId: $studyWeekId) {
      ...AssessmentAttemptFields
    }
  }
  ${ASSESSMENT_ATTEMPT_FIELDS}
`;

export const SUBMIT_ASSESSMENT_MUTATION = gql`
  mutation SubmitAssessment($input: SubmitAssessmentInput!) {
    submitAssessment(input: $input) {
      ...AssessmentAttemptFields
    }
  }
  ${ASSESSMENT_ATTEMPT_FIELDS}
`;

export const ASSESSMENT_RESULT_QUERY = gql`
  query AssessmentResult($attemptId: ID!) {
    assessmentResult(attemptId: $attemptId) {
      attemptId
      status
      scoreEarned
      scorePossible
      percentage
      passed
      weakTopics
      revisionRecommendations {
        ...DailyTaskFields
      }
    }
  }
  ${DAILY_TASK_FIELDS}
`;
