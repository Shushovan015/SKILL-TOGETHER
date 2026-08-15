import type {
  Exercise as PrismaExercise,
  KnowledgeCheck as PrismaKnowledgeCheck,
  LearningModule as PrismaLearningModule,
  LearningTrack as PrismaLearningTrack,
  Lesson as PrismaLesson,
  LessonPrerequisite as PrismaLessonPrerequisite,
  LessonVersion as PrismaLessonVersion,
  Resource as PrismaResource
} from "../../../generated/prisma/client.js";
import {
  ContentStatus as PrismaContentStatus,
  EnrollmentStatus as PrismaEnrollmentStatus,
  Prisma,
  TrackType as PrismaTrackType,
  UserRole as PrismaUserRole,
  UserStatus as PrismaUserStatus
} from "../../../generated/prisma/client.js";
import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import { PrismaService } from "../../../prisma/prisma.service.js";
import type {
  AdminLessonVersionRecord,
  ContentStatus,
  EnrollmentRecord,
  ExerciseRecord,
  GermanLevel,
  KnowledgeCheckRecord,
  LessonVersionEditorInput,
  LearningTrackRecord,
  ModuleRecord,
  ResourceRecord,
  SelectLearningTrackInput
} from "../domain/content.types.js";
import {
  buildApprovedSeedVersionInput,
  lessonSlug,
  phase3SeedTracks,
  phase3SeedUsers
} from "../seed/phase-03-seed-data.js";
import type {
  ContentRepository,
  CreateLessonVersionRepositoryInput,
  SeedContentInput,
  UpdateLessonVersionRepositoryInput
} from "./content.repository.js";

interface PrismaTrackWithModules extends PrismaLearningTrack {
  readonly modules: readonly PrismaModuleWithLessons[];
}

interface PrismaModuleWithLessons extends PrismaLearningModule {
  readonly lessons: readonly PrismaLessonWithApprovedVersions[];
}

interface PrismaLessonWithApprovedVersions extends PrismaLesson {
  readonly versions: readonly PrismaVersionWithChildren[];
  readonly prerequisites: readonly PrismaPrerequisiteWithLesson[];
}

interface PrismaPrerequisiteWithLesson extends PrismaLessonPrerequisite {
  readonly prerequisiteLesson: PrismaLesson;
}

interface PrismaVersionWithChildren extends PrismaLessonVersion {
  readonly resources: readonly PrismaResource[];
  readonly exercises: readonly PrismaExercise[];
  readonly knowledgeChecks: readonly PrismaKnowledgeCheck[];
}

interface PrismaAdminVersion extends PrismaVersionWithChildren {
  readonly lesson: PrismaLesson & {
    readonly module: PrismaLearningModule & {
      readonly track: PrismaLearningTrack;
    };
  };
}

interface PrismaEnrollmentWithTrack {
  readonly id: string;
  readonly userId: string;
  readonly status: PrismaEnrollmentStatus;
  readonly track: PrismaTrackWithModules;
  readonly startDate: Date;
  readonly targetOutcome: string;
  readonly experienceLevel: string;
  readonly learningPreferences: Prisma.JsonValue | null;
}

interface EnrollmentProgress {
  readonly totalTaskCount: number;
  readonly completedTaskCount: number;
  readonly overallProgressPercentage: number;
  readonly currentDailyTaskId: string | null;
  readonly currentLessonId: string | null;
  readonly currentModuleTitle: string | null;
  readonly currentLessonTitle: string | null;
  readonly completedLessonIds: readonly string[];
}

const disabledSeedPasswordHash = "disabled-seed-content-admin-no-login";

export class PrismaContentRepository implements ContentRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async listLearningTracks(activeOnly: boolean): Promise<readonly LearningTrackRecord[]> {
    const tracks = await this.prisma.learningTrack.findMany({
      ...(activeOnly ? { where: { active: true } } : {}),
      include: trackInclude,
      orderBy: {
        title: "asc"
      }
    });

