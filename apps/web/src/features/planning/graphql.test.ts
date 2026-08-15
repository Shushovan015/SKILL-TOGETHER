import { print } from "graphql";
import { describe, expect, it } from "vitest";

import { DAILY_TASK_QUERY, TODAY_DASHBOARD_QUERY, WEEKLY_PLAN_QUERY } from "./graphql.js";

describe("planning GraphQL payloads", () => {
  it("keeps complete lesson content out of dashboard and weekly summary queries", () => {
    for (const document of [TODAY_DASHBOARD_QUERY, WEEKLY_PLAN_QUERY]) {
      const query = print(document);
      expect(query).not.toContain("explanationMarkdown");
      expect(query).not.toContain("solutionNotesMarkdown");
      expect(query).not.toContain("answerKey");
      expect(query).not.toContain("resources {");
    }
  });

  it("requests teaching, solutions, and feedback only for the lesson detail", () => {
    const query = print(DAILY_TASK_QUERY);
    expect(query).toContain("explanationMarkdown");
    expect(query).toContain("solutionNotesMarkdown");
    expect(query).toContain("answerKey");
  });
});
