// @vitest-environment jsdom

import { MockedProvider } from "@apollo/client/testing/react";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { ME_QUERY } from "./graphql.js";
import { HomePage } from "./HomePage.js";

describe("HomePage session restoration", () => {
  afterEach(() => cleanup());

  it("redirects an authenticated visitor at the root URL to My Tracks", async () => {
    render(
      <MockedProvider
        mocks={[{
          request: { query: ME_QUERY },
          result: {
            data: {
              me: {
                id: "user-1",
                email: "learner@example.test",
                roles: ["LEARNER"],
                profile: {
                  displayName: "Learner",
                  timeZone: "Europe/Berlin",
                  preferredSessionTime: null
                }
              }
            }
          }
        }]}
      >
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tracks" element={<p>My Tracks restored</p>} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(await screen.findByText("My Tracks restored")).toBeTruthy();
  });
});