    return tracks
      .map((track) => mapTrack(track))
      .filter((track): track is LearningTrackRecord => track !== null);
  }

  public async findLearningTrackBySlug(slug: string): Promise<LearningTrackRecord | null> {
    const track = await this.prisma.learningTrack.findUnique({
      where: {
        slug
      },
      include: trackInclude
    });

    return track === null ? null : mapTrack(track);
  }

  public async findLearningTrackById(id: string): Promise<LearningTrackRecord | null> {
    const track = await this.prisma.learningTrack.findUnique({
      where: {
        id
      },
      include: trackInclude
    });

    return track === null ? null : mapTrack(track);
  }

  public async listEnrollmentsForUser(userId: string): Promise<readonly EnrollmentRecord[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        userId
      },
      include: {
        track: {
          include: trackInclude
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const progress = await Promise.all(enrollments.map((enrollment) => this.enrollmentProgress(enrollment.id)));

    return enrollments
      .map((enrollment, index) => mapEnrollment(enrollment, progress[index]))
      .filter((enrollment): enrollment is EnrollmentRecord => enrollment !== null);
  }

  public async findEnrollmentForUser(
    enrollmentId: string,
    userId: string
  ): Promise<EnrollmentRecord | null> {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        userId
      },
      include: {
        track: {
          include: trackInclude
        }
      }
    });

    return enrollment === null
      ? null
      : mapEnrollment(enrollment, await this.enrollmentProgress(enrollment.id));
  }

  public async selectLearningTrack(
    userId: string,
    input: SelectLearningTrackInput
  ): Promise<EnrollmentRecord> {
    const track = await this.prisma.learningTrack.findFirst({
      where: {
        id: input.trackId,
        active: true
      }
    });

    if (track === null) {
      throw notFoundError();
    }

    const activeEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        trackId: input.trackId,
        status: PrismaEnrollmentStatus.ACTIVE
      }
    });

    if (activeEnrollment !== null) {
      throw conflictError();
    }

    const existingDraft = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        trackId: input.trackId,
        status: PrismaEnrollmentStatus.DRAFT
      }
    });

    const enrollment =
      existingDraft === null
        ? await this.prisma.enrollment.create({
            data: {
              userId,
              trackId: input.trackId,
              status: PrismaEnrollmentStatus.DRAFT,
              startDate: input.startDate,
              targetOutcome: input.targetOutcome,
              experienceLevel: input.experienceLevel,
              learningPreferences: enrollmentPreferencesForTrack(track.type, input) ?? Prisma.DbNull
            },
            include: {
              track: {
                include: trackInclude
              }
            }
          })
        : await this.prisma.enrollment.update({
            where: {
              id: existingDraft.id
            },
            data: {
              startDate: input.startDate,
              targetOutcome: input.targetOutcome,
              experienceLevel: input.experienceLevel,
              learningPreferences: enrollmentPreferencesForTrack(track.type, input) ?? Prisma.DbNull
            },
            include: {
              track: {
                include: trackInclude
              }
            }
          });

    const mapped = mapEnrollment(enrollment);

    if (mapped === null) {
      throw notFoundError();
    }

    return mapped;
  }

  private async enrollmentProgress(enrollmentId: string): Promise<EnrollmentProgress> {
    const tasks = await this.prisma.dailyTask.findMany({
      where: {
        studyWeek: { studyPlan: { enrollmentId } },
        status: { notIn: ["CANCELLED", "RESCHEDULED", "SKIPPED"] }
      },
      select: {
        id: true,
        status: true,
        scheduledOn: true,
        lessonVersion: {
          select: {
            title: true,
            lessonId: true,
            lesson: { select: { module: { select: { title: true } } } }
          }
        }
      },
      orderBy: { scheduledOn: "asc" }
    });
    const current = tasks.find((task) => task.status === "IN_PROGRESS")
      ?? tasks.find((task) => task.status === "PLANNED");
    const completed = tasks.filter((task) => task.status === "COMPLETED");

    return {
      totalTaskCount: tasks.length,
      completedTaskCount: completed.length,
      overallProgressPercentage: tasks.length === 0 ? 0 : Math.round((completed.length / tasks.length) * 10_000) / 100,
      currentDailyTaskId: current?.id ?? null,
      currentLessonId: current?.lessonVersion.lessonId ?? null,
      currentModuleTitle: current?.lessonVersion.lesson.module.title ?? null,
      currentLessonTitle: current?.lessonVersion.title ?? null,
      completedLessonIds: [...new Set(completed.map((task) => task.lessonVersion.lessonId))]
    };
  }

  public async listAdminLessonVersions(
    status: ContentStatus | undefined
  ): Promise<readonly AdminLessonVersionRecord[]> {
    const versions = await this.prisma.lessonVersion.findMany({
      ...(status === undefined ? {} : { where: { status: toPrismaContentStatus(status) } }),
      include: adminVersionInclude,
      orderBy: [
        {
          lesson: {
            module: {
              track: {
                title: "asc"
              }
            }
          }
        },
        {
          lesson: {
            module: {
              sequence: "asc"
            }
          }
        },
        {
          lesson: {
            sequence: "asc"
          }
        },
        {
          version: "desc"
        }
      ]
    });

    return versions.map(mapAdminVersion);
  }

  public async findAdminLessonVersion(id: string): Promise<AdminLessonVersionRecord | null> {
    const version = await this.prisma.lessonVersion.findUnique({
      where: {
        id
      },
      include: adminVersionInclude
    });

    return version === null ? null : mapAdminVersion(version);
  }

  public async createLessonVersion(
    input: CreateLessonVersionRepositoryInput
  ): Promise<AdminLessonVersionRecord> {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: input.lessonId
      },
      select: {
        id: true
      }
    });

    if (lesson === null) {
      throw notFoundError();
    }

    const nextVersion = await this.nextVersion(input.lessonId);

    try {
      const version = await this.prisma.lessonVersion.create({
        data: {
          lessonId: input.lessonId,
          version: nextVersion,
          status: PrismaContentStatus.DRAFT,
          title: input.title,
          learningObjective: input.learningObjective,
          outcomes: [...input.outcomes],
          explanationMd: input.explanationMarkdown,
          relevanceMd: input.relevanceMarkdown,
          examples: [...input.examples],
          commonMistakes: [...input.commonMistakes],
          assessmentTags: [...input.assessmentTags],
          authorId: input.authorId,
          resources: {
            create: input.resources.map(toResourceCreateInput)
          },
          exercises: {
            create: input.exercises.map(toExerciseCreateInput)
          },
          knowledgeChecks: {
            create: input.knowledgeChecks.map(toKnowledgeCheckCreateInput)
          }
        },
        include: adminVersionInclude
      });
      await this.createAuditEvent(input.authorId, "LESSON_VERSION_CREATED", "lesson_versions", version.id);

      return mapAdminVersion(version);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw versionConflictError();
      }

      throw error;
    }
  }

  public async updateLessonVersion(
    input: UpdateLessonVersionRepositoryInput
  ): Promise<AdminLessonVersionRecord> {
    const current = await this.prisma.lessonVersion.findUnique({
      where: {
        id: input.id
      },
      select: {
        id: true,
        status: true,
        authorId: true
      }
    });

    if (current === null) {
      throw notFoundError();
    }

    if (current.status !== PrismaContentStatus.DRAFT) {
      throw invalidStatusError();
    }

    const version = await this.prisma.$transaction(async (transaction) => {
      await transaction.resource.deleteMany({
        where: {
          lessonVersionId: input.id
        }
      });
      await transaction.exercise.deleteMany({
        where: {
          lessonVersionId: input.id
        }
      });
      await transaction.knowledgeCheck.deleteMany({
        where: {
          lessonVersionId: input.id
        }
      });

      return transaction.lessonVersion.update({
        where: {
          id: input.id
        },
        data: {
          title: input.title,
          learningObjective: input.learningObjective,
          outcomes: [...input.outcomes],
          explanationMd: input.explanationMarkdown,
          relevanceMd: input.relevanceMarkdown,
          examples: [...input.examples],
          commonMistakes: [...input.commonMistakes],
          assessmentTags: [...input.assessmentTags],
          resources: {
            create: input.resources.map(toResourceCreateInput)
          },
          exercises: {
            create: input.exercises.map(toExerciseCreateInput)
          },
          knowledgeChecks: {
            create: input.knowledgeChecks.map(toKnowledgeCheckCreateInput)
          }
        },
        include: adminVersionInclude
      });
    });
    await this.createAuditEvent(current.authorId, "LESSON_VERSION_UPDATED", "lesson_versions", input.id);

    return mapAdminVersion(version);
  }

  public async submitLessonVersionForReview(
    id: string,
    actorUserId: string
  ): Promise<AdminLessonVersionRecord> {
    return this.transition(id, PrismaContentStatus.DRAFT, PrismaContentStatus.REVIEWED, actorUserId);
  }

  public async approveLessonVersion(
    id: string,
    actorUserId: string
  ): Promise<AdminLessonVersionRecord> {
    return this.transition(
      id,
      PrismaContentStatus.REVIEWED,
      PrismaContentStatus.APPROVED,
      actorUserId
    );
  }

  public async archiveLessonVersion(
    id: string,
    actorUserId: string
  ): Promise<AdminLessonVersionRecord> {
    return this.transition(
      id,
      PrismaContentStatus.APPROVED,
      PrismaContentStatus.ARCHIVED,
      actorUserId
    );
  }

  public async seedContent(input: SeedContentInput): Promise<void> {
    await this.seedContentAdmin();

    for (const trackDefinition of phase3SeedTracks) {
      const track = await this.prisma.learningTrack.upsert({
        where: {
          slug: trackDefinition.slug
        },
        update: {
          type: toPrismaTrackType(trackDefinition.type),
          title: trackDefinition.title,
          description: trackDefinition.description,
          active: trackDefinition.active
        },
        create: {
          slug: trackDefinition.slug,
          type: toPrismaTrackType(trackDefinition.type),
          title: trackDefinition.title,
          description: trackDefinition.description,
          active: trackDefinition.active
        }
      });
      const lessonIdsByIdentifier = new Map<string, string>();

      for (const moduleDefinition of trackDefinition.modules) {
        const moduleRecord = await this.prisma.learningModule.upsert({
          where: {
            trackId_sequence: {
              trackId: track.id,
              sequence: moduleDefinition.sequence
            }
          },
          update: {
            title: moduleDefinition.title,
            summary: moduleDefinition.summary
          },
          create: {
            trackId: track.id,
            sequence: moduleDefinition.sequence,
            title: moduleDefinition.title,
            summary: moduleDefinition.summary
          }
        });

        for (const [index, lessonDefinition] of moduleDefinition.lessons.entries()) {
          const lesson = await this.prisma.lesson.upsert({
            where: {
              moduleId_sequence: {
                moduleId: moduleRecord.id,
                sequence: index + 1
              }
            },
            update: {
              slug: lessonSlug(lessonDefinition.identifier),
              defaultDurationMinutes: lessonDefinition.durationMinutes,
              difficulty: lessonDefinition.level ?? "Beginner",
              required: lessonDefinition.required
            },
            create: {
              moduleId: moduleRecord.id,
              slug: lessonSlug(lessonDefinition.identifier),
              sequence: index + 1,
              defaultDurationMinutes: lessonDefinition.durationMinutes,
              difficulty: lessonDefinition.level ?? "Beginner",
              required: lessonDefinition.required
            }
          });
          lessonIdsByIdentifier.set(lessonDefinition.identifier, lesson.id);

          await this.upsertApprovedSeedVersion(lesson.id, input.authorId, input.reviewerId, lessonDefinition);
        }

        const expectedSequences = moduleDefinition.lessons.map((_, index) => index + 1);
        const extraLessons = await this.prisma.lesson.findMany({
          where: {
            moduleId: moduleRecord.id,
            ...(expectedSequences.length === 0
              ? {}
              : {
                  sequence: {
                    notIn: expectedSequences
                  }
                })
          },
          select: {
            id: true
          }
        });

        if (extraLessons.length > 0) {
          await this.prisma.lessonVersion.updateMany({
            where: {
              lessonId: {
                in: extraLessons.map((lesson) => lesson.id)
              },
              status: PrismaContentStatus.APPROVED
            },
            data: {
              status: PrismaContentStatus.ARCHIVED,
              archivedAt: new Date()
            }
          });
        }
      }

      for (const moduleDefinition of trackDefinition.modules) {
        for (const lessonDefinition of moduleDefinition.lessons) {
          const lessonId = lessonIdsByIdentifier.get(lessonDefinition.identifier);

          if (lessonId === undefined) {
            continue;
          }

          await this.prisma.lessonPrerequisite.deleteMany({
            where: {
              lessonId
            }
          });

          const prerequisites = lessonDefinition.prerequisites
            .map((identifier) => lessonIdsByIdentifier.get(identifier))
            .filter(
              (prerequisiteLessonId): prerequisiteLessonId is string =>
                prerequisiteLessonId !== undefined
            )
            .map((prerequisiteLessonId) => ({
              lessonId,
              prerequisiteLessonId
            }));

          if (prerequisites.length > 0) {
            await this.prisma.lessonPrerequisite.createMany({
              data: prerequisites,
              skipDuplicates: true
            });
          }
        }
      }
    }
  }

  private async nextVersion(lessonId: string): Promise<number> {
    const aggregate = await this.prisma.lessonVersion.aggregate({
      where: {
        lessonId
      },
      _max: {
        version: true
      }
    });

    return (aggregate._max.version ?? 0) + 1;
  }

  private async transition(
    id: string,
    expectedStatus: PrismaContentStatus,
    nextStatus: PrismaContentStatus,
    actorUserId: string
  ): Promise<AdminLessonVersionRecord> {
    const current = await this.prisma.lessonVersion.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        status: true
      }
    });

    if (current === null) {
      throw notFoundError();
    }

    if (current.status !== expectedStatus) {
      throw invalidStatusError();
    }

    const version = await this.prisma.lessonVersion.update({
      where: {
        id
      },
      data: {
        status: nextStatus,
        ...(nextStatus === PrismaContentStatus.APPROVED
          ? {
              reviewerId: actorUserId,
              approvedAt: new Date()
            }
          : {}),
        ...(nextStatus === PrismaContentStatus.ARCHIVED
          ? {
              archivedAt: new Date()
            }
          : {})
      },
      include: adminVersionInclude
    });
    await this.createAuditEvent(actorUserId, `LESSON_VERSION_${nextStatus}`, "lesson_versions", id);

    return mapAdminVersion(version);
  }

  private async seedContentAdmin(): Promise<void> {
    await this.prisma.user.upsert({
      where: {
        id: phase3SeedUsers.contentAdmin.id
      },
      update: {
        email: phase3SeedUsers.contentAdmin.email,
        status: PrismaUserStatus.DISABLED,
        profile: {
          upsert: {
            update: {
              displayName: phase3SeedUsers.contentAdmin.displayName,
              timeZone: phase3SeedUsers.contentAdmin.timeZone
            },
            create: {
              displayName: phase3SeedUsers.contentAdmin.displayName,
              timeZone: phase3SeedUsers.contentAdmin.timeZone
            }
          }
        },
        roles: {
          upsert: {
            where: {
              userId_role: {
                userId: phase3SeedUsers.contentAdmin.id,
                role: PrismaUserRole.CONTENT_ADMIN
              }
            },
            update: {},
            create: {
              role: PrismaUserRole.CONTENT_ADMIN
            }
          }
        }
      },
      create: {
        id: phase3SeedUsers.contentAdmin.id,
        email: phase3SeedUsers.contentAdmin.email,
        passwordHash: disabledSeedPasswordHash,
        status: PrismaUserStatus.DISABLED,
        profile: {
          create: {
            displayName: phase3SeedUsers.contentAdmin.displayName,
            timeZone: phase3SeedUsers.contentAdmin.timeZone
          }
        },
        roles: {
          create: {
            role: PrismaUserRole.CONTENT_ADMIN
          }
        }
      }
    });
  }

  private async upsertApprovedSeedVersion(
    lessonId: string,
    authorId: string,
    reviewerId: string,
    lessonDefinition: Parameters<typeof buildApprovedSeedVersionInput>[0]
  ): Promise<void> {
    const input = buildApprovedSeedVersionInput(lessonDefinition);
    const version = await this.prisma.lessonVersion.upsert({
      where: {
        lessonId_version: {
          lessonId,
          version: 1
        }
      },
      update: {
        status: PrismaContentStatus.APPROVED,
        title: input.title,
        learningObjective: input.learningObjective,
        outcomes: [...input.outcomes],
        explanationMd: input.explanationMarkdown,
        relevanceMd: input.relevanceMarkdown,
        examples: [...input.examples],
        commonMistakes: [...input.commonMistakes],
        assessmentTags: [...input.assessmentTags],
        authorId,
        reviewerId,
        approvedAt: new Date("2026-08-02T00:00:00.000Z"),
        archivedAt: null
      },
      create: {
        lessonId,
        version: 1,
        status: PrismaContentStatus.APPROVED,
        title: input.title,
        learningObjective: input.learningObjective,
        outcomes: [...input.outcomes],
        explanationMd: input.explanationMarkdown,
        relevanceMd: input.relevanceMarkdown,
        examples: [...input.examples],
        commonMistakes: [...input.commonMistakes],
        assessmentTags: [...input.assessmentTags],
        authorId,
        reviewerId,
        approvedAt: new Date("2026-08-02T00:00:00.000Z")
      }
    });

    await this.replaceVersionChildren(version.id, input);
  }

  private async replaceVersionChildren(
    lessonVersionId: string,
    input: LessonVersionEditorInput
  ): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      await transaction.resource.deleteMany({
        where: {
          lessonVersionId
        }
      });
      await transaction.exercise.deleteMany({
        where: {
          lessonVersionId
        }
      });
      await transaction.knowledgeCheck.deleteMany({
        where: {
          lessonVersionId
        }
      });
      await transaction.resource.createMany({
        data: input.resources.map((resource) => ({
          lessonVersionId,
          ...toResourceCreateInput(resource)
        }))
      });
      await transaction.exercise.createMany({
        data: input.exercises.map((exercise) => ({
          lessonVersionId,
          ...toExerciseCreateInput(exercise)
        }))
      });
      await transaction.knowledgeCheck.createMany({
        data: input.knowledgeChecks.map((knowledgeCheck) => ({
          lessonVersionId,
          ...toKnowledgeCheckCreateInput(knowledgeCheck)
        }))
      });
    });
  }

  private async createAuditEvent(
    actorUserId: string,
    eventType: string,
    entityType: string,
    entityId: string
  ): Promise<void> {
    await this.prisma.auditEvent.create({
      data: {
        actorUserId,
        eventType,
        entityType,
        entityId,
        safeMetadata: {}
      }
    });
  }
}

