import { Inject, Injectable, type OnModuleInit } from "@nestjs/common";

import type { AuthenticatedUser } from "../auth/domain/auth.types.js";
import {
  validateAssessmentId,
  validateSubmitAssessmentInput
} from "./domain/assessment.validation.js";
import type {
  AssessmentAttemptRecord,
  AssessmentResultRecord
} from "./domain/assessment.types.js";
import {
  ASSESSMENT_REPOSITORY,
  type AssessmentRepository
} from "./persistence/assessment.repository.js";

@Injectable()
export class AssessmentService implements OnModuleInit {
  public constructor(
    @Inject(ASSESSMENT_REPOSITORY) private readonly repository: AssessmentRepository
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.repository.seedReviewedQuestions();
  }

  public weeklyAssessment(
    user: AuthenticatedUser,
    studyWeekId: string
  ): Promise<AssessmentAttemptRecord> {
    return this.repository.weeklyAssessment(user.id, validateAssessmentId(studyWeekId));
  }

  public startWeeklyAssessment(
    user: AuthenticatedUser,
    studyWeekId: string
  ): Promise<AssessmentAttemptRecord> {
    return this.repository.startWeeklyAssessment(user.id, validateAssessmentId(studyWeekId));
  }

  public submitAssessment(
    user: AuthenticatedUser,
    input: unknown
  ): Promise<AssessmentAttemptRecord> {
    return this.repository.submitAssessment(user.id, validateSubmitAssessmentInput(input));
  }

  public assessmentResult(
    user: AuthenticatedUser,
    attemptId: string
  ): Promise<AssessmentResultRecord> {
    return this.repository.assessmentResult(user.id, validateAssessmentId(attemptId));
  }
}
