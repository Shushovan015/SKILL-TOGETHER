import { useApolloClient, useMutation } from "@apollo/client/react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { fetchCsrfToken } from "../auth/graphql.js";
import {
  START_WEEKLY_ASSESSMENT_MUTATION,
  SUBMIT_ASSESSMENT_MUTATION,
  type AssessmentAttempt,
  type AssessmentQuestion,
  type JsonValue,
  type StartWeeklyAssessmentMutationData,
  type SubmitAssessmentMutationData,
  type SubmitAssessmentMutationVariables,
  type WeeklyAssessmentVariables
} from "./graphql.js";
import {
  isAnswered,
  questionOptions,
  toSafeAssessmentMessage
} from "./assessment-ui.js";

type AnswersByQuestionId = Readonly<Record<string, JsonValue>>;

export function AssessmentPage(): React.JSX.Element {
  const { studyWeekId } = useParams();
  const client = useApolloClient();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<AssessmentAttempt | undefined>();
  const [answers, setAnswers] = useState<AnswersByQuestionId>({});
  const [actionError, setActionError] = useState<string | undefined>();
  const [startWeeklyAssessment, startState] = useMutation<
    StartWeeklyAssessmentMutationData,
    WeeklyAssessmentVariables
  >(START_WEEKLY_ASSESSMENT_MUTATION);
  const [submitAssessment, submitState] = useMutation<
    SubmitAssessmentMutationData,
    SubmitAssessmentMutationVariables
  >(SUBMIT_ASSESSMENT_MUTATION);

  if (studyWeekId === undefined) {
    return (
      <main className="status-page" role="alert">
        This assessment is not available.
      </main>
    );
  }

  const currentStudyWeekId = studyWeekId;

  async function startAssessment(): Promise<void> {
    setActionError(undefined);

    try {
      const result = await startWeeklyAssessment({
        variables: {
          studyWeekId: currentStudyWeekId
        },
        context: {
          headers: {
            "x-csrf-token": await fetchCsrfToken(client)
          }
        }
      });
      setAttempt(result.data?.startWeeklyAssessment);
      setAnswers({});
    } catch (error) {
      setActionError(toSafeAssessmentMessage(error));
    }
  }

  async function submit(): Promise<void> {
    if (attempt === undefined) {
      return;
    }

    if (attempt.questions.some((question) => !isAnswered(answers[question.id]))) {
      setActionError("Answer every question before submitting.");
      return;
    }

    setActionError(undefined);

    try {
      const result = await submitAssessment({
        variables: {
          input: {
            attemptId: attempt.id,
            answers: attempt.questions.map((question) => ({
              questionId: question.id,
              response: answers[question.id] ?? null
            }))
          }
        },
        context: {
          headers: {
            "x-csrf-token": await fetchCsrfToken(client)
          }
        }
      });
      const submittedAttempt = result.data?.submitAssessment;

      if (submittedAttempt !== undefined) {
        navigate(`/assessments/${submittedAttempt.id}/result`);
      }
    } catch (error) {
      setActionError(toSafeAssessmentMessage(error));
    }
  }

  function setAnswer(questionId: string, response: JsonValue): void {
    setAnswers((current) => ({
      ...current,
      [questionId]: response
    }));
  }

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="assessment-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">Weekly assessment</p>
          <h1 id="assessment-title">Week assessment</h1>
          <p>Answer the reviewed questions for completed lessons in this week.</p>
        </div>
        <div className="auth-panel__actions">
          <Link className="button-link button-link--secondary" to="/today">
            Today
          </Link>
        </div>
      </section>

      {actionError === undefined ? null : (
        <p className="form-error" role="alert">
          {actionError}
        </p>
      )}

      {attempt === undefined ? (
        <section className="module-panel">
          <h2>Start assessment</h2>
          <p>Complete at least one required lesson in the week before starting.</p>
          <button type="button" disabled={startState.loading} onClick={() => void startAssessment()}>
            {startState.loading ? "Starting..." : "Start weekly assessment"}
          </button>
        </section>
      ) : (
        <section className="lesson-layout">
          <div className="lesson-content">
            {attempt.questions.map((question, index) => (
              <QuestionCard
                answer={answers[question.id]}
                key={question.id}
                number={index + 1}
                onAnswer={(response) => setAnswer(question.id, response)}
                question={question}
              />
            ))}
          </div>
          <aside className="lesson-action">
            <h2>Attempt {attempt.attemptNumber}</h2>
            <p>{attempt.status}</p>
            {attempt.result === null ? (
              <button type="button" disabled={submitState.loading} onClick={() => void submit()}>
                {submitState.loading ? "Submitting..." : "Submit assessment"}
              </button>
            ) : (
              <Link className="button-link" to={`/assessments/${attempt.id}/result`}>
                View result
              </Link>
            )}
          </aside>
        </section>
      )}
    </main>
  );
}

function QuestionCard({
  answer,
  number,
  onAnswer,
  question
}: {
  readonly answer: JsonValue | undefined;
  readonly number: number;
  readonly onAnswer: (response: JsonValue) => void;
  readonly question: AssessmentQuestion;
}): React.JSX.Element {
  const options = questionOptions(question);

  return (
    <section>
      <h2>Question {number}</h2>
      <p>{question.promptMarkdown}</p>
      {question.type === "TRUE_FALSE" ? (
        <select
          aria-label={`Answer question ${number}`}
          value={typeof answer === "boolean" ? String(answer) : ""}
          onChange={(event) => onAnswer(event.currentTarget.value === "true")}
        >
          <option value="">Select an answer</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      ) : null}
      {question.type === "MULTIPLE_CHOICE" ? (
        <fieldset className="planner-days">
          <legend>Choose one</legend>
          {options.map((option) => (
            <label className="checkbox-row" key={option.id}>
              <input
                checked={answer === option.id}
                name={question.id}
                type="radio"
                onChange={() => onAnswer(option.id)}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      ) : null}
      {question.type === "MULTIPLE_SELECT" ? (
        <fieldset className="planner-days">
          <legend>Choose all that apply</legend>
          {options.map((option) => (
            <label className="checkbox-row" key={option.id}>
              <input
                checked={isSelected(answer, option.id)}
                type="checkbox"
                onChange={() => onAnswer(toggleSelection(answer, option.id))}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      ) : null}
      {question.type !== "TRUE_FALSE" &&
      question.type !== "MULTIPLE_CHOICE" &&
      question.type !== "MULTIPLE_SELECT" ? (
        <textarea
          aria-label={`Answer question ${number}`}
          rows={6}
          value={typeof answer === "string" ? answer : ""}
          onChange={(event) => onAnswer(event.currentTarget.value)}
        />
      ) : null}
    </section>
  );
}

function isSelected(answer: JsonValue | undefined, optionId: string): boolean {
  return Array.isArray(answer) && answer.includes(optionId);
}

function toggleSelection(answer: JsonValue | undefined, optionId: string): readonly string[] {
  const current = Array.isArray(answer)
    ? answer.filter((item): item is string => typeof item === "string")
    : [];

  return current.includes(optionId)
    ? current.filter((item) => item !== optionId)
    : [...current, optionId];
}
