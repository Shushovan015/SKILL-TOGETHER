import { z, type ZodError } from "zod";

import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import { parseDateOnly } from "../../../common/graphql/date.scalar.js";
import type { LessonVersionEditorInput, SelectLearningTrackInput } from "./content.types.js";

const textField = z.string().trim().min(1).max(4_000);
const shortTextField = z.string().trim().min(1).max(200);
const tagSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/u);

const resourceSchema = z.object({
  title: shortTextField,
  url: z
    .string()
    .trim()
    .url()
    .refine((value) => {
      const url = new URL(value);
      return url.protocol === "https:";
    }, "Resource URLs must use HTTPS."),
  resourceType: shortTextField,
  required: z.boolean(),
  approved: z.boolean(),
  citation: textField
});

const exerciseSchema = z.object({
  kind: shortTextField,
  promptMarkdown: textField,
  expectedEvidence: textField,
  solutionNotesMarkdown: z.string().trim().max(4_000).nullable()
});

const knowledgeCheckSchema = z.object({
  question: textField,
  answerKey: z.array(shortTextField).min(1).max(10),
  explanation: textField
});

const lessonVersionEditorSchema = z.object({
  title: shortTextField,
  learningObjective: textField,
  outcomes: z.array(textField).min(1).max(10),
  explanationMarkdown: textField,
  relevanceMarkdown: textField,
  examples: z.array(textField).min(1).max(10),
  commonMistakes: z.array(textField).min(1).max(10),
  assessmentTags: z.array(tagSchema).min(1).max(20),
  resources: z.array(resourceSchema).min(1).max(12),
  exercises: z.array(exerciseSchema).min(1).max(6),
  knowledgeChecks: z.array(knowledgeCheckSchema).min(1).max(10)
});

const selectLearningTrackSchema = z.object({
  trackId: z.string().uuid(),
  startDate: z.union([z.date(), z.string().transform(parseDateOnly)]),
  experienceLevel: shortTextField,
  targetOutcome: textField
});

export function validateLessonVersionEditorInput(input: unknown): LessonVersionEditorInput {
  const result = lessonVersionEditorSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return result.data;
}

export function validateSelectLearningTrackInput(input: unknown): SelectLearningTrackInput {
  const result = selectLearningTrackSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return result.data;
}

export function assertLessonVersionIsApprovable(input: LessonVersionEditorInput): void {
  const hasUnapprovedResource = input.resources.some((resource) => !resource.approved);

  if (hasUnapprovedResource) {
    throw createApiGraphqlError({
      code: "CONTENT_APPROVAL_FAILED",
      message: apiErrorMessages.CONTENT_APPROVAL_FAILED,
      retryable: false,
      field: "resources"
    });
  }
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
