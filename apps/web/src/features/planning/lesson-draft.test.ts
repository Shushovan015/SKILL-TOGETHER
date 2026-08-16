// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";

import { clearLessonDraft, emptyLessonDraft, readLessonDraft, writeLessonDraft } from "./lesson-draft.js";

describe("lesson drafts", () => {
  afterEach(() => window.localStorage.clear());

  it("restores unfinished evidence for the same daily task", () => {
    writeLessonDraft("software-task", { ...emptyLessonDraft, guidedEvidence: "typed mapper" });

    expect(readLessonDraft("software-task").guidedEvidence).toBe("typed mapper");
  });

  it("isolates drafts by daily task and clears completed work", () => {
    writeLessonDraft("software-task", { ...emptyLessonDraft, notes: "software" });
    writeLessonDraft("german-task", { ...emptyLessonDraft, notes: "german" });
    clearLessonDraft("software-task");

    expect(readLessonDraft("software-task")).toEqual(emptyLessonDraft);
    expect(readLessonDraft("german-task").notes).toBe("german");
  });

  it("ignores malformed stored content", () => {
    window.localStorage.setItem("skilltogether:lesson-draft:task", "{not-json");

    expect(readLessonDraft("task")).toEqual(emptyLessonDraft);
  });
});
