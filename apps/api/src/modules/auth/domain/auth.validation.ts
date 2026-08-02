import { z, type ZodError } from "zod";

import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import { normalizeEmailAddress } from "./email-normalization.js";

export interface ValidatedRegisterInput {
  readonly email: string;
  readonly password: string;
  readonly displayName: string;
  readonly timeZone: string;
}

export interface ValidatedLoginInput {
  readonly email: string;
  readonly password: string;
}

function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

const emailSchema = z
  .string()
  .trim()
  .min(3, "Enter a valid email address.")
  .max(254, "Email must be 254 characters or fewer.")
  .email("Enter a valid email address.")
  .transform(normalizeEmailAddress);

export const passwordPolicyDescription =
  "Password must be at least 12 characters and include uppercase, lowercase, number, and symbol characters.";

const passwordSchema = z
  .string()
  .min(12, passwordPolicyDescription)
  .max(256, "Password must be 256 characters or fewer.")
  .regex(/[a-z]/, passwordPolicyDescription)
  .regex(/[A-Z]/, passwordPolicyDescription)
  .regex(/[0-9]/, passwordPolicyDescription)
  .regex(/[^A-Za-z0-9]/, passwordPolicyDescription);

const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Display name is required.")
  .max(80, "Display name must be 80 characters or fewer.");

const timeZoneSchema = z
  .string()
  .trim()
  .min(1, "Time zone is required.")
  .refine(isValidTimeZone, "Choose a valid time zone.");

const registerInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
  timeZone: timeZoneSchema
});

const loginInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required.").max(256)
});

export function validateRegisterInput(input: unknown): ValidatedRegisterInput {
  const result = registerInputSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return result.data;
}

export function validateLoginInput(input: unknown): ValidatedLoginInput {
  const result = loginInputSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return result.data;
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
