import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";

import {
  WEEKLY_PLAN_QUERY,
  type DailyTask,
  type WeeklyPlanQueryData,
  type WeeklyPlanQueryVariables
} from "./graphql.js";
import { formatDate, toSafePlanningMessage } from "./planning-ui.js";

export function WeeklyPlanPage(): React.JSX.Element {
  const params = useParams();
  const weekNumber = Number(params["weekNumber"] ?? "1");
  const query = useQuery<WeeklyPlanQueryData, WeeklyPlanQueryVariables>(WEEKLY_PLAN_QUERY, {
    variables: {
      weekNumber: Number.isInteger(weekNumber) && weekNumber > 0 ? weekNumber : 1
    },
    fetchPolicy: "cache-and-network"
  });

  if (query.loading && query.data?.weeklyPlan === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading week...
      </main>
    );
  }

  if (query.error !== undefined && query.data?.weeklyPlan === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafePlanningMessage(query.error)}
      </main>
    );
  }

  const tasks = query.data?.weeklyPlan ?? [];
  const tasksByDate = groupTasksByDate(tasks);
  const studyWeekId = tasks[0]?.studyWeekId;
  const completedCount = tasks.filter((task) => task.status === "COMPLETED").length;
  const missedCount = tasks.filter((task) => task.status === "MISSED").length;
  const plannedCount = tasks.filter((task) => task.status === "PLANNED").length;

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="weekly-plan-title">
      <section className="workspace-header content-header weekly-plan-header">
        <div>
          <p className="auth-panel__eyebrow">Weekly plan</p>
          <h1 id="weekly-plan-title">Week {weekNumber}</h1>
          <p>Your lessons for this week, grouped by study day.</p>
          <dl className="weekly-plan-summary" aria-label="Week status summary">
            <div><dt>Total</dt><dd>{tasks.length}</dd></div>
            <div><dt>Planned</dt><dd>{plannedCount}</dd></div>
            <div><dt>Completed</dt><dd>{completedCount}</dd></div>
            <div><dt>Missed</dt><dd>{missedCount}</dd></div>
          </dl>
        </div>
        <div className="auth-panel__actions">
          <Link className="button-link button-link--secondary" to="/today">
            Today
          </Link>
          <Link className="button-link button-link--secondary" to={`/plan/week/${Math.max(1, weekNumber - 1)}`}>
            Previous
          </Link>
          <Link className="button-link" to={`/plan/week/${weekNumber + 1}`}>
            Next
          </Link>
          {studyWeekId === undefined ? null : (
            <Link className="button-link" to={`/assessments/week/${studyWeekId}`}>
              Assessment
            </Link>
          )}
        </div>
      </section>

      {tasks.length === 0 ? (
        <section className="content-empty">No lessons are scheduled for this week.</section>
      ) : (
        <>
          <div className="weekly-plan-legend" aria-label="Task status legend">
            <span className="task-status task-status--planned">Planned</span>
            <span className="task-status task-status--in-progress">In progress</span>
            <span className="task-status task-status--completed">Completed</span>
            <span className="task-status task-status--missed">Missed</span>
          </div>
          <section className="week-grid" aria-label="Scheduled daily tasks">
            {[...tasksByDate.entries()].map(([date, dayTasks]) => (
              <article className="module-panel week-day-card" key={date}>
                <header className="week-day-card__header">
                  <h2>{formatDate(date)}</h2>
                  <span>{dayTasks.length} {dayTasks.length === 1 ? "lesson" : "lessons"}</span>
                </header>
                <ol className="week-task-list">
                  {dayTasks.map((task) => {
                    const statusClass = task.status.toLowerCase().replaceAll("_", "-");

                    return (
                      <li className={`week-task week-task--${statusClass}`} key={task.id}>
                        <div className="week-task__heading">
                          <Link to={`/lessons/${task.id}`}>{task.lesson.title}</Link>
                          <span className={`task-status task-status--${statusClass}`}>
                            {formatTaskStatus(task.status)}
                          </span>
                        </div>
                        <small>{task.lesson.trackTitle} · {task.plannedDurationMinutes} min</small>
                      </li>
                    );
                  })}
                </ol>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}

function formatTaskStatus(status: DailyTask["status"]): string {
  return status.toLowerCase().replaceAll("_", " ").replace(/^./u, (letter) => letter.toUpperCase());
}

function groupTasksByDate(tasks: readonly DailyTask[]): ReadonlyMap<string, readonly DailyTask[]> {
  const grouped = new Map<string, DailyTask[]>();

  for (const task of tasks) {
    grouped.set(task.scheduledOn, [...(grouped.get(task.scheduledOn) ?? []), task]);
  }

  return grouped;
}
