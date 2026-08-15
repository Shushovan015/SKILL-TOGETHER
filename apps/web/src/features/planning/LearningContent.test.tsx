// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LearningContent } from "./LearningContent.js";

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
});