const trackInclude = {
  modules: {
    orderBy: {
      sequence: "asc"
    },
    include: {
      lessons: {
        orderBy: {
          sequence: "asc"
        },
        include: {
          prerequisites: {
            include: {
              prerequisiteLesson: true
            }
          },
          versions: {
            where: {
              status: PrismaContentStatus.APPROVED
            },
            include: {
              resources: true,
              exercises: true,
              knowledgeChecks: true
            },
            orderBy: {
              version: "desc"
            },
            take: 1
          }
        }
      }
    }
  }
} as const;

const adminVersionInclude = {
  resources: true,
  exercises: true,
  knowledgeChecks: true,
  lesson: {
    include: {
      module: {
        include: {
          track: true
        }
      }
    }
  }
} as const;

function mapTrack(track: PrismaTrackWithModules): LearningTrackRecord {
  const modules = track.modules
    .map((moduleRecord): ModuleRecord => {
      const lessons = moduleRecord.lessons
        .map((lesson) => {
          const approvedVersion = lesson.versions[0];

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
            prerequisites: lesson.prerequisites.map(
              (prerequisite) => prerequisite.prerequisiteLesson.id
            )
          };
        })
        .filter((lesson): lesson is NonNullable<typeof lesson> => lesson !== null);

      return {
        id: moduleRecord.id,
        sequence: moduleRecord.sequence,
        title: moduleRecord.title,
        summary: moduleRecord.summary,
        lessons
      };
    });

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

