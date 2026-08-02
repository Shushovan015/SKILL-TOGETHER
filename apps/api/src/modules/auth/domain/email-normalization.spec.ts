import { describe, expect, it } from "vitest";

import { normalizeEmailAddress } from "./email-normalization.js";

describe("normalizeEmailAddress", () => {
  it("trims surrounding whitespace and lowercases addresses", () => {
    expect(normalizeEmailAddress("  Learner.Name+Test@Example.COM  ")).toBe(
      "learner.name+test@example.com"
    );
  });
});
