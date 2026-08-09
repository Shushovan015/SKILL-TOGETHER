import { randomUUID } from "node:crypto";

import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import type {
  AdminLessonVersionRecord,
  ContentStatus,
  EnrollmentRecord,
  LessonVersionEditorInput,
  LearningTrackRecord,
  ModuleRecord,
  SelectLearningTrackInput
} from "../domain/content.types.js";
import {
  buildApprovedSeedVersionInput,
  lessonSlug,
  phase3SeedTracks,
  type SeedLessonDefinition,
  type SeedTrackDefinition
} from "../seed/phase-03-seed-data.js";
import type {
  ContentRepository,
  CreateLessonVersionRepositoryInput,
  SeedContentInput,
  UpdateLessonVersionRepositoryInput
} from "./content.repository.js";

interface StoredTrack {
  readonly id: string;
  readonly slug: string;
  readonly type: LearningTrackRecord["type"];
  readonly title: string;
  readonly description: string;
  readonly active: boolean;
  readonly modules: StoredModule[];
}

interface StoredModule {
  readonly id: string;
  readonly sequence: number;
  readonly title: string;
  readonly summary: string;
  readonly lessons: StoredLesson[];
}

interface StoredLesson {
  readonly id: string;
  readonly identifier: string;
  readonly slug: string;
  readonly sequence: number;
  readonly defaultDurationMinutes: number;
  readonly difficulty: string;
  readonly required: boolean;
  readonly prerequisites: string[];
  readonly versions: StoredLessonVersion[];
}

interface StoredLessonVersion extends LessonVersionEditorInput {
  readonly id: string;
  readonly lessonId: string;
  readonly version: number;
  readonly status: ContentStatus;
  readonly authorId: string;
  readonly reviewerId: string | null;
  readonly approvedAt: Date | null;
  readonly archivedAt: Date | null;
}

interface StoredEnrollment {
  readonly id: string;
  readonly userId: string;
  readonly trackId: string;
  readonly status: EnrollmentRecord["status"];
  readonly startDate: Date;
  readonly targetOutcome: string;
  readonly experienceLevel: string;
}

export class InMemoryContentRepository implements ContentRepository {
  private readonly tracksById = new Map<string, StoredTrack>();
  private readonly trackIdsBySlug = new Map<string, string>();
  private readonly lessonsById = new Map<string, StoredLesson>();
  private readonly lessonIdsByIdentifier = new Map<string, string>();
  private readonly enrollmentsById = new Map<string, StoredEnrollment>();

  public constructor() {
    this.seedTracks({
      authorId: "00000000-0000-4000-8000-000000000001",
      reviewerId: "00000000-0000-4000-8000-000000000001"
    });
  }

  public async listLearningTracks(activeOnly: boolean): Promise<readonly LearningTrackRecord[]> {
    return [...this.tracksById.values()]
      .filter((track) => !activeOnly || track.active)
      .map((track) => this.toLearningTrackRecord(track))
      .filter((track): track is LearningTrackRecord => track !== null)
      .sort((left, right) => left.title.localeCompare(right.title));
  }

  public async findLearningTrackBySlug(slug: string): Promise<LearningTrackRecord | null> {
    const trackId = this.trackIdsBySlug.get(slug);
    const track = trackId === undefined ? undefined : this.tracksById.get(trackId);
    return track === undefined ? null : this.toLearningTrackRecord(track);
  }

  public async findLearningTrackById(id: string): Promise<LearningTrackRecord | null> {
    const track = this.tracksById.get(id);
    return track === undefined ? null : this.toLearningTrackRecord(track);
  }

  public async listEnrollmentsForUser(userId: string): Promise<readonly EnrollmentRecord[]> {
    return [...this.enrollmentsById.values()]
      .filter((enrollment) => enrollment.userId === userId)
      .map((enrollment) => this.toEnrollmentRecord(enrollment))
      .filter((enrollment): enrollment is EnrollmentRecord => enrollment !== null);
  }

  public async findEnrollmentForUser(
    enrollmentId: string,
    userId: string
  ): Promise<EnrollmentRecord | null> {
    const enrollment = this.enrollmentsById.get(enrollmentId);

    if (enrollment === undefined || enrollment.userId !== userId) {
      return null;
    }

    return this.toEnrollmentRecord(enrollment);
  }

