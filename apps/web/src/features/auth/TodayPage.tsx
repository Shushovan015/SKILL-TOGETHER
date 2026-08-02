import { useQuery } from "@apollo/client/react";

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
        <LogoutButton />
      </section>
    </main>
  );
}
