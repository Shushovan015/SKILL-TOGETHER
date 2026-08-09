import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import { LogoutButton } from "./LogoutButton.js";
import { ME_QUERY, type MeQueryData } from "./graphql.js";

export function TodayPage(): React.JSX.Element {
  const { data } = useQuery<MeQueryData>(ME_QUERY, {
    fetchPolicy: "cache-first"
  });

  return (
    <main className="workspace-page" aria-labelledby="workspace-title">
      <section className="workspace-header">
        <p className="auth-panel__eyebrow">Private workspace</p>
        <h1 id="workspace-title">Signed in</h1>
        <p>
          {data?.me.profile.displayName === undefined
            ? "Your session is active."
            : `Your session is active, ${data.me.profile.displayName}.`}
        </p>
        <div className="auth-panel__actions">
          <Link className="button-link" to="/tracks">
            Browse tracks
          </Link>
          {data?.me.roles.some((role) => role === "CONTENT_ADMIN" || role === "SYSTEM_ADMIN") ? (
            <Link className="button-link button-link--secondary" to="/admin/content">
              Content admin
            </Link>
          ) : null}
        </div>
        <LogoutButton />
      </section>
    </main>
  );
}
