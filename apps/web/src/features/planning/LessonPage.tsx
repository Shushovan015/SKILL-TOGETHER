import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { fetchCsrfToken } from "../auth/graphql.js";
import {
  COMPLETE_DAILY_TASK_MUTATION,
  DAILY_TASK_QUERY,
  START_DAILY_TASK_MUTATION,
  type CompleteDailyTaskMutationData,
  type CompleteDailyTaskMutationVariables,
  type DailyTask,
  type DailyTaskQueryData,
  type DailyTaskQueryVariables,
  type StartDailyTaskMutationData,
  type TaskIdMutationVariables
} from "./graphql.js";
import { toSafePlanningMessage } from "./planning-ui.js";

interface LessonPageProps {
  readonly exerciseOnly?: boolean;
}

export function LessonPage({ exerciseOnly = false }: LessonPageProps): React.JSX.Element {
  const { dailyTaskId } = useParams();
  const client = useApolloClient();
  const navigate = useNavigate();
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [guidedEvidence, setGuidedEvidence] = useState("");
  const [independentEvidence, setIndependentEvidence] = useState("");
  const [knowledgeCheckEvidence, setKnowledgeCheckEvidence] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");
  const [reflection, setReflection] = useState("");
  const [actionError, setActionError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const query = useQuery<DailyTaskQueryData, DailyTaskQueryVariables>(DAILY_TASK_QUERY, {
    variables: {
      id: dailyTaskId ?? ""
    },
    skip: dailyTaskId === undefined,
    fetchPolicy: "cache-and-network"
  });
  const [startDailyTask, startState] = useMutation<
    StartDailyTaskMutationData,
    TaskIdMutationVariables
  >(START_DAILY_TASK_MUTATION);
  const [completeDailyTask, completeState] = useMutation<
    CompleteDailyTaskMutationData,
    CompleteDailyTaskMutationVariables
  >(COMPLETE_DAILY_TASK_MUTATION);

  if (dailyTaskId === undefined) {
    return (
      <main className="status-page" role="alert">
        This lesson is not available.
      </main>
    );
  }

  if (query.loading && query.data?.dailyTask === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading lesson...
      </main>
    );
  }

  if (query.error !== undefined && query.data?.dailyTask === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafePlanningMessage(query.error)}
      </main>
    );
  }

  const task = query.data?.dailyTask;

  if (task === undefined) {
    return (
      <main className="status-page" role="alert">
        This lesson is not available.
      </main>
    );
  }

  const taskId = task.id;

  async function runWithCsrf(action: (csrfToken: string) => Promise<void>): Promise<void> {
    setActionError(undefined);
    setSuccessMessage(undefined);

    try {
      await action(await fetchCsrfToken(client));
      await query.refetch();
    } catch (error) {
      setActionError(toSafePlanningMessage(error));
    }
  }

  async function startTask(): Promise<void> {
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

  async function completeTask(): Promise<void> {
    if (
      guidedEvidence.trim().length === 0 &&
      independentEvidence.trim().length === 0 &&
      completionNotes.trim().length === 0
    ) {
      setActionError("Write something in the practice boxes before completing the lesson.");
      return;
    }

    await runWithCsrf(async (csrfToken) => {
      await completeDailyTask({
        variables: {
          input: {
            dailyTaskId: taskId,
            durationMinutes,
            completionEvidence: {
              guidedExercise: guidedEvidence,
              independentExercise: independentEvidence,
              knowledgeChecks: knowledgeCheckEvidence,
              notes: completionNotes
            },
            reflection: reflection.trim().length === 0 ? null : reflection
          }
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      setSuccessMessage("Lesson completed. Your practice and reflection were saved.");
    });
  }

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="lesson-title">
      <section className="workspace-header lesson-header">
        <div>
          <Link className="back-link" to={exerciseOnly ? `/lessons/${taskId}` : "/today"}>
            {exerciseOnly ? "< Back to lesson" : "< Back to Today"}
          </Link>
          <p className="auth-panel__eyebrow">
            {task.lesson.trackTitle} &gt; Week {task.studyWeekNumber}
          </p>
          <h1 id="lesson-title">{task.lesson.title}</h1>
          <p>
            {task.lesson.difficulty} - {task.plannedDurationMinutes} minutes - {formatStatus(task.status)}
          </p>
        </div>
        <div className="auth-panel__actions">
          <Link className="button-link button-link--secondary" to={`/plan/week/${task.studyWeekNumber}`}>
            This Week
          </Link>
          <Link className="button-link button-link--secondary" to={`/roadmap`}>
            Roadmap
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

      {exerciseOnly ? (
        <LessonCompletionForm
          completeLoading={completeState.loading}
          durationMinutes={durationMinutes}
          guidedEvidence={guidedEvidence}
          independentEvidence={independentEvidence}
          knowledgeCheckEvidence={knowledgeCheckEvidence}
          notes={completionNotes}
          reflection={reflection}
          setDurationMinutes={setDurationMinutes}
          setGuidedEvidence={setGuidedEvidence}
          setIndependentEvidence={setIndependentEvidence}
          setKnowledgeCheckEvidence={setKnowledgeCheckEvidence}
          setNotes={setCompletionNotes}
          setReflection={setReflection}
          task={task}
          onComplete={() => void completeTask()}
        />
      ) : (
        <section className="lesson-layout">
          <article className="lesson-content lesson-content--learning">
            <LessonSections task={task} />
          </article>
          <aside className="lesson-action" aria-label="Lesson actions">
            <button type="button" disabled={startState.loading || task.status !== "PLANNED"} onClick={() => void startTask()}>
              {task.status === "PLANNED" ? "Start lesson" : "Lesson started"}
            </button>
            <button type="button" onClick={() => navigate(`/lessons/${taskId}/exercise`)}>
              Finish lesson
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}

function LessonSections({ task }: { readonly task: DailyTask }): React.JSX.Element {
  return (
    <>
      <section>
        <h2>What You Will Learn</h2>
        <p>By the end of this lesson you will be able to:</p>
        <ul>
          {task.lesson.outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Before You Start</h2>
        <p>{beforeStartCopy(task)}</p>
      </section>
      <section>
        <h2>Learn</h2>
        <p className="preserve-lines">{task.lesson.explanationMarkdown}</p>
      </section>
      <section>
        <h2>Why This Matters</h2>
        <p className="preserve-lines">{task.lesson.businessRelevanceMarkdown}</p>
      </section>
      <section>
        <h2>Examples</h2>
        <ul className="example-list">
          {task.lesson.examples.map((example) => (
            <li className="preserve-lines" key={example}>{example}</li>
          ))}
        </ul>
      </section>
      <ExerciseSection
        evidence={task.lesson.guidedExercise.expectedEvidence}
        prompt={task.lesson.guidedExercise.promptMarkdown}
        title="Try It With Me"
      />
      <ExerciseSection
        evidence={task.lesson.independentExercise.expectedEvidence}
        prompt={task.lesson.independentExercise.promptMarkdown}
        title="Practice By Yourself"
      />
      <section>
        <h2>Check Your Understanding</h2>
        <ol>
          {task.lesson.knowledgeChecks.map((check) => (
            <li key={check.id}>{check.question}</li>
          ))}
        </ol>
      </section>
      <section>
        <h2>Common Mistakes</h2>
        <ul>
          {task.lesson.commonMistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Learning Resources</h2>
        {task.lesson.resources.length === 0 ? (
          <p>No extra resources are required for this lesson.</p>
        ) : (
          <ul>
            {task.lesson.resources.map((resource) => (
              <li key={resource.id}>
                <a href={resource.url} rel="noreferrer" target="_blank">
                  {resource.title}
                </a>
                <small>
                  {resource.provider} - {resource.resourceType} - {resource.estimatedMinutes} min -{" "}
                  {resource.required ? "Recommended before practice" : "Optional"} -{" "}
                  {resource.verificationStatus === "VERIFIED" ? "Verified" : "Needs verification"}
                </small>
                {resource.description.length === 0 ? null : <p>{resource.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function ExerciseSection({
  evidence,
  prompt,
  title
}: {
  readonly evidence: string;
  readonly prompt: string;
  readonly title: string;
}): React.JSX.Element {
  return (
    <section>
      <h2>{title}</h2>
      <p className="preserve-lines">{prompt}</p>
      <p>
        <strong>What to write down:</strong> {evidence}
      </p>
    </section>
  );
}

function LessonCompletionForm({
  completeLoading,
  durationMinutes,
  guidedEvidence,
  independentEvidence,
  knowledgeCheckEvidence,
  notes,
  reflection,
  setDurationMinutes,
  setGuidedEvidence,
  setIndependentEvidence,
  setKnowledgeCheckEvidence,
  setNotes,
  setReflection,
  task,
  onComplete
}: {
  readonly completeLoading: boolean;
  readonly durationMinutes: number;
  readonly guidedEvidence: string;
  readonly independentEvidence: string;
  readonly knowledgeCheckEvidence: string;
  readonly notes: string;
  readonly reflection: string;
  readonly setDurationMinutes: (value: number) => void;
  readonly setGuidedEvidence: (value: string) => void;
  readonly setIndependentEvidence: (value: string) => void;
  readonly setKnowledgeCheckEvidence: (value: string) => void;
  readonly setNotes: (value: string) => void;
  readonly setReflection: (value: string) => void;
  readonly task: DailyTask;
  readonly onComplete: () => void;
}): React.JSX.Element {
  return (
    <section className="lesson-layout">
      <article className="lesson-content">
        <ExerciseSection title="Try It With Me" prompt={task.lesson.guidedExercise.promptMarkdown} evidence={task.lesson.guidedExercise.expectedEvidence} />
        <ExerciseSection title="Practice By Yourself" prompt={task.lesson.independentExercise.promptMarkdown} evidence={task.lesson.independentExercise.expectedEvidence} />
        <section>
          <h2>Check Your Understanding</h2>
          <ol>
            {task.lesson.knowledgeChecks.map((check) => (
              <li key={check.id}>{check.question}</li>
            ))}
          </ol>
        </section>
      </article>
      <form className="content-form" onSubmit={(event) => event.preventDefault()}>
        <h2>Finish Lesson</h2>
        <label>
          Study time in minutes
          <input type="number" min={1} max={480} value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} />
        </label>
        <label>
          Try It With Me
          <textarea rows={4} value={guidedEvidence} onChange={(event) => setGuidedEvidence(event.target.value)} />
        </label>
        <label>
          Practice By Yourself
          <textarea rows={4} value={independentEvidence} onChange={(event) => setIndependentEvidence(event.target.value)} />
        </label>
        <label>
          Check Your Understanding
          <textarea rows={4} value={knowledgeCheckEvidence} onChange={(event) => setKnowledgeCheckEvidence(event.target.value)} />
        </label>
        <label>
          Notes
          <textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
        <label>
          Daily reflection
          <textarea rows={4} value={reflection} onChange={(event) => setReflection(event.target.value)} />
        </label>
        <button type="button" disabled={completeLoading || task.status === "COMPLETED"} onClick={onComplete}>
          {completeLoading ? "Saving..." : "Complete lesson"}
        </button>
      </form>
    </section>
  );
}

function beforeStartCopy(task: DailyTask): string {
  if (task.lesson.trackTitle === "German" && task.studyWeekNumber === 1) {
    return "No previous German knowledge required.";
  }

  if (task.lesson.trackTitle === "Software Engineering") {
    return "You should be comfortable reading short JavaScript examples.";
  }

  if (task.lesson.trackTitle === "Project Management") {
    return "No formal project-management experience required.";
  }

  return "Review the previous lesson if this topic feels unfamiliar.";
}

function formatStatus(status: DailyTask["status"]): string {
  return status.toLowerCase().replace("_", " ");
}
