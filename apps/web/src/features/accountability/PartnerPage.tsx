import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { fetchCsrfToken } from "../auth/graphql.js";
import {
  ACCEPT_PARTNER_INVITATION_MUTATION,
  BLOCK_USER_MUTATION,
  INVITE_PARTNER_MUTATION,
  PARTNER_DASHBOARD_QUERY,
  REJECT_PARTNER_INVITATION_MUTATION,
  REMOVE_PARTNER_CONNECTION_MUTATION,
  REVOKE_PARTNER_INVITATION_MUTATION,
  type BlockUserMutationData,
  type BlockUserVariables,
  type ConnectionIdVariables,
  type InvitationIdVariables,
  type InvitePartnerMutationData,
  type InvitePartnerMutationVariables,
  type PartnerConnection,
  type PartnerDashboardQueryData,
  type PartnerInvitation,
  type PartnerInvitationMutationData,
  type PartnerProgressSummary,
  type RemovePartnerConnectionMutationData
} from "./graphql.js";
import { formatPartnerDate, toSafeAccountabilityMessage } from "./accountability-ui.js";

export function PartnerPage(): React.JSX.Element {
  const client = useApolloClient();
  const [email, setEmail] = useState("");
  const [actionError, setActionError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const dashboard = useQuery<PartnerDashboardQueryData>(PARTNER_DASHBOARD_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const [invitePartner, inviteState] = useMutation<
    InvitePartnerMutationData,
    InvitePartnerMutationVariables
  >(INVITE_PARTNER_MUTATION);
  const [acceptInvitation, acceptState] = useMutation<
    PartnerInvitationMutationData,
    InvitationIdVariables
  >(ACCEPT_PARTNER_INVITATION_MUTATION);
  const [rejectInvitation, rejectState] = useMutation<
    PartnerInvitationMutationData,
    InvitationIdVariables
  >(REJECT_PARTNER_INVITATION_MUTATION);
  const [revokeInvitation, revokeState] = useMutation<
    PartnerInvitationMutationData,
    InvitationIdVariables
  >(REVOKE_PARTNER_INVITATION_MUTATION);
  const [removeConnection, removeState] = useMutation<
    RemovePartnerConnectionMutationData,
    ConnectionIdVariables
  >(REMOVE_PARTNER_CONNECTION_MUTATION);
  const [blockUser, blockState] = useMutation<BlockUserMutationData, BlockUserVariables>(
    BLOCK_USER_MUTATION
  );

  async function runWithCsrf(action: (csrfToken: string) => Promise<void>): Promise<void> {
    setActionError(undefined);
    setSuccessMessage(undefined);

    try {
      await action(await fetchCsrfToken(client));
      await dashboard.refetch();
    } catch (error) {
      setActionError(toSafeAccountabilityMessage(error));
    }
  }

  async function submitInvitation(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (trimmedEmail.length === 0) {
      setActionError("Enter a partner email address.");
      return;
    }

    await runWithCsrf(async (csrfToken) => {
      await invitePartner({
        variables: {
          input: {
            email: trimmedEmail
          }
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      setEmail("");
      setSuccessMessage("Invitation sent.");
    });
  }

  async function invitationAction(
    invitationId: string,
    action: "accept" | "reject" | "revoke"
  ): Promise<void> {
    await runWithCsrf(async (csrfToken) => {
      const mutation =
        action === "accept"
          ? acceptInvitation
          : action === "reject"
            ? rejectInvitation
            : revokeInvitation;
      await mutation({
        variables: {
          invitationId
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      setSuccessMessage("Invitation updated.");
    });
  }

  async function removePartner(connection: PartnerConnection): Promise<void> {
    if (!window.confirm(`Remove ${connection.partnerDisplayName} from partner sharing?`)) {
      return;
    }

    await runWithCsrf(async (csrfToken) => {
      await removeConnection({
        variables: {
          connectionId: connection.id
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      setSuccessMessage("Partner connection removed.");
    });
  }

  async function blockPartner(connection: PartnerConnection): Promise<void> {
    if (!window.confirm(`Block ${connection.partnerDisplayName} and stop partner sharing?`)) {
      return;
    }

    await runWithCsrf(async (csrfToken) => {
      await blockUser({
        variables: {
          userId: connection.partnerUserId
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      setSuccessMessage("Partner blocked.");
    });
  }

  if (dashboard.loading && dashboard.data?.partnerDashboard === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading partners...
      </main>
    );
  }

  if (dashboard.error !== undefined && dashboard.data?.partnerDashboard === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafeAccountabilityMessage(dashboard.error)}
      </main>
    );
  }

  const data = dashboard.data?.partnerDashboard;

  if (data === undefined) {
    return (
      <main className="status-page" role="alert">
        Partner dashboard is not available.
      </main>
    );
  }

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="partner-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">Partner accountability</p>
          <h1 id="partner-title">Partner dashboard</h1>
          <p>Partners see completion summaries only.</p>
        </div>
        <div className="auth-panel__actions">
          <Link className="button-link button-link--secondary" to="/today">
            Today
          </Link>
        </div>
      </section>

      {actionError === undefined ? null : (
        <p className="form-error" role="alert">
          {actionError}
        </p>
      )}
      {successMessage === undefined ? null : (
        <p className="form-success" role="status">
          {successMessage}
        </p>
      )}

      <section className="content-layout">
        <form className="content-form" onSubmit={(event) => void submitInvitation(event)}>
          <h2>Invite partner</h2>
          <p>
            Shared fields: planned sessions, completed sessions, completion percentage, streak,
            assessment completion, overall progress, and encouragement status.
          </p>
          <label>
            Partner email
            <input
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
          </label>
          <button type="submit" disabled={inviteState.loading}>
            {inviteState.loading ? "Sending..." : "Send invitation"}
          </button>
        </form>

        <div className="roadmap">
          <InvitationList
            acceptLoading={acceptState.loading}
            invitations={data.invitations}
            rejectLoading={rejectState.loading}
            revokeLoading={revokeState.loading}
            onAction={(invitationId, action) => void invitationAction(invitationId, action)}
          />
          <ConnectionList
            blockLoading={blockState.loading}
            connections={data.connections}
            removeLoading={removeState.loading}
            onBlock={(connection) => void blockPartner(connection)}
            onRemove={(connection) => void removePartner(connection)}
          />
          <ProgressList progress={data.progress} />
        </div>
      </section>
    </main>
  );
}

function InvitationList({
  acceptLoading,
  invitations,
  rejectLoading,
  revokeLoading,
  onAction
}: {
  readonly acceptLoading: boolean;
  readonly invitations: readonly PartnerInvitation[];
  readonly rejectLoading: boolean;
  readonly revokeLoading: boolean;
  readonly onAction: (invitationId: string, action: "accept" | "reject" | "revoke") => void;
}): React.JSX.Element {
  return (
    <article className="module-panel">
      <h2>Invitations</h2>
      {invitations.length === 0 ? (
        <p>No partner invitations.</p>
      ) : (
        <ol>
          {invitations.map((invitation) => (
            <li key={invitation.id}>
              <strong>
                {invitation.direction === "SENT"
                  ? invitation.inviteeEmail
                  : invitation.inviterDisplayName}
              </strong>
              <small>
                {invitation.status} - expires {formatPartnerDate(invitation.expiresAt)}
              </small>
              {invitation.status === "PENDING" && invitation.direction === "RECEIVED" ? (
                <div className="auth-panel__actions">
                  <button
                    type="button"
                    disabled={acceptLoading}
                    onClick={() => onAction(invitation.id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={rejectLoading}
                    onClick={() => onAction(invitation.id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              ) : null}
              {invitation.status === "PENDING" && invitation.direction === "SENT" ? (
                <button
                  type="button"
                  disabled={revokeLoading}
                  onClick={() => onAction(invitation.id, "revoke")}
                >
                  Revoke
                </button>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

function ConnectionList({
  blockLoading,
  connections,
  removeLoading,
  onBlock,
  onRemove
}: {
  readonly blockLoading: boolean;
  readonly connections: readonly PartnerConnection[];
  readonly removeLoading: boolean;
  readonly onBlock: (connection: PartnerConnection) => void;
  readonly onRemove: (connection: PartnerConnection) => void;
}): React.JSX.Element {
  return (
    <article className="module-panel">
      <h2>Connections</h2>
      {connections.length === 0 ? (
        <p>No active partner connections.</p>
      ) : (
        <ol>
          {connections.map((connection) => (
            <li key={connection.id}>
              <strong>{connection.partnerDisplayName}</strong>
              <small>{connection.status}</small>
              <div className="auth-panel__actions">
                <button
                  type="button"
                  disabled={removeLoading}
                  onClick={() => onRemove(connection)}
                >
                  Remove
                </button>
                <button type="button" disabled={blockLoading} onClick={() => onBlock(connection)}>
                  Block
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

function ProgressList({
  progress
}: {
  readonly progress: readonly PartnerProgressSummary[];
}): React.JSX.Element {
  return (
    <article className="module-panel">
      <h2>Shared progress</h2>
      {progress.length === 0 ? (
        <p>No partner progress is shared yet.</p>
      ) : (
        <ol>
          {progress.map((item) => (
            <li key={item.userId}>
              <strong>{item.displayName}</strong>
              <small>
                {item.completedSessionCount}/{item.plannedSessionCount} sessions -{" "}
                {item.weeklyCompletionPercentage}% this week - streak {item.currentStreak}
              </small>
              <small>
                Assessment {item.assessmentCompleted ? "completed" : "not completed"} - overall{" "}
                {item.overallTrackProgressPercentage}%
              </small>
              {item.encouragementStatus === null ? null : <small>{item.encouragementStatus}</small>}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
