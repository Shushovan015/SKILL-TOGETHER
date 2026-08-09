import { useQuery } from "@apollo/client/react";
import { Link, useSearchParams } from "react-router-dom";

import {
  MY_ENROLLMENTS_QUERY,
  type Enrollment,
  type MyEnrollmentsQueryData
} from "./graphql.js";
import { toSafeContentMessage } from "./content-ui.js";

export function RoadmapPage(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const query = useQuery<MyEnrollmentsQueryData>(MY_ENROLLMENTS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  if (query.loading && query.data?.myEnrollments === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading roadmap...
      </main>
    );
  }

  if (query.error !== undefined && query.data?.myEnrollments === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafeContentMessage(query.error)}
      </main>
    );
  }

  const activeEnrollments = (query.data?.myEnrollments ?? []).filter((enrollment) =>
    ["ACTIVE", "PAUSED"].includes(enrollment.status)
  );
  const selectedSlug = searchParams.get("track");
  const selectedEnrollment =
    activeEnrollments.find((enrollment) => enrollment.track.slug === selectedSlug) ??
    activeEnrollments[0];

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="roadmap-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">Roadmap</p>
          <h1 id="roadmap-title">What comes next</h1>
          <p>Follow the current lesson, then move through each module in order.</p>
        </div>
        <Link className="button-link button-link--secondary" to="/tracks">
          My Tracks
        </Link>
      </section>

      {selectedEnrollment === undefined ? (
        <section className="content-empty">
          <p>No active learning tracks yet.</p>
          <Link className="button-link" to="/tracks">
            Choose a track
          </Link>
        </section>
      ) : (
        <>
          <TrackSwitcher activeEnrollments={activeEnrollments} selectedEnrollment={selectedEnrollment} />
          {selectedEnrollment.track.type === "GERMAN" ? (
            <GermanRoadmap enrollment={selectedEnrollment} />
          ) : (
            <Roadmap enrollment={selectedEnrollment} />
          )}
        </>
      )}
    </main>
  );
}

function TrackSwitcher({
  activeEnrollments,
  selectedEnrollment
}: {
  readonly activeEnrollments: readonly Enrollment[];
  readonly selectedEnrollment: Enrollment;
}): React.JSX.Element {
  return (
    <nav className="track-switcher" aria-label="Switch roadmap">
      {activeEnrollments.map((enrollment) => (
        <Link
          className={
            enrollment.id === selectedEnrollment.id
              ? "button-link"
              : "button-link button-link--secondary"
          }
          key={enrollment.id}
          to={`/roadmap?track=${enrollment.track.slug}`}
        >
          {enrollment.track.title}
        </Link>
      ))}
    </nav>
  );
}

function Roadmap({ enrollment }: { readonly enrollment: Enrollment }): React.JSX.Element {
  let markerUsed = false;

  return (
    <section className="roadmap roadmap--learner" aria-label={`${enrollment.track.title} roadmap`}>
      <div className="roadmap-title">
        <p className="auth-panel__eyebrow">{enrollment.experienceLevel}</p>
        <h2>{enrollment.track.title}</h2>
      </div>
      {enrollment.track.modules.map((moduleRecord) => (
        <article className="module-panel" key={moduleRecord.id}>
          <h3>{moduleRecord.title}</h3>
          <p>{moduleRecord.summary}</p>
          <ol className="roadmap-list">
            {moduleRecord.lessons.map((lesson) => {
              const marker = markerUsed ? "upcoming" : "current";
              markerUsed = true;

              return (
                <li className={`roadmap-list__item roadmap-list__item--${marker}`} key={lesson.id}>
                  <span aria-hidden="true">{marker === "current" ? "->" : "o"}</span>
                  <span>
                    <strong>{lesson.title}</strong>
                    <small>
                      {lesson.difficulty} · {lesson.estimatedDurationMinutes} min
                    </small>
                  </span>
                </li>
              );
            })}
          </ol>
        </article>
      ))}
    </section>
  );
}

const cefrGroups = [
  { group: "A1", levels: ["A1.1", "A1.2"] },
  { group: "A2", levels: ["A2.1", "A2.2"] },
  { group: "B1", levels: ["B1.1", "B1.2"] },
  { group: "B2", levels: ["B2.1", "B2.2"] }
] as const;

function GermanRoadmap({ enrollment }: { readonly enrollment: Enrollment }): React.JSX.Element {
  const currentLevel = normalizedGermanStartLevel(enrollment.germanStartLevel ?? "A1.1");
  const targetLevel = enrollment.germanTargetLevel ?? "A1.2";
  const currentIndex = germanLevelIndex(currentLevel);
  const targetIndex = germanLevelIndex(targetLevel);

  return (
    <section className="roadmap roadmap--learner" aria-label="German CEFR roadmap">
      <div className="roadmap-title">
        <p className="auth-panel__eyebrow">German</p>
        <h2>
          {currentLevel} to {targetLevel}
        </h2>
        <p>
          Current level: {currentLevel}. Target level: {targetLevel}. Session length:{" "}
          {enrollment.germanSessionDurationMinutes ?? 60} minutes.
        </p>
      </div>
      {cefrGroups.map((group) => (
        <article className="module-panel" key={group.group}>
          <h3>{group.group}</h3>
          <ol className="roadmap-list">
            {group.levels.map((level) => {
              const levelIndex = germanLevelIndex(level);
              const state =
                levelIndex < currentIndex
                  ? "completed"
                  : levelIndex === currentIndex
                    ? "current"
                    : "upcoming";

              return (
                <li className={`roadmap-list__item roadmap-list__item--${state}`} key={level}>
                  <span aria-hidden="true">{state === "completed" ? "✓" : state === "current" ? "->" : "o"}</span>
                  <span>
                    <strong>
                      {level}
                      {levelIndex === targetIndex ? " target" : ""}
                    </strong>
                    <small>{state === "current" ? "Current" : state}</small>
                  </span>
                </li>
              );
            })}
          </ol>
        </article>
      ))}
      <section className="module-panel">
        <h3>Current modules</h3>
        <p>{enrollment.track.modules.find((moduleRecord) => moduleRecord.title.includes(currentLevel))?.summary ?? "Detailed sessions for this level are being prepared."}</p>
      </section>
    </section>
  );
}

function normalizedGermanStartLevel(level: string): string {
  return level === "COMPLETE_BEGINNER" ? "A1.1" : level;
}

function germanLevelIndex(level: string): number {
  return ["A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B1.2", "B2.1", "B2.2"].indexOf(level);
}
