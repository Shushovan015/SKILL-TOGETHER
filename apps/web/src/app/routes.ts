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
  }
] as const satisfies readonly AppRouteDefinition[];
