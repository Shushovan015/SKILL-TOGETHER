import { z, type ZodError } from "zod";

import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import type { JsonValue } from "../../../common/graphql/json.scalar.js";
import type { SubmitAssessmentInput } from "./assessment.types.js";

const jsonSchema: z.ZodType<JsonValue> = z.custom<JsonValue>(isJsonValue);

const submitAssessmentSchema = z
  .object({
    attemptId: z.string().uuid(),
    answers: z
      .array(
        z.object({
          questionId: z.string().uuid(),
          response: jsonSchema
        })
      )
      .min(1)
      .max(100)
  })
  .superRefine((value, context) => {
    const questionIds = new Set<string>();

    for (const answer of value.answers) {
      if (questionIds.has(answer.questionId)) {
        context.addIssue({
          code: "custom",
          message: "Each question can only be answered once.",
          path: ["answers"]
        });
      }

      questionIds.add(answer.questionId);
    }
  });

export function validateSubmitAssessmentInput(input: unknown): SubmitAssessmentInput {
  const result = submitAssessmentSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return result.data;
}

export function validateAssessmentId(value: unknown): string {
  const result = z.string().uuid().safeParse(value);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return result.data;
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (typeof value === "object" && value !== null) {
    return Object.values(value).every(isJsonValue);
  }

  return false;
}

function validationGraphqlError(error: ZodError): Error {
  const firstIssue = error.issues[0];
  const field = firstIssue?.path.map(String).join(".");

  return createApiGraphqlError({
    code: "VALIDATION_FAILED",
    message: apiErrorMessages.VALIDATION_FAILED,
    retryable: false,
    ...(field === undefined || field.length === 0 ? {} : { field })
  });
}
