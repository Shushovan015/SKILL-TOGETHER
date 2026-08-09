import { Args, Context, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

import type { GraphqlContext } from "../../common/graphql/graphql-context.js";
import { RequireRoles, RolesGuard } from "../../common/guards/roles.guard.js";
import { AuthSessionGuard } from "../auth/auth-session.guard.js";
import { CsrfGuard } from "../auth/csrf.guard.js";
import { ContentService } from "./content.service.js";
import {
  fromContentStatusDto,
  toAdminLessonVersionDto,
  toEnrollmentDto,
  toLearningTrackDto
} from "./content.mapper.js";
import {
  AdminLessonVersionDto,
  ContentStatusDto,
  EnrollmentDto,
  LearningTrackDto,
  LessonVersionEditorInputDto,
  SelectLearningTrackInputDto
} from "./dto/content.dto.js";

@Resolver()
export class ContentResolver {
  public constructor(private readonly contentService: ContentService) {}

  @Query(() => [LearningTrackDto])
  @UseGuards(AuthSessionGuard)
  public async learningTracks(): Promise<readonly LearningTrackDto[]> {
    return (await this.contentService.listLearningTracks()).map(toLearningTrackDto);
  }

  @Query(() => LearningTrackDto)
  @UseGuards(AuthSessionGuard)
  public async learningTrack(
    @Args("slug") slug: string
  ): Promise<LearningTrackDto> {
    return toLearningTrackDto(await this.contentService.getLearningTrack(slug));
  }

  @Query(() => [EnrollmentDto])
  @UseGuards(AuthSessionGuard)
  public async myEnrollments(@Context() context: GraphqlContext): Promise<readonly EnrollmentDto[]> {
    return (await this.contentService.listEnrollments(requireCurrentUser(context))).map(
      toEnrollmentDto
    );
  }

  @Mutation(() => EnrollmentDto)
  @UseGuards(AuthSessionGuard, CsrfGuard)
  public async selectLearningTrack(
    @Args("input", { type: () => SelectLearningTrackInputDto }) input: SelectLearningTrackInputDto,
    @Context() context: GraphqlContext
  ): Promise<EnrollmentDto> {
    return toEnrollmentDto(
      await this.contentService.selectLearningTrack(requireCurrentUser(context), input)
    );
  }

  @Query(() => [AdminLessonVersionDto])
  @UseGuards(AuthSessionGuard, RolesGuard)
  @RequireRoles("CONTENT_ADMIN", "SYSTEM_ADMIN")
  public async adminLessonVersions(
    @Args("status", { type: () => ContentStatusDto, nullable: true })
    status?: ContentStatusDto
  ): Promise<readonly AdminLessonVersionDto[]> {
    return (
      await this.contentService.listAdminLessonVersions(
        status === undefined ? undefined : fromContentStatusDto(status)
      )
    ).map(toAdminLessonVersionDto);
  }

  @Query(() => AdminLessonVersionDto)
  @UseGuards(AuthSessionGuard, RolesGuard)
  @RequireRoles("CONTENT_ADMIN", "SYSTEM_ADMIN")
  public async adminLessonVersion(
    @Args("id", { type: () => ID }) id: string
  ): Promise<AdminLessonVersionDto> {
    return toAdminLessonVersionDto(await this.contentService.getAdminLessonVersion(id));
  }

  @Mutation(() => AdminLessonVersionDto)
  @UseGuards(AuthSessionGuard, RolesGuard, CsrfGuard)
  @RequireRoles("CONTENT_ADMIN", "SYSTEM_ADMIN")
  public async createLessonVersion(
    @Args("lessonId", { type: () => ID }) lessonId: string,
    @Args("input", { type: () => LessonVersionEditorInputDto }) input: LessonVersionEditorInputDto,
    @Context() context: GraphqlContext
  ): Promise<AdminLessonVersionDto> {
    return toAdminLessonVersionDto(
      await this.contentService.createLessonVersion(lessonId, requireCurrentUser(context), input)
    );
  }

  @Mutation(() => AdminLessonVersionDto)
  @UseGuards(AuthSessionGuard, RolesGuard, CsrfGuard)
  @RequireRoles("CONTENT_ADMIN", "SYSTEM_ADMIN")
  public async updateLessonVersion(
    @Args("id", { type: () => ID }) id: string,
    @Args("input", { type: () => LessonVersionEditorInputDto }) input: LessonVersionEditorInputDto
  ): Promise<AdminLessonVersionDto> {
    return toAdminLessonVersionDto(await this.contentService.updateLessonVersion(id, input));
  }

  @Mutation(() => AdminLessonVersionDto)
  @UseGuards(AuthSessionGuard, RolesGuard, CsrfGuard)
  @RequireRoles("CONTENT_ADMIN", "SYSTEM_ADMIN")
  public async submitLessonVersionForReview(
    @Args("id", { type: () => ID }) id: string,
    @Context() context: GraphqlContext
  ): Promise<AdminLessonVersionDto> {
    return toAdminLessonVersionDto(
      await this.contentService.submitLessonVersionForReview(id, requireCurrentUser(context))
    );
  }

  @Mutation(() => AdminLessonVersionDto)
  @UseGuards(AuthSessionGuard, RolesGuard, CsrfGuard)
  @RequireRoles("CONTENT_ADMIN", "SYSTEM_ADMIN")
  public async approveLessonVersion(
    @Args("id", { type: () => ID }) id: string,
    @Context() context: GraphqlContext
  ): Promise<AdminLessonVersionDto> {
    return toAdminLessonVersionDto(
      await this.contentService.approveLessonVersion(id, requireCurrentUser(context))
    );
  }

  @Mutation(() => AdminLessonVersionDto)
  @UseGuards(AuthSessionGuard, RolesGuard, CsrfGuard)
  @RequireRoles("CONTENT_ADMIN", "SYSTEM_ADMIN")
  public async archiveLessonVersion(
    @Args("id", { type: () => ID }) id: string,
    @Context() context: GraphqlContext
  ): Promise<AdminLessonVersionDto> {
    return toAdminLessonVersionDto(
      await this.contentService.archiveLessonVersion(id, requireCurrentUser(context))
    );
  }
}

function requireCurrentUser(context: GraphqlContext) {
  if (context.currentUser === undefined) {
    throw new Error("AuthSessionGuard did not populate current user");
  }

  return context.currentUser;
}
