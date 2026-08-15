import { Field, Float, ID, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";

import { DateTimeValue } from "../../../common/graphql/date-time.scalar.js";
import { DateValue } from "../../../common/graphql/date.scalar.js";

export enum TrackTypeDto {
  SOFTWARE_ENGINEERING = "SOFTWARE_ENGINEERING",
  PROJECT_MANAGEMENT = "PROJECT_MANAGEMENT",
  GERMAN = "GERMAN"
}

export enum EnrollmentStatusDto {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum ContentStatusDto {
  DRAFT = "DRAFT",
  REVIEWED = "REVIEWED",
  APPROVED = "APPROVED",
  ARCHIVED = "ARCHIVED"
}

registerEnumType(TrackTypeDto, {
  name: "TrackType"
});

registerEnumType(EnrollmentStatusDto, {
  name: "EnrollmentStatus"
});

registerEnumType(ContentStatusDto, {
  name: "ContentStatus"
});

@ObjectType("Resource")
export class ResourceDto {
  @Field(() => ID)
  public id!: string;

  @Field()
  public title!: string;

  @Field()
  public provider!: string;

  @Field()
  public url!: string;

  @Field()
  public resourceType!: string;

  @Field()
  public difficulty!: string;

  @Field(() => Int)
  public estimatedMinutes!: number;

  @Field()
  public description!: string;

  @Field()
  public verificationStatus!: string;

  @Field()
  public required!: boolean;

  @Field()
  public approved!: boolean;

  @Field()
  public citation!: string;
}

@ObjectType("Exercise")
export class ExerciseDto {
  @Field(() => ID)
  public id!: string;

  @Field()
  public kind!: string;

  @Field()
  public promptMarkdown!: string;

  @Field()
  public expectedEvidence!: string;

  @Field(() => String, { nullable: true })
  public solutionNotesMarkdown!: string | null;
}

@ObjectType("KnowledgeCheck")
export class KnowledgeCheckDto {
  @Field(() => ID)
  public id!: string;

  @Field()
  public question!: string;

  @Field(() => [String])
  public answerKey!: readonly string[];

  @Field()
  public explanation!: string;
}

@ObjectType("LessonVersion")
export class LessonVersionDto {
  @Field(() => ID)
  public id!: string;

  @Field(() => ID)
  public lessonId!: string;

  @Field(() => Int)
  public version!: number;

  @Field(() => ContentStatusDto)
  public status!: ContentStatusDto;

  @Field()
  public title!: string;

  @Field()
  public learningObjective!: string;

  @Field(() => [String])
  public outcomes!: readonly string[];

  @Field()
  public explanationMarkdown!: string;

  @Field()
  public relevanceMarkdown!: string;

  @Field(() => [String])
  public examples!: readonly string[];

  @Field(() => [String])
  public commonMistakes!: readonly string[];

  @Field(() => [String])
  public assessmentTags!: readonly string[];

  @Field(() => ID)
  public authorId!: string;

  @Field(() => ID, { nullable: true })
  public reviewerId!: string | null;

  @Field(() => DateTimeValue, { nullable: true })
  public approvedAt!: Date | null;

  @Field(() => DateTimeValue, { nullable: true })
  public archivedAt!: Date | null;

  @Field(() => [ResourceDto])
  public resources!: readonly ResourceDto[];

  @Field(() => [ExerciseDto])
  public exercises!: readonly ExerciseDto[];

  @Field(() => [KnowledgeCheckDto])
  public knowledgeChecks!: readonly KnowledgeCheckDto[];
}

@ObjectType("AdminLessonVersion")
export class AdminLessonVersionDto extends LessonVersionDto {
  @Field()
  public lessonSlug!: string;

  @Field()
  public moduleTitle!: string;

  @Field()
  public trackTitle!: string;

  @Field()
  public trackSlug!: string;
}

@ObjectType("LessonSummary")
export class LessonSummaryDto {
  @Field(() => ID)
  public id!: string;

  @Field()
  public slug!: string;

  @Field(() => Int)
  public sequence!: number;

  @Field()
  public title!: string;

  @Field()
  public difficulty!: string;

  @Field(() => Int)
  public estimatedDurationMinutes!: number;

  @Field()
  public required!: boolean;

  @Field(() => [ID])
  public prerequisites!: readonly string[];
}

@ObjectType("LearningModule")
export class LearningModuleDto {
  @Field(() => ID)
  public id!: string;

  @Field(() => Int)
  public sequence!: number;

  @Field()
  public title!: string;

  @Field()
  public summary!: string;

  @Field(() => [LessonSummaryDto])
  public lessons!: readonly LessonSummaryDto[];
}

@ObjectType("LearningTrack")
export class LearningTrackDto {
  @Field(() => ID)
  public id!: string;

  @Field()
  public slug!: string;

  @Field(() => TrackTypeDto)
  public type!: TrackTypeDto;

  @Field()
  public title!: string;

  @Field()
  public description!: string;

  @Field()
  public active!: boolean;

  @Field(() => [LearningModuleDto])
  public modules!: readonly LearningModuleDto[];
}

@ObjectType("Enrollment")
export class EnrollmentDto {
  @Field(() => ID)
  public id!: string;

  @Field(() => ID)
  public userId!: string;

  @Field(() => EnrollmentStatusDto)
  public status!: EnrollmentStatusDto;

  @Field(() => LearningTrackDto)
  public track!: LearningTrackDto;

  @Field(() => DateValue)
  public startDate!: Date;

  @Field()
  public targetOutcome!: string;

  @Field()
  public experienceLevel!: string;

  @Field(() => String, { nullable: true })
  public germanStartLevel!: string | null;

  @Field(() => String, { nullable: true })
  public germanTargetLevel!: string | null;

  @Field(() => Int, { nullable: true })
  public germanSessionDurationMinutes!: number | null;

  @Field(() => Int)
  public totalTaskCount!: number;

  @Field(() => Int)
  public completedTaskCount!: number;

  @Field(() => Float)
  public overallProgressPercentage!: number;

  @Field(() => ID, { nullable: true })
  public currentDailyTaskId!: string | null;

  @Field(() => ID, { nullable: true })
  public currentLessonId!: string | null;

  @Field(() => String, { nullable: true })
  public currentModuleTitle!: string | null;

  @Field(() => String, { nullable: true })
  public currentLessonTitle!: string | null;

  @Field(() => [ID])
  public completedLessonIds!: readonly string[];
}

@InputType("ResourceInput")
export class ResourceInputDto {
  @Field()
  public title!: string;

  @Field()
  public provider!: string;

  @Field()
  public url!: string;

  @Field()
  public resourceType!: string;

  @Field()
  public difficulty!: string;

  @Field(() => Int)
  public estimatedMinutes!: number;

  @Field()
  public description!: string;

  @Field()
  public verificationStatus!: string;

  @Field()
  public required!: boolean;

  @Field()
  public approved!: boolean;

  @Field()
  public citation!: string;
}

@InputType("ExerciseInput")
export class ExerciseInputDto {
  @Field()
  public kind!: string;

  @Field()
  public promptMarkdown!: string;

  @Field()
  public expectedEvidence!: string;

  @Field(() => String, { nullable: true })
  public solutionNotesMarkdown!: string | null;
}

@InputType("KnowledgeCheckInput")
export class KnowledgeCheckInputDto {
  @Field()
  public question!: string;

  @Field(() => [String])
  public answerKey!: readonly string[];

  @Field()
  public explanation!: string;
}

@InputType("LessonVersionEditorInput")
export class LessonVersionEditorInputDto {
  @Field()
  public title!: string;

  @Field()
  public learningObjective!: string;

  @Field(() => [String])
  public outcomes!: readonly string[];

  @Field()
  public explanationMarkdown!: string;

  @Field()
  public relevanceMarkdown!: string;

  @Field(() => [String])
  public examples!: readonly string[];

  @Field(() => [String])
  public commonMistakes!: readonly string[];

  @Field(() => [String])
  public assessmentTags!: readonly string[];

  @Field(() => [ResourceInputDto])
  public resources!: readonly ResourceInputDto[];

  @Field(() => [ExerciseInputDto])
  public exercises!: readonly ExerciseInputDto[];

  @Field(() => [KnowledgeCheckInputDto])
  public knowledgeChecks!: readonly KnowledgeCheckInputDto[];
}

@InputType("SelectLearningTrackInput")
export class SelectLearningTrackInputDto {
  @Field(() => ID)
  public trackId!: string;

  @Field(() => DateValue)
  public startDate!: Date;

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
}
