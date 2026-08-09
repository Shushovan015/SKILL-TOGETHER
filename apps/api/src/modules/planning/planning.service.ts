import { Inject, Injectable } from "@nestjs/common";

import type { AuthenticatedUser } from "../auth/domain/auth.types.js";
import {
  validateOnboardingInput,
  validateCompleteDailyTaskInput,
  validatePauseEnrollmentInput,
  validateRescheduleTaskInput
} from "./domain/planning.validation.js";
import type {
  DailyTaskRecord,
  PlanningEnrollmentRecord,
  RecoveryProposalRecord,
  TodayDashboardRecord
} from "./domain/planning.types.js";
import {
  PLANNING_REPOSITORY,
  type PlanningRepository
} from "./persistence/planning.repository.js";

@Injectable()
export class PlanningService {
  public constructor(
    @Inject(PLANNING_REPOSITORY) private readonly repository: PlanningRepository
  ) {}

  public completeOnboarding(user: AuthenticatedUser, input: unknown): Promise<PlanningEnrollmentRecord> {
    return this.repository.completeOnboarding(user.id, validateOnboardingInput(input));
  }

  public todayDashboard(user: AuthenticatedUser, date: Date | undefined): Promise<TodayDashboardRecord> {
    return this.repository.todayDashboard(user.id, date ?? todayUtcDate());
  }

  public weeklyPlan(
    user: AuthenticatedUser,
    weekNumber: number
  ): Promise<readonly DailyTaskRecord[]> {
    return this.repository.weeklyPlan(user.id, weekNumber, todayUtcDate());
  }

  public dailyTask(user: AuthenticatedUser, dailyTaskId: string): Promise<DailyTaskRecord> {
    return this.repository.dailyTask(user.id, dailyTaskId, todayUtcDate());
  }

  public startDailyTask(user: AuthenticatedUser, dailyTaskId: string): Promise<DailyTaskRecord> {
    return this.repository.startDailyTask(user.id, dailyTaskId);
  }

  public completeDailyTask(user: AuthenticatedUser, input: unknown): Promise<DailyTaskRecord> {
    return this.repository.completeDailyTask(user.id, validateCompleteDailyTaskInput(input));
  }

  public proposeRecovery(
    user: AuthenticatedUser,
    dailyTaskId: string
  ): Promise<RecoveryProposalRecord> {
    return this.repository.proposeRecovery(user.id, dailyTaskId, todayUtcDate());
  }

  public applyRecovery(
    user: AuthenticatedUser,
    input: unknown
  ): Promise<readonly DailyTaskRecord[]> {
    return this.repository.applyRecovery(user.id, validateRescheduleTaskInput(input), todayUtcDate());
  }

  public pauseEnrollment(user: AuthenticatedUser, input: unknown): Promise<PlanningEnrollmentRecord> {
    return this.repository.pauseEnrollment(user.id, validatePauseEnrollmentInput(input));
  }

  public resumeEnrollment(
    user: AuthenticatedUser,
    enrollmentId: string
  ): Promise<PlanningEnrollmentRecord> {
    return this.repository.resumeEnrollment(user.id, enrollmentId);
  }
}

function todayUtcDate(): Date {
  return new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
}
