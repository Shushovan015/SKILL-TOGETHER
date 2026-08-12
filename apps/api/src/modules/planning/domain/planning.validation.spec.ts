import { describe, expect, it } from "vitest";

import { validateOnboardingInput } from "./planning.validation.js";

const baseGermanInput = {
  trackId: "00000000-0000-4000-8000-000000000101",
  startDate: "2026-08-10",
  studyDays: [1, 2, 3, 4, 5],
  availableMinutesByDay: {
    "1": 60,
    "2": 60,
    "3": 60,
    "4": 60,
    "5": 60,
    "6": 60
  },
  preferredSessionTime: null,
  experienceLevel: "C1.2",
  targetOutcome: "Reach C2 professional German.",
  germanStartLevel: "C1.2",
  germanTargetLevel: "C2.2",
  germanSessionDurationMinutes: 90,
  assessmentDay: 5,
  recoveryDay: 6,
  pausePeriods: []
} as const;

describe("German onboarding validation", () => {
  it("accepts C-level German start and target levels with 90-minute sessions", () => {
    const input = validateOnboardingInput(baseGermanInput);

    expect(input.germanStartLevel).toBe("C1.2");
    expect(input.germanTargetLevel).toBe("C2.2");
    expect(input.germanSessionDurationMinutes).toBe(90);
  });

  it("allows Complete Beginner to target levels above A1.1", () => {
    const input = validateOnboardingInput({
      ...baseGermanInput,
      experienceLevel: "COMPLETE_BEGINNER",
      germanStartLevel: "COMPLETE_BEGINNER",
      germanTargetLevel: "A1.2",
      germanSessionDurationMinutes: 30
    });

    expect(input.germanStartLevel).toBe("COMPLETE_BEGINNER");
    expect(input.germanTargetLevel).toBe("A1.2");
    expect(input.germanSessionDurationMinutes).toBe(30);
  });

  it("rejects a target that is not above normalized Complete Beginner", () => {
    expect(() =>
      validateOnboardingInput({
        ...baseGermanInput,
        experienceLevel: "COMPLETE_BEGINNER",
        germanStartLevel: "COMPLETE_BEGINNER",
        germanTargetLevel: "A1.1"
      })
    ).toThrow();
  });
});