  public async selectLearningTrack(
    userId: string,
    input: SelectLearningTrackInput
  ): Promise<EnrollmentRecord> {
    const track = this.tracksById.get(input.trackId);

    if (track === undefined || !track.active) {
      throw notFoundError();
    }

    const activeEnrollment = [...this.enrollmentsById.values()].find(
      (enrollment) =>
        enrollment.userId === userId &&
        enrollment.trackId === input.trackId &&
        enrollment.status === "ACTIVE"
    );

    if (activeEnrollment !== undefined) {
      throw createApiGraphqlError({
        code: "CONFLICT",
        message: apiErrorMessages.CONFLICT,
        retryable: true
      });
    }

    const existingDraft = [...this.enrollmentsById.values()].find(
      (enrollment) =>
        enrollment.userId === userId &&
        enrollment.trackId === input.trackId &&
        enrollment.status === "DRAFT"
    );
    const enrollment: StoredEnrollment = {
      id: existingDraft?.id ?? randomUUID(),
      userId,
      trackId: input.trackId,
      status: "DRAFT",
      startDate: new Date(input.startDate),
      targetOutcome: input.targetOutcome,
      experienceLevel: input.experienceLevel
    };

    this.enrollmentsById.set(enrollment.id, enrollment);

    const record = this.toEnrollmentRecord(enrollment);

    if (record === null) {
      throw notFoundError();
    }

    return record;
  }

  public async listAdminLessonVersions(
    status: ContentStatus | undefined
  ): Promise<readonly AdminLessonVersionRecord[]> {
    return this.allAdminLessonVersions()
      .filter((version) => status === undefined || version.status === status)
      .sort((left, right) => left.trackTitle.localeCompare(right.trackTitle) || left.title.localeCompare(right.title));
  }

  public async findAdminLessonVersion(id: string): Promise<AdminLessonVersionRecord | null> {
    return this.allAdminLessonVersions().find((version) => version.id === id) ?? null;
  }

  public async createLessonVersion(
    input: CreateLessonVersionRepositoryInput
  ): Promise<AdminLessonVersionRecord> {
    const lesson = this.lessonsById.get(input.lessonId);

    if (lesson === undefined) {
      throw notFoundError();
    }

    const nextVersion =
      Math.max(0, ...lesson.versions.map((version) => version.version)) + 1;
    lesson.versions.push({
      ...input,
      id: randomUUID(),
      version: nextVersion,
      status: "DRAFT",
      reviewerId: null,
      approvedAt: null,
      archivedAt: null
    });

    return this.requireAdminLessonVersion(lesson.versions.at(-1)?.id);
  }

  public async updateLessonVersion(
    input: UpdateLessonVersionRepositoryInput
  ): Promise<AdminLessonVersionRecord> {
    const located = this.locateVersion(input.id);

    if (located === null) {
      throw notFoundError();
    }

    if (located.version.status !== "DRAFT") {
      throw invalidStatusError();
    }

    located.lesson.versions[located.index] = {
      ...located.version,
      ...input
    };

    return this.requireAdminLessonVersion(input.id);
  }

  public async submitLessonVersionForReview(
    id: string,
    actorUserId: string
  ): Promise<AdminLessonVersionRecord> {
    return this.transition(id, "DRAFT", "REVIEWED", actorUserId);
  }

  public async approveLessonVersion(
    id: string,
    actorUserId: string
  ): Promise<AdminLessonVersionRecord> {
    return this.transition(id, "REVIEWED", "APPROVED", actorUserId);
  }

  public async archiveLessonVersion(
    id: string,
    actorUserId: string
  ): Promise<AdminLessonVersionRecord> {
    return this.transition(id, "APPROVED", "ARCHIVED", actorUserId);
  }

  public async seedContent(input: SeedContentInput): Promise<void> {
    this.seedTracks(input);
  }

  private seedTracks(input: SeedContentInput): void {
    for (const trackDefinition of phase3SeedTracks) {
      this.upsertTrack(trackDefinition, input);
    }
  }

