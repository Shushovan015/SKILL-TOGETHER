import { zodResolver } from "@hookform/resolvers/zod";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

import { fetchCsrfToken } from "../auth/graphql.js";
import {
  enrollmentFormSchema,
  type EnrollmentFormValues
} from "./content-form-schemas.js";
import {
  LEARNING_TRACK_QUERY,
  MY_ENROLLMENTS_QUERY,
  SELECT_LEARNING_TRACK_MUTATION,
  type LearningTrackQueryData,
  type LearningTrackQueryVariables,
  type SelectLearningTrackMutationData,
  type SelectLearningTrackMutationVariables
} from "./graphql.js";
import { toSafeContentMessage, todayDateInputValue } from "./content-ui.js";

export function TrackDetailPage(): React.JSX.Element {
  const { slug } = useParams();
  const client = useApolloClient();
  const [formError, setFormError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const query = useQuery<LearningTrackQueryData, LearningTrackQueryVariables>(LEARNING_TRACK_QUERY, {
    variables: {
      slug: slug ?? ""
    },
    skip: slug === undefined,
    fetchPolicy: "cache-and-network"
  });
  const [selectLearningTrack, selectState] = useMutation<
    SelectLearningTrackMutationData,
    SelectLearningTrackMutationVariables
  >(SELECT_LEARNING_TRACK_MUTATION);
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      startDate: todayDateInputValue(),
      experienceLevel: "Beginner",
      targetOutcome: ""
    }
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

  const trackId = track.id;

  async function onSubmit(values: EnrollmentFormValues): Promise<void> {
    setFormError(undefined);
    setSuccessMessage(undefined);

    try {
      const csrfToken = await fetchCsrfToken(client);
      const result = await selectLearningTrack({
        variables: {
          input: {
            trackId,
            startDate: values.startDate,
            experienceLevel: values.experienceLevel,
            targetOutcome: values.targetOutcome
          }
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        },
        refetchQueries: [MY_ENROLLMENTS_QUERY]
      });
      const status = result.data?.selectLearningTrack.status ?? "DRAFT";
      setSuccessMessage(`Track selection saved as ${status}.`);
    } catch (error) {
      setFormError(toSafeContentMessage(error));
    }
  }

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="track-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">Roadmap</p>
          <h1 id="track-title">{track.title}</h1>
          <p>{track.description}</p>
        </div>
        <Link className="button-link button-link--secondary" to="/tracks">
          All tracks
        </Link>
      </section>

      <section className="content-layout">
        <form className="content-form" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <h2>Track selection</h2>
          <label>
            Start date
            <input type="date" aria-invalid={errors.startDate === undefined ? "false" : "true"} {...register("startDate")} />
          </label>
          {errors.startDate === undefined ? null : <p className="field-error">{errors.startDate.message}</p>}
          <label>
            Experience level
            <input aria-invalid={errors.experienceLevel === undefined ? "false" : "true"} {...register("experienceLevel")} />
          </label>
          {errors.experienceLevel === undefined ? null : (
            <p className="field-error">{errors.experienceLevel.message}</p>
          )}
          <label>
            Target outcome
            <textarea aria-invalid={errors.targetOutcome === undefined ? "false" : "true"} rows={4} {...register("targetOutcome")} />
          </label>
          {errors.targetOutcome === undefined ? null : (
            <p className="field-error">{errors.targetOutcome.message}</p>
          )}
          {formError === undefined ? null : (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
          {successMessage === undefined ? null : (
            <p className="form-success" role="status">
              {successMessage}
            </p>
          )}
          <button type="submit" disabled={selectState.loading}>
            {selectState.loading ? "Saving..." : "Select track"}
          </button>
        </form>

        <section className="roadmap" aria-label={`${track.title} modules`}>
          {track.modules.map((moduleRecord) => (
            <article className="module-panel" key={moduleRecord.id}>
              <h2>
                {moduleRecord.sequence}. {moduleRecord.title}
              </h2>
              <p>{moduleRecord.summary}</p>
              <ol>
                {moduleRecord.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <span>{lesson.title}</span>
                    <small>
                      {lesson.estimatedDurationMinutes} min · {lesson.difficulty}
                    </small>
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
