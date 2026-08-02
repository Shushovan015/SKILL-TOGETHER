import type { Server } from "node:http";

import { type INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request, { type Response } from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AppModule } from "../../app.module.js";
import { configureApplication } from "../../configure-app.js";

interface GraphqlErrorExtension {
  readonly code?: string;
  readonly field?: string;
  readonly retryable?: boolean;
}

interface GraphqlErrorResponse {
  readonly message: string;
  readonly extensions?: GraphqlErrorExtension;
}

interface GraphqlBody<TData> {
  readonly data?: TData;
  readonly errors?: readonly GraphqlErrorResponse[];
}

interface CsrfData {
  readonly csrfToken: string;
}

interface AuthUserData {
  readonly id: string;
  readonly email: string;
  readonly roles: readonly string[];
  readonly profile: {
    readonly displayName: string;
    readonly timeZone: string;
    readonly preferredSessionTime: string | null;
  };
}

interface RegisterData {
  readonly register: {
    readonly user: AuthUserData;
  };
}

interface LoginData {
  readonly login: {
    readonly user: AuthUserData;
  };
}

interface LogoutData {
  readonly logout: boolean;
}

interface MeData {
  readonly me: AuthUserData;
}

const csrfQuery = `
  query CsrfToken {
    csrfToken
  }
`;

const registerMutation = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        roles
        profile {
          displayName
          timeZone
          preferredSessionTime
        }
      }
    }
  }
`;

const loginMutation = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        roles
        profile {
          displayName
          timeZone
          preferredSessionTime
        }
      }
    }
  }
`;

const logoutMutation = `
  mutation Logout {
    logout
  }
`;

const meQuery = `
  query Me {
    me {
      id
      email
      roles
      profile {
        displayName
        timeZone
        preferredSessionTime
      }
    }
  }
`;

