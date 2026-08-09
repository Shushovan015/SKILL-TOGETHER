import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";

import {
  LEARNING_TRACK_QUERY,
  MY_ENROLLMENTS_QUERY,
  type LearningTrackQueryData,
  type LearningTrackQueryVariables,
  type MyEnrollmentsQueryData
} from "./graphql.js";
import { toSafeContentMessage } from "./content-ui.js";

export function TrackDetailPage(): React.JSX.Element {
  const { slug } = useParams();
  const query = useQuery<LearningTrackQueryData, LearningTrackQueryVariables>(LEARNING_TRACK_QUERY, {
    variables: {
      slug: slug ?? ""
    },
    skip: slug === undefined,
    fetchPolicy: "cache-and-network"
  });
  const enrollments = useQuery<MyEnrollmentsQueryData>(MY_ENROLLMENTS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  if (slug === undefined) {
    return (
      <main className="status-page" role="alert">
        This track is not available.
      </main>
    );
  }

  if (query.loading && query.data?.learningTrack === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading roadmap...
      </main>
    );
  }

  if (query.error !== undefined && query.data?.learningTrack === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafeContentMessage(query.error)}
      </main>
    );
  }

  const track = query.data?.learningTrack;

  if (track === undefined) {
    return (
      <main className="status-page" role="alert">
        This track is not available.
      </main>
    );
  }

  const enrollment = (enrollments.data?.myEnrollments ?? []).find(
    (item) => item.track.id === track.id && ["ACTIVE", "PAUSED"].includes(item.status)
  );

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="track-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">
            <Link to="/tracks">My Tracks</Link> &gt; {track.title}
          </p>
          <h1 id="track-title">{track.title}</h1>
          <p>{track.description}</p>
        </div>
        <div className="auth-panel__actions">
          <Link className="button-link button-link--secondary" to="/tracks">
            Back to My Tracks
          </Link>
          {enrollment === undefined ? (
            <Link className="button-link" to={`/onboarding?trackId=${track.id}`}>
              Create plan
            </Link>
          ) : (
            <Link className="button-link" to={`/roadmap?track=${track.slug}`}>
              Open roadmap
            </Link>
          )}
        </div>
      </section>

      <section className="workspace-section">
        <section className="roadmap" aria-label={`${track.title} modules`}>
          {track.modules.map((moduleRecord) => (
            <article className="module-panel" key={moduleRecord.id}>
              <h2>{moduleRecord.title}</h2>
              <p>{moduleRecord.summary}</p>
              <ol className="roadmap-list">
                {moduleRecord.lessons.map((lesson, index) => (
                  <li className="roadmap-list__item" key={lesson.id}>
                    <span aria-hidden="true">{moduleRecord.sequence === 1 && index === 0 ? "->" : "o"}</span>
                    <span>
                      <strong>{lesson.title}</strong>
                      <small>
                        {lesson.estimatedDurationMinutes} min - {lesson.difficulty}
                      </small>
                    </span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
