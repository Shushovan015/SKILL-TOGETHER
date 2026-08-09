import { useQuery } from "@apollo/client/react";
import type { ReactNode } from "react";

import { ME_QUERY, type MeQueryData } from "../auth/graphql.js";

interface AdminRouteProps {
  readonly children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps): React.JSX.Element {
  const { data, error, loading } = useQuery<MeQueryData>(ME_QUERY, {
    fetchPolicy: "cache-first",
    errorPolicy: "all"
  });

  if (loading && data?.me === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading permissions...
      </main>
    );
  }

  if (error !== undefined && data?.me === undefined) {
    return (
      <main className="status-page" role="alert">
        Something went wrong. Try again later.
      </main>
    );
  }

  if (!data?.me.roles.some((role) => role === "CONTENT_ADMIN" || role === "SYSTEM_ADMIN")) {
    return (
      <main className="status-page" role="alert">
        You do not have access to this item.
      </main>
    );
  }

  return <>{children}</>;
}
