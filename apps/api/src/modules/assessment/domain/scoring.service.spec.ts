import { describe, expect, it } from "vitest";

import { AssessmentScoringService } from "./scoring.service.js";

describe("AssessmentScoringService feedback", () => {
  const service = new AssessmentScoringService();

  it("explains why an objective answer is incorrect", () => {
    const result = service.score({ type: "TRUE_FALSE", answerKey: true, points: 1, assessmentTags: ["risk"] }, false);

    expect(result.score).toBe(0);
    expect(result.feedback).toContain("does not match the reviewed answer");
    expect(result.feedback).toContain("before retrying");
  });

  it("distinguishes a malformed response from a wrong answer", () => {
    const result = service.score({ type: "MULTIPLE_CHOICE", answerKey: "a", points: 1, assessmentTags: ["dto"] }, ["a"]);

    expect(result.feedback).toContain("format did not match");
  });
});
