import { Injectable } from "@nestjs/common";

import type { PartnerProgressRecord } from "./accountability.types.js";

export interface ProgressSnapshotForSharing {
  readonly userId: string;
  readonly displayName: string;
  readonly plannedCount: number;
  readonly completedCount: number;
  readonly weeklyCompletionPercentage: number;
  readonly currentStreak: number;
  readonly assessmentCompleted: boolean;
  readonly overallProgressPercentage: number;
}

@Injectable()
export class PartnerVisibilityService {
  public toSharedProgress(snapshot: ProgressSnapshotForSharing | null, user: {
    readonly id: string;
    readonly displayName: string;
  }): PartnerProgressRecord {
    if (snapshot === null) {
      return {
        userId: user.id,
        displayName: user.displayName,
        plannedSessionCount: 0,
        completedSessionCount: 0,
        weeklyCompletionPercentage: 0,
        currentStreak: 0,
        assessmentCompleted: false,
        overallTrackProgressPercentage: 0,
        encouragementStatus: null
      };
    }

    return {
      userId: snapshot.userId,
      displayName: snapshot.displayName,
      plannedSessionCount: snapshot.plannedCount,
      completedSessionCount: snapshot.completedCount,
      weeklyCompletionPercentage: snapshot.weeklyCompletionPercentage,
      currentStreak: snapshot.currentStreak,
      assessmentCompleted: snapshot.assessmentCompleted,
      overallTrackProgressPercentage: snapshot.overallProgressPercentage,
      encouragementStatus: encouragementStatus(snapshot)
    };
  }
}

function encouragementStatus(snapshot: ProgressSnapshotForSharing): string {
  if (snapshot.assessmentCompleted && snapshot.weeklyCompletionPercentage >= 100) {
    return "CELEBRATING_COMPLETED_WEEK";
  }

  if (snapshot.plannedCount > 0 && snapshot.completedCount < snapshot.plannedCount) {
    return "RECOVERING_MISSED_SESSION";
  }

  if (snapshot.weeklyCompletionPercentage < 50) {
    return "OPEN_TO_CHECK_IN";
  }

  return "NEEDS_QUIET_FOCUS";
}
