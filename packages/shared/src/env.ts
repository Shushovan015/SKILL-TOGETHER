export type EnvSource = Readonly<Record<string, string | undefined>>;

export interface EnvVariableSpec {
  readonly name: string;
  readonly required: boolean;
  readonly defaultValue?: string;
  readonly allowedValues?: readonly string[];
}

export interface EnvValidationResult {
  readonly values: Readonly<Record<string, string>>;
  readonly errors: readonly string[];
}

export function validateEnvironment(
  source: EnvSource,
  specs: readonly EnvVariableSpec[]
): EnvValidationResult {
  const values: Record<string, string> = {};
  const errors: string[] = [];

  for (const spec of specs) {
    const rawValue = source[spec.name];
    const value = rawValue === undefined || rawValue.trim() === "" ? spec.defaultValue : rawValue;

    if (value === undefined) {
      if (spec.required) {
        errors.push(`${spec.name} is required`);
      }
      continue;
    }

    if (spec.allowedValues !== undefined && !spec.allowedValues.includes(value)) {
      errors.push(`${spec.name} must be one of: ${spec.allowedValues.join(", ")}`);
      continue;
    }

    values[spec.name] = value;
  }

  return {
    values,
    errors
  };
}