describe("AuthResolver", () => {
  let app: INestApplication;
  let server: Server;

  beforeEach(async () => {
    configureAuthTestEnvironment();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    configureApplication(app);
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterEach(async () => {
    await app.close();
  });

  it("registers a learner, normalizes email, creates an HTTP-only session, and resolves me", async () => {
    const csrf = await getCsrfToken(server);

    const registerResponse = await graphqlRequest<RegisterData>(server, {
      query: registerMutation,
      variables: {
        input: {
          email: " Learner@Example.TEST ",
          password: "ValidPass123!",
          displayName: "Phase Two Learner",
          timeZone: "Europe/Berlin"
        }
      },
      cookieHeader: csrf.cookieHeader,
      csrfToken: csrf.token
    });

    expect(registerResponse.body.errors).toBeUndefined();
    expect(registerResponse.body.data?.register.user.email).toBe("learner@example.test");
    expect(registerResponse.body.data?.register.user.roles).toEqual(["LEARNER"]);

    const sessionCookie = getRequiredSetCookie(registerResponse.response, "skilltogether.sid");
    expect(sessionCookie).toContain("HttpOnly");
    expect(sessionCookie).toContain("SameSite=Lax");

    const meResponse = await graphqlRequest<MeData>(server, {
      query: meQuery,
      cookieHeader: cookieHeaderFrom([sessionCookie])
    });

    expect(meResponse.body.errors).toBeUndefined();
    expect(meResponse.body.data?.me.email).toBe("learner@example.test");
  });

  it("rejects duplicate registration with a stable validation error", async () => {
    const csrf = await getCsrfToken(server);
    const input = {
      email: "duplicate@example.test",
      password: "ValidPass123!",
      displayName: "Duplicate Learner",
      timeZone: "Europe/Berlin"
    };

    await graphqlRequest<RegisterData>(server, {
      query: registerMutation,
      variables: {
        input
      },
      cookieHeader: csrf.cookieHeader,
      csrfToken: csrf.token
    });

    const secondCsrf = await getCsrfToken(server);
    const duplicateResponse = await graphqlRequest<RegisterData>(server, {
      query: registerMutation,
      variables: {
        input
      },
      cookieHeader: secondCsrf.cookieHeader,
      csrfToken: secondCsrf.token
    });

    expect(firstErrorCode(duplicateResponse.body)).toBe("VALIDATION_FAILED");
    expect(duplicateResponse.body.errors?.[0]?.extensions?.field).toBe("email");
  });

  it("rejects auth mutations without CSRF", async () => {
    const response = await graphqlRequest<RegisterData>(server, {
      query: registerMutation,
      variables: {
        input: {
          email: "csrf@example.test",
          password: "ValidPass123!",
          displayName: "CSRF Learner",
          timeZone: "Europe/Berlin"
        }
      }
    });

    expect(firstErrorCode(response.body)).toBe("CSRF_INVALID");
  });

  it("logs in with valid credentials, rejects invalid credentials generically, and rate limits failures", async () => {
    const csrf = await getCsrfToken(server);
    await graphqlRequest<RegisterData>(server, {
      query: registerMutation,
      variables: {
        input: {
          email: "login@example.test",
          password: "ValidPass123!",
          displayName: "Login Learner",
          timeZone: "Europe/Berlin"
        }
      },
      cookieHeader: csrf.cookieHeader,
      csrfToken: csrf.token
    });

    const invalidCsrf = await getCsrfToken(server);
    const invalidResponse = await graphqlRequest<LoginData>(server, {
      query: loginMutation,
      variables: {
        input: {
          email: "LOGIN@example.test",
          password: "WrongPass123!"
        }
      },
      cookieHeader: invalidCsrf.cookieHeader,
      csrfToken: invalidCsrf.token
    });

    expect(firstErrorCode(invalidResponse.body)).toBe("AUTH_INVALID_CREDENTIALS");
    expect(invalidResponse.body.errors?.[0]?.message).toBe("Email or password is incorrect.");

    const validCsrf = await getCsrfToken(server);
    const loginResponse = await graphqlRequest<LoginData>(server, {
      query: loginMutation,
      variables: {
        input: {
          email: "LOGIN@example.test",
          password: "ValidPass123!"
        }
      },
      cookieHeader: validCsrf.cookieHeader,
      csrfToken: validCsrf.token
    });

    expect(loginResponse.body.errors).toBeUndefined();
    expect(loginResponse.body.data?.login.user.email).toBe("login@example.test");
    expect(getRequiredSetCookie(loginResponse.response, "skilltogether.sid")).toContain("HttpOnly");

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const attemptCsrf = await getCsrfToken(server);
      await graphqlRequest<LoginData>(server, {
        query: loginMutation,
        variables: {
          input: {
            email: "missing@example.test",
            password: "WrongPass123!"
          }
        },
        cookieHeader: attemptCsrf.cookieHeader,
        csrfToken: attemptCsrf.token
      });
    }

    const limitedCsrf = await getCsrfToken(server);
    const limitedResponse = await graphqlRequest<LoginData>(server, {
      query: loginMutation,
      variables: {
        input: {
          email: "missing@example.test",
          password: "WrongPass123!"
        }
      },
      cookieHeader: limitedCsrf.cookieHeader,
      csrfToken: limitedCsrf.token
    });

    expect(firstErrorCode(limitedResponse.body)).toBe("AUTH_RATE_LIMITED");
  });

  it("logs out idempotently, clears the cookie, and rejects the revoked session", async () => {
    const csrf = await getCsrfToken(server);
    const registerResponse = await graphqlRequest<RegisterData>(server, {
      query: registerMutation,
      variables: {
        input: {
          email: "logout@example.test",
          password: "ValidPass123!",
          displayName: "Logout Learner",
          timeZone: "Europe/Berlin"
        }
      },
      cookieHeader: csrf.cookieHeader,
      csrfToken: csrf.token
    });
    const sessionCookie = getRequiredSetCookie(registerResponse.response, "skilltogether.sid");

    const logoutCsrf = await getCsrfToken(server);
    const logoutResponse = await graphqlRequest<LogoutData>(server, {
      query: logoutMutation,
      cookieHeader: cookieHeaderFrom([sessionCookie, logoutCsrf.cookieHeader]),
      csrfToken: logoutCsrf.token
    });

    expect(logoutResponse.body.errors).toBeUndefined();
    expect(logoutResponse.body.data?.logout).toBe(true);
    expect(getRequiredSetCookie(logoutResponse.response, "skilltogether.sid")).toContain(
      "Expires=Thu, 01 Jan 1970"
    );

    const secondLogoutCsrf = await getCsrfToken(server);
    const secondLogoutResponse = await graphqlRequest<LogoutData>(server, {
      query: logoutMutation,
      cookieHeader: secondLogoutCsrf.cookieHeader,
      csrfToken: secondLogoutCsrf.token
    });

    expect(secondLogoutResponse.body.errors).toBeUndefined();
    expect(secondLogoutResponse.body.data?.logout).toBe(true);

    const meResponse = await graphqlRequest<MeData>(server, {
      query: meQuery,
      cookieHeader: cookieHeaderFrom([sessionCookie])
    });

    expect(firstErrorCode(meResponse.body)).toBe("AUTH_REQUIRED");
  });
});

function configureAuthTestEnvironment(): void {
  process.env["NODE_ENV"] = "test";
  process.env["AUTH_PERSISTENCE"] = "memory";
  process.env["DATABASE_URL"] =
    "postgresql://skilltogether:skilltogether_test_password@localhost:5432/skilltogether_test";
  process.env["SESSION_SECRET"] = "test-session-secret-for-auth-resolver-0001";
  process.env["CSRF_SECRET"] = "test-csrf-secret-for-auth-resolver-000001";
  process.env["SESSION_COOKIE_SECURE"] = "false";
  process.env["WEB_ORIGIN"] = "http://localhost:5173";
  process.env["CORS_ALLOWED_ORIGINS"] = "http://localhost:5173,http://127.0.0.1:5173";
}

async function getCsrfToken(
  server: Server
): Promise<{ readonly token: string; readonly cookieHeader: string }> {
  const response = await graphqlRequest<CsrfData>(server, {
    query: csrfQuery
  });
  const token = response.body.data?.csrfToken;

  if (token === undefined) {
    throw new Error("CSRF token was not returned");
  }

  return {
    token,
    cookieHeader: cookieHeaderFrom([getRequiredSetCookie(response.response, "skilltogether.csrf")])
  };
}

async function graphqlRequest<TData>(
  server: Server,
  options: {
    readonly query: string;
    readonly variables?: unknown;
    readonly cookieHeader?: string;
    readonly csrfToken?: string;
  }
): Promise<{ readonly response: Response; readonly body: GraphqlBody<TData> }> {
  let operation = request(server).post("/graphql");

  if (options.cookieHeader !== undefined) {
    operation = operation.set("Cookie", options.cookieHeader);
  }

  if (options.csrfToken !== undefined) {
    operation = operation.set("x-csrf-token", options.csrfToken);
  }

  const response = await operation.send({
    query: options.query,
    ...(options.variables === undefined ? {} : { variables: options.variables })
  });

  return {
    response,
    body: response.body as unknown as GraphqlBody<TData>
  };
}

function getRequiredSetCookie(response: Response, cookieName: string): string {
  const cookies = getSetCookieHeaders(response);
  const cookie = cookies.find((value) => value.startsWith(`${cookieName}=`));

  if (cookie === undefined) {
    throw new Error(`${cookieName} cookie was not set`);
  }

  return cookie;
}

function getSetCookieHeaders(response: Response): readonly string[] {
  const header = response.headers["set-cookie"];

  if (Array.isArray(header)) {
    return header;
  }

  if (typeof header === "string") {
    return [header];
  }

  return [];
}

function cookieHeaderFrom(cookies: readonly string[]): string {
  return cookies
    .map((cookie) => {
      const [value] = cookie.split(";");
      return value ?? "";
    })
    .filter((cookie) => cookie.length > 0)
    .join("; ");
}

function firstErrorCode<TData>(body: GraphqlBody<TData>): string | undefined {
  return body.errors?.[0]?.extensions?.code;
}