function mapEnrollment(
  enrollment: PrismaEnrollmentWithTrack,
  progress: EnrollmentProgress | undefined = undefined
): EnrollmentRecord | null {
  const track = mapTrack(enrollment.track);

  return {
    id: enrollment.id,
    userId: enrollment.userId,
    status: enrollment.status,
    track,
    startDate: enrollment.startDate,
    targetOutcome: enrollment.targetOutcome,
    experienceLevel: enrollment.experienceLevel,
    ...germanEnrollmentFields(enrollment.learningPreferences),
    ...(progress ?? emptyEnrollmentProgress)
  };
}

const emptyEnrollmentProgress: EnrollmentProgress = {
  totalTaskCount: 0,
  completedTaskCount: 0,
  overallProgressPercentage: 0,
  currentDailyTaskId: null,
  currentLessonId: null,
  currentModuleTitle: null,
  currentLessonTitle: null,
  completedLessonIds: []
};

function enrollmentPreferencesForTrack(
  trackType: PrismaTrackType,
  input: SelectLearningTrackInput
): Prisma.InputJsonObject | null {
  if (trackType !== PrismaTrackType.GERMAN) {
    return null;
  }

  if (
    input.germanStartLevel === null ||
    input.germanTargetLevel === null ||
    input.germanSessionDurationMinutes === null
  ) {
    throw validationError("germanStartLevel");
  }

  return {
    german: {
      startLevel: input.germanStartLevel,
      targetLevel: input.germanTargetLevel,
      sessionDurationMinutes: input.germanSessionDurationMinutes
    }
  };
}

