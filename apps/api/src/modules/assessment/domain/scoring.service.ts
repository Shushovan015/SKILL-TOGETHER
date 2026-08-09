import { Injectable } from "@nestjs/common";

import type { JsonValue } from "../../../common/graphql/json.scalar.js";
import type { QuestionType } from "./assessment.types.js";

export interface ScoreableQuestion {
  readonly type: QuestionType;
  readonly answerKey: JsonValue;
  readonly points: number;
  readonly assessmentTags: readonly string[];
}

export interface ScoreResult {
  readonly score: number | null;
  readonly feedback: string | null;
  readonly autoScored: boolean;
}

@Injectable()
export class AssessmentScoringService {
  public score(question: ScoreableQuestion, response: JsonValue): ScoreResult {
    switch (question.type) {
      case "TRUE_FALSE":
        return this.scoreBoolean(question, response);
      case "MULTIPLE_CHOICE":
        return this.scoreSingleChoice(question, response);
      case "MULTIPLE_SELECT":
        return this.scoreMultipleSelect(question, response);
      case "SHORT_ANSWER":
      case "CODE_CHALLENGE":
      case "DEBUGGING_CHALLENGE":
      case "SCENARIO":
      case "CASE_STUDY":
      case "PRACTICAL_ASSIGNMENT":
      case "REFLECTION":
        return {
          score: null,
          feedback: "This answer requires review.",
          autoScored: false
        };
    }
  }

  private scoreBoolean(question: ScoreableQuestion, response: JsonValue): ScoreResult {
    if (typeof question.answerKey !== "boolean" || typeof response !== "boolean") {
      return invalidAnswerResult();
    }

    return objectiveResult(question.points, response === question.answerKey);
  }

  private scoreSingleChoice(question: ScoreableQuestion, response: JsonValue): ScoreResult {
    if (typeof question.answerKey !== "string" || typeof response !== "string") {
      return invalidAnswerResult();
    }

    return objectiveResult(question.points, response === question.answerKey);
  }

  private scoreMultipleSelect(question: ScoreableQuestion, response: JsonValue): ScoreResult {
    if (!isStringArray(question.answerKey) || !isStringArray(response)) {
      return invalidAnswerResult();
    }

    const expected = [...question.answerKey].sort();
    const actual = [...response].sort();
    const correct =
      expected.length === actual.length &&
      expected.every((answer, index) => answer === actual[index]);

    return objectiveResult(question.points, correct);
  }
}

function objectiveResult(points: number, correct: boolean): ScoreResult {
  return {
    score: correct ? points : 0,
    feedback: correct ? "Correct." : "Review this topic.",
    autoScored: true
  };
}

function invalidAnswerResult(): ScoreResult {
  return {
    score: 0,
    feedback: "Answer format was invalid.",
    autoScored: true
  };
}

function isStringArray(value: JsonValue): value is readonly string[] {
  return Array.isArray(value) && value.every((item): item is string => typeof item === "string");
}
