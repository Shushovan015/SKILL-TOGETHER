import { z, type ZodError } from "zod";

import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import { parseDateOnly } from "../../../common/graphql/date.scalar.js";
import type {
  CompleteDailyTaskInput,
  OnboardingInput,
  PauseEnrollmentInput,
  ReconfigureEnrollmentInput,
  RescheduleTaskInput
} from "./planning.types.js";

const daySchema = z.number().int().min(0).max(6);
const minutesSchema = z.number().int().min(15).max(480);
const dateSchema = z.union([z.date(), z.string().transform(parseDateOnly)]);
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
const idSchema = z.string().uuid();
const timeSchema = z
  .string()
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/u)
  .nullable();

const pausePeriodSchema = z
  .object({
    startsOn: dateSchema,
    endsOn: dateSchema,
    reason: z.string().trim().max(500).nullable().optional()
  })
  .refine((value) => value.endsOn >= value.startsOn, {
    message: "Pause end must be on or after pause start.",
    path: ["endsOn"]
  });

const onboardingSchema = z
  .object({
    trackId: z.string().uuid(),
    startDate: dateSchema,
    studyDays: z.array(daySchema).min(1).max(7),
    availableMinutesByDay: z.record(z.string(), minutesSchema),
    preferredSessionTime: timeSchema.optional(),
    experienceLevel: z.union([learnerLevelSchema, germanLevelSchema]),
    targetOutcome: z.string().trim().min(1).max(4_000),
    germanStartLevel: germanLevelSchema.nullable().optional(),
    germanTargetLevel: germanTargetLevelSchema.nullable().optional(),
    germanSessionDurationMinutes: germanSessionDurationSchema.nullable().optional(),
    assessmentDay: daySchema,
    recoveryDay: daySchema,
    pausePeriods: z.array(pausePeriodSchema).max(12).optional()
  })
  .superRefine((value, context) => {
    const uniqueStudyDays = new Set(value.studyDays);

    if (uniqueStudyDays.size !== value.studyDays.length) {
      context.addIssue({
        code: "custom",
        message: "Study days must be unique.",
        path: ["studyDays"]
      });
    }

    for (const day of [...uniqueStudyDays, value.recoveryDay]) {
      if (value.availableMinutesByDay[String(day)] === undefined) {
        context.addIssue({
          code: "custom",
          message: "Available minutes are required for each study or recovery day.",
          path: ["availableMinutesByDay"]
        });
      }
    }

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

const rescheduleSchema = z.object({
  dailyTaskId: z.string().uuid(),
  strategy: z.string().trim().min(1).max(80),
  targetDate: dateSchema.nullable().optional()
});

const pauseEnrollmentSchema = z
  .object({
    enrollmentId: z.string().uuid(),
    startsOn: dateSchema,
    endsOn: dateSchema,
    reason: z.string().trim().max(500).nullable().optional()
  })
  .refine((value) => value.endsOn >= value.startsOn, {
    message: "Pause end must be on or after pause start.",
    path: ["endsOn"]
  });

const completionEvidenceSchema = z
  .record(z.string(), z.unknown())
  .refine((value) => Object.keys(value).length > 0, {
    message: "Completion evidence is required."
  })
  .refine(
    (value) =>
      Object.values(value).some(
        (fieldValue) => typeof fieldValue === "string" && fieldValue.trim().length > 0
      ),
    {
      message: "Completion evidence is required."
    }
  );

const completeDailyTaskSchema = z.object({
  dailyTaskId: z.string().uuid(),
  durationMinutes: z.number().int().min(1).max(480),
  completionEvidence: completionEvidenceSchema,
  reflection: z.string().trim().max(4_000).nullable().optional()
});

export function validateOnboardingInput(input: unknown): OnboardingInput {
  const result = onboardingSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return {
    ...result.data,
    studyDays: [...new Set(result.data.studyDays)].sort((left, right) => left - right),
    availableMinutesByDay: Object.fromEntries(
      Object.entries(result.data.availableMinutesByDay).map(([day, minutes]) => [Number(day), minutes])
    ),
    preferredSessionTime: result.data.preferredSessionTime ?? null,
    germanStartLevel: result.data.germanStartLevel ?? null,
    germanTargetLevel: result.data.germanTargetLevel ?? null,
    germanSessionDurationMinutes: result.data.germanSessionDurationMinutes ?? null,
    pausePeriods: (result.data.pausePeriods ?? []).map((pausePeriod) => ({
      startsOn: pausePeriod.startsOn,
      endsOn: pausePeriod.endsOn,
      reason: pausePeriod.reason ?? null
    }))
  };
}

export function validateReconfigureEnrollmentInput(input: unknown): ReconfigureEnrollmentInput {
  const enrollmentIdResult = z
    .object({
      enrollmentId: idSchema
    })
    .safeParse(input);

  if (!enrollmentIdResult.success) {
    throw validationGraphqlError(enrollmentIdResult.error);
  }

  return {
    ...validateOnboardingInput(input),
    enrollmentId: enrollmentIdResult.data.enrollmentId
  };
}

export function validateEnrollmentId(input: unknown): string {
  const result = idSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return result.data;
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

export function validateRescheduleTaskInput(input: unknown): RescheduleTaskInput {
  const result = rescheduleSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return {
    ...result.data,
    targetDate: result.data.targetDate ?? null
  };
}

export function validatePauseEnrollmentInput(input: unknown): PauseEnrollmentInput {
  const result = pauseEnrollmentSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return {
    ...result.data,
    reason: result.data.reason ?? null
  };
}

export function validateCompleteDailyTaskInput(input: unknown): CompleteDailyTaskInput {
  const result = completeDailyTaskSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return {
    dailyTaskId: result.data.dailyTaskId,
    durationMinutes: result.data.durationMinutes,
    completionEvidence: result.data.completionEvidence,
    reflection:
      result.data.reflection === undefined ||
      result.data.reflection === null ||
      result.data.reflection.length === 0
        ? null
        : result.data.reflection
  };
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
