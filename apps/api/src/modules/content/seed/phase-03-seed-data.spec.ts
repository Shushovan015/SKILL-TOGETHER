import { describe, expect, it } from "vitest";

import { phase3SeedTracks } from "./phase-03-seed-data.js";

const selectableGermanLevels = [
  "A1.1",
  "A1.2",
  "A2.1",
  "A2.2",
  "B1.1",
  "B1.2",
  "B2.1",
  "B2.2"
] as const;

describe("phase 3 German seed data", () => {
  const germanTrack = phase3SeedTracks.find((track) => track.slug === "german");
  const germanLessons = germanTrack?.modules.flatMap((moduleRecord) => moduleRecord.lessons) ?? [];

  it("contains schedulable lessons for every selectable German level", () => {
    expect(germanTrack).toBeDefined();

    for (const level of selectableGermanLevels) {
      expect(germanLessons.some((lesson) => lesson.level === level)).toBe(true);
    }
  });

  it("uses unique German lesson identifiers", () => {
    const identifiers = germanLessons.map((lesson) => lesson.identifier);

    expect(new Set(identifiers).size).toBe(identifiers.length);
  });
});