function germanEnrollmentFields(value: Prisma.JsonValue | null): Pick<
  EnrollmentRecord,
  "germanStartLevel" | "germanTargetLevel" | "germanSessionDurationMinutes"
> {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    !("german" in value) ||
    typeof value["german"] !== "object" ||
    value["german"] === null ||
    Array.isArray(value["german"])
  ) {
    return {
      germanStartLevel: null,
      germanTargetLevel: null,
      germanSessionDurationMinutes: null
    };
  }

  const german = value["german"];
  const startLevel = german["startLevel"];
  const targetLevel = german["targetLevel"];
  const sessionDurationMinutes = german["sessionDurationMinutes"];

  return {
    germanStartLevel: isGermanLevel(startLevel) ? startLevel : null,
    germanTargetLevel: isGermanTargetLevel(targetLevel) ? targetLevel : null,
    germanSessionDurationMinutes:
      isGermanSessionDuration(sessionDurationMinutes) ? sessionDurationMinutes : null
  };
}

function isGermanLevel(value: unknown): value is GermanLevel {
  return (
    value === "COMPLETE_BEGINNER" ||
    value === "A1.1" ||
    value === "A1.2" ||
    value === "A2.1" ||
    value === "A2.2" ||
    value === "B1.1" ||
    value === "B1.2" ||
    value === "B2.1" ||
    value === "B2.2" ||
    value === "C1.1" ||
    value === "C1.2" ||
    value === "C2.1" ||
    value === "C2.2"
  );
}

