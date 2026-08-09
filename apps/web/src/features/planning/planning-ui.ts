import { getFirstGraphqlErrorCode } from "../../shared/graphql/errors.js";

export function toSafePlanningMessage(error: unknown): string {
  const code = getFirstGraphqlErrorCode(error);

  if (code === "AUTH_FORBIDDEN") {
    return "You do not have access to this item.";
  }

  if (code === "AUTH_REQUIRED") {
    return "Please log in to continue.";
  }

  if (code === "PLAN_CAPACITY_EXCEEDED") {
    return "Your schedule does not have enough available time.";
  }

  if (code === "RECOVERY_NOT_AVAILABLE") {
    return "No valid recovery slot is available yet.";
  }

  if (code === "VALIDATION_FAILED") {
    return "Check the highlighted fields and try again.";
  }

  if (isLikelyNetworkFailure(error)) {
    return "Cannot reach the planner server. Start the API and try again.";
  }

  return "Something went wrong. Try again later.";
}

export function todayDateInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00.000Z`));
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
