import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import { LogoutButton } from "../auth/LogoutButton.js";
import {
  LEARNING_TRACKS_QUERY,
  MY_ENROLLMENTS_QUERY,
  type LearningTracksQueryData,
  type MyEnrollmentsQueryData
} from "./graphql.js";
import { toSafeContentMessage } from "./content-ui.js";

export function TrackCataloguePage(): React.JSX.Element {
  const tracks = useQuery<LearningTracksQueryData>(LEARNING_TRACKS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const enrollments = useQuery<MyEnrollmentsQueryData>(MY_ENROLLMENTS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

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
  const enrollmentByTrackId = new Map(
    (enrollments.data?.myEnrollments ?? []).map((enrollment) => [
      enrollment.track.id,
      enrollment
    ])
  );

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="tracks-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">Learning tracks</p>
          <h1 id="tracks-title">Choose a roadmap</h1>
          <p>Browse approved programmes and select the track you want to follow.</p>
        </div>
        <LogoutButton />
      </section>

      {trackList.length === 0 ? (
        <section className="content-empty">No active tracks are available.</section>
      ) : (
        <section className="track-grid" aria-label="Available learning tracks">
          {trackList.map((track) => {
            const enrollment = enrollmentByTrackId.get(track.id);

            return (
              <article className="track-card" key={track.id}>
                <div>
                  <p className="track-card__type">{formatTrackType(track.type)}</p>
                  <h2>{track.title}</h2>
                  <p>{track.description}</p>
                </div>
                <dl className="track-card__meta">
                  <div>
                    <dt>Modules</dt>
                    <dd>{track.modules.length}</dd>
                  </div>
                  <div>
                    <dt>Lessons</dt>
                    <dd>{track.modules.reduce((sum, moduleRecord) => sum + moduleRecord.lessons.length, 0)}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{enrollment?.status ?? "Not selected"}</dd>
                  </div>
                </dl>
                <Link className="button-link" to={`/tracks/${track.slug}`}>
                  View roadmap
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

function formatTrackType(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
