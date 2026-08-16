// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LearningContent } from "./LearningContent.js";
import { formatIndependentPracticeContent } from "./independent-practice.js";

describe("LearningContent", () => {
  it("renders instructional code and tables without flattening their structure", () => {
    const { container } = render(
      <LearningContent content={["Mental model", "```ts", "const safe: unknown = response;", "```", "| Type | Meaning |", "| --- | --- |", "| Risk | Could happen |"].join("\n")} />
    );

    expect(screen.getByRole("heading", { name: "Mental model" })).toBeTruthy();
    expect(screen.getByText("const safe: unknown = response;")).toBeTruthy();
    expect(screen.getByRole("table")).toBeTruthy();
    expect(container.querySelector("pre")).not.toBeNull();
  });

  it("renders ordered checkpoints as an ordered list", () => {
    render(<LearningContent content={"1. Identify the boundary.\n2. Validate the input."} />);

    expect(screen.getByRole("list")).toBeTruthy();
    expect(screen.getByText("Validate the input.")).toBeTruthy();
  });

  it("renders lesson sections and inline phrases without exposing markdown markers", () => {
    render(
      <LearningContent
        content={"### Vocabulary · 10 min\n\n- **Question:** `Wann faehrt der Zug?`"}
      />
    );

    expect(screen.getByRole("heading", { name: "Vocabulary · 10 min" })).toBeTruthy();
    expect(screen.getByText("Question:").tagName).toBe("STRONG");
    expect(screen.getByText("Wann faehrt der Zug?").tagName).toBe("CODE");
  });

  it("replaces legacy independent-practice overload with one concise task", () => {
    const content = formatIndependentPracticeContent(
      "Plan a short trip.\n\nReal-world goal: compare two travel options and book one. Speaking task (8-10 minutes): six turns. Writing task (8-10 minutes): write a message. Mediation task: explain it. 90-minute extension: compare versions."
    );

    expect(content).toContain("### Your task");
    expect(content).toContain("### Steps");
    expect(content).toContain("compare two travel options and book one");
    expect(content).not.toContain("Speaking task");
    expect(content).not.toContain("Mediation task");
    expect(content).not.toContain("90-minute extension");
  });

  it("divides a reviewed plain-text exercise into a task and steps", () => {
    const content = formatIndependentPracticeContent(
      "Plan a short trip. Write six lines. Then say the questions aloud."
    );

    expect(content).toBe(
      "### Your task\n\nPlan a short trip.\n\n### Steps\n\n1. Write six lines.\n\n2. Then say the questions aloud."
    );
  });
});
