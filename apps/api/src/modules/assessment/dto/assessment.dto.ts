import { Field, Float, ID, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";

import { DateTimeValue } from "../../../common/graphql/date-time.scalar.js";
import { GraphqlJsonValue, type JsonValue } from "../../../common/graphql/json.scalar.js";
import { DailyTaskDto } from "../../planning/dto/planning.dto.js";

export enum AssessmentAttemptStatusDto {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  NEEDS_MANUAL_GRADING = "NEEDS_MANUAL_GRADING",
  GRADED = "GRADED",
  PASSED = "PASSED",
  FAILED = "FAILED"
}

export enum QuestionTypeDto {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  MULTIPLE_SELECT = "MULTIPLE_SELECT",
  TRUE_FALSE = "TRUE_FALSE",
  SHORT_ANSWER = "SHORT_ANSWER",
  CODE_CHALLENGE = "CODE_CHALLENGE",
  DEBUGGING_CHALLENGE = "DEBUGGING_CHALLENGE",
  SCENARIO = "SCENARIO",
  CASE_STUDY = "CASE_STUDY",
  PRACTICAL_ASSIGNMENT = "PRACTICAL_ASSIGNMENT",
  REFLECTION = "REFLECTION"
}

registerEnumType(AssessmentAttemptStatusDto, {
  name: "AssessmentAttemptStatus"
});

registerEnumType(QuestionTypeDto, {
  name: "QuestionType"
});

@InputType("AssessmentAnswerInput")
export class AssessmentAnswerInputDto {
  @Field(() => ID)
  public questionId!: string;

  @Field(() => GraphqlJsonValue)
  public response!: JsonValue;
}

@InputType("SubmitAssessmentInput")
export class SubmitAssessmentInputDto {
  @Field(() => ID)
  public attemptId!: string;

  @Field(() => [AssessmentAnswerInputDto])
  public answers!: readonly AssessmentAnswerInputDto[];
}

@ObjectType("AssessmentQuestion")
export class AssessmentQuestionDto {
  @Field(() => ID)
  public id!: string;

  @Field(() => QuestionTypeDto)
  public type!: QuestionTypeDto;

  @Field()
  public promptMarkdown!: string;

  @Field(() => GraphqlJsonValue, { nullable: true })
  public options!: JsonValue | null;

  @Field(() => Int)
  public points!: number;

  @Field(() => [String])
  public assessmentTags!: readonly string[];
}

@ObjectType("AssessmentAnswerFeedback")
export class AssessmentAnswerFeedbackDto {
  @Field(() => ID)
  public questionId!: string;

  @Field()
  public promptMarkdown!: string;

  @Field(() => GraphqlJsonValue)
  public response!: JsonValue;

  @Field(() => Float, { nullable: true })
  public score!: number | null;

  @Field(() => Int)
  public points!: number;

  @Field(() => String, { nullable: true })
  public feedback!: string | null;

  @Field()
  public pendingManualReview!: boolean;
}

@ObjectType("AssessmentAttemptResult")
export class AssessmentAttemptResultDto {
  @Field(() => Float, { nullable: true })
  public scoreEarned!: number | null;

  @Field(() => Float, { nullable: true })
  public scorePossible!: number | null;

  @Field(() => Float, { nullable: true })
  public percentage!: number | null;

  @Field(() => Boolean, { nullable: true })
  public passed!: boolean | null;

  @Field(() => [String])
  public weakTopics!: readonly string[];

  @Field(() => [DailyTaskDto])
  public revisionRecommendations!: readonly DailyTaskDto[];

  @Field(() => [AssessmentAnswerFeedbackDto])
  public answerFeedback!: readonly AssessmentAnswerFeedbackDto[];
}

@ObjectType("AssessmentAttempt")
export class AssessmentAttemptDto {
  @Field(() => ID)
  public id!: string;

  @Field(() => ID)
  public studyWeekId!: string;

  @Field(() => Int)
  public studyWeekNumber!: number;

  @Field(() => Int)
  public attemptNumber!: number;

  @Field(() => AssessmentAttemptStatusDto)
  public status!: AssessmentAttemptStatusDto;

  @Field(() => DateTimeValue)
  public startedAt!: Date;

  @Field(() => DateTimeValue, { nullable: true })
  public submittedAt!: Date | null;

  @Field(() => DateTimeValue, { nullable: true })
  public gradedAt!: Date | null;

  @Field(() => [AssessmentQuestionDto])
  public questions!: readonly AssessmentQuestionDto[];

  @Field(() => AssessmentAttemptResultDto, { nullable: true })
  public result!: AssessmentAttemptResultDto | null;
}

@ObjectType("AssessmentResult")
export class AssessmentResultDto extends AssessmentAttemptResultDto {
  @Field(() => ID)
  public attemptId!: string;

  @Field(() => AssessmentAttemptStatusDto)
  public status!: AssessmentAttemptStatusDto;
}
