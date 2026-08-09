import { UseGuards } from "@nestjs/common";
import { Args, Context, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import type { GraphqlContext } from "../../common/graphql/graphql-context.js";
import { AuthSessionGuard } from "../auth/auth-session.guard.js";
import { CsrfGuard } from "../auth/csrf.guard.js";
import {
  toAssessmentAttemptDto,
  toAssessmentResultDto
} from "./assessment.mapper.js";
import { AssessmentService } from "./assessment.service.js";
import {
  AssessmentAttemptDto,
  AssessmentResultDto,
  SubmitAssessmentInputDto
} from "./dto/assessment.dto.js";

@Resolver()
export class AssessmentResolver {
  public constructor(private readonly assessmentService: AssessmentService) {}

  @Query(() => AssessmentAttemptDto)
  @UseGuards(AuthSessionGuard)
  public async weeklyAssessment(
    @Args("studyWeekId", { type: () => ID }) studyWeekId: string,
    @Context() context: GraphqlContext
  ): Promise<AssessmentAttemptDto> {
    return toAssessmentAttemptDto(
      await this.assessmentService.weeklyAssessment(requireCurrentUser(context), studyWeekId)
    );
  }

  @Mutation(() => AssessmentAttemptDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async startWeeklyAssessment(
    @Args("studyWeekId", { type: () => ID }) studyWeekId: string,
    @Context() context: GraphqlContext
  ): Promise<AssessmentAttemptDto> {
    return toAssessmentAttemptDto(
      await this.assessmentService.startWeeklyAssessment(requireCurrentUser(context), studyWeekId)
    );
  }

  @Mutation(() => AssessmentAttemptDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async submitAssessment(
    @Args("input", { type: () => SubmitAssessmentInputDto }) input: SubmitAssessmentInputDto,
    @Context() context: GraphqlContext
  ): Promise<AssessmentAttemptDto> {
    return toAssessmentAttemptDto(
      await this.assessmentService.submitAssessment(requireCurrentUser(context), input)
    );
  }

  @Query(() => AssessmentResultDto)
  @UseGuards(AuthSessionGuard)
  public async assessmentResult(
    @Args("attemptId", { type: () => ID }) attemptId: string,
    @Context() context: GraphqlContext
  ): Promise<AssessmentResultDto> {
    return toAssessmentResultDto(
      await this.assessmentService.assessmentResult(requireCurrentUser(context), attemptId)
    );
  }
}

function requireCurrentUser(context: GraphqlContext) {
  if (context.currentUser === undefined) {
    throw new Error("AuthSessionGuard did not populate current user");
  }

  return context.currentUser;
}
