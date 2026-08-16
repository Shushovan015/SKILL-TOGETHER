export interface LessonDraft {
  readonly guidedEvidence: string;
  readonly independentEvidence: string;
  readonly knowledgeCheckEvidence: string;
  readonly notes: string;
  readonly reflection: string;
}

export const emptyLessonDraft: LessonDraft = {
  guidedEvidence: "",
  independentEvidence: "",
  knowledgeCheckEvidence: "",
  notes: "",
  reflection: ""
};

export function readLessonDraft(dailyTaskId: string | undefined): LessonDraft {
  if (dailyTaskId === undefined || typeof window === "undefined") return emptyLessonDraft;

  try {
    const saved = window.localStorage.getItem(draftKey(dailyTaskId));
    if (saved === null) return emptyLessonDraft;
    const value: unknown = JSON.parse(saved);
    return isLessonDraft(value) ? value : emptyLessonDraft;
  } catch {
    return emptyLessonDraft;
  }
}

export function writeLessonDraft(dailyTaskId: string, draft: LessonDraft): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(draftKey(dailyTaskId), JSON.stringify(draft));
}

export function clearLessonDraft(dailyTaskId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(draftKey(dailyTaskId));
}

function draftKey(dailyTaskId: string): string {
  return `skilltogether:lesson-draft:${dailyTaskId}`;
}

function isLessonDraft(value: unknown): value is LessonDraft {
  if (typeof value !== "object" || value === null) return false;
  const draft = value as Record<string, unknown>;
  return ["guidedEvidence", "independentEvidence", "knowledgeCheckEvidence", "notes", "reflection"]
    .every((field) => typeof draft[field] === "string");
}
