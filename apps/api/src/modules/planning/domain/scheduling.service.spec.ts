import { describe, expect, it } from "vitest";

import type { ApprovedLessonForScheduling, PlanPreferences } from "./planning.types.js";
import { plannedDurationFor, SchedulingDomainService } from "./scheduling.service.js";

const preferences: PlanPreferences = {
  startDate: new Date("2026-01-05T00:00:00.000Z"),
  studyDays: [1, 2, 3, 4, 5],
  availableMinutesByDay: { 1: 30, 2: 30, 3: 30, 4: 30, 5: 30, 6: 120 },
  assessmentDay: 5,
  recoveryDay: 6,
  pausePeriods: []
};

function lesson(trackType: ApprovedLessonForScheduling["trackType"]): ApprovedLessonForScheduling {
  return {
    lessonId: "lesson-1",
    lessonVersionId: "version-1",
    moduleSequence: 1,
    lessonSequence: 1,
    trackType,
    trackTitle: "Software Engineering",
    moduleTitle: "TypeScript Foundations",
    title: "A typed boundary",
    learningObjective: "Model a boundary",
    outcomes: [],
    explanationMarkdown: "",
    relevanceMarkdown: "",
    examples: [],
    commonMistakes: [],
    assessmentTags: [],
    durationMinutes: 120,
    required: true,
    prerequisiteLessonIds: [],
    resources: [],
    exercises: [],
    knowledgeChecks: []
  };
}

describe("professional session duration scheduling", () => {
  it("adapts a 120-minute Software Engineering source lesson to the selected 30-minute study session", () => {
    const sourceLesson = lesson("SOFTWARE_ENGINEERING");

    expect(plannedDurationFor(sourceLesson, preferences)).toBe(30);
    expect(new SchedulingDomainService().createSchedule([sourceLesson], preferences).tasks[0])
      .toMatchObject({ plannedDurationMinutes: 30 });
  });

  it("adapts Project Management sessions to the selected professional duration", () => {
    expect(plannedDurationFor(lesson("PROJECT_MANAGEMENT"), preferences)).toBe(30);
  });

  it("does not silently shorten German sessions composed by the German duration path", () => {
    expect(plannedDurationFor(lesson("GERMAN"), preferences)).toBe(120);
  });
});
