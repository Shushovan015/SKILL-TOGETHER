import { CombinedGraphQLErrors } from "@apollo/client/errors";

export function getFirstGraphqlErrorCode(error: unknown): string | undefined {
  if (!CombinedGraphQLErrors.is(error)) {
    return undefined;
  }

  const code = error.errors[0]?.extensions?.["code"];
  return typeof code === "string" ? code : undefined;
}

export function getFirstGraphqlErrorField(error: unknown): string | undefined {
  if (!CombinedGraphQLErrors.is(error)) {
    return undefined;
  }

  const field = error.errors[0]?.extensions?.["field"];
  return typeof field === "string" ? field : undefined;
}

export function toSafeAuthMessage(error: unknown): string {
  const code = getFirstGraphqlErrorCode(error);

  if (code === "AUTH_INVALID_CREDENTIALS") {
    return "Email or password is incorrect.";
  }

  if (code === "AUTH_RATE_LIMITED") {
    return "Too many attempts. Try again later.";
  }

  if (code === "CSRF_INVALID") {
    return "Refresh the page and try again.";
  }

  if (code === "VALIDATION_FAILED") {
    return "Check the highlighted fields and try again.";
  }

  if (isLikelyNetworkFailure(error)) {
    return "Cannot reach the authentication server. Start the API and try again.";
  }

  return "Something went wrong. Try again later.";
}

function isLikelyNetworkFailure(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("networkerror") ||
    message.includes("load failed")
  );
}
