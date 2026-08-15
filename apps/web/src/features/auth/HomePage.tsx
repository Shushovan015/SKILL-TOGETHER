import { useQuery } from "@apollo/client/react";
import { Link, Navigate } from "react-router-dom";

import { ME_QUERY, type MeQueryData } from "./graphql.js";

export function HomePage(): React.JSX.Element {
  const { data, loading } = useQuery<MeQueryData>(ME_QUERY, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all"
  });

  if (data?.me !== undefined) {
    return <Navigate to="/tracks" replace />;
  }

  if (loading) {
    return (
      <main className="status-page" aria-live="polite">
        Restoring your session...
      </main>
    );
  }

  return (
    <main className="auth-page" aria-labelledby="home-title">
      <section className="auth-panel">
        <p className="auth-panel__eyebrow">SkillTogether</p>
        <h1 id="home-title">Learn with accountability</h1>
        <p className="auth-panel__helper">
          Create an account or log in to continue to your private workspace.
        </p>
        <div className="auth-panel__actions">
          <Link className="button-link" to="/register">
            Register
          </Link>
          <Link className="button-link button-link--secondary" to="/login">
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
