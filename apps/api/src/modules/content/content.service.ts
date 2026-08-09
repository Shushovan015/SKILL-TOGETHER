import { Inject, Injectable, type OnModuleInit } from "@nestjs/common";

import { apiErrorMessages, createApiGraphqlError } from "../../common/errors/graphql-errors.js";
import type { AuthenticatedUser } from "../auth/domain/auth.types.js";
import {
  assertLessonVersionIsApprovable,
  validateLessonVersionEditorInput,
  validateSelectLearningTrackInput
} from "./domain/content.validation.js";
import type {
  AdminLessonVersionRecord,
  ContentStatus,
  EnrollmentRecord,
  LearningTrackRecord
} from "./domain/content.types.js";
import {
  phase3SeedUsers
} from "./seed/phase-03-seed-data.js";
import {
  CONTENT_REPOSITORY,
  type ContentRepository
} from "./persistence/content.repository.js";

@Injectable()
export class ContentService implements OnModuleInit {
  public constructor(
    @Inject(CONTENT_REPOSITORY) private readonly repository: ContentRepository
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.repository.seedContent({
      authorId: phase3SeedUsers.contentAdmin.id,
      reviewerId: phase3SeedUsers.contentAdmin.id
    });
  }

  public async listLearningTracks(): Promise<readonly LearningTrackRecord[]> {
    return this.repository.listLearningTracks(true);
  }

  public async getLearningTrack(slug: string): Promise<LearningTrackRecord> {
    const track = await this.repository.findLearningTrackBySlug(slug);

    if (track === null || !track.active) {
      throw notFoundError();
    }

    return track;
  }

  public async listEnrollments(user: AuthenticatedUser): Promise<readonly EnrollmentRecord[]> {
    return this.repository.listEnrollmentsForUser(user.id);
  }

  public async selectLearningTrack(
    user: AuthenticatedUser,
    input: unknown
  ): Promise<EnrollmentRecord> {
    return this.repository.selectLearningTrack(user.id, validateSelectLearningTrackInput(input));
  }

  public async listAdminLessonVersions(
    status: ContentStatus | undefined
  ): Promise<readonly AdminLessonVersionRecord[]> {
    return this.repository.listAdminLessonVersions(status);
  }

  public async getAdminLessonVersion(id: string): Promise<AdminLessonVersionRecord> {
    const version = await this.repository.findAdminLessonVersion(id);

    if (version === null) {
      throw notFoundError();
    }

    return version;
  }

  public async createLessonVersion(
    lessonId: string,
    author: AuthenticatedUser,
    input: unknown
  ): Promise<AdminLessonVersionRecord> {
    const validated = validateLessonVersionEditorInput(input);

    return this.repository.createLessonVersion({
      ...validated,
      lessonId,
      authorId: author.id
    });
  }

  public async updateLessonVersion(
    id: string,
    input: unknown
  ): Promise<AdminLessonVersionRecord> {
    return this.repository.updateLessonVersion({
      ...validateLessonVersionEditorInput(input),
      id
    });
  }

  public async submitLessonVersionForReview(
    id: string,
    actor: AuthenticatedUser
  ): Promise<AdminLessonVersionRecord> {
    const version = await this.getAdminLessonVersion(id);
    assertLessonVersionIsApprovable(version);
    return this.repository.submitLessonVersionForReview(id, actor.id);
  }

  public async approveLessonVersion(
    id: string,
    actor: AuthenticatedUser
  ): Promise<AdminLessonVersionRecord> {
    const version = await this.getAdminLessonVersion(id);
    assertLessonVersionIsApprovable(version);
    return this.repository.approveLessonVersion(id, actor.id);
  }

  public async archiveLessonVersion(
    id: string,
    actor: AuthenticatedUser
  ): Promise<AdminLessonVersionRecord> {
    return this.repository.archiveLessonVersion(id, actor.id);
  }
}

function notFoundError(): Error {
  return createApiGraphqlError({
    code: "NOT_FOUND",
    message: apiErrorMessages.NOT_FOUND,
    retryable: false
  });
}
