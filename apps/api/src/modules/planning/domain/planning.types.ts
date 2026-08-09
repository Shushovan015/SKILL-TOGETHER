import type {
  ContentStatus,
  EnrollmentStatus,
  ExerciseRecord,
  KnowledgeCheckRecord,
  ResourceRecord,
  TrackType
} from "../../content/domain/content.types.js";

export type DailyTaskStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "MISSED"
  | "RESCHEDULED"
  | "SKIPPED"
  | "CANCELLED";

export interface PausePeriodInput {
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly reason: string | null;
}

export interface OnboardingInput {
  readonly trackId: string;
  readonly startDate: Date;
  readonly studyDays: readonly number[];
  readonly availableMinutesByDay: Readonly<Record<number, number>>;
  readonly preferredSessionTime: string | null;
  readonly experienceLevel: string;
  readonly targetOutcome: string;
  readonly assessmentDay: number;
  readonly recoveryDay: number;
  readonly pausePeriods: readonly PausePeriodInput[];
}

export interface ApprovedLessonForScheduling {
  readonly lessonId: string;
  readonly lessonVersionId: string;
  readonly moduleSequence: number;
  readonly lessonSequence: number;
  readonly trackType: TrackType;
  readonly trackTitle: string;
  readonly moduleTitle: string;
  readonly title: string;
  readonly learningObjective: string;
  readonly outcomes: readonly string[];
  readonly explanationMarkdown: string;
  readonly relevanceMarkdown: string;
  readonly examples: readonly string[];
  readonly commonMistakes: readonly string[];
  readonly assessmentTags: readonly string[];
  readonly durationMinutes: number;
  readonly required: boolean;
  readonly prerequisiteLessonIds: readonly string[];
  readonly resources: readonly ResourceRecord[];
  readonly exercises: readonly ExerciseRecord[];
  readonly knowledgeChecks: readonly KnowledgeCheckRecord[];
}

export interface ScheduledTaskDraft {
  readonly lessonVersionId: string;
  readonly scheduledOn: Date;
  readonly plannedDurationMinutes: number;
  readonly required: boolean;
  readonly weekNumber: number;
}

export interface StudyWeekDraft {
  readonly weekNumber: number;
  readonly startsOn: Date;
  readonly endsOn: Date;
}

export interface ScheduleDraft {
  readonly weeks: readonly StudyWeekDraft[];
  readonly tasks: readonly ScheduledTaskDraft[];
}

export interface PlanningTrackRecord {
  readonly id: string;
  readonly slug: string;
  readonly type: TrackType;
  readonly title: string;
  readonly description: string;
  readonly active: boolean;
}

export interface PlanningEnrollmentRecord {
  readonly id: string;
  readonly userId: string;
  readonly status: EnrollmentStatus;
  readonly track: {
    readonly id: string;
    readonly slug: string;
    readonly type: TrackType;
    readonly title: string;
    readonly description: string;
    readonly active: boolean;
    readonly modules: readonly [];
  };
  readonly startDate: Date;
  readonly targetOutcome: string;
  readonly experienceLevel: string;
}

export interface ScheduledLessonRecord {
  readonly lessonVersionId: string;
  readonly title: string;
  readonly moduleTitle: string;
  readonly trackTitle: string;
  readonly trackType: TrackType;
  readonly learningObjective: string;
  readonly outcomes: readonly string[];
  readonly explanationMarkdown: string;
  readonly businessRelevanceMarkdown: string;
  readonly examples: readonly string[];
  readonly commonMistakes: readonly string[];
  readonly assessmentTags: readonly string[];
  readonly resources: readonly ResourceRecord[];
  readonly guidedExercise: ExerciseRecord;
  readonly independentExercise: ExerciseRecord;
  readonly knowledgeChecks: readonly KnowledgeCheckRecord[];
}

export interface DailyTaskRecord {
  readonly id: string;
  readonly scheduledOn: Date;
  readonly status: DailyTaskStatus;
  readonly plannedDurationMinutes: number;
  readonly required: boolean;
  readonly lesson: ScheduledLessonRecord;
  readonly rescheduleReason: string | null;
  readonly studyWeekNumber: number;
}

export interface ProgressSummaryRecord {
  readonly plannedCount: number;
  readonly completedCount: number;
  readonly weeklyCompletionPercentage: number;
}

export interface TodayDashboardRecord {
  readonly date: Date;
  readonly mainTask: DailyTaskRecord | null;
  readonly germanTask: DailyTaskRecord | null;
  readonly estimatedStudyMinutes: number;
  readonly weeklyProgress: ProgressSummaryRecord;
  readonly missedTasks: readonly DailyTaskRecord[];
}

export interface RecoveryProposalRecord {
  readonly dailyTaskId: string;
  readonly strategy: string;
  readonly targetDate: Date | null;
  readonly reason: string;
  readonly impactedTaskIds: readonly string[];
  readonly capacityMinutes: number;
  readonly plannedMinutes: number;
}

export interface RescheduleTaskInput {
  readonly dailyTaskId: string;
  readonly strategy: string;
  readonly targetDate: Date | null;
}

export interface CompleteDailyTaskInput {
  readonly dailyTaskId: string;
  readonly durationMinutes: number;
  readonly completionEvidence: Record<string, unknown>;
  readonly reflection: string | null;
}

export interface PauseEnrollmentInput {
  readonly enrollmentId: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly reason: string | null;
}

export interface PlanPreferences {
  readonly startDate: Date;
  readonly studyDays: readonly number[];
  readonly availableMinutesByDay: Readonly<Record<number, number>>;
  readonly assessmentDay: number;
  readonly recoveryDay: number;
  readonly pausePeriods: readonly PausePeriodInput[];
}

export interface ExistingScheduledTask {
  readonly id: string;
  readonly scheduledOn: Date;
  readonly status: DailyTaskStatus;
  readonly plannedDurationMinutes: number;
}

export interface RecoveryPlanContext {
  readonly preferences: PlanPreferences;
  readonly today: Date;
  readonly missedTask: ExistingScheduledTask;
  readonly scheduledTasks: readonly ExistingScheduledTask[];
}

export type ContentStatusForPlanning = ContentStatus;