function isGermanTargetLevel(value: unknown): value is Exclude<GermanLevel, "COMPLETE_BEGINNER"> {
  return isGermanLevel(value) && value !== "COMPLETE_BEGINNER";
}

function isGermanSessionDuration(value: unknown): value is 30 | 45 | 60 | 90 {
  return value === 30 || value === 45 || value === 60 || value === 90;
}

function mapAdminVersion(version: PrismaAdminVersion): AdminLessonVersionRecord {
  return {
    id: version.id,
    lessonId: version.lessonId,
    version: version.version,
    status: version.status,
    title: version.title,
    learningObjective: version.learningObjective,
    outcomes: toStringArray(version.outcomes),
    explanationMarkdown: version.explanationMd,
    relevanceMarkdown: version.relevanceMd,
    examples: toStringArray(version.examples),
    commonMistakes: toStringArray(version.commonMistakes),
    assessmentTags: [...version.assessmentTags],
    authorId: version.authorId,
    reviewerId: version.reviewerId,
    approvedAt: version.approvedAt,
    archivedAt: version.archivedAt,
    resources: version.resources.map(mapResource),
    exercises: version.exercises.map(mapExercise),
    knowledgeChecks: version.knowledgeChecks.map(mapKnowledgeCheck),
    lessonSlug: version.lesson.slug,
    moduleTitle: version.lesson.module.title,
    trackTitle: version.lesson.module.track.title,
    trackSlug: version.lesson.module.track.slug
  };
}

