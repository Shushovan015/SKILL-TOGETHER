import { describe, expect, it } from "vitest";

import { QuestionType as PrismaQuestionType } from "../../../generated/prisma/client.js";
import { buildApprovedSeedVersionInput, phase3SeedTracks } from "../../content/seed/phase-03-seed-data.js";
import { questionSeeds } from "./prisma-assessment.repository.js";

describe("Software Engineering assessment question seeds", () => {
  it("creates professional weekly assessment parts for code, debugging, design, and interview readiness", () => {
    const questions = questionSeeds("SOFTWARE_ENGINEERING", "ts-generics");

    expect(questions.map((question) => question.type)).toEqual([
      PrismaQuestionType.MULTIPLE_CHOICE,
      PrismaQuestionType.MULTIPLE_SELECT,
      PrismaQuestionType.CODE_CHALLENGE,
      PrismaQuestionType.DEBUGGING_CHALLENGE,
      PrismaQuestionType.CASE_STUDY,
      PrismaQuestionType.SHORT_ANSWER,
      PrismaQuestionType.REFLECTION
    ]);
    expect(questions).toHaveLength(7);
    expect(questions.every((question) => question.assessmentTags.includes("ts-generics"))).toBe(true);
    expect(questions[0]?.gradingMode).toBe("AUTO");
    expect(questions[2]?.gradingMode).toBe("MANUAL");
    expect(questions[3]?.promptMd).toContain("Part D - Debugging");
    expect(questions[5]?.promptMd).toContain("Part F - Interview 1");
    expect(JSON.stringify(questions[2]?.answerKey)).toContain("boundary safety");
  });
});

describe("German assessment question seeds", () => {
  it("creates CEFR-aware objective and productive assessment items for German lesson tags", () => {
    const questions = questionSeeds("GERMAN", "c2-2-final-integrated-mastery-assessment");

    expect(questions.map((question) => question.type)).toEqual([
      PrismaQuestionType.MULTIPLE_CHOICE,
      PrismaQuestionType.MULTIPLE_SELECT,
      PrismaQuestionType.SCENARIO,
      PrismaQuestionType.REFLECTION
    ]);
    expect(questions).toHaveLength(4);
    expect(questions.every((question) => question.assessmentTags.includes("c2-2-final-integrated-mastery-assessment"))).toBe(true);
    expect(questions[0]?.gradingMode).toBe("AUTO");
    expect(questions[2]?.gradingMode).toBe("MANUAL");
    expect(JSON.stringify(questions[2]?.options)).toContain("C2");
    expect(JSON.stringify(questions[2]?.answerKey)).toContain("mediation");
  });

  it("does not create German assessment items for structural lesson metadata tags", () => {
    expect(questionSeeds("GERMAN", "m01")).toEqual([]);
    expect(questionSeeds("GERMAN", "c2-2")).toEqual([]);
    expect(questionSeeds("GERMAN", "input-phrases")).toEqual([]);
  });

  it("uses one assessable German module tag per implemented module", () => {
    const germanTrack = phase3SeedTracks.find((track) => track.slug === "german");
    const implementedCodes = ["A21", "A22", "B11", "B12", "B21", "B22", "C11", "C12", "C21", "C22"];
    const lessons =
      germanTrack?.modules.flatMap((moduleRecord) => moduleRecord.lessons).filter((lesson) =>
        implementedCodes.some((code) => lesson.identifier.startsWith(`DE-${code}-`))
      ) ?? [];
    const assessableTags = new Set(
      lessons
        .flatMap((lesson) => buildApprovedSeedVersionInput(lesson).assessmentTags)
        .filter((tag) => questionSeeds("GERMAN", tag).length > 0)
    );

    expect(assessableTags.size).toBe(100);
    expect([...assessableTags].some((tag) => /^([abc]\d-\d)-\1-/u.test(tag))).toBe(false);
  });
});
