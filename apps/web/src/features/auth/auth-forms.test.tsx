// @vitest-environment jsdom

import { MockedProvider } from "@apollo/client/testing/react";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { CSRF_TOKEN_QUERY, REGISTER_MUTATION } from "./graphql.js";
import { LoginPage } from "./LoginPage.js";
import { RegisterPage } from "./RegisterPage.js";

describe("auth forms", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows registration validation errors without submitting", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </MockedProvider>
    );

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Enter a valid email address.")).toBeTruthy();
    expect(screen.getByText(/Password must be at least 12 characters/u)).toBeTruthy();
    expect(screen.getByText("Display name is required.")).toBeTruthy();
  });

  it("shows login validation errors without submitting", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </MockedProvider>
    );

    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("Enter a valid email address.")).toBeTruthy();
    expect(screen.getByText("Password is required.")).toBeTruthy();
  });

  it("maps server validation fields onto registration controls", async () => {
    const user = userEvent.setup();
    const input = {
      email: "duplicate@example.test",
      password: "ValidPass123!",
      displayName: "Duplicate Learner",
      timeZone: "Europe/Berlin"
    };

    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: CSRF_TOKEN_QUERY
            },
            result: {
              data: {
                csrfToken: "csrf.token"
              }
            }
          },
          {
            request: {
              query: REGISTER_MUTATION,
              variables: {
                input
              }
            },
            result: {
              errors: [
                {
                  message: "Check the highlighted fields and try again.",
                  extensions: {
                    code: "VALIDATION_FAILED",
                    field: "email",
                    retryable: false
                  }
                }
              ]
            }
          }
        ]}
      >
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </MockedProvider>
    );

    await user.type(screen.getByLabelText("Email"), input.email);
    await user.type(screen.getByLabelText("Password"), input.password);
    await user.type(screen.getByLabelText("Display name"), input.displayName);
    await user.clear(screen.getByLabelText("Time zone"));
    await user.type(screen.getByLabelText("Time zone"), input.timeZone);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Check this field and try again.")).toBeTruthy();
    expect(screen.getByText("Check the highlighted fields and try again.")).toBeTruthy();
  });
});
