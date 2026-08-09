export type AppRouteScope = "public" | "authenticated" | "admin";

export interface AppRouteDefinition {
  readonly path: string;
  readonly label: string;
  readonly scope: AppRouteScope;
}

export interface LayoutShellDefinition {
  readonly name: string;
  readonly scope: AppRouteScope;
}

export const layoutShells = [
  {
    name: "PublicLayout",
    scope: "public"
  },
  {
    name: "LearnerLayout",
    scope: "authenticated"
  },
  {
    name: "AdminLayout",
    scope: "admin"
  }
] as const satisfies readonly LayoutShellDefinition[];

export const appRoutes = [
  {
    path: "/",
    label: "Landing",
    scope: "public"
  },
  {
    path: "/register",
    label: "Register",
    scope: "public"
  },
  {
    path: "/login",
    label: "Login",
    scope: "public"
  },
  {
    path: "/today",
    label: "Today",
    scope: "authenticated"
  },
  {
    path: "/onboarding",
    label: "Onboarding",
    scope: "authenticated"
  },
  {
    path: "/plan/week/:weekNumber",
    label: "Weekly plan",
    scope: "authenticated"
  },
  {
    path: "/lessons/:dailyTaskId",
    label: "Lesson",
    scope: "authenticated"
  },
  {
    path: "/lessons/:dailyTaskId/exercise",
    label: "Exercise",
    scope: "authenticated"
  },
  {
    path: "/tracks",
    label: "Tracks",
    scope: "authenticated"
  },
  {
    path: "/tracks/:slug",
    label: "Track roadmap",
    scope: "authenticated"
  },
  {
    path: "/admin/content",
    label: "Content admin",
    scope: "admin"
  },
  {
    path: "/admin/content/:versionId",
    label: "Lesson editor",
    scope: "admin"
  }
] as const satisfies readonly AppRouteDefinition[];
