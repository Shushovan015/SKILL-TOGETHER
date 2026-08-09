import { gql } from "@apollo/client";

import { TRACK_FIELDS, type LearningTrack } from "../content/graphql.js";

export type DailyTaskStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "MISSED"
  | "RESCHEDULED"
  | "SKIPPED"
  | "CANCELLED";

export interface Exercise {
  readonly id: string;
  readonly kind: string;
  readonly promptMarkdown: string;
  readonly expectedEvidence: string;
  readonly solutionNotesMarkdown?: string | null;
}

export interface Resource {
  readonly id: string;
  readonly title: string;
  readonly provider: string;
  readonly url: string;
  readonly resourceType: string;
  readonly difficulty: string;
  readonly estimatedMinutes: number;
  readonly description: string;
  readonly verificationStatus: string;
  readonly required: boolean;
  readonly approved: boolean;
  readonly citation: string;
}

export interface KnowledgeCheck {
  readonly id: string;
  readonly question: string;
  readonly answerKey?: readonly string[];
  readonly explanation?: string;
}

export interface ScheduledLesson {
  readonly lessonVersionId: string;
  readonly title: string;
  readonly moduleTitle: string;
  readonly trackTitle: string;
  readonly difficulty: string;
  readonly learningObjective: string;
  readonly outcomes: readonly string[];
  readonly explanationMarkdown: string;
  readonly businessRelevanceMarkdown: string;
  readonly examples: readonly string[];
  readonly guidedExercise: Exercise;
  readonly independentExercise: Exercise;
  readonly knowledgeChecks: readonly KnowledgeCheck[];
  readonly commonMistakes: readonly string[];
  readonly resources: readonly Resource[];
}

export interface DailyTask {
  readonly id: string;
  readonly studyWeekId: string;
  readonly scheduledOn: string;
  readonly status: DailyTaskStatus;
  readonly plannedDurationMinutes: number;
  readonly required: boolean;
  readonly rescheduleReason: string | null;
  readonly studyWeekNumber: number;
  readonly lesson: ScheduledLesson;
}

export interface ProgressSummary {
  readonly plannedCount: number;
  readonly completedCount: number;
  readonly weeklyCompletionPercentage: number;
}

export interface TodayDashboard {
  readonly date: string;
  readonly tasks: readonly DailyTask[];
  readonly mainTask: DailyTask | null;
  readonly germanTask: DailyTask | null;
  readonly estimatedStudyMinutes: number;
  readonly weeklyProgress: ProgressSummary;
  readonly missedTasks: readonly DailyTask[];
}

export interface RecoveryProposal {
  readonly dailyTaskId: string;
  readonly strategy: string;
  readonly targetDate: string | null;
  readonly reason: string;
  readonly impactedTaskIds: readonly string[];
  readonly capacityMinutes: number;
  readonly plannedMinutes: number;
}

export interface LearningTracksQueryData {
  readonly learningTracks: readonly LearningTrack[];
}

export interface CompleteOnboardingMutationData {
  readonly completeOnboarding: {
    readonly id: string;
    readonly status: string;
  };
}

export interface CompleteOnboardingMutationVariables {
  readonly input: {
    readonly trackId: string;
    readonly startDate: string;
    readonly studyDays: readonly number[];
    readonly availableMinutesByDay: Readonly<Record<string, number>>;
    readonly preferredSessionTime: string | null;
    readonly experienceLevel: string;
    readonly targetOutcome: string;
    readonly germanStartLevel: string | null;
    readonly germanTargetLevel: string | null;
    readonly germanSessionDurationMinutes: number | null;
    readonly assessmentDay: number;
    readonly recoveryDay: number;
    readonly pausePeriods: readonly [];
  };
}

export interface CancelEnrollmentMutationData {
  readonly cancelEnrollment: {
    readonly id: string;
    readonly status: string;
  };
}

export interface CancelEnrollmentMutationVariables {
  readonly enrollmentId: string;
}

export interface ReconfigureEnrollmentMutationData {
  readonly reconfigureEnrollment: {
    readonly id: string;
    readonly status: string;
  };
}

export interface ReconfigureEnrollmentMutationVariables {
  readonly input: CompleteOnboardingMutationVariables["input"] & {
    readonly enrollmentId: string;
  };
}

export interface TodayDashboardQueryData {
  readonly todayDashboard: TodayDashboard;
}

export interface WeeklyPlanQueryData {
  readonly weeklyPlan: readonly DailyTask[];
}

export interface WeeklyPlanQueryVariables {
  readonly weekNumber: number;
}

export interface StartDailyTaskMutationData {
  readonly startDailyTask: DailyTask;
}

export interface TaskIdMutationVariables {
  readonly id: string;
}

export interface DailyTaskQueryData {
  readonly dailyTask: DailyTask;
}

export interface DailyTaskQueryVariables {
  readonly id: string;
}