  private upsertTrack(trackDefinition: SeedTrackDefinition, input: SeedContentInput): void {
    const existingTrackId = this.trackIdsBySlug.get(trackDefinition.slug);
    const track: StoredTrack = {
      id: existingTrackId ?? randomUUID(),
      slug: trackDefinition.slug,
      type: trackDefinition.type,
      title: trackDefinition.title,
      description: trackDefinition.description,
      active: trackDefinition.active,
      modules: []
    };

    this.tracksById.set(track.id, track);
    this.trackIdsBySlug.set(track.slug, track.id);

    for (const moduleDefinition of trackDefinition.modules) {
      const moduleId =
        this.tracksById.get(track.id)?.modules.find(
          (storedModule) => storedModule.sequence === moduleDefinition.sequence
        )?.id ?? randomUUID();
      const storedModule: StoredModule = {
        id: moduleId,
        sequence: moduleDefinition.sequence,
        title: moduleDefinition.title,
        summary: moduleDefinition.summary,
        lessons: []
      };
      track.modules.push(storedModule);

      for (const [index, lessonDefinition] of moduleDefinition.lessons.entries()) {
        storedModule.lessons.push(this.upsertLesson(lessonDefinition, index + 1, input));
      }
    }

    this.applyPrerequisites(trackDefinition);
  }

  private upsertLesson(
    lessonDefinition: SeedLessonDefinition,
    sequence: number,
    input: SeedContentInput
  ): StoredLesson {
    const existingLessonId = this.lessonIdsByIdentifier.get(lessonDefinition.identifier);
    const versionInput = buildApprovedSeedVersionInput(lessonDefinition);
    const lesson: StoredLesson = {
      id: existingLessonId ?? randomUUID(),
      identifier: lessonDefinition.identifier,
      slug: lessonSlug(lessonDefinition.identifier),
      sequence,
      defaultDurationMinutes: lessonDefinition.durationMinutes,
      difficulty: "Beginner",
      required: lessonDefinition.required,
      prerequisites: [],
      versions: [
        {
          ...versionInput,
          id: existingLessonId === undefined ? randomUUID() : this.lessonsById.get(existingLessonId)?.versions[0]?.id ?? randomUUID(),
          lessonId: existingLessonId ?? "",
          version: 1,
          status: "APPROVED",
          authorId: input.authorId,
          reviewerId: input.reviewerId,
          approvedAt: new Date("2026-08-02T00:00:00.000Z"),
          archivedAt: null
        }
      ]
    };
    const storedLesson = {
      ...lesson,
      versions: lesson.versions.map((version) => ({
        ...version,
        lessonId: lesson.id
      }))
    };

    this.lessonsById.set(storedLesson.id, storedLesson);
    this.lessonIdsByIdentifier.set(storedLesson.identifier, storedLesson.id);
    return storedLesson;
  }

  private applyPrerequisites(trackDefinition: SeedTrackDefinition): void {
    for (const moduleDefinition of trackDefinition.modules) {
      for (const lessonDefinition of moduleDefinition.lessons) {
        const lessonId = this.lessonIdsByIdentifier.get(lessonDefinition.identifier);
        const lesson = lessonId === undefined ? undefined : this.lessonsById.get(lessonId);

        if (lesson === undefined) {
          continue;
        }

        lesson.prerequisites.splice(
          0,
          lesson.prerequisites.length,
          ...lessonDefinition.prerequisites
            .map((identifier) => this.lessonIdsByIdentifier.get(identifier))
            .filter((id): id is string => id !== undefined)
        );
      }
    }
  }

  private toLearningTrackRecord(track: StoredTrack): LearningTrackRecord | null {
    const modules = track.modules
      .map((moduleRecord): ModuleRecord | null => {
        const lessons = moduleRecord.lessons
          .map((lesson) => {
            const approvedVersion = this.currentApprovedVersion(lesson);

            if (approvedVersion === undefined) {
              return null;
            }

            return {
              id: lesson.id,
              slug: lesson.slug,
              sequence: lesson.sequence,
              title: approvedVersion.title,
              difficulty: lesson.difficulty,
              estimatedDurationMinutes: lesson.defaultDurationMinutes,
              required: lesson.required,
              prerequisites: [...lesson.prerequisites]
            };
          })
          .filter((lesson): lesson is NonNullable<typeof lesson> => lesson !== null)
          .sort((left, right) => left.sequence - right.sequence);

        if (lessons.length === 0) {
          return null;
        }

        return {
          id: moduleRecord.id,
          sequence: moduleRecord.sequence,
          title: moduleRecord.title,
          summary: moduleRecord.summary,
          lessons
        };
      })
      .filter((moduleRecord): moduleRecord is ModuleRecord => moduleRecord !== null)
      .sort((left, right) => left.sequence - right.sequence);

    return {
      id: track.id,
      slug: track.slug,
      type: track.type,
      title: track.title,
      description: track.description,
      active: track.active,
      modules
    };
  }

