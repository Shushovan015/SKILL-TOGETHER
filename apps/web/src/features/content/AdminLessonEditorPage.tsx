import { zodResolver } from "@hookform/resolvers/zod";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

import { fetchCsrfToken } from "../auth/graphql.js";
import {
  lessonEditorFormSchema,
  type LessonEditorFormValues
} from "./content-form-schemas.js";
import {
  ADMIN_LESSON_VERSION_QUERY,
  UPDATE_LESSON_VERSION_MUTATION,
  type AdminLessonVersion,
  type AdminLessonVersionQueryData,
  type AdminLessonVersionQueryVariables,
  type LessonVersionEditorInput,
  type UpdateLessonVersionMutationData,
  type UpdateLessonVersionMutationVariables
} from "./graphql.js";
import { firstOrFallback, toSafeContentMessage } from "./content-ui.js";

export function AdminLessonEditorPage(): React.JSX.Element {
  const { versionId } = useParams();
  const client = useApolloClient();
  const [formError, setFormError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const query = useQuery<AdminLessonVersionQueryData, AdminLessonVersionQueryVariables>(
    ADMIN_LESSON_VERSION_QUERY,
    {
      variables: {
        id: versionId ?? ""
      },
      skip: versionId === undefined,
      fetchPolicy: "cache-and-network"
    }
  );
  const [updateLessonVersion, updateState] = useMutation<
    UpdateLessonVersionMutationData,
    UpdateLessonVersionMutationVariables
  >(UPDATE_LESSON_VERSION_MUTATION);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<LessonEditorFormValues>({
    resolver: zodResolver(lessonEditorFormSchema),
    defaultValues: emptyEditorValues()
  });

  useEffect(() => {
    if (query.data?.adminLessonVersion !== undefined) {
      reset(toEditorValues(query.data.adminLessonVersion));
    }
  }, [query.data?.adminLessonVersion, reset]);

  if (versionId === undefined) {
    return (
      <main className="status-page" role="alert">
        This content is not available.
      </main>
    );
  }

  if (query.loading && query.data?.adminLessonVersion === undefined) {
    return (
      <main className="status-page" aria-live="polite">
        Loading lesson editor...
      </main>
    );
  }

  if (query.error !== undefined && query.data?.adminLessonVersion === undefined) {
    return (
      <main className="status-page" role="alert">
        {toSafeContentMessage(query.error)}
      </main>
    );
  }

  const version = query.data?.adminLessonVersion;

  if (version === undefined) {
    return (
      <main className="status-page" role="alert">
        This content is not available.
      </main>
    );
  }

  const editable = version.status === "DRAFT";
  const lessonVersionId = version.id;

  async function onSubmit(values: LessonEditorFormValues): Promise<void> {
    setFormError(undefined);
    setSuccessMessage(undefined);

    try {
      const csrfToken = await fetchCsrfToken(client);
      await updateLessonVersion({
        variables: {
          id: lessonVersionId,
          input: toLessonVersionInput(values)
        },
        context: {
          headers: {
            "x-csrf-token": csrfToken
          }
        }
      });
      setSuccessMessage("Lesson version saved.");
    } catch (error) {
      setFormError(toSafeContentMessage(error));
    }
  }

  return (
    <main className="workspace-page workspace-page--wide" aria-labelledby="lesson-editor-title">
      <section className="workspace-header content-header">
        <div>
          <p className="auth-panel__eyebrow">
            {version.trackTitle} · {version.moduleTitle} · {version.status}
          </p>
          <h1 id="lesson-editor-title">{version.title}</h1>
          <p>
            {version.lessonSlug} · version {version.version}
          </p>
        </div>
        <Link className="button-link button-link--secondary" to="/admin/content">
          Content list
        </Link>
      </section>

      <form className="editor-form" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <fieldset disabled={!editable || updateState.loading}>
          <label>
            Title
            <input aria-invalid={errors.title === undefined ? "false" : "true"} {...register("title")} />
          </label>
          {errors.title === undefined ? null : <p className="field-error">{errors.title.message}</p>}

          <label>
            Learning objective
            <textarea rows={3} aria-invalid={errors.learningObjective === undefined ? "false" : "true"} {...register("learningObjective")} />
          </label>
          {errors.learningObjective === undefined ? null : <p className="field-error">{errors.learningObjective.message}</p>}

          <label>
            Outcomes
            <textarea rows={4} aria-invalid={errors.outcomes === undefined ? "false" : "true"} {...register("outcomes")} />
          </label>
          {errors.outcomes === undefined ? null : <p className="field-error">{errors.outcomes.message}</p>}

          <label>
            Explanation
            <textarea rows={5} aria-invalid={errors.explanationMarkdown === undefined ? "false" : "true"} {...register("explanationMarkdown")} />
          </label>
          {errors.explanationMarkdown === undefined ? null : <p className="field-error">{errors.explanationMarkdown.message}</p>}

          <label>
            Relevance
            <textarea rows={4} aria-invalid={errors.relevanceMarkdown === undefined ? "false" : "true"} {...register("relevanceMarkdown")} />
          </label>
          {errors.relevanceMarkdown === undefined ? null : <p className="field-error">{errors.relevanceMarkdown.message}</p>}

          <label>
            Examples
            <textarea rows={4} aria-invalid={errors.examples === undefined ? "false" : "true"} {...register("examples")} />
          </label>
          {errors.examples === undefined ? null : <p className="field-error">{errors.examples.message}</p>}

          <label>
            Common mistakes
            <textarea rows={4} aria-invalid={errors.commonMistakes === undefined ? "false" : "true"} {...register("commonMistakes")} />
          </label>
          {errors.commonMistakes === undefined ? null : <p className="field-error">{errors.commonMistakes.message}</p>}

          <label>
            Assessment tags
            <input aria-invalid={errors.assessmentTags === undefined ? "false" : "true"} {...register("assessmentTags")} />
          </label>
          {errors.assessmentTags === undefined ? null : <p className="field-error">{errors.assessmentTags.message}</p>}

          <section className="editor-form__section">
            <h2>Resource</h2>
            <label>
              Title
              <input {...register("resourceTitle")} />
            </label>
            <label>
              URL
              <input {...register("resourceUrl")} />
            </label>
            <label>
              Type
              <input {...register("resourceType")} />
            </label>
            <label>
              Citation
              <textarea rows={3} {...register("resourceCitation")} />
            </label>
            <label className="checkbox-row">
              <input type="checkbox" {...register("resourceRequired")} />
              Required
            </label>
            <label className="checkbox-row">
              <input type="checkbox" {...register("resourceApproved")} />
              Approved
            </label>
          </section>

          <section className="editor-form__section">
            <h2>Exercise</h2>
            <label>
              Kind
              <input {...register("exerciseKind")} />
            </label>
            <label>
              Prompt
              <textarea rows={4} {...register("exercisePromptMarkdown")} />
            </label>
            <label>
              Expected evidence
              <textarea rows={3} {...register("exerciseExpectedEvidence")} />
            </label>
            <label>
              Solution notes
              <textarea rows={3} {...register("exerciseSolutionNotesMarkdown")} />
            </label>
          </section>

          <section className="editor-form__section">
            <h2>Knowledge check</h2>
            <label>
              Question
              <textarea rows={3} {...register("knowledgeCheckQuestion")} />
            </label>
            <label>
              Answer key
              <input {...register("knowledgeCheckAnswerKey")} />
            </label>
            <label>
              Explanation
              <textarea rows={3} {...register("knowledgeCheckExplanation")} />
            </label>
          </section>
        </fieldset>

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
        <button type="submit" disabled={!editable || updateState.loading}>
          {updateState.loading ? "Saving..." : "Save draft"}
        </button>
      </form>
    </main>
  );
}

function emptyEditorValues(): LessonEditorFormValues {
  return {
    title: "",
    learningObjective: "",
    outcomes: "",
    explanationMarkdown: "",
    relevanceMarkdown: "",
    examples: "",
    commonMistakes: "",
    assessmentTags: "",
    resourceTitle: "",
    resourceUrl: "https://example.test/",
    resourceType: "curriculum-reference",
    resourceRequired: false,
    resourceApproved: true,
    resourceCitation: "",
    exerciseKind: "independent",
    exercisePromptMarkdown: "",
    exerciseExpectedEvidence: "",
    exerciseSolutionNotesMarkdown: "",
    knowledgeCheckQuestion: "",
    knowledgeCheckAnswerKey: "",
    knowledgeCheckExplanation: ""
  };
}

function toEditorValues(version: AdminLessonVersion): LessonEditorFormValues {
  const resource = version.resources[0];
  const exercise = version.exercises[0];
  const knowledgeCheck = version.knowledgeChecks[0];

  return {
    title: version.title,
    learningObjective: version.learningObjective,
    outcomes: version.outcomes.join("\n"),
    explanationMarkdown: version.explanationMarkdown,
    relevanceMarkdown: version.relevanceMarkdown,
    examples: version.examples.join("\n"),
    commonMistakes: version.commonMistakes.join("\n"),
    assessmentTags: version.assessmentTags.join(", "),
    resourceTitle: resource?.title ?? "",
    resourceUrl: resource?.url ?? "https://example.test/",
    resourceType: resource?.resourceType ?? "curriculum-reference",
    resourceRequired: resource?.required ?? false,
    resourceApproved: resource?.approved ?? true,
    resourceCitation: resource?.citation ?? "",
    exerciseKind: exercise?.kind ?? "independent",
    exercisePromptMarkdown: exercise?.promptMarkdown ?? "",
    exerciseExpectedEvidence: exercise?.expectedEvidence ?? "",
    exerciseSolutionNotesMarkdown: exercise?.solutionNotesMarkdown ?? "",
    knowledgeCheckQuestion: knowledgeCheck?.question ?? "",
    knowledgeCheckAnswerKey: firstOrFallback(knowledgeCheck?.answerKey ?? [], ""),
    knowledgeCheckExplanation: knowledgeCheck?.explanation ?? ""
  };
}

function toLessonVersionInput(values: LessonEditorFormValues): LessonVersionEditorInput {
  return {
    title: values.title.trim(),
    learningObjective: values.learningObjective.trim(),
    outcomes: toLineArray(values.outcomes),
    explanationMarkdown: values.explanationMarkdown.trim(),
    relevanceMarkdown: values.relevanceMarkdown.trim(),
    examples: toLineArray(values.examples),
    commonMistakes: toLineArray(values.commonMistakes),
    assessmentTags: values.assessmentTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0),
    resources: [
      {
        title: values.resourceTitle.trim(),
        url: values.resourceUrl.trim(),
        resourceType: values.resourceType.trim(),
        required: values.resourceRequired,
        approved: values.resourceApproved,
        citation: values.resourceCitation.trim()
      }
    ],
    exercises: [
      {
        kind: values.exerciseKind.trim(),
        promptMarkdown: values.exercisePromptMarkdown.trim(),
        expectedEvidence: values.exerciseExpectedEvidence.trim(),
        solutionNotesMarkdown:
          values.exerciseSolutionNotesMarkdown.trim().length === 0
            ? null
            : values.exerciseSolutionNotesMarkdown.trim()
      }
    ],
    knowledgeChecks: [
      {
        question: values.knowledgeCheckQuestion.trim(),
        answerKey: toLineArray(values.knowledgeCheckAnswerKey),
        explanation: values.knowledgeCheckExplanation.trim()
      }
    ]
  };
}

function toLineArray(value: string): readonly string[] {
  return value
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
