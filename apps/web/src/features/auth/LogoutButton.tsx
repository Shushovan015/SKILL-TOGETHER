import { useApolloClient, useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toSafeAuthMessage } from "../../shared/graphql/errors.js";
import { fetchCsrfToken, LOGOUT_MUTATION, type LogoutMutationData } from "./graphql.js";

export function LogoutButton(): React.JSX.Element {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | undefined>();
  const [logout, { loading }] = useMutation<LogoutMutationData>(LOGOUT_MUTATION);

  async function onLogout(): Promise<void> {
    setFormError(undefined);

    try {
      const csrfToken = await fetchCsrfToken(client);
      await logout({
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      await client.clearStore();
      navigate("/login", { replace: true });
    } catch (error) {
      setFormError(toSafeAuthMessage(error));
    }
  }

  return (
    <div className="logout-action">
      <button type="button" onClick={() => void onLogout()} disabled={loading}>
        {loading ? "Logging out..." : "Log out"}
      </button>
      {formError === undefined ? null : (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}
    </div>
  );
}
