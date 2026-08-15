// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { NotFoundPage } from "./NotFoundPage.js";

describe("NotFoundPage", () => {
  it("gives a learner actionable recovery links", () => {
    render(<MemoryRouter><NotFoundPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Go to Today" }).getAttribute("href")).toBe("/today");
    expect(screen.getByRole("link", { name: "My Tracks" }).getAttribute("href")).toBe("/tracks");
  });
});
