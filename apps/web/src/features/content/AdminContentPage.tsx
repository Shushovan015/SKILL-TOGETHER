import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { fetchCsrfToken } from "../auth/graphql.js";
import {
  ADMIN_LESSON_VERSIONS_QUERY,
  APPROVE_LESSON_VERSION_MUTATION,
  ARCHIVE_LESSON_VERSION_MUTATION,
  CREATE_LESSON_VERSION_MUTATION,
  SUBMIT_LESSON_VERSION_MUTATION,
  type AdminLessonVersion,
  type AdminLessonVersionsQueryData,
  type AdminLessonVersionsQueryVariables,
  type ContentStatus,
  type CreateLessonVersionMutationData,
  type CreateLessonVersionMutationVariables,
  type TransitionLessonVersionMutationData,
  type TransitionLessonVersionMutationVariables
} from "./graphql.js";
import { cloneLessonVersionInput, toSafeContentMessage } from "./content-ui.js";

const contentStatuses = ["DRAFT", "REVIEWED", "APPROVED", "ARCHIVED"] as const;

export function AdminContentPage(): React.JSX.Element {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ContentStatus | undefined>();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionMessage, setActionMessage] = useState<string | undefined>();
  const query = useQuery<AdminLessonVersionsQueryData, AdminLessonVersionsQueryVariables>(
    ADMIN_LESSON_VERSIONS_QUERY,
    {
      variables: status === undefined ? {} : { status },
      fetchPolicy: "cache-and-network"
    }
  );
  const [createLessonVersion, createState] = useMutation<
    CreateLessonVersionMutationData,
    CreateLessonVersionMutationVariables
  >(CREATE_LESSON_VERSION_MUTATION);
  const [submitLessonVersion, submitState] = useMutation<
    TransitionLessonVersionMutationData,
    TransitionLessonVersionMutationVariables
  >(SUBMIT_LESSON_VERSION_MUTATION);
  const [approveLessonVersion, approveState] = useMutation<
    TransitionLessonVersionMutationData,
    TransitionLessonVersionMutationVariables
  >(APPROVE_LESSON_VERSION_MUTATION);
  const [archiveLessonVersion, archiveState] = useMutation<
    TransitionLessonVersionMutationData,
    TransitionLessonVersionMutationVariables
  >(ARCHIVE_LESSON_VERSION_MUTATION);
  const actionLoading =
    createState.loading || submitState.loading || approveState.loading || archiveState.loading;

  async function runAction(
    action: () => Promise<string | undefined>,
    successMessage: string
  ): Promise<void> {
    setActionError(undefined);
    setActionMessage(undefined);

    try {
      const id = await action();
      await query.refetch();
      setActionMessage(successMessage);

      if (id !== undefined) {
        navigate(`/admin/content/${id}`);
      }
    } catch (error) {
      setActionError(toSafeContentMessage(error));
    }
  }

  async function cloneDraft(version: AdminLessonVersion): Promise<void> {
    await runAction(async () => {
      const csrfToken = await fetchCsrfToken(client);
      const result = await createLessonVersion({
        variables: {
          lessonId: version.lessonId,
          input: cloneLessonVersionInput(version)
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });

      return result.data?.createLessonVersion.id;
    }, "Draft created.");
  }

  async function transition(
    mutation: typeof submitLessonVersion,
    version: AdminLessonVersion,
    message: string
  ): Promise<void> {
    await runAction(async () => {
      const csrfToken = await fetchCsrfToken(client);
      await mutation({
        variables: {
          id: version.id
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });

      return undefined;
    }, message);
  }

  if (query.loading && query.data?.adminLessonVersions === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading content...
      </main>
    );
  }

  if (query.error !== undefined && query.data?.adminLessonVersions === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafeContentMessage(query.error)}
      </main>
    );
  }

  const versions = query.data?.adminLessonVersions ?? [];

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="admin-content-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">Content admin</p>
          <h1 id="admin-content-title">Lesson versions</h1>
          <p>Manage Phase 3 lesson metadata and approval states.</p>
        </div>
        <Link className="button-link button-link--secondary" to="/tracks">
          Tracks
        </Link>
      </section>

      <section className="admin-toolbar" aria-label="Content filters">
        <button type="button" className={status === undefined ? "is-selected" : ""} onClick={() => setStatus(undefined)}>
          All
        </button>
        {contentStatuses.map((contentStatus) => (
          <button
            type="button"
            className={status === contentStatus ? "is-selected" : ""}
            key={contentStatus}
            onClick={() => setStatus(contentStatus)}
          >
            {contentStatus}
          </button>
        ))}
      </section>

      {actionError === undefined ? null : (
        <p className="form-error" role="alert">
          {actionError}
        </p>
      )}
      {actionMessage === undefined ? null : (
        <p className="form-success" role="status">
          {actionMessage}
        </p>
      )}

      {versions.length === 0 ? (
        <section className="content-empty">No lesson versions match this filter.</section>
      ) : (
        <section className="admin-list" aria-label="Lesson versions">
          {versions.map((version) => (
            <article className="admin-row" key={version.id}>
              <div>
                <p className="track-card__type">{version.trackTitle} · {version.moduleTitle}</p>
                <h2>{version.title}</h2>
                <p>
                  {version.lessonSlug} · v{version.version} · {version.status}
                </p>
              </div>
              <div className="admin-row__actions">
                <Link className="button-link button-link--secondary" to={`/admin/content/${version.id}`}>
                  Edit
                </Link>
                <button type="button" disabled={actionLoading} onClick={() => void cloneDraft(version)}>
                  New draft
                </button>
                {version.status === "DRAFT" ? (
                  <button type="button" disabled={actionLoading} onClick={() => void transition(submitLessonVersion, version, "Submitted for review.")}>
                    Submit
                  </button>
                ) : null}
                {version.status === "REVIEWED" ? (
                  <button type="button" disabled={actionLoading} onClick={() => void transition(approveLessonVersion, version, "Approved.")}>
                    Approve
                  </button>
                ) : null}
                {version.status === "APPROVED" ? (
                  <button type="button" disabled={actionLoading} onClick={() => void transition(archiveLessonVersion, version, "Archived.")}>
                    Archive
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
