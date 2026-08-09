import type {
  AdminLessonVersionRecord,
  ContentStatus,
  EnrollmentRecord,
  EnrollmentStatus,
  LearningTrackRecord,
  TrackType
} from "./domain/content.types.js";
import {
  AdminLessonVersionDto,
  ContentStatusDto,
  EnrollmentDto,
  EnrollmentStatusDto,
  LearningTrackDto,
  TrackTypeDto
} from "./dto/content.dto.js";

export function toLearningTrackDto(track: LearningTrackRecord): LearningTrackDto {
  return {
    id: track.id,
    slug: track.slug,
    type: toTrackTypeDto(track.type),
    title: track.title,
    description: track.description,
    active: track.active,
    modules: track.modules.map((moduleRecord) => ({
      id: moduleRecord.id,
      sequence: moduleRecord.sequence,
      title: moduleRecord.title,
      summary: moduleRecord.summary,
      lessons: moduleRecord.lessons.map((lesson) => ({
        id: lesson.id,
        slug: lesson.slug,
        sequence: lesson.sequence,
        title: lesson.title,
        difficulty: lesson.difficulty,
        estimatedDurationMinutes: lesson.estimatedDurationMinutes,
        required: lesson.required,
        prerequisites: [...lesson.prerequisites]
      }))
    }))
  };
}

export function toEnrollmentDto(enrollment: EnrollmentRecord): EnrollmentDto {
  return {
    id: enrollment.id,
    userId: enrollment.userId,
    status: toEnrollmentStatusDto(enrollment.status),
    track: toLearningTrackDto(enrollment.track),
    startDate: enrollment.startDate,
    targetOutcome: enrollment.targetOutcome,
    experienceLevel: enrollment.experienceLevel,
    germanStartLevel: enrollment.germanStartLevel,
    germanTargetLevel: enrollment.germanTargetLevel,
    germanSessionDurationMinutes: enrollment.germanSessionDurationMinutes
  };
}

export function toAdminLessonVersionDto(
  version: AdminLessonVersionRecord
): AdminLessonVersionDto {
  return {
    id: version.id,
    lessonId: version.lessonId,
    version: version.version,
    status: toContentStatusDto(version.status),
    title: version.title,
    learningObjective: version.learningObjective,
    outcomes: [...version.outcomes],
    explanationMarkdown: version.explanationMarkdown,
    relevanceMarkdown: version.relevanceMarkdown,
    examples: [...version.examples],
    commonMistakes: [...version.commonMistakes],
    assessmentTags: [...version.assessmentTags],
    authorId: version.authorId,
    reviewerId: version.reviewerId,
    approvedAt: version.approvedAt,
    archivedAt: version.archivedAt,
    resources: version.resources.map((resource) => ({ ...resource })),
    exercises: version.exercises.map((exercise) => ({ ...exercise })),
    knowledgeChecks: version.knowledgeChecks.map((knowledgeCheck) => ({ ...knowledgeCheck })),
    lessonSlug: version.lessonSlug,
    moduleTitle: version.moduleTitle,
    trackTitle: version.trackTitle,
    trackSlug: version.trackSlug
  };
}

export function fromContentStatusDto(status: ContentStatusDto): ContentStatus {
  return status;
}

function toTrackTypeDto(type: TrackType): TrackTypeDto {
  return type as TrackTypeDto;
}

function toEnrollmentStatusDto(status: EnrollmentStatus): EnrollmentStatusDto {
  return status as EnrollmentStatusDto;
}

function toContentStatusDto(status: ContentStatus): ContentStatusDto {
  return status as ContentStatusDto;
}
