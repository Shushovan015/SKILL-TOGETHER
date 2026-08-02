import { z } from "zod";

export const passwordPolicyMessage =
  "Password must be at least 12 characters and include uppercase, lowercase, number, and symbol characters.";

function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export const registrationFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(12, passwordPolicyMessage)
    .max(256, "Password must be 256 characters or fewer.")
    .regex(/[a-z]/, passwordPolicyMessage)
    .regex(/[A-Z]/, passwordPolicyMessage)
    .regex(/[0-9]/, passwordPolicyMessage)
    .regex(/[^A-Za-z0-9]/, passwordPolicyMessage),
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required.")
    .max(80, "Display name must be 80 characters or fewer."),
  timeZone: z
    .string()
    .trim()
    .min(1, "Time zone is required.")
    .refine(isValidTimeZone, "Choose a valid time zone.")
});

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.").max(256)
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
