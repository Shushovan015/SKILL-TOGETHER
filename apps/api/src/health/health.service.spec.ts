import { describe, expect, it } from "vitest";

import { createHealthStatus } from "./health.service.js";

describe("createHealthStatus", () => {
  it("creates a stable health response shape", () => {
    const result = createHealthStatus(
      [
        {
          name: "process",
          status: "ok"
        }
      ],
      new Date("2026-08-02T00:00:00.000Z")
    );

    expect(result).toEqual({
      service: "api",
      status: "ok",
      checkedAt: "2026-08-02T00:00:00.000Z",
      checks: [
        {
          name: "process",
          status: "ok"
        }
      ]
    });
  });
});
