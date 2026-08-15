import { describe, expect, it } from "vitest";

import { germanLevelsForRange } from "./prisma-planning.repository.js";

describe("German enrollment lesson range", () => {
  it("starts an A2.2 plan at A2.2 and excludes all A1 lessons", () => {
    expect(germanLevelsForRange("A2.2", "B1.1")).toEqual(["A2.2", "B1.1"]);
  });

  it("normalizes a complete beginner to A1.1", () => {
    expect(germanLevelsForRange("COMPLETE_BEGINNER", "A1.2")).toEqual(["A1.1", "A1.2"]);
  });
});
