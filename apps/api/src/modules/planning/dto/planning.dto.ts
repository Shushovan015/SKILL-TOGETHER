import { Field, ID, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";

import { DateValue } from "../../../common/graphql/date.scalar.js";
import { GraphqlJsonValue, type JsonValue } from "../../../common/graphql/json.scalar.js";
import { TimeValue } from "../../../common/graphql/time.scalar.js";
import { ExerciseDto, KnowledgeCheckDto, ResourceDto } from "../../content/dto/content.dto.js";
import { EnrollmentDto } from "../../content/dto/content.dto.js";

export enum DailyTaskStatusDto {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  MISSED = "MISSED",
  RESCHEDULED = "RESCHEDULED",
  SKIPPED = "SKIPPED",
  CANCELLED = "CANCELLED"
}

registerEnumType(DailyTaskStatusDto, {
  name: "DailyTaskStatus"
});

@InputType("PausePeriodInput")
export class PausePeriodInputDto {
  @Field(() => DateValue)
  public startsOn!: Date;

  @Field(() => DateValue)
  public endsOn!: Date;

  @Field(() => String, { nullable: true })
  public reason!: string | null;
}

@InputType("OnboardingInput")
export class OnboardingInputDto {
  @Field(() => ID)
  public trackId!: string;

  @Field(() => DateValue)
  public startDate!: Date;

  @Field(() => [Int])
  public studyDays!: readonly number[];

  @Field(() => GraphqlJsonValue)
  public availableMinutesByDay!: JsonValue;

  @Field(() => TimeValue, { nullable: true })
  public preferredSessionTime!: string | null;

  @Field()
  public experienceLevel!: string;

  @Field()
  public targetOutcome!: string;

  @Field(() => String, { nullable: true })
  public germanStartLevel!: string | null;

  @Field(() => String, { nullable: true })
  public germanTargetLevel!: string | null;

  @Field(() => Int, { nullable: true })
  public germanSessionDurationMinutes!: number | null;

  @Field(() => Int)
  public assessmentDay!: number;

  @Field(() => Int)
  public recoveryDay!: number;

  @Field(() => [PausePeriodInputDto], { defaultValue: [] })
  public pausePeriods!: readonly PausePeriodInputDto[];
}

@InputType("ReconfigureEnrollmentInput")
export class ReconfigureEnrollmentInputDto extends OnboardingInputDto {
  @Field(() => ID)
  public enrollmentId!: string;
}

@InputType("RescheduleTaskInput")
export class RescheduleTaskInputDto {
  @Field(() => ID)
  public dailyTaskId!: string;

  @Field()
  public strategy!: string;

  @Field(() => DateValue, { nullable: true })
  public targetDate!: Date | null;
}

@InputType("CompleteDailyTaskInput")
export class CompleteDailyTaskInputDto {
  @Field(() => ID)
  public dailyTaskId!: string;

  @Field(() => Int)
  public durationMinutes!: number;

  @Field(() => GraphqlJsonValue)
  public completionEvidence!: JsonValue;

  @Field(() => String, { nullable: true })
  public reflection!: string | null;
}

@InputType("PauseEnrollmentInput")
export class PauseEnrollmentInputDto {
  @Field(() => ID)
  public enrollmentId!: string;

  @Field(() => DateValue)
  public startsOn!: Date;

  @Field(() => DateValue)
  public endsOn!: Date;

  @Field(() => String, { nullable: true })
  public reason!: string | null;
}

@ObjectType("ScheduledLesson")
export class ScheduledLessonDto {
  @Field(() => ID)
  public lessonVersionId!: string;

  @Field()
  public title!: string;

  @Field()
  public moduleTitle!: string;

  @Field()
  public trackTitle!: string;

  @Field()
  public difficulty!: string;

  @Field()
  public learningObjective!: string;

  @Field(() => [String])
  public outcomes!: readonly string[];

  @Field()
  public explanationMarkdown!: string;

  @Field()
  public businessRelevanceMarkdown!: string;

  @Field(() => [String])
  public examples!: readonly string[];

  @Field(() => ExerciseDto)
  public guidedExercise!: ExerciseDto;

  @Field(() => ExerciseDto)
  public independentExercise!: ExerciseDto;

  @Field(() => [KnowledgeCheckDto])
  public knowledgeChecks!: readonly KnowledgeCheckDto[];

  @Field(() => [String])
  public commonMistakes!: readonly string[];

  @Field(() => [ResourceDto])
  public resources!: readonly ResourceDto[];
}

@ObjectType("DailyTask")
export class DailyTaskDto {
  @Field(() => ID)
  public id!: string;

  @Field(() => ID)
  public studyWeekId!: string;

  @Field(() => DateValue)
  public scheduledOn!: Date;

  @Field(() => DailyTaskStatusDto)
  public status!: DailyTaskStatusDto;

  @Field(() => Int)
  public plannedDurationMinutes!: number;

  @Field()
  public required!: boolean;

  @Field(() => ScheduledLessonDto)
  public lesson!: ScheduledLessonDto;

  @Field(() => String, { nullable: true })
  public rescheduleReason!: string | null;

  @Field(() => Int)
  public studyWeekNumber!: number;
}

@ObjectType("ProgressSummary")
export class ProgressSummaryDto {
  @Field(() => Int)
  public plannedCount!: number;

  @Field(() => Int)
  public completedCount!: number;

  @Field()
  public weeklyCompletionPercentage!: number;
}

@ObjectType("AssessmentAttemptSummary")
export class AssessmentAttemptSummaryDto {
  @Field(() => ID)
  public id!: string;
}

@ObjectType("PartnerProgressSummary")
export class PartnerProgressSummaryDto {
  @Field(() => ID)
  public userId!: string;

  @Field()
  public displayName!: string;

  @Field(() => Int)
  public plannedSessionCount!: number;

  @Field(() => Int)
  public completedSessionCount!: number;

  @Field()
  public weeklyCompletionPercentage!: number;

  @Field(() => Int)
  public currentStreak!: number;

  @Field()
  public assessmentCompleted!: boolean;

  @Field()
  public overallTrackProgressPercentage!: number;

  @Field(() => String, { nullable: true })
  public encouragementStatus!: string | null;
}

@ObjectType("TodayDashboard")
export class TodayDashboardDto {
  @Field(() => DateValue)
  public date!: Date;

  @Field(() => [DailyTaskDto])
  public tasks!: readonly DailyTaskDto[];

  @Field(() => DailyTaskDto, { nullable: true })
  public mainTask!: DailyTaskDto | null;

  @Field(() => DailyTaskDto, { nullable: true })
  public germanTask!: DailyTaskDto | null;

  @Field(() => Int)
  public estimatedStudyMinutes!: number;

  @Field(() => ProgressSummaryDto)
  public weeklyProgress!: ProgressSummaryDto;

  @Field(() => [DailyTaskDto])
  public missedTasks!: readonly DailyTaskDto[];

  @Field(() => AssessmentAttemptSummaryDto, { nullable: true })
  public nextAssessment!: AssessmentAttemptSummaryDto | null;

  @Field(() => [PartnerProgressSummaryDto])
  public partnerProgress!: readonly PartnerProgressSummaryDto[];
}

@ObjectType("RecoveryProposal")
export class RecoveryProposalDto {
  @Field(() => ID)
  public dailyTaskId!: string;

  @Field()
  public strategy!: string;

  @Field(() => DateValue, { nullable: true })
  public targetDate!: Date | null;

  @Field()
  public reason!: string;

  @Field(() => [ID])
  public impactedTaskIds!: readonly string[];

  @Field(() => Int)
  public capacityMinutes!: number;

  @Field(() => Int)
  public plannedMinutes!: number;
}

export { EnrollmentDto };
