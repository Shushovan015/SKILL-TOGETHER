import { useQuery } from "@apollo/client/react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { getFirstGraphqlErrorCode } from "../../shared/graphql/errors.js";
import { ME_QUERY, type MeQueryData } from "./graphql.js";

interface ProtectedRouteProps {
  readonly children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const location = useLocation();
  const { data, error, loading } = useQuery<MeQueryData>(ME_QUERY, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all"
  });

  if (loading && data?.me === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading session...
      </main>
    );
  }

  if (getFirstGraphqlErrorCode(error) === "AUTH_REQUIRED") {
    return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />;
  }

  if (error !== undefined && data?.me === undefined) {
    return (
      <main className="status-page" role="alert">
        Something went wrong. Try again later.
      </main>
    );
  }

  return <>{children}</>;
}
