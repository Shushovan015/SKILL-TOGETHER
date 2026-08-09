import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { fetchCsrfToken } from "../auth/graphql.js";
import {
  CANCEL_ENROLLMENT_MUTATION,
  type CancelEnrollmentMutationData,
  type CancelEnrollmentMutationVariables
} from "../planning/graphql.js";
import {
  LEARNING_TRACKS_QUERY,
  MY_ENROLLMENTS_QUERY,
  type Enrollment,
  type LearningTracksQueryData,
  type MyEnrollmentsQueryData
} from "./graphql.js";
import { toSafeContentMessage } from "./content-ui.js";

export function TrackCataloguePage(): React.JSX.Element {
  const client = useApolloClient();
  const tracks = useQuery<LearningTracksQueryData>(LEARNING_TRACKS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const enrollments = useQuery<MyEnrollmentsQueryData>(MY_ENROLLMENTS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const [cancelEnrollment, cancelState] = useMutation<
    CancelEnrollmentMutationData,
    CancelEnrollmentMutationVariables
  >(CANCEL_ENROLLMENT_MUTATION);
  const [actionError, setActionError] = useState<string | undefined>();

  if (tracks.loading && tracks.data?.learningTracks === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading tracks...
      </main>
    );
  }

  if (tracks.error !== undefined && tracks.data?.learningTracks === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafeContentMessage(tracks.error)}
      </main>
    );
  }

  const trackList = tracks.data?.learningTracks ?? [];
  const enrollmentList = enrollments.data?.myEnrollments ?? [];
  const activeEnrollments = enrollmentList.filter((enrollment) =>
    ["ACTIVE", "PAUSED"].includes(enrollment.status)
  );
  const activeEnrollmentByTrackId = new Map(
    activeEnrollments.map((enrollment) => [enrollment.track.id, enrollment])
  );
  const availableTracks = trackList.filter((track) => {
    const enrollment = activeEnrollmentByTrackId.get(track.id);
    return enrollment === undefined;
  });

  async function cancelPlan(enrollment: Enrollment): Promise<void> {
    setActionError(undefined);

    const confirmed = window.confirm(
      `Cancel your ${enrollment.track.title} plan? Completed lesson history stays saved, but unfinished scheduled tasks will be cancelled.`
    );

    if (!confirmed) {
      return;
    }

    try {
      const csrfToken = await fetchCsrfToken(client);
      await cancelEnrollment({
        variables: {
          enrollmentId: enrollment.id
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        },
        refetchQueries: [MY_ENROLLMENTS_QUERY]
      });
    } catch (error) {
      setActionError(toSafeContentMessage(error));
    }
  }

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="tracks-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">My Learning Tracks</p>
          <h1 id="tracks-title">Keep learning</h1>
          <p>Continue an active track or add another one when you are ready.</p>
        </div>
        <Link className="button-link" to="/onboarding">
          + Add another learning track
        </Link>
      </section>

      {actionError === undefined ? null : (
        <p className="form-error track-action-error" role="alert">
          {actionError}
        </p>
      )}

      {activeEnrollments.length === 0 ? (
        <section className="content-empty">
          <p>No active tracks yet.</p>
          <Link className="button-link" to="/onboarding">
            Create your first study plan
          </Link>
        </section>
      ) : (
        <section className="track-grid" aria-label="My active learning tracks">
          {activeEnrollments.map((enrollment) => (
            <ActiveTrackCard
              enrollment={enrollment}
              cancelDisabled={cancelState.loading}
              key={enrollment.id}
              onCancel={() => void cancelPlan(enrollment)}
            />
          ))}
        </section>
      )}

      <section className="workspace-section" aria-labelledby="available-tracks-title">
        <div className="section-heading">
          <h2 id="available-tracks-title">Add another learning track</h2>
          <p>Each track gets its own study plan, schedule, and progress.</p>
        </div>
        {availableTracks.length === 0 ? (
          <section className="content-empty">All available tracks are already in your learning plan.</section>
        ) : (
          <section className="track-grid" aria-label="Available learning tracks">
            {availableTracks.map((track) => (
              <article className="track-card" key={track.id}>
                <div>
                  <p className="track-card__type">{formatTrackType(track.type)}</p>
                  <h3>{track.title}</h3>
                  <p>{track.description}</p>
                </div>
                <dl className="track-card__meta">
                  <div>
                    <dt>Modules</dt>
                    <dd>{track.modules.length}</dd>
                  </div>
                  <div>
                    <dt>Lessons</dt>
                    <dd>{lessonCount(track)}</dd>
                  </div>
                  <div>
                    <dt>Level</dt>
                    <dd>Choose</dd>
                  </div>
                </dl>
                <div className="auth-panel__actions">
                  <Link className="button-link" to={`/onboarding?trackId=${track.id}`}>
                    Create plan
                  </Link>
                  <Link className="button-link button-link--secondary" to={`/tracks/${track.slug}`}>
                    Preview
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

function ActiveTrackCard({
  enrollment,
  cancelDisabled,
  onCancel
}: {
  readonly enrollment: Enrollment;
  readonly cancelDisabled: boolean;
  readonly onCancel: () => void;
}): React.JSX.Element {
  const changeLabel = enrollment.track.type === "GERMAN" ? "Change level" : "Change plan";

  return (
    <article className="track-card">
      <div>
        <p className="track-card__type">{enrollment.track.type === "GERMAN" ? germanLevelLabel(enrollment) : enrollment.experienceLevel}</p>
        <h2>{enrollment.track.title}</h2>
        <p>{enrollment.track.description}</p>
      </div>
      <dl className="track-card__meta">
        <div>
          <dt>Week</dt>
          <dd>{weekNumber(enrollment.startDate)}</dd>
        </div>
        <div>
          <dt>{enrollment.track.type === "GERMAN" ? "Session" : "Lessons"}</dt>
          <dd>{enrollment.track.type === "GERMAN" ? `${enrollment.germanSessionDurationMinutes ?? 60} min` : lessonCount(enrollment.track)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{formatStatus(enrollment.status)}</dd>
        </div>
      </dl>
      <div className="auth-panel__actions">
        <Link className="button-link" to="/today">
          Continue
        </Link>
        <Link className="button-link button-link--secondary" to={`/roadmap?track=${enrollment.track.slug}`}>
          Roadmap
        </Link>
        <Link
          className="button-link button-link--secondary"
          to={`/onboarding?trackId=${enrollment.track.id}&reconfigureEnrollmentId=${enrollment.id}`}
        >
          {changeLabel}
        </Link>
        <button className="button-link button-link--danger" type="button" disabled={cancelDisabled} onClick={onCancel}>
          Cancel plan
        </button>
      </div>
    </article>
  );
}

function germanLevelLabel(enrollment: Enrollment): string {
  const start = enrollment.germanStartLevel === "COMPLETE_BEGINNER"
    ? "A1.1"
    : enrollment.germanStartLevel ?? "A1.1";
  const target = enrollment.germanTargetLevel ?? "A1.2";

  return `${start} to ${target}`;
}

function formatTrackType(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function weekNumber(startDate: string): number {
  const start = new Date(`${startDate}T00:00:00.000Z`).getTime();
  const now = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`).getTime();
  const days = Math.max(0, Math.floor((now - start) / 86_400_000));

  return Math.floor(days / 7) + 1;
}

function lessonCount(track: { readonly modules: readonly { readonly lessons: readonly unknown[] }[] }): number {
  return track.modules.reduce((sum, moduleRecord) => sum + moduleRecord.lessons.length, 0);
}
