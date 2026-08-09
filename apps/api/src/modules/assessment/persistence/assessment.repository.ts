import type {
  AssessmentAttemptRecord,
  AssessmentResultRecord,
  SubmitAssessmentInput
} from "../domain/assessment.types.js";

export const ASSESSMENT_REPOSITORY = Symbol("ASSESSMENT_REPOSITORY");

export interface AssessmentRepository {
  seedReviewedQuestions(): Promise<void>;
  weeklyAssessment(userId: string, studyWeekId: string): Promise<AssessmentAttemptRecord>;
  startWeeklyAssessment(userId: string, studyWeekId: string): Promise<AssessmentAttemptRecord>;
  submitAssessment(userId: string, input: SubmitAssessmentInput): Promise<AssessmentAttemptRecord>;
  assessmentResult(userId: string, attemptId: string): Promise<AssessmentResultRecord>;
}
