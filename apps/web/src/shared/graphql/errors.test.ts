import { CombinedGraphQLErrors } from "@apollo/client/errors";
import type { FormattedExecutionResult } from "graphql";
import { describe, expect, it } from "vitest";

import {
  getFirstGraphqlErrorCode,
  getFirstGraphqlErrorField,
  toSafeAuthMessage
} from "./errors.js";

describe("auth GraphQL error helpers", () => {
  it("maps stable auth error codes to safe messages", () => {
    const result: FormattedExecutionResult<Record<string, never>> = {
      errors: [
        {
          message: "Email or password is incorrect.",
          extensions: {
            code: "AUTH_INVALID_CREDENTIALS",
            field: "email"
          }
        }
      ]
    };
    const combined = new CombinedGraphQLErrors(result);

    expect(getFirstGraphqlErrorCode(combined)).toBe("AUTH_INVALID_CREDENTIALS");
    expect(getFirstGraphqlErrorField(combined)).toBe("email");
    expect(toSafeAuthMessage(combined)).toBe("Email or password is incorrect.");
  });

  it("maps browser fetch failures to an actionable server-unavailable message", () => {
    expect(toSafeAuthMessage(new TypeError("Failed to fetch"))).toBe(
      "Cannot reach the authentication server. Start the API and try again."
    );
  });
});
