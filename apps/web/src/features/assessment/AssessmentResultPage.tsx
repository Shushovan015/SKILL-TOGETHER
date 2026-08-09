import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";

import {
  ASSESSMENT_RESULT_QUERY,
  type AssessmentResultQueryData,
  type AssessmentResultQueryVariables
} from "./graphql.js";
import { toSafeAssessmentMessage } from "./assessment-ui.js";

export function AssessmentResultPage(): React.JSX.Element {
  const { attemptId } = useParams();
  const query = useQuery<AssessmentResultQueryData, AssessmentResultQueryVariables>(
    ASSESSMENT_RESULT_QUERY,
    {
      variables: {
        attemptId: attemptId ?? ""
      },
      skip: attemptId === undefined,
      fetchPolicy: "cache-and-network"
    }
  );

  if (attemptId === undefined) {
    return (
      <main className="status-page" role="alert">
        This result is not available.
      </main>
    );
  }

  if (query.loading && query.data?.assessmentResult === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading result...
      </main>
    );
  }

  if (query.error !== undefined && query.data?.assessmentResult === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafeAssessmentMessage(query.error)}
      </main>
    );
  }

  const result = query.data?.assessmentResult;

  if (result === undefined) {
    return (
      <main className="status-page" role="alert">
        This result is not available.
      </main>
    );
  }

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="assessment-result-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">Assessment result</p>
          <h1 id="assessment-result-title">
            {result.passed === true ? "Passed" : result.passed === false ? "Needs review" : "Pending review"}
          </h1>
          <p>
            {result.percentage === null
              ? result.status
              : `${result.percentage}% (${result.scoreEarned ?? 0}/${result.scorePossible ?? 0})`}
          </p>
        </div>
        <div className="auth-panel__actions">
          <Link className="button-link button-link--secondary" to="/today">
            Today
          </Link>
        </div>
      </section>

      <section className="today-grid">
        <article className="module-panel">
          <h2>Weak topics</h2>
          {result.weakTopics.length === 0 ? (
            <p>No weak topics detected from objective questions.</p>
          ) : (
            <ul>
              {result.weakTopics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          )}
        </article>

        <article className="module-panel">
          <h2>Revision</h2>
          {result.revisionRecommendations.length === 0 ? (
            <p>No revision tasks are recommended.</p>
          ) : (
            <ol>
              {result.revisionRecommendations.map((task) => (
                <li key={task.id}>
                  <Link to={`/lessons/${task.id}`}>{task.lesson.title}</Link>
                  <small>{task.lesson.moduleTitle}</small>
                </li>
              ))}
            </ol>
          )}
        </article>
      </section>
    </main>
  );
}
