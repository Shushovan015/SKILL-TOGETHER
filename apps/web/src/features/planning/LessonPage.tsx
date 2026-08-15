import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
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
import { LearningContent } from "./LearningContent.js";
import { clearLessonDraft, readLessonDraft, writeLessonDraft } from "./lesson-draft.js";

interface LessonPageProps {
  readonly exerciseOnly?: boolean;
}

export function LessonPage({ exerciseOnly = false }: LessonPageProps): React.JSX.Element {
  const { dailyTaskId } = useParams();
  const client = useApolloClient();
  const navigate = useNavigate();
  const initialDraft = readLessonDraft(dailyTaskId);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [guidedEvidence, setGuidedEvidence] = useState(initialDraft.guidedEvidence);
  const [independentEvidence, setIndependentEvidence] = useState(initialDraft.independentEvidence);
  const [knowledgeCheckEvidence, setKnowledgeCheckEvidence] = useState(initialDraft.knowledgeCheckEvidence);
  const [completionNotes, setCompletionNotes] = useState(initialDraft.notes);
  const [reflection, setReflection] = useState(initialDraft.reflection);
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
  const task = query.data?.dailyTask;

  useEffect(() => {
    if (dailyTaskId === undefined) return;
    writeLessonDraft(dailyTaskId, {
      guidedEvidence,
      independentEvidence,
      knowledgeCheckEvidence,
      notes: completionNotes,
      reflection
    });
  }, [completionNotes, dailyTaskId, guidedEvidence, independentEvidence, knowledgeCheckEvidence, reflection]);

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

  if (task === undefined) {
    return (
      <main className="status-page" role="alert">
        This lesson is not available.
      </main>
    );
  }

  const taskId = task.id;
  const selectedDurationMinutes = durationMinutes ?? task.plannedDurationMinutes;
  const roadmapUrl = `/roadmap?track=${encodeURIComponent(task.lesson.trackSlug)}`;

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
            durationMinutes: selectedDurationMinutes,
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
      clearLessonDraft(taskId);
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
            {task.lesson.trackTitle} &gt; {task.lesson.moduleTitle} &gt; Week {task.studyWeekNumber}
          </p>
          <h1 id="lesson-title">{task.lesson.title}</h1>
          <p>
            {task.lesson.difficulty} - {task.plannedDurationMinutes} minutes - {formatStatus(task.status)}
          </p>
          <p className="lesson-goal"><strong>Today&apos;s goal:</strong> {task.lesson.learningObjective}</p>
        </div>
        <div className="auth-panel__actions">
          <Link className="button-link button-link--secondary" to={`/plan/week/${task.studyWeekNumber}`}>
            This Week
          </Link>
          <Link className="button-link button-link--secondary" to={roadmapUrl}>
            Roadmap
          </Link>
          <Link className="button-link button-link--secondary" to="/tracks">
            My Tracks
          </Link>
        </div>
      </section>

      {actionError === undefined ? null : (
        <p className="form-error" role="alert">
          {actionError}
        </p>
      )}
      {successMessage === undefined ? null : (
        <section className="form-success" role="status">
          <p>{successMessage}</p>
          <div className="auth-panel__actions">
            <Link className="button-link" to="/today">Continue on Today</Link>
            <Link className="button-link button-link--secondary" to={roadmapUrl}>View roadmap</Link>
          </div>
        </section>
      )}

      {exerciseOnly ? (
        <LessonCompletionForm
          completeLoading={completeState.loading}
          durationMinutes={selectedDurationMinutes}
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
            <div className="lesson-progress" aria-label="Session progress">
              <span>Learn</span><span>Example</span><span>Guided practice</span><span>Independent practice</span><span>Review</span>
            </div>
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
        <p className="learning-section-label">Orient</p>
        <h2>What You Will Learn</h2>
        <p>By the end of this lesson you will be able to:</p>
        <ul>
          {task.lesson.outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </section>
      <section>
        <p className="learning-section-label">Prerequisites</p>
        <h2>Before You Start</h2>
        <p>{beforeStartCopy(task)}</p>
      </section>
      <section>
        <p className="learning-section-label">Concept</p>
        <h2>Learn the Mental Model</h2>
        <LearningContent content={task.lesson.explanationMarkdown} />
      </section>
      <section>
        <p className="learning-section-label">Why?</p>
        <h2>Why This Matters</h2>
        <LearningContent content={task.lesson.businessRelevanceMarkdown} />
      </section>
      <section>
        <p className="learning-section-label">Watch</p>
        <h2>Worked Examples</h2>
        <ul className="example-list">
          {task.lesson.examples.map((example) => (
            <li key={example}><LearningContent content={example} /></li>
          ))}
        </ul>
      </section>
      <ExerciseSection
        evidence={task.lesson.guidedExercise.expectedEvidence}
        prompt={task.lesson.guidedExercise.promptMarkdown}
        solutionNotes={task.lesson.guidedExercise.solutionNotesMarkdown ?? null}
        title="Try It With Me"
      />
      <ExerciseSection
        evidence={task.lesson.independentExercise.expectedEvidence}
        prompt={task.lesson.independentExercise.promptMarkdown}
        solutionNotes={task.lesson.independentExercise.solutionNotesMarkdown ?? null}
        title="Practice By Yourself"
      />
      <section>
        <p className="learning-section-label">Retrieval</p>
        <h2>Check Your Understanding</h2>
        <ol>
          {task.lesson.knowledgeChecks.map((check) => (
            <li key={check.id}>
              <p>{check.question}</p>
              <details>
                <summary>Show answer and feedback</summary>
                <p>
                  <strong>Answer:</strong> {(check.answerKey ?? ["No answer key available."]).join(" / ")}
                </p>
                <p>{check.explanation ?? "No explanation available."}</p>
              </details>
            </li>
          ))}
        </ol>
      </section>
      <section className="learning-callout learning-callout--mistake">
        <p className="learning-section-label">Common Mistake</p>
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
  solutionNotes,
  title
}: {
  readonly evidence: string;
  readonly prompt: string;
  readonly solutionNotes: string | null;
  readonly title: string;
}): React.JSX.Element {
  return (
    <section className={title === "Try It With Me" ? "learning-callout learning-callout--guided" : "learning-callout learning-callout--independent"}>
      <p className="learning-section-label">{title === "Try It With Me" ? "Guided Practice" : "Try It Yourself"}</p>
      <h2>{title}</h2>
      <LearningContent content={prompt} />
      <p>
        <strong>What to write down:</strong> {evidence}
      </p>
      {solutionNotes === null ? null : (
        <details>
          <summary>Show answer notes</summary>
          <LearningContent content={solutionNotes} />
        </details>
      )}
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
        <ExerciseSection
          title="Try It With Me"
          prompt={task.lesson.guidedExercise.promptMarkdown}
          evidence={task.lesson.guidedExercise.expectedEvidence}
          solutionNotes={task.lesson.guidedExercise.solutionNotesMarkdown ?? null}
        />
        <ExerciseSection
          title="Practice By Yourself"
          prompt={task.lesson.independentExercise.promptMarkdown}
          evidence={task.lesson.independentExercise.expectedEvidence}
          solutionNotes={task.lesson.independentExercise.solutionNotesMarkdown ?? null}
        />
        <section>
          <h2>Check Your Understanding</h2>
          <ol>
            {task.lesson.knowledgeChecks.map((check) => (
              <li key={check.id}>
                <p>{check.question}</p>
                <details>
                  <summary>Show answer and feedback</summary>
                  <p>
                    <strong>Answer:</strong> {(check.answerKey ?? ["No answer key available."]).join(" / ")}
                  </p>
                  <p>{check.explanation ?? "No explanation available."}</p>
                </details>
              </li>
            ))}
          </ol>
        </section>
      </article>
      <form className="content-form" onSubmit={(event) => event.preventDefault()}>
        <h2>Finish Lesson</h2>
        <p className="form-help" role="status">Your unfinished answers are preserved when this tab refreshes.</p>
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