  private toEnrollmentRecord(enrollment: StoredEnrollment): EnrollmentRecord | null {
    const track = this.tracksById.get(enrollment.trackId);
    const trackRecord = track === undefined ? null : this.toLearningTrackRecord(track);

    if (trackRecord === null) {
      return null;
    }

    return {
      id: enrollment.id,
      userId: enrollment.userId,
      status: enrollment.status,
      track: trackRecord,
      startDate: new Date(enrollment.startDate),
      targetOutcome: enrollment.targetOutcome,
      experienceLevel: enrollment.experienceLevel
    };
  }

  private allAdminLessonVersions(): readonly AdminLessonVersionRecord[] {
    const records: AdminLessonVersionRecord[] = [];

    for (const track of this.tracksById.values()) {
      for (const moduleRecord of track.modules) {
        for (const lesson of moduleRecord.lessons) {
          for (const version of lesson.versions) {
            records.push(this.toAdminLessonVersionRecord(track, moduleRecord, lesson, version));
          }
        }
      }
    }

    return records;
  }

  private toAdminLessonVersionRecord(
    track: StoredTrack,
    moduleRecord: StoredModule,
    lesson: StoredLesson,
    version: StoredLessonVersion
  ): AdminLessonVersionRecord {
    return {
      ...version,
      resources: version.resources.map((resource) => ({
        ...resource,
        id: `${version.id}:resource:${resource.title}`
      })),
      exercises: version.exercises.map((exercise) => ({
        ...exercise,
        id: `${version.id}:exercise:${exercise.kind}`
      })),
      knowledgeChecks: version.knowledgeChecks.map((knowledgeCheck) => ({
        ...knowledgeCheck,
        id: `${version.id}:knowledge-check:${knowledgeCheck.question}`
      })),
      lessonSlug: lesson.slug,
      moduleTitle: moduleRecord.title,
      trackTitle: track.title,
      trackSlug: track.slug
    };
  }

  private currentApprovedVersion(lesson: StoredLesson): StoredLessonVersion | undefined {
    return lesson.versions
      .filter((version) => version.status === "APPROVED")
      .sort((left, right) => right.version - left.version)[0];
  }

  private locateVersion(
    id: string
  ): { readonly lesson: StoredLesson; readonly version: StoredLessonVersion; readonly index: number } | null {
    for (const lesson of this.lessonsById.values()) {
      const index = lesson.versions.findIndex((version) => version.id === id);

      if (index >= 0) {
        const version = lesson.versions[index];

        if (version !== undefined) {
          return {
            lesson,
            version,
            index
          };
        }
      }
    }

    return null;
  }

  private async transition(
    id: string,
    expectedStatus: ContentStatus,
    nextStatus: ContentStatus,
    actorUserId: string
  ): Promise<AdminLessonVersionRecord> {
    const located = this.locateVersion(id);

    if (located === null) {
      throw notFoundError();
    }

    if (located.version.status !== expectedStatus) {
      throw invalidStatusError();
    }

    located.lesson.versions[located.index] = {
      ...located.version,
      status: nextStatus,
      reviewerId: nextStatus === "APPROVED" ? actorUserId : located.version.reviewerId,
      approvedAt: nextStatus === "APPROVED" ? new Date() : located.version.approvedAt,
      archivedAt: nextStatus === "ARCHIVED" ? new Date() : located.version.archivedAt
    };

    return this.requireAdminLessonVersion(id);
  }

  private requireAdminLessonVersion(id: string | undefined): AdminLessonVersionRecord {
    if (id === undefined) {
      throw notFoundError();
    }

    const version = this.allAdminLessonVersions().find((record) => record.id === id);

    if (version === undefined) {
      throw notFoundError();
    }

    return version;
  }
}

function notFoundError(): Error {
  return createApiGraphqlError({
    code: "NOT_FOUND",
    message: apiErrorMessages.NOT_FOUND,
    retryable: false
  });
}

function invalidStatusError(): Error {
  return createApiGraphqlError({
    code: "CONTENT_INVALID_STATUS",
    message: apiErrorMessages.CONTENT_INVALID_STATUS,
    retryable: false
  });
}
