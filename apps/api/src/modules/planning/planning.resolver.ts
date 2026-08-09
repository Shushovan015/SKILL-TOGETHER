import { Args, Context, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

import { DateValue } from "../../common/graphql/date.scalar.js";
import type { GraphqlContext } from "../../common/graphql/graphql-context.js";
import { AuthSessionGuard } from "../auth/auth-session.guard.js";
import { CsrfGuard } from "../auth/csrf.guard.js";
import { PlanningService } from "./planning.service.js";
import {
  toDailyTaskDto,
  toPlanningEnrollmentDto,
  toRecoveryProposalDto,
  toTodayDashboardDto
} from "./planning.mapper.js";
import {
  DailyTaskDto,
  CompleteDailyTaskInputDto,
  EnrollmentDto,
  OnboardingInputDto,
  PauseEnrollmentInputDto,
  RecoveryProposalDto,
  ReconfigureEnrollmentInputDto,
  RescheduleTaskInputDto,
  TodayDashboardDto
} from "./dto/planning.dto.js";

@Resolver()
export class PlanningResolver {
  public constructor(private readonly planningService: PlanningService) {}

  @Mutation(() => EnrollmentDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async completeOnboarding(
    @Args("input", { type: () => OnboardingInputDto }) input: OnboardingInputDto,
    @Context() context: GraphqlContext
  ): Promise<EnrollmentDto> {
    return toPlanningEnrollmentDto(
      await this.planningService.completeOnboarding(requireCurrentUser(context), input)
    );
  }

  @Mutation(() => EnrollmentDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async cancelEnrollment(
    @Args("enrollmentId", { type: () => ID }) enrollmentId: string,
    @Context() context: GraphqlContext
  ): Promise<EnrollmentDto> {
    return toPlanningEnrollmentDto(
      await this.planningService.cancelEnrollment(requireCurrentUser(context), enrollmentId)
    );
  }

  @Mutation(() => EnrollmentDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async reconfigureEnrollment(
    @Args("input", { type: () => ReconfigureEnrollmentInputDto }) input: ReconfigureEnrollmentInputDto,
    @Context() context: GraphqlContext
  ): Promise<EnrollmentDto> {
    return toPlanningEnrollmentDto(
      await this.planningService.reconfigureEnrollment(requireCurrentUser(context), input)
    );
  }

  @Query(() => TodayDashboardDto)
  @UseGuards(AuthSessionGuard)
  public async todayDashboard(
    @Args("date", { type: () => DateValue, nullable: true }) date: Date | undefined,
    @Context() context: GraphqlContext
  ): Promise<TodayDashboardDto> {
    return toTodayDashboardDto(
      await this.planningService.todayDashboard(requireCurrentUser(context), date)
    );
  }

  @Query(() => [DailyTaskDto])
  @UseGuards(AuthSessionGuard)
  public async weeklyPlan(
    @Args("weekNumber", { type: () => Int }) weekNumber: number,
    @Context() context: GraphqlContext
  ): Promise<readonly DailyTaskDto[]> {
    return (await this.planningService.weeklyPlan(requireCurrentUser(context), weekNumber)).map(
      toDailyTaskDto
    );
  }

  @Query(() => DailyTaskDto)
  @UseGuards(AuthSessionGuard)
  public async dailyTask(
    @Args("id", { type: () => ID }) id: string,
    @Context() context: GraphqlContext
  ): Promise<DailyTaskDto> {
    return toDailyTaskDto(await this.planningService.dailyTask(requireCurrentUser(context), id));
  }

  @Mutation(() => DailyTaskDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async startDailyTask(
    @Args("id", { type: () => ID }) id: string,
    @Context() context: GraphqlContext
  ): Promise<DailyTaskDto> {
    return toDailyTaskDto(await this.planningService.startDailyTask(requireCurrentUser(context), id));
  }

  @Mutation(() => DailyTaskDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async completeDailyTask(
    @Args("input", { type: () => CompleteDailyTaskInputDto }) input: CompleteDailyTaskInputDto,
    @Context() context: GraphqlContext
  ): Promise<DailyTaskDto> {
    return toDailyTaskDto(
      await this.planningService.completeDailyTask(requireCurrentUser(context), input)
    );
  }

  @Mutation(() => RecoveryProposalDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async proposeRecovery(
    @Args("dailyTaskId", { type: () => ID }) dailyTaskId: string,
    @Context() context: GraphqlContext
  ): Promise<RecoveryProposalDto> {
    return toRecoveryProposalDto(
      await this.planningService.proposeRecovery(requireCurrentUser(context), dailyTaskId)
    );
  }

  @Mutation(() => [DailyTaskDto])
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async applyRecovery(
    @Args("input", { type: () => RescheduleTaskInputDto }) input: RescheduleTaskInputDto,
    @Context() context: GraphqlContext
  ): Promise<readonly DailyTaskDto[]> {
    return (await this.planningService.applyRecovery(requireCurrentUser(context), input)).map(
      toDailyTaskDto
    );
  }

  @Mutation(() => EnrollmentDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async pauseEnrollment(
    @Args("input", { type: () => PauseEnrollmentInputDto }) input: PauseEnrollmentInputDto,
    @Context() context: GraphqlContext
  ): Promise<EnrollmentDto> {
    return toPlanningEnrollmentDto(
      await this.planningService.pauseEnrollment(requireCurrentUser(context), input)
    );
  }

  @Mutation(() => EnrollmentDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async resumeEnrollment(
    @Args("enrollmentId", { type: () => ID }) enrollmentId: string,
    @Context() context: GraphqlContext
  ): Promise<EnrollmentDto> {
    return toPlanningEnrollmentDto(
      await this.planningService.resumeEnrollment(requireCurrentUser(context), enrollmentId)
    );
  }
}

function requireCurrentUser(context: GraphqlContext) {
  if (context.currentUser === undefined) {
    throw new Error("AuthSessionGuard did not populate current user");
  }

  return context.currentUser;
}
