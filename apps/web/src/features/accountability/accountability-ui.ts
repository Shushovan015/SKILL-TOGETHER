import { getFirstGraphqlErrorCode } from "../../shared/graphql/errors.js";

export function toSafeAccountabilityMessage(error: unknown): string {
  const code = getFirstGraphqlErrorCode(error);

  if (code === "PARTNER_INVITATION_EXISTS") {
    return "An invitation is already pending.";
  }

  if (code === "PARTNER_INVITATION_EXPIRED") {
    return "This invitation has expired.";
  }

  if (code === "PARTNER_CONNECTION_NOT_FOUND") {
    return "This partner connection is not available.";
  }

  if (code === "PARTNER_BLOCKED") {
    return "This invitation cannot be sent.";
  }

  if (code === "VALIDATION_FAILED") {
    return "Check the email address and try again.";
  }

  if (code === "CSRF_INVALID") {
    return "Refresh the page and try again.";
  }

  return "Something went wrong. Try again later.";
}

export function formatPartnerDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium"
  }).format(new Date(value));
}
