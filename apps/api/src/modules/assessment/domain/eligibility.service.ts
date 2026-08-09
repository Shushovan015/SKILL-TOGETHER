import { Injectable } from "@nestjs/common";

import type { AssessmentAttemptStatus } from "./assessment.types.js";

@Injectable()
export class AssessmentEligibilityService {
  public hasActiveAttempt(statuses: readonly AssessmentAttemptStatus[]): boolean {
    return statuses.some((status) => status === "NOT_STARTED" || status === "IN_PROGRESS");
  }

  public canCreateAttempt(
    statuses: readonly AssessmentAttemptStatus[],
    maxAttempts: number
  ): boolean {
    if (statuses.some((status) => status === "PASSED" || status === "NEEDS_MANUAL_GRADING")) {
      return false;
    }

    return statuses.length < maxAttempts;
  }
}
