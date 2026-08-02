import { describe, expect, it } from "vitest";

import { validateEnvironment } from "./env.js";

describe("validateEnvironment", () => {
  it("returns defaults and reports missing required variables", () => {
    const result = validateEnvironment(
      {
        NODE_ENV: "development"
      },
      [
        {
          name: "NODE_ENV",
          required: true,
          allowedValues: ["development", "test", "production"]
        },
        {
          name: "API_PORT",
          required: false,
          defaultValue: "4000"
        },
        {
          name: "DATABASE_URL",
          required: true
        }
      ]
    );

    expect(result.values).toEqual({
      NODE_ENV: "development",
      API_PORT: "4000"
    });
    expect(result.errors).toEqual(["DATABASE_URL is required"]);
  });
});
