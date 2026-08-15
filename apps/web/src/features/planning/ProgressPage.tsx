import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import {
  MY_ENROLLMENTS_QUERY,
  type MyEnrollmentsQueryData
} from "../content/graphql.js";
import { TODAY_DASHBOARD_QUERY, type TodayDashboardQueryData } from "./graphql.js";
import { toSafePlanningMessage } from "./planning-ui.js";

export function ProgressPage(): React.JSX.Element {
  const enrollments = useQuery<MyEnrollmentsQueryData>(MY_ENROLLMENTS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const today = useQuery<TodayDashboardQueryData>(TODAY_DASHBOARD_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  if (
    (enrollments.loading && enrollments.data?.myEnrollments === undefined) ||
    (today.loading && today.data?.todayDashboard === undefined)
  ) {
    return (
      <main className="status-page" aria-live="polite">
        Loading progress...
      </main>
    );
  }

  if (enrollments.error !== undefined && enrollments.data?.myEnrollments === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafePlanningMessage(enrollments.error)}
      </main>
    );
  }

  if (today.error !== undefined && today.data?.todayDashboard === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafePlanningMessage(today.error)}
      </main>
    );
  }

  const activeEnrollments = (enrollments.data?.myEnrollments ?? []).filter((enrollment) =>
    ["ACTIVE", "PAUSED"].includes(enrollment.status)
  );
  const dashboard = today.data?.todayDashboard;

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="progress-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">Progress</p>
          <h1 id="progress-title">Your learning progress</h1>
          <p>See your active tracks and this week&apos;s completed lessons.</p>
        </div>
        <Link className="button-link button-link--secondary" to="/today">
          Today
        </Link>
      </section>

      <section className="track-grid" aria-label="Track progress">
        {activeEnrollments.length === 0 ? (
          <article className="content-empty">
            <p>No active tracks yet.</p>
            <Link className="button-link" to="/tracks">
              Choose a track
            </Link>
          </article>
        ) : (
          activeEnrollments.map((enrollment) => (
            <article className="track-card" key={enrollment.id}>
              <p className="track-card__type">{enrollment.experienceLevel}</p>
              <h2>{enrollment.track.title}</h2>
              <p>{enrollment.status === "PAUSED" ? "Paused" : "Active"}</p>
              <dl className="track-card__meta">
                <div>
                  <dt>Week</dt>
                  <dd>{weekNumber(enrollment.startDate)}</dd>
                </div>
                <div>
                  <dt>Completed</dt>
                  <dd>{enrollment.completedTaskCount}/{enrollment.totalTaskCount}</dd>
                </div>
                <div>
                  <dt>Today</dt>
                  <dd>{dashboard?.tasks.filter((task) => task.lesson.trackTitle === enrollment.track.title).length ?? 0}</dd>
                </div>
              </dl>
              <p>{enrollment.overallProgressPercentage}% of this track completed.</p>
              {isProfessionalTrack(enrollment.track.type) ? (
                <ul className="today-practice-list" aria-label={`${enrollment.track.title} professional progress areas`}>
                  <li>Curriculum: {lessonCount(enrollment)} planned sessions</li>
                  <li>Practical work: required evidence in every session</li>
                  <li>Assessments: weekly reviewed question bank</li>
                  <li>Interview prep: session and assessment prompts</li>
                  <li>Capstone: {hasCapstone(enrollment) ? "included in roadmap" : "not planned yet"}</li>
                </ul>
              ) : null}
              <Link className="button-link" to={`/roadmap?track=${enrollment.track.slug}`}>
                View roadmap
              </Link>
            </article>
          ))
        )}
      </section>

      {dashboard === undefined ? null : (
        <section className="module-panel progress-summary">
          <h2>This week</h2>
          <p>
            {dashboard.weeklyProgress.completedCount} of {dashboard.weeklyProgress.plannedCount} lessons complete ·{" "}
            {dashboard.weeklyProgress.weeklyCompletionPercentage}%
          </p>
        </section>
      )}
    </main>
  );
}

function weekNumber(startDate: string): number {
  const start = new Date(`${startDate}T00:00:00.000Z`).getTime();
  const now = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`).getTime();
  const days = Math.max(0, Math.floor((now - start) / 86_400_000));

  return Math.floor(days / 7) + 1;
}

function lessonCount(enrollment: MyEnrollmentsQueryData["myEnrollments"][number]): number {
  return enrollment.track.modules.reduce(
    (sum, moduleRecord) => sum + moduleRecord.lessons.length,
    0
  );
}

function isProfessionalTrack(trackType: string): boolean {
  return trackType === "SOFTWARE_ENGINEERING" || trackType === "PROJECT_MANAGEMENT";
}

function hasCapstone(enrollment: MyEnrollmentsQueryData["myEnrollments"][number]): boolean {
  return enrollment.track.modules.some((moduleRecord) =>
    moduleRecord.title.toLowerCase().includes("capstone")
  );
}
