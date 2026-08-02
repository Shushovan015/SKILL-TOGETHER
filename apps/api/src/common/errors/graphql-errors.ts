import { GraphQLError } from "graphql";

export type ApiErrorCode =
  | "AUTH_FORBIDDEN"
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_RATE_LIMITED"
  | "AUTH_REQUIRED"
  | "CONFLICT"
  | "CSRF_INVALID"
  | "INTERNAL_ERROR"
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
  CONFLICT: "Refresh and try again.",
  CSRF_INVALID: "Refresh the page and try again.",
  INTERNAL_ERROR: "Something went wrong. Try again later.",
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
