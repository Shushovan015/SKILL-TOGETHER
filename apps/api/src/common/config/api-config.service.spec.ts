import { describe, expect, it } from "vitest";

import { resolveApiConfig } from "./api-config.service.js";

const baseSource = {
  DATABASE_URL: "postgresql://skilltogether:password@localhost:5432/skilltogether_test",
  SESSION_SECRET: "test-session-secret-for-config-validation",
  CSRF_SECRET: "test-csrf-secret-for-config-validation",
  FRONTEND_URL: "https://skill-together.example.test"
} as const;

describe("resolveApiConfig", () => {
  it("defaults production cookies to secure with prisma persistence", () => {
    const config = resolveApiConfig({
      ...baseSource,
      NODE_ENV: "production"
    });

    expect(config.sessionCookieSecure).toBe(true);
    expect(config.authPersistence).toBe("prisma");
  });

  it("rejects insecure session cookies in production", () => {
    expect(() =>
      resolveApiConfig({
        ...baseSource,
        NODE_ENV: "production",
        SESSION_COOKIE_SECURE: "false"
      })
    ).toThrow("SESSION_COOKIE_SECURE must be true in production");
  });

  it("rejects in-memory auth persistence in production", () => {
    expect(() =>
      resolveApiConfig({
        ...baseSource,
        NODE_ENV: "production",
        AUTH_PERSISTENCE: "memory"
      })
    ).toThrow("AUTH_PERSISTENCE must be prisma in production");
  });

  it("rejects invalid environment enum values instead of silently falling back", () => {
    expect(() =>
      resolveApiConfig({
        ...baseSource,
        NODE_ENV: "prod"
      })
    ).toThrow("NODE_ENV must be one of: development, test, production");

    expect(() =>
      resolveApiConfig({
        ...baseSource,
        AUTH_PERSISTENCE: "volatile"
      })
    ).toThrow("AUTH_PERSISTENCE must be one of: prisma, memory");
  });

  it("rejects wildcard CORS origins when credentialed requests are enabled", () => {
    expect(() =>
      resolveApiConfig({
        ...baseSource,
        CORS_ALLOWED_ORIGINS: "http://localhost:5173,*"
      })
    ).toThrow("CORS_ALLOWED_ORIGINS must not include * when credentials are enabled");
  });
});
