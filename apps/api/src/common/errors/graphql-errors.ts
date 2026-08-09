import { GraphQLError } from "graphql";

export type ApiErrorCode =
  | "AUTH_FORBIDDEN"
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_RATE_LIMITED"
  | "AUTH_REQUIRED"
  | "ASSESSMENT_ALREADY_SUBMITTED"
  | "ASSESSMENT_INVALID_ANSWER"
  | "ASSESSMENT_NOT_ELIGIBLE"
  | "CONFLICT"
  | "CONTENT_APPROVAL_FAILED"
  | "CONTENT_INVALID_STATUS"
  | "CONTENT_NOT_FOUND"
  | "CONTENT_VERSION_CONFLICT"
  | "CSRF_INVALID"
  | "INTERNAL_ERROR"
  | "LESSON_EVIDENCE_REQUIRED"
  | "NOT_FOUND"
  | "PARTNER_BLOCKED"
  | "PARTNER_CONNECTION_NOT_FOUND"
  | "PARTNER_INVITATION_EXPIRED"
  | "PARTNER_INVITATION_EXISTS"
  | "PLAN_CAPACITY_EXCEEDED"
  | "RECOVERY_NOT_AVAILABLE"
  | "TASK_ALREADY_COMPLETED"
  | "VALIDATION_FAILED";

export interface ApiGraphqlErrorOptions {
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly retryable: boolean;
  readonly field?: string;
}

export const apiErrorMessages = {
  AUTH_FORBIDDEN: "You do not have access to this item.",
  AUTH_INVALID_CREDENTIALS: "Email or password is incorrect.",
  AUTH_RATE_LIMITED: "Too many attempts. Try again later.",
  AUTH_REQUIRED: "Please log in to continue.",
  ASSESSMENT_ALREADY_SUBMITTED: "This assessment was already submitted.",
  ASSESSMENT_INVALID_ANSWER: "Check your answer format.",
  ASSESSMENT_NOT_ELIGIBLE: "This assessment is not available yet.",
  CONFLICT: "Refresh and try again.",
  CONTENT_APPROVAL_FAILED: "Complete required content fields before approval.",
  CONTENT_INVALID_STATUS: "This content cannot move to that status.",
  CONTENT_NOT_FOUND: "This content is not available.",
  CONTENT_VERSION_CONFLICT: "Refresh and review the latest version.",
  CSRF_INVALID: "Refresh the page and try again.",
  INTERNAL_ERROR: "Something went wrong. Try again later.",
  LESSON_EVIDENCE_REQUIRED: "Add the required completion evidence.",
  NOT_FOUND: "This item is not available.",
  PARTNER_BLOCKED: "This invitation cannot be sent.",
  PARTNER_CONNECTION_NOT_FOUND: "This partner connection is not available.",
  PARTNER_INVITATION_EXPIRED: "This invitation has expired.",
  PARTNER_INVITATION_EXISTS: "An invitation is already pending.",
  PLAN_CAPACITY_EXCEEDED: "Your schedule does not have enough available time.",
  RECOVERY_NOT_AVAILABLE: "No valid recovery slot is available yet.",
  TASK_ALREADY_COMPLETED: "This task is already completed.",
  VALIDATION_FAILED: "Check the highlighted fields and try again."
} as const satisfies Record<ApiErrorCode, string>;

export function createApiGraphqlError(options: ApiGraphqlErrorOptions): GraphQLError {
  return new GraphQLError(options.message, {
    extensions: {
      code: options.code,
      retryable: options.retryable,
      ...(options.field === undefined ? {} : { field: options.field })
    }
  });
}
