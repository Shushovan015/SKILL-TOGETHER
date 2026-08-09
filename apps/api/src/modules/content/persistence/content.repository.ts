import type {
  AdminLessonVersionRecord,
  ContentStatus,
  EnrollmentRecord,
  LessonVersionEditorInput,
  LearningTrackRecord,
  SelectLearningTrackInput
} from "../domain/content.types.js";

export const CONTENT_REPOSITORY = Symbol("CONTENT_REPOSITORY");

export interface CreateLessonVersionRepositoryInput extends LessonVersionEditorInput {
  readonly lessonId: string;
  readonly authorId: string;
}

export interface UpdateLessonVersionRepositoryInput extends LessonVersionEditorInput {
  readonly id: string;
}

export interface SeedContentInput {
  readonly authorId: string;
  readonly reviewerId: string;
}

export interface ContentRepository {
  listLearningTracks(activeOnly: boolean): Promise<readonly LearningTrackRecord[]>;
  findLearningTrackBySlug(slug: string): Promise<LearningTrackRecord | null>;
  findLearningTrackById(id: string): Promise<LearningTrackRecord | null>;
  listEnrollmentsForUser(userId: string): Promise<readonly EnrollmentRecord[]>;
  findEnrollmentForUser(enrollmentId: string, userId: string): Promise<EnrollmentRecord | null>;
  selectLearningTrack(
    userId: string,
    input: SelectLearningTrackInput
  ): Promise<EnrollmentRecord>;
  listAdminLessonVersions(
    status: ContentStatus | undefined
  ): Promise<readonly AdminLessonVersionRecord[]>;
  findAdminLessonVersion(id: string): Promise<AdminLessonVersionRecord | null>;
  createLessonVersion(input: CreateLessonVersionRepositoryInput): Promise<AdminLessonVersionRecord>;
  updateLessonVersion(input: UpdateLessonVersionRepositoryInput): Promise<AdminLessonVersionRecord>;
  submitLessonVersionForReview(
    id: string,
    actorUserId: string
  ): Promise<AdminLessonVersionRecord>;
  approveLessonVersion(id: string, actorUserId: string): Promise<AdminLessonVersionRecord>;
  archiveLessonVersion(id: string, actorUserId: string): Promise<AdminLessonVersionRecord>;
  seedContent(input: SeedContentInput): Promise<void>;
}
