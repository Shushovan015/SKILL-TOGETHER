import { z, type ZodError } from "zod";

import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import { parseDateOnly } from "../../../common/graphql/date.scalar.js";
import type { LessonVersionEditorInput, SelectLearningTrackInput } from "./content.types.js";

const textField = z.string().trim().min(1).max(4_000);
const shortTextField = z.string().trim().min(1).max(200);
const learnerLevelSchema = z.enum([
  "Beginner",
  "Intermediate",
  "Advanced",
  "JavaScript Frontend Developer - TypeScript New"
]);
const germanLevelSchema = z.enum([
  "COMPLETE_BEGINNER",
  "A1.1",
  "A1.2",
  "A2.1",
  "A2.2",
  "B1.1",
  "B1.2",
  "B2.1",
  "B2.2"
]);
const germanTargetLevelSchema = germanLevelSchema.exclude(["COMPLETE_BEGINNER"]);
const germanSessionDurationSchema = z.union([z.literal(30), z.literal(45), z.literal(60), z.literal(90)]);
const tagSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/u);

const resourceSchema = z.object({
  title: shortTextField,
  provider: shortTextField,
  url: z
    .string()
    .trim()
    .url()
    .refine((value) => {
      const url = new URL(value);
      return url.protocol === "https:";
    }, "Resource URLs must use HTTPS."),
  resourceType: shortTextField,
  difficulty: shortTextField,
  estimatedMinutes: z.number().int().min(1).max(240),
  description: textField,
  verificationStatus: z.enum(["VERIFIED", "NEEDS_VERIFICATION"]),
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

const selectLearningTrackSchema = z
  .object({
    trackId: z.string().uuid(),
    startDate: z.union([z.date(), z.string().transform(parseDateOnly)]),
    experienceLevel: z.union([learnerLevelSchema, germanLevelSchema]),
    targetOutcome: textField,
    germanStartLevel: germanLevelSchema.nullable().optional(),
    germanTargetLevel: germanTargetLevelSchema.nullable().optional(),
    germanSessionDurationMinutes: germanSessionDurationSchema.nullable().optional()
  })
  .superRefine((value, context) => {
    if (
      value.germanStartLevel !== undefined &&
      value.germanStartLevel !== null &&
      value.germanTargetLevel !== undefined &&
      value.germanTargetLevel !== null &&
      compareGermanLevels(value.germanTargetLevel, normalizedGermanStartLevel(value.germanStartLevel)) <= 0
    ) {
      context.addIssue({
        code: "custom",
        message: "German target level must be above the starting level.",
        path: ["germanTargetLevel"]
      });
    }
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

  return {
    ...result.data,
    germanStartLevel: result.data.germanStartLevel ?? null,
    germanTargetLevel: result.data.germanTargetLevel ?? null,
    germanSessionDurationMinutes: result.data.germanSessionDurationMinutes ?? null
  };
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

const germanLevelOrder = ["A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B1.2", "B2.1", "B2.2"] as const;

function normalizedGermanStartLevel(level: z.infer<typeof germanLevelSchema>): Exclude<z.infer<typeof germanLevelSchema>, "COMPLETE_BEGINNER"> {
  return level === "COMPLETE_BEGINNER" ? "A1.1" : level;
}

function compareGermanLevels(
  left: Exclude<z.infer<typeof germanLevelSchema>, "COMPLETE_BEGINNER">,
  right: Exclude<z.infer<typeof germanLevelSchema>, "COMPLETE_BEGINNER">
): number {
  return germanLevelOrder.indexOf(left) - germanLevelOrder.indexOf(right);
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
