import { z } from "zod";

export const enrollmentFormSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, "Choose a start date."),
  experienceLevel: z.string().trim().min(1, "Experience level is required."),
  targetOutcome: z.string().trim().min(1, "Target outcome is required.")
});

export type EnrollmentFormValues = z.infer<typeof enrollmentFormSchema>;

export const lessonEditorFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  learningObjective: z.string().trim().min(1, "Objective is required."),
  outcomes: z.string().trim().min(1, "Add at least one outcome."),
  explanationMarkdown: z.string().trim().min(1, "Explanation is required."),
  relevanceMarkdown: z.string().trim().min(1, "Relevance is required."),
  examples: z.string().trim().min(1, "Add at least one example."),
  commonMistakes: z.string().trim().min(1, "Add at least one common mistake."),
  assessmentTags: z.string().trim().min(1, "Add at least one assessment tag."),
  resourceTitle: z.string().trim().min(1, "Resource title is required."),
  resourceUrl: z.string().trim().url("Enter a valid resource URL."),
  resourceType: z.string().trim().min(1, "Resource type is required."),
  resourceRequired: z.boolean(),
  resourceApproved: z.boolean(),
  resourceCitation: z.string().trim().min(1, "Citation is required."),
  exerciseKind: z.string().trim().min(1, "Exercise kind is required."),
  exercisePromptMarkdown: z.string().trim().min(1, "Exercise prompt is required."),
  exerciseExpectedEvidence: z.string().trim().min(1, "Expected evidence is required."),
  exerciseSolutionNotesMarkdown: z.string(),
  knowledgeCheckQuestion: z.string().trim().min(1, "Question is required."),
  knowledgeCheckAnswerKey: z.string().trim().min(1, "Answer key is required."),
  knowledgeCheckExplanation: z.string().trim().min(1, "Explanation is required.")
});

export type LessonEditorFormValues = z.infer<typeof lessonEditorFormSchema>;
