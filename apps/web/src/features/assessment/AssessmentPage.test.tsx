// @vitest-environment jsdom

import { MockedProvider } from "@apollo/client/testing/react";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { AssessmentPage } from "./AssessmentPage.js";
import { WEEKLY_ASSESSMENT_QUERY } from "./graphql.js";

describe("AssessmentPage restoration", () => {
  afterEach(() => cleanup());

  it("restores an existing in-progress server attempt after refresh", async () => {
    render(
      <MockedProvider mocks={[{
        request: { query: WEEKLY_ASSESSMENT_QUERY, variables: { studyWeekId: "week-1" } },
        result: {
          data: {
            weeklyAssessment: {
              __typename: "AssessmentAttempt",
              id: "attempt-1",
              studyWeekId: "week-1",
              studyWeekNumber: 1,
              attemptNumber: 1,
              status: "IN_PROGRESS",
              startedAt: "2026-08-15T10:00:00.000Z",
              submittedAt: null,
              gradedAt: null,
              questions: [{
                __typename: "AssessmentQuestion",
                id: "question-1",
                type: "SHORT_ANSWER",
                promptMarkdown: "Explain the boundary.",
                options: null,
                points: 2,
                assessmentTags: ["boundaries"]
              }],
              result: null
            }
          }
        }
      }]}>
        <MemoryRouter initialEntries={["/assessments/week/week-1"]}>
          <Routes><Route path="/assessments/week/:studyWeekId" element={<AssessmentPage />} /></Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(await screen.findByText("Explain the boundary.")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Attempt 1" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Start weekly assessment" })).toBeNull();
  });
});
