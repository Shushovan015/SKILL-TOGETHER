// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";

import { clearAssessmentDraft, readAssessmentDraft, writeAssessmentDraft } from "./assessment-draft.js";

describe("assessment drafts", () => {
  afterEach(() => window.sessionStorage.clear());

  it("restores answers for one attempt without leaking into another", () => {
    writeAssessmentDraft("attempt-1", { question: "answer" });

    expect(readAssessmentDraft("attempt-1")).toEqual({ question: "answer" });
    expect(readAssessmentDraft("attempt-2")).toEqual({});
  });

  it("clears answers after submission", () => {
    writeAssessmentDraft("attempt-1", { question: true });
    clearAssessmentDraft("attempt-1");

    expect(readAssessmentDraft("attempt-1")).toEqual({});
  });
});
