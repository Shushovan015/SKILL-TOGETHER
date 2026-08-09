import { getFirstGraphqlErrorCode } from "../../shared/graphql/errors.js";
import type { AssessmentQuestion, JsonValue } from "./graphql.js";

export interface QuestionOption {
  readonly id: string;
  readonly label: string;
}

export function toSafeAssessmentMessage(error: unknown): string {
  const code = getFirstGraphqlErrorCode(error);

  if (code === "ASSESSMENT_NOT_ELIGIBLE") {
    return "This assessment is not available yet.";
  }

  if (code === "ASSESSMENT_ALREADY_SUBMITTED") {
    return "This assessment was already submitted.";
  }

  if (code === "ASSESSMENT_INVALID_ANSWER" || code === "VALIDATION_FAILED") {
    return "Check your answers and try again.";
  }

  if (code === "CSRF_INVALID") {
    return "Refresh the page and try again.";
  }

  return "Something went wrong. Try again later.";
}

export function questionOptions(question: AssessmentQuestion): readonly QuestionOption[] {
  const options = question.options;

  if (!Array.isArray(options)) {
    return [];
  }

  return options
    .map((option): QuestionOption | null => {
      if (typeof option !== "object" || option === null || Array.isArray(option)) {
        return null;
      }

      const id = option["id"];
      const label = option["label"];

      if (typeof id !== "string" || typeof label !== "string") {
        return null;
      }

      return {
        id,
        label
      };
    })
    .filter((option): option is QuestionOption => option !== null);
}

export function isAnswered(value: JsonValue | undefined): boolean {
  if (value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}
