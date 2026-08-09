import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { fetchCsrfToken, ME_QUERY, type MeQueryData } from "../auth/graphql.js";
import { LogoutButton } from "../auth/LogoutButton.js";
import {
  APPLY_RECOVERY_MUTATION,
  PROPOSE_RECOVERY_MUTATION,
  START_DAILY_TASK_MUTATION,
  TODAY_DASHBOARD_QUERY,
  type ApplyRecoveryMutationData,
  type ApplyRecoveryMutationVariables,
  type DailyTask,
  type ProposeRecoveryMutationData,
  type ProposeRecoveryMutationVariables,
  type RecoveryProposal,
  type StartDailyTaskMutationData,
  type TaskIdMutationVariables,
  type TodayDashboardQueryData
} from "./graphql.js";
import { formatDate, toSafePlanningMessage } from "./planning-ui.js";

export function TodayPage(): React.JSX.Element {
  const client = useApolloClient();
  const me = useQuery<MeQueryData>(ME_QUERY, { fetchPolicy: "cache-first" });
  const dashboard = useQuery<TodayDashboardQueryData>(TODAY_DASHBOARD_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const [startDailyTask, startState] = useMutation<
    StartDailyTaskMutationData,
    TaskIdMutationVariables
  >(START_DAILY_TASK_MUTATION);
  const [proposeRecovery, proposeState] = useMutation<
    ProposeRecoveryMutationData,
    ProposeRecoveryMutationVariables
  >(PROPOSE_RECOVERY_MUTATION);
  const [applyRecovery, applyState] = useMutation<
    ApplyRecoveryMutationData,
    ApplyRecoveryMutationVariables
  >(APPLY_RECOVERY_MUTATION);
  const [proposalByTaskId, setProposalByTaskId] = useState<Readonly<Record<string, RecoveryProposal>>>({});
  const [actionError, setActionError] = useState<string | undefined>();

  async function runWithCsrf(action: (csrfToken: string) => Promise<void>): Promise<void> {
    setActionError(undefined);

    try {
      await action(await fetchCsrfToken(client));
      await dashboard.refetch();
    } catch (error) {
      setActionError(toSafePlanningMessage(error));
    }
  }

  async function startTask(taskId: string): Promise<void> {
    await runWithCsrf(async (csrfToken) => {
      await startDailyTask({
        variables: {
          id: taskId
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
    });
  }

  async function recover(taskId: string): Promise<void> {
    await runWithCsrf(async (csrfToken) => {
      const result = await proposeRecovery({
        variables: {
          dailyTaskId: taskId
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      const proposal = result.data?.proposeRecovery;

      if (proposal !== undefined) {
        setProposalByTaskId((current) => ({
          ...current,
          [taskId]: proposal
        }));
      }
    });
  }

  async function apply(proposal: RecoveryProposal): Promise<void> {
    await runWithCsrf(async (csrfToken) => {
      await applyRecovery({
        variables: {
          input: {
            dailyTaskId: proposal.dailyTaskId,
            strategy: proposal.strategy,
            targetDate: proposal.targetDate
          }
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      setProposalByTaskId((current) => {
        const next = { ...current };
        delete next[proposal.dailyTaskId];
        return next;
      });
    });
  }

  if (dashboard.loading && dashboard.data?.todayDashboard === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading today...
      </main>
    );
  }

  if (dashboard.error !== undefined && dashboard.data?.todayDashboard === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafePlanningMessage(dashboard.error)}
      </main>
    );
  }

  const data = dashboard.data?.todayDashboard;

  if (data === undefined) {
    return (
      <main className="status-page" role="alert">
        Today is not available.
      </main>
    );
  }

  const hasPlan =
    data.mainTask !== null ||
    data.germanTask !== null ||
    data.missedTasks.length > 0 ||
    data.weeklyProgress.plannedCount > 0;

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="today-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">Today</p>
          <h1 id="today-title">{formatDate(data.date)}</h1>
          <p>
            {me.data?.me.profile.displayName === undefined
              ? "Your plan is ready."
              : `Your plan is ready, ${me.data.me.profile.displayName}.`}
          </p>
        </div>
        <LogoutButton />
      </section>

      {actionError === undefined ? null : (
        <p className="form-error" role="alert">
          {actionError}
        </p>
      )}

      {!hasPlan ? (
        <section className="content-empty">
          <p>No active study plan yet.</p>
          <Link className="button-link" to="/onboarding">
            Create study plan
          </Link>
        </section>
      ) : (
        <section className="today-grid">
          <TaskPanel task={data.mainTask} title="Main task" onStart={(taskId) => void startTask(taskId)} loading={startState.loading} />
          <TaskPanel task={data.germanTask} title="German task" onStart={(taskId) => void startTask(taskId)} loading={startState.loading} />

          <article className="module-panel">
            <h2>Week progress</h2>
            <p>
              {data.weeklyProgress.completedCount} of {data.weeklyProgress.plannedCount} tasks complete ·{" "}
              {data.weeklyProgress.weeklyCompletionPercentage}%
            </p>
            <p>{data.estimatedStudyMinutes} planned minutes today.</p>
            <Link className="button-link button-link--secondary" to="/plan/week/1">
              View weekly plan
            </Link>
          </article>

          <article className="module-panel">
            <h2>Missed sessions</h2>
            {data.missedTasks.length === 0 ? (
              <p>No missed sessions need recovery.</p>
            ) : (
              <div className="recovery-list">
                {data.missedTasks.map((task) => {
                  const proposal = proposalByTaskId[task.id];

                  return (
                    <section key={task.id}>
                      <h3>{task.lesson.title}</h3>
                      <p>
                        Missed on {formatDate(task.scheduledOn)} · {task.plannedDurationMinutes} min
                      </p>
                      {proposal === undefined ? (
                        <button type="button" disabled={proposeState.loading} onClick={() => void recover(task.id)}>
                          Propose recovery
                        </button>
                      ) : (
                        <div>
                          <p>
                            {proposal.targetDate === null
                              ? proposal.reason
                              : `Move to ${formatDate(proposal.targetDate)}.`}
                          </p>
                          <button type="button" disabled={applyState.loading || proposal.targetDate === null} onClick={() => void apply(proposal)}>
                            Apply recovery
                          </button>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </article>
        </section>
      )}
    </main>
  );
}

function TaskPanel({
  loading,
  onStart,
  task,
  title
}: {
  readonly loading: boolean;
  readonly onStart: (taskId: string) => void;
  readonly task: DailyTask | null;
  readonly title: string;
}): React.JSX.Element {
  return (
    <article className="module-panel">
      <h2>{title}</h2>
      {task === null ? (
        <p>No task scheduled today.</p>
      ) : (
        <>
          <p className="track-card__type">{task.lesson.trackTitle} · {task.lesson.moduleTitle}</p>
          <h3>{task.lesson.title}</h3>
          <p>{task.lesson.learningObjective}</p>
          <p>
            {task.plannedDurationMinutes} min · {task.status}
          </p>
          <div className="auth-panel__actions">
            <Link className="button-link" to={`/lessons/${task.id}`}>
              Open lesson
            </Link>
            <button type="button" disabled={loading || task.status !== "PLANNED"} onClick={() => onStart(task.id)}>
              {task.status === "IN_PROGRESS" ? "In progress" : "Start task"}
            </button>
          </div>
        </>
      )}
    </article>
  );
}
