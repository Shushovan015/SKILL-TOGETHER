import { describe, expect, it } from "vitest";

import { appRoutes, layoutShells } from "./routes.js";

describe("route shell", () => {
  it("keeps public, authenticated, and admin shell boundaries explicit", () => {
    expect(layoutShells.map((layout) => layout.scope)).toEqual([
      "public",
      "authenticated",
      "admin"
    ]);
    expect(appRoutes.map((route) => route.path)).toEqual([
      "/",
      "/register",
      "/login",
      "/today",
      "/onboarding",
      "/plan/week/:weekNumber",
      "/lessons/:dailyTaskId",
      "/lessons/:dailyTaskId/exercise",
      "/assessments/week/:studyWeekId",
      "/assessments/:attemptId/result",
      "/partner",
      "/tracks",
      "/tracks/:slug",
      "/admin/content",
      "/admin/content/:versionId"
    ]);
  });
});
