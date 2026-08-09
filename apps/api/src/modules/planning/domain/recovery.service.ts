import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import {
  addDays,
  dateKey,
  dayOfWeek,
  hasCapacity,
  isPaused,
  isStudyDate
} from "./scheduling.service.js";
import type {
  ExistingScheduledTask,
  RecoveryPlanContext,
  RecoveryProposalRecord
} from "./planning.types.js";

const maxRecoverySearchDays = 60;

export class RecoveryDomainService {
  public propose(context: RecoveryPlanContext): RecoveryProposalRecord {
    const usedMinutes = new Map<string, number>();

    for (const task of context.scheduledTasks) {
      if (task.status === "CANCELLED" || task.status === "RESCHEDULED" || task.status === "SKIPPED") {
        continue;
      }

      usedMinutes.set(
        dateKey(task.scheduledOn),
        (usedMinutes.get(dateKey(task.scheduledOn)) ?? 0) + task.plannedDurationMinutes
      );
    }

    const recoveryDay = this.nextDateForDay(context.today, context.preferences.recoveryDay);

    if (
      !isPaused(recoveryDay, context.preferences) &&
      hasCapacity(
        recoveryDay,
        context.missedTask.plannedDurationMinutes,
        context.preferences,
        usedMinutes
      )
    ) {
      return proposal(context, "MOVE_TO_RECOVERY_DAY", recoveryDay, usedMinutes);
    }

    for (let offset = 0; offset < maxRecoverySearchDays; offset += 1) {
      const candidate = addDays(context.today, offset);

      if (
        isStudyDate(candidate, context.preferences) &&
        !isPaused(candidate, context.preferences) &&
        hasCapacity(
          candidate,
          context.missedTask.plannedDurationMinutes,
          context.preferences,
          usedMinutes
        )
      ) {
        return proposal(context, "MOVE_TO_NEXT_AVAILABLE_DAY", candidate, usedMinutes);
      }
    }

    return {
      dailyTaskId: context.missedTask.id,
      strategy: "MANUAL_REVIEW_REQUIRED",
      targetDate: null,
      reason: apiErrorMessages.RECOVERY_NOT_AVAILABLE,
      impactedTaskIds: [],
      capacityMinutes: 0,
      plannedMinutes: 0
    };
  }

  private nextDateForDay(startDate: Date, targetDay: number): Date {
    const offset = (targetDay - dayOfWeek(startDate) + 7) % 7;
    return addDays(startDate, offset);
  }
}

function proposal(
  context: RecoveryPlanContext,
  strategy: string,
  targetDate: Date,
  usedMinutes: ReadonlyMap<string, number>
): RecoveryProposalRecord {
  return {
    dailyTaskId: context.missedTask.id,
    strategy,
    targetDate,
    reason: "Move the missed lesson into an available slot while preserving completed work.",
    impactedTaskIds: [context.missedTask.id],
    capacityMinutes: context.preferences.availableMinutesByDay[dayOfWeek(targetDate)] ?? 0,
    plannedMinutes: usedMinutes.get(dateKey(targetDate)) ?? 0
  };
}

export function assertRecoveryAvailable(proposalRecord: RecoveryProposalRecord): void {
  if (proposalRecord.targetDate === null) {
    throw createApiGraphqlError({
      code: "RECOVERY_NOT_AVAILABLE",
      message: apiErrorMessages.RECOVERY_NOT_AVAILABLE,
      retryable: false
    });
  }
}
