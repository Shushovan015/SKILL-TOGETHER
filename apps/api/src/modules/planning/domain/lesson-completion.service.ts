import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import type { DailyTaskStatus } from "./planning.types.js";

export class LessonCompletionService {
  public assertCanComplete(status: DailyTaskStatus): void {
    if (status === "COMPLETED") {
      throw createApiGraphqlError({
        code: "TASK_ALREADY_COMPLETED",
        message: apiErrorMessages.TASK_ALREADY_COMPLETED,
        retryable: false
      });
    }

    if (status !== "PLANNED" && status !== "IN_PROGRESS") {
      throw createApiGraphqlError({
        code: "VALIDATION_FAILED",
        message: apiErrorMessages.VALIDATION_FAILED,
        retryable: false,
        field: "status"
      });
    }
  }
}
