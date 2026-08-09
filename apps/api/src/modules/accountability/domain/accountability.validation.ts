import { z, type ZodError } from "zod";

import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import { normalizeEmailAddress } from "../../auth/domain/email-normalization.js";
import type { InvitePartnerInput } from "./accountability.types.js";

const emailSchema = z
  .string()
  .trim()
  .min(3)
  .max(254)
  .email()
  .transform(normalizeEmailAddress);

const invitePartnerSchema = z.object({
  email: emailSchema
});

const idSchema = z.string().uuid();

export function validateInvitePartnerInput(input: unknown): InvitePartnerInput {
  const result = invitePartnerSchema.safeParse(input);

  if (!result.success) {
    throw validationGraphqlError(result.error);
  }

  return result.data;
}

export function validateAccountabilityId(value: unknown): string {
  const result = idSchema.safeParse(value);

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
