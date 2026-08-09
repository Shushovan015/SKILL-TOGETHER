import type {
  CompleteDailyTaskInput,
  DailyTaskRecord,
  OnboardingInput,
  PauseEnrollmentInput,
  PlanningEnrollmentRecord,
  RecoveryProposalRecord,
  RescheduleTaskInput,
  TodayDashboardRecord
} from "../domain/planning.types.js";

export const PLANNING_REPOSITORY = Symbol("PLANNING_REPOSITORY");

export interface PlanningRepository {
  completeOnboarding(userId: string, input: OnboardingInput): Promise<PlanningEnrollmentRecord>;
  todayDashboard(userId: string, date: Date): Promise<TodayDashboardRecord>;
  weeklyPlan(userId: string, weekNumber: number, today: Date): Promise<readonly DailyTaskRecord[]>;
  dailyTask(userId: string, dailyTaskId: string, today: Date): Promise<DailyTaskRecord>;
  startDailyTask(userId: string, dailyTaskId: string): Promise<DailyTaskRecord>;
  completeDailyTask(userId: string, input: CompleteDailyTaskInput): Promise<DailyTaskRecord>;
  proposeRecovery(
    userId: string,
    dailyTaskId: string,
    today: Date
  ): Promise<RecoveryProposalRecord>;
  applyRecovery(
    userId: string,
    input: RescheduleTaskInput,
    today: Date
  ): Promise<readonly DailyTaskRecord[]>;
  pauseEnrollment(userId: string, input: PauseEnrollmentInput): Promise<PlanningEnrollmentRecord>;
  resumeEnrollment(userId: string, enrollmentId: string): Promise<PlanningEnrollmentRecord>;
}