function mapResource(resource: PrismaResource): ResourceRecord {
  return {
    id: resource.id,
    title: resource.title,
    provider: resource.provider,
    url: resource.url,
    resourceType: resource.resourceType,
    difficulty: resource.difficulty,
    estimatedMinutes: resource.estimatedMinutes,
    description: resource.description,
    verificationStatus: resource.verificationStatus,
    required: resource.required,
    approved: resource.approved,
    citation: resource.citation
  };
}

function mapExercise(exercise: PrismaExercise): ExerciseRecord {
  return {
    id: exercise.id,
    kind: exercise.kind,
    promptMarkdown: exercise.promptMd,
    expectedEvidence: exercise.expectedEvidence,
    solutionNotesMarkdown: exercise.solutionNotesMd
  };
}

function mapKnowledgeCheck(knowledgeCheck: PrismaKnowledgeCheck): KnowledgeCheckRecord {
  return {
    id: knowledgeCheck.id,
    question: knowledgeCheck.question,
    answerKey: toStringArray(knowledgeCheck.answerKey),
    explanation: knowledgeCheck.explanation
  };
}

function toResourceCreateInput(resource: Omit<ResourceRecord, "id">) {
  return {
    title: resource.title,
    provider: resource.provider,
    url: resource.url,
    resourceType: resource.resourceType,
    difficulty: resource.difficulty,
    estimatedMinutes: resource.estimatedMinutes,
    description: resource.description,
    verificationStatus: resource.verificationStatus,
    required: resource.required,
    approved: resource.approved,
    citation: resource.citation
  };
}