export interface CompleteDailyTaskMutationData {
  readonly completeDailyTask: DailyTask;
}

export interface CompleteDailyTaskMutationVariables {
  readonly input: {
    readonly dailyTaskId: string;
    readonly durationMinutes: number;
    readonly completionEvidence: Readonly<Record<string, string>>;
    readonly reflection: string | null;
  };
}

export interface ProposeRecoveryMutationData {
  readonly proposeRecovery: RecoveryProposal;
}

export interface ProposeRecoveryMutationVariables {
  readonly dailyTaskId: string;
}

export interface ApplyRecoveryMutationData {
  readonly applyRecovery: readonly DailyTask[];
}

export interface ApplyRecoveryMutationVariables {
  readonly input: {
    readonly dailyTaskId: string;
    readonly strategy: string;
    readonly targetDate: string | null;
  };
}

export const PLANNING_TRACKS_QUERY = gql`
  query PlanningTracks {
    learningTracks {
      ...TrackFields
    }
  }
  ${TRACK_FIELDS}
`;

export const DAILY_TASK_FIELDS = gql`
  fragment DailyTaskFields on DailyTask {
    id
    studyWeekId
    scheduledOn
    status
    plannedDurationMinutes
    required
    rescheduleReason
    studyWeekNumber
    lesson {
      lessonVersionId
      title
      moduleTitle
      trackTitle
      difficulty
      learningObjective
      outcomes
      explanationMarkdown
      businessRelevanceMarkdown
      examples
      commonMistakes
      guidedExercise {
        id
        kind
        promptMarkdown
        expectedEvidence
      }
      independentExercise {
        id
        kind
        promptMarkdown
        expectedEvidence
      }
      knowledgeChecks {
        id
        question
      }
      resources {
        id
        title
        provider
        url
        resourceType
        difficulty
        estimatedMinutes
        description
        verificationStatus
        required
        approved
        citation
      }
    }
  }
`;

export const DAILY_TASK_QUERY = gql`
  query DailyTask($id: ID!) {
    dailyTask(id: $id) {
      ...DailyTaskFields
    }
  }
  ${DAILY_TASK_FIELDS}
`;

export const COMPLETE_ONBOARDING_MUTATION = gql`
  mutation CompleteOnboarding($input: OnboardingInput!) {
    completeOnboarding(input: $input) {
      id
      status
    }
  }
`;

export const CANCEL_ENROLLMENT_MUTATION = gql`
  mutation CancelEnrollment($enrollmentId: ID!) {
    cancelEnrollment(enrollmentId: $enrollmentId) {
      id
      status
    }
  }
`;

export const RECONFIGURE_ENROLLMENT_MUTATION = gql`
  mutation ReconfigureEnrollment($input: ReconfigureEnrollmentInput!) {
    reconfigureEnrollment(input: $input) {
      id
      status
    }
  }
`;

export const TODAY_DASHBOARD_QUERY = gql`
  query TodayDashboard {
    todayDashboard {
      date
      tasks {
        ...DailyTaskFields
      }
      mainTask {
        ...DailyTaskFields
      }
      germanTask {
        ...DailyTaskFields
      }
      estimatedStudyMinutes
      weeklyProgress {
        plannedCount
        completedCount
        weeklyCompletionPercentage
      }
      missedTasks {
        ...DailyTaskFields
      }
    }
  }
  ${DAILY_TASK_FIELDS}
`;

export const WEEKLY_PLAN_QUERY = gql`
  query WeeklyPlan($weekNumber: Int!) {
    weeklyPlan(weekNumber: $weekNumber) {
      ...DailyTaskFields
    }
  }
  ${DAILY_TASK_FIELDS}
`;

export const START_DAILY_TASK_MUTATION = gql`
  mutation StartDailyTask($id: ID!) {
    startDailyTask(id: $id) {
      ...DailyTaskFields
    }
  }
  ${DAILY_TASK_FIELDS}
`;

export const COMPLETE_DAILY_TASK_MUTATION = gql`
  mutation CompleteDailyTask($input: CompleteDailyTaskInput!) {
    completeDailyTask(input: $input) {
      ...DailyTaskFields
    }
  }
  ${DAILY_TASK_FIELDS}
`;

export const PROPOSE_RECOVERY_MUTATION = gql`
  mutation ProposeRecovery($dailyTaskId: ID!) {
    proposeRecovery(dailyTaskId: $dailyTaskId) {
      dailyTaskId
      strategy
      targetDate
      reason
      impactedTaskIds
      capacityMinutes
      plannedMinutes
    }
  }
`;

export const APPLY_RECOVERY_MUTATION = gql`
  mutation ApplyRecovery($input: RescheduleTaskInput!) {
    applyRecovery(input: $input) {
      ...DailyTaskFields
    }
  }
  ${DAILY_TASK_FIELDS}
`;
