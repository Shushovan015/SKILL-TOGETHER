import { Injectable } from "@nestjs/common";
import { type EnvSource, validateEnvironment } from "@skilltogether/shared";

export type NodeEnvironment = "development" | "test" | "production";
export type SessionSameSite = "lax" | "strict" | "none";
export type AuthPersistence = "prisma" | "memory";
export type ContentPersistence = "prisma" | "memory";

export interface ApiConfig {
  readonly nodeEnv: NodeEnvironment;
  readonly apiPort: number;
  readonly databaseUrl: string | undefined;
  readonly authPersistence: AuthPersistence;
  readonly contentPersistence: ContentPersistence;
  readonly sessionCookieName: string;
  readonly sessionSecret: string;
  readonly sessionTtlMs: number;
  readonly sessionCookieSecure: boolean;
  readonly sessionCookieSameSite: SessionSameSite;
  readonly csrfCookieName: string;
  readonly csrfHeaderName: string;
  readonly csrfSecret: string;
  readonly webOrigin: string;
  readonly corsAllowedOrigins: readonly string[];
}

const nodeEnvironments = ["development", "test", "production"] as const;
const persistenceModes = ["prisma", "memory"] as const;
const sameSiteValues = ["lax", "strict", "none"] as const;

function parseInteger(name: string, value: string, minimum: number, maximum: number): number {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${name} must be an integer between ${minimum} and ${maximum}`);
  }

  return parsed;
}

function parseBoolean(name: string, value: string): boolean {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`${name} must be true or false`);
}

function assertSecret(name: string, value: string, nodeEnv: NodeEnvironment): void {
  if (value.length < 32) {
    throw new Error(`${name} must be at least 32 characters`);
  }

  if (nodeEnv === "production" && value.includes("replace-with")) {
    throw new Error(`${name} must not use the example placeholder in production`);
  }
}

function splitOrigins(value: string): readonly string[] {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

function readOptionalEnum<TValue extends string>(
  name: string,
  values: readonly TValue[],
  value: string | undefined,
  fallback: TValue
): TValue {
  const normalized = value?.trim();

  if (normalized === undefined || normalized.length === 0) {
    return fallback;
  }

  if (values.includes(normalized as TValue)) {
    return normalized as TValue;
  }

  throw new Error(`${name} must be one of: ${values.join(", ")}`);
}

export function resolveApiConfig(source: EnvSource = process.env): ApiConfig {
  const nodeEnv = readOptionalEnum(
    "NODE_ENV",
    nodeEnvironments,
    source["NODE_ENV"],
    "development"
  );
  const authPersistence = readOptionalEnum(
    "AUTH_PERSISTENCE",
    persistenceModes,
    source["AUTH_PERSISTENCE"],
    "prisma"
  );
  const contentPersistence = readOptionalEnum(
    "CONTENT_PERSISTENCE",
    persistenceModes,
    source["CONTENT_PERSISTENCE"],
    "prisma"
  );

  const validation = validateEnvironment(source, [
    {
      name: "DATABASE_URL",
      required: authPersistence === "prisma" || contentPersistence === "prisma"
    },
    {
      name: "SESSION_SECRET",
      required: true
    },
    {
      name: "CSRF_SECRET",
      required: true
    },
    {
      name: "SESSION_COOKIE_NAME",
      required: false,
      defaultValue: "skilltogether.sid"
    },
    {
      name: "SESSION_COOKIE_SAME_SITE",
      required: false,
      defaultValue: "lax",
      allowedValues: sameSiteValues
    },
    {
      name: "SESSION_TTL_DAYS",
      required: false,
      defaultValue: "14"
    },
    {
      name: "CSRF_COOKIE_NAME",
      required: false,
      defaultValue: "skilltogether.csrf"
    },
    {
      name: "CSRF_HEADER_NAME",
      required: false,
      defaultValue: "x-csrf-token"
    },
    {
      name: "WEB_ORIGIN",
      required: false,
      defaultValue: "http://localhost:5173"
    },
    {
      name: "CORS_ALLOWED_ORIGINS",
      required: false,
      defaultValue: source["WEB_ORIGIN"] ?? "http://localhost:5173"
    },
    {
      name: "API_PORT",
      required: false,
      defaultValue: "4000"
    },
    {
      name: "SESSION_COOKIE_SECURE",
      required: false,
      defaultValue: nodeEnv === "production" ? "true" : "false"
    }
  ]);

  if (validation.errors.length > 0) {
    throw new Error(validation.errors.join("; "));
  }

  const sessionSecret = validation.values["SESSION_SECRET"];
  const csrfSecret = validation.values["CSRF_SECRET"];

  if (sessionSecret === undefined || csrfSecret === undefined) {
    throw new Error("SESSION_SECRET and CSRF_SECRET are required");
  }

  assertSecret("SESSION_SECRET", sessionSecret, nodeEnv);
  assertSecret("CSRF_SECRET", csrfSecret, nodeEnv);

  const sameSite = readOptionalEnum(
    "SESSION_COOKIE_SAME_SITE",
    sameSiteValues,
    validation.values["SESSION_COOKIE_SAME_SITE"],
    "lax"
  );
  const secure = parseBoolean(
    "SESSION_COOKIE_SECURE",
    validation.values["SESSION_COOKIE_SECURE"] ?? "false"
  );
  const corsAllowedOrigins = splitOrigins(
    validation.values["CORS_ALLOWED_ORIGINS"] ?? "http://localhost:5173"
  );

  if (sameSite === "none" && !secure) {
    throw new Error("SESSION_COOKIE_SECURE must be true when SameSite=None");
  }

  if (nodeEnv === "production" && !secure) {
    throw new Error("SESSION_COOKIE_SECURE must be true in production");
  }

  if (nodeEnv === "production" && authPersistence !== "prisma") {
    throw new Error("AUTH_PERSISTENCE must be prisma in production");
  }

  if (nodeEnv === "production" && contentPersistence !== "prisma") {
    throw new Error("CONTENT_PERSISTENCE must be prisma in production");
  }

  if (corsAllowedOrigins.includes("*")) {
    throw new Error("CORS_ALLOWED_ORIGINS must not include * when credentials are enabled");
  }

  return {
    nodeEnv,
    apiPort: parseInteger("API_PORT", validation.values["API_PORT"] ?? "4000", 1, 65_535),
    databaseUrl: validation.values["DATABASE_URL"],
    authPersistence,
    contentPersistence,
    sessionCookieName: validation.values["SESSION_COOKIE_NAME"] ?? "skilltogether.sid",
    sessionSecret,
    sessionTtlMs:
      parseInteger("SESSION_TTL_DAYS", validation.values["SESSION_TTL_DAYS"] ?? "14", 1, 90) *
      24 *
      60 *
      60 *
      1000,
    sessionCookieSecure: secure,
    sessionCookieSameSite: sameSite,
    csrfCookieName: validation.values["CSRF_COOKIE_NAME"] ?? "skilltogether.csrf",
    csrfHeaderName: validation.values["CSRF_HEADER_NAME"] ?? "x-csrf-token",
    csrfSecret,
    webOrigin: validation.values["WEB_ORIGIN"] ?? "http://localhost:5173",
    corsAllowedOrigins
  };
}

@Injectable()
export class ApiConfigService {
  public readonly value: ApiConfig;

  public constructor() {
    this.value = resolveApiConfig();
  }
}