function toExerciseCreateInput(exercise: Omit<ExerciseRecord, "id">) {
  return {
    kind: exercise.kind,
    promptMd: exercise.promptMarkdown,
    expectedEvidence: exercise.expectedEvidence,
    solutionNotesMd: exercise.solutionNotesMarkdown
  };
}

function toKnowledgeCheckCreateInput(knowledgeCheck: Omit<KnowledgeCheckRecord, "id">) {
  return {
    question: knowledgeCheck.question,
    answerKey: [...knowledgeCheck.answerKey],
    explanation: knowledgeCheck.explanation
  };
}

function toPrismaContentStatus(status: ContentStatus): PrismaContentStatus {
  return status;
}

function toPrismaTrackType(type: LearningTrackRecord["type"]): PrismaTrackType {
  return type;
}

function toStringArray(value: Prisma.JsonValue): readonly string[] {
  if (Array.isArray(value) && value.every((item): item is string => typeof item === "string")) {
    return value;
  }

  throw new Error("Expected string array JSON.");
}

function notFoundError(): Error {
  return createApiGraphqlError({
    code: "NOT_FOUND",
    message: apiErrorMessages.NOT_FOUND,
    retryable: false
  });
}

function conflictError(): Error {
  return createApiGraphqlError({
    code: "CONFLICT",
    message: apiErrorMessages.CONFLICT,
    retryable: true
  });
}

function validationError(field: string): Error {
  return createApiGraphqlError({
    code: "VALIDATION_FAILED",
    message: apiErrorMessages.VALIDATION_FAILED,
    retryable: false,
    field
  });
}

function invalidStatusError(): Error {
  return createApiGraphqlError({
    code: "CONTENT_INVALID_STATUS",
    message: apiErrorMessages.CONTENT_INVALID_STATUS,
    retryable: false
  });
}

function versionConflictError(): Error {
  return createApiGraphqlError({
    code: "CONTENT_VERSION_CONFLICT",
    message: apiErrorMessages.CONTENT_VERSION_CONFLICT,
    retryable: true
  });
}
