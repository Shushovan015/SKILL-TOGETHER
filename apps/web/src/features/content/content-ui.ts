import { getFirstGraphqlErrorCode } from "../../shared/graphql/errors.js";
import type { AdminLessonVersion, LessonVersionEditorInput } from "./graphql.js";

export function toSafeContentMessage(error: unknown): string {
  const code = getFirstGraphqlErrorCode(error);

  if (code === "AUTH_FORBIDDEN") {
    return "You do not have access to this item.";
  }

  if (code === "AUTH_REQUIRED") {
    return "Please log in to continue.";
  }

  if (code === "CONTENT_APPROVAL_FAILED") {
    return "Complete required content fields before approval.";
  }

  if (code === "CONTENT_INVALID_STATUS") {
    return "This content cannot move to that status.";
  }

  if (code === "CONFLICT" || code === "CONTENT_VERSION_CONFLICT") {
    return "Refresh and try again.";
  }

  if (code === "VALIDATION_FAILED") {
    return "Check the highlighted fields and try again.";
  }

  if (isLikelyNetworkFailure(error)) {
    return "Cannot reach the content server. Start the API and try again.";
  }

  return "Something went wrong. Try again later.";
}

export function firstOrFallback(values: readonly string[], fallback: string): string {
  return values[0] ?? fallback;
}

export function cloneLessonVersionInput(version: AdminLessonVersion): LessonVersionEditorInput {
  return {
    title: version.title,
    learningObjective: version.learningObjective,
    outcomes: [...version.outcomes],
    explanationMarkdown: version.explanationMarkdown,
    relevanceMarkdown: version.relevanceMarkdown,
    examples: [...version.examples],
    commonMistakes: [...version.commonMistakes],
    assessmentTags: [...version.assessmentTags],
    resources: version.resources.map((resource) => ({
      title: resource.title,
      provider: resource.provider,
      url: resource.url,
      resourceType: resource.resourceType,
      difficulty: resource.difficulty,
      estimatedMinutes: resource.estimatedMinutes,
      description: resource.description,
      verificationStatus: resource.verificationStatus,
      required: resource.required,
      approved: resource.approved,
      citation: resource.citation
    })),
    exercises: version.exercises.map((exercise) => ({
      kind: exercise.kind,
      promptMarkdown: exercise.promptMarkdown,
      expectedEvidence: exercise.expectedEvidence,
      solutionNotesMarkdown: exercise.solutionNotesMarkdown
    })),
    knowledgeChecks: version.knowledgeChecks.map((knowledgeCheck) => ({
      question: knowledgeCheck.question,
      answerKey: [...knowledgeCheck.answerKey],
      explanation: knowledgeCheck.explanation
    }))
  };
}

export function todayDateInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function isLikelyNetworkFailure(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("networkerror") ||
    message.includes("load failed")
  );
}
