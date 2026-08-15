import type { JsonValue } from "./graphql.js";

export type AssessmentDraft = Readonly<Record<string, JsonValue>>;

export function readAssessmentDraft(attemptId: string): AssessmentDraft {
  if (typeof window === "undefined") return {};
  try {
    const saved = window.sessionStorage.getItem(draftKey(attemptId));
    if (saved === null) return {};
    const value: unknown = JSON.parse(saved);
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? value as AssessmentDraft
      : {};
  } catch {
    return {};
  }
}

export function writeAssessmentDraft(attemptId: string, draft: AssessmentDraft): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(draftKey(attemptId), JSON.stringify(draft));
}

export function clearAssessmentDraft(attemptId: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(draftKey(attemptId));
}

function draftKey(attemptId: string): string {
  return `skilltogether:assessment-draft:${attemptId}`;
}
