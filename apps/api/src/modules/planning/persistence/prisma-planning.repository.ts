import type {
  DailyTask as PrismaDailyTask,
  Enrollment as PrismaEnrollment,
  Exercise as PrismaExercise,
  KnowledgeCheck as PrismaKnowledgeCheck,
  LearningModule as PrismaLearningModule,
  LearningTrack as PrismaLearningTrack,
  Lesson as PrismaLesson,
  LessonPrerequisite as PrismaLessonPrerequisite,
  LessonVersion as PrismaLessonVersion,
  PausePeriod as PrismaPausePeriod,
  Resource as PrismaResource,
  StudyPlan as PrismaStudyPlan,
  StudyWeek as PrismaStudyWeek
} from "../../../generated/prisma/client.js";
import {
  ContentStatus as PrismaContentStatus,
  EnrollmentStatus as PrismaEnrollmentStatus,
  Prisma,
  TrackType as PrismaTrackType,
  ReflectionVisibility as PrismaReflectionVisibility,
  TaskStatus as PrismaTaskStatus
} from "../../../generated/prisma/client.js";
import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import { PrismaService } from "../../../prisma/prisma.service.js";
import { LessonCompletionService } from "../domain/lesson-completion.service.js";
import type {
  ApprovedLessonForScheduling,
  CompleteDailyTaskInput,
  DailyTaskRecord,
  ExistingScheduledTask,
  OnboardingInput,
  PauseEnrollmentInput,
  PlanPreferences,
  PlanningEnrollmentRecord,
  RecoveryPlanContext,
  RecoveryProposalRecord,
  ReconfigureEnrollmentInput,
  ScheduleDraft,
  RescheduleTaskInput,
  TodayDashboardRecord
} from "../domain/planning.types.js";
import type { GermanLevel } from "../../content/domain/content.types.js";
import { RecoveryDomainService, assertRecoveryAvailable } from "../domain/recovery.service.js";
import {
  dateKey,
  hasCapacity,
  isStudyDate,
  weekForDate
} from "../domain/scheduling.service.js";
import { SchedulingDomainService } from "../domain/scheduling.service.js";
import type { PlanningRepository } from "./planning.repository.js";

interface PrismaVersionWithChildren extends PrismaLessonVersion {
  readonly resources: readonly PrismaResource[];
  readonly exercises: readonly PrismaExercise[];
  readonly knowledgeChecks: readonly PrismaKnowledgeCheck[];
}

interface PrismaLessonForSchedule extends PrismaLesson {
  readonly module: PrismaLearningModule & {
    readonly track: PrismaLearningTrack;
  };
  readonly prerequisites: readonly (PrismaLessonPrerequisite & {
    readonly prerequisiteLesson: PrismaLesson;
  })[];
  readonly versions: readonly PrismaVersionWithChildren[];
}

interface PrismaDailyTaskWithLesson extends PrismaDailyTask {
  readonly studyWeek: PrismaStudyWeek & {
    readonly studyPlan: PrismaStudyPlan & {
      readonly pausePeriods: readonly PrismaPausePeriod[];
      readonly enrollment: PrismaEnrollment & {
        readonly track: PrismaLearningTrack;
      };
    };
  };
  readonly lessonVersion: PrismaVersionWithChildren & {
    readonly lesson: PrismaLesson & {
      readonly module: PrismaLearningModule & {
        readonly track: PrismaLearningTrack;
      };
      readonly prerequisites: readonly (PrismaLessonPrerequisite & {
        readonly prerequisiteLesson: PrismaLesson;
      })[];
    };
  };
}

interface PrismaEnrollmentWithTrack extends PrismaEnrollment {
  readonly track: PrismaLearningTrack;
}

interface LoadedRecoveryContext {
  readonly context: RecoveryPlanContext;
  readonly studyPlanId: string;
  readonly enrollmentStartDate: Date;
  readonly lessonVersionId: string;
  readonly required: boolean;
}

export class PrismaPlanningRepository implements PlanningRepository {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly schedulingService: SchedulingDomainService,
    private readonly recoveryService: RecoveryDomainService,
    private readonly lessonCompletionService: LessonCompletionService
  ) {}

  public async completeOnboarding(
    userId: string,
    input: OnboardingInput
  ): Promise<PlanningEnrollmentRecord> {
    const track = await this.requireActiveTrack(input.trackId);

    const existingActiveEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        trackId: input.trackId,
        status: {
          in: [PrismaEnrollmentStatus.ACTIVE, PrismaEnrollmentStatus.PAUSED]
        }
      }
    });

    if (existingActiveEnrollment !== null) {
      throw conflictError();
    }

    const lessons = await this.approvedLessonsForTrack(input, track.type);

    if (lessons.length === 0) {
      throw notFoundError();
    }

    const schedule = this.schedulingService.createSchedule(lessons, input);

    try {
      const enrollment = await this.prisma.$transaction(async (transaction) => {
        const existingDraft = await transaction.enrollment.findFirst({
          where: {
            userId,
            trackId: input.trackId,
            status: PrismaEnrollmentStatus.DRAFT
          },
          orderBy: {
            createdAt: "desc"
          }
        });

        const savedEnrollment = await this.createOrActivateEnrollment(
          transaction,
          userId,
          input,
          track.type,
          existingDraft?.id ?? null
        );

        await transaction.studyPlan.deleteMany({
          where: {
            enrollmentId: savedEnrollment.id
          }
        });

        await this.createStudyPlanSchedule(transaction, savedEnrollment.id, input, schedule);

        await this.createAuditEvent(
          transaction,
          userId,
          "ENROLLMENT_ACTIVATED",
          "enrollments",
          savedEnrollment.id
        );

        return savedEnrollment;
      });

      return mapEnrollment(enrollment);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw conflictError();
      }

      throw error;
    }
  }

  public async cancelEnrollment(
    userId: string,
    enrollmentId: string
  ): Promise<PlanningEnrollmentRecord> {
    const enrollment = await this.requireEnrollmentForUser(userId, enrollmentId);

    if (enrollment.status === PrismaEnrollmentStatus.CANCELLED) {
      return mapEnrollment(enrollment);
    }

    if (
      enrollment.status !== PrismaEnrollmentStatus.ACTIVE &&
      enrollment.status !== PrismaEnrollmentStatus.PAUSED &&
      enrollment.status !== PrismaEnrollmentStatus.DRAFT
    ) {
      throw invalidStatusError();
    }

    const cancelled = await this.prisma.$transaction((transaction) =>
      this.cancelEnrollmentInTransaction(transaction, userId, enrollment.id)
    );

    return mapEnrollment(cancelled);
  }

  public async reconfigureEnrollment(
    userId: string,
    input: ReconfigureEnrollmentInput
  ): Promise<PlanningEnrollmentRecord> {
    const currentEnrollment = await this.requireEnrollmentForUser(userId, input.enrollmentId);

    if (
      currentEnrollment.status !== PrismaEnrollmentStatus.ACTIVE &&
      currentEnrollment.status !== PrismaEnrollmentStatus.PAUSED &&
      currentEnrollment.status !== PrismaEnrollmentStatus.DRAFT
    ) {
      throw invalidStatusError();
    }

    if (currentEnrollment.trackId !== input.trackId) {
      throw validationError("trackId");
    }

    const track = await this.requireActiveTrack(input.trackId);
    const lessons = await this.approvedLessonsForTrack(input, track.type);

    if (lessons.length === 0) {
      throw notFoundError();
    }

    const schedule = this.schedulingService.createSchedule(lessons, input);

    try {
      const enrollment = await this.prisma.$transaction(async (transaction) => {
        await this.cancelEnrollmentInTransaction(transaction, userId, currentEnrollment.id);

        const savedEnrollment = await this.createOrActivateEnrollment(
          transaction,
          userId,
          input,
          track.type,
          null
        );

        await this.createStudyPlanSchedule(transaction, savedEnrollment.id, input, schedule);
        await this.createAuditEvent(
          transaction,
          userId,
          "ENROLLMENT_RECONFIGURED",
          "enrollments",
          savedEnrollment.id
        );

        return savedEnrollment;
      });

      return mapEnrollment(enrollment);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw conflictError();
      }

      throw error;
    }
  }

  public async todayDashboard(userId: string, date: Date): Promise<TodayDashboardRecord> {
    await this.markMissedTasks(userId, date);

    const todaysTasks = await this.prisma.dailyTask.findMany({
      where: {
        ...activeOwnerTaskWhere(userId),
        scheduledOn: date,
        status: {
          notIn: [
            PrismaTaskStatus.CANCELLED,
            PrismaTaskStatus.RESCHEDULED,
            PrismaTaskStatus.SKIPPED
          ]
        }
      },
      include: dailyTaskInclude,
      orderBy: {
        plannedDurationMinutes: "desc"
      }
    });
    const missedTasks = await this.prisma.dailyTask.findMany({
      where: {
        ...activeOwnerTaskWhere(userId),
        status: PrismaTaskStatus.MISSED,
        scheduledOn: {
          lt: date
        }
      },
      include: dailyTaskInclude,
      orderBy: {
        scheduledOn: "asc"
      }
    });
    const weeklyTasks = await this.prisma.dailyTask.findMany({
      where: {
        ...activeOwnerTaskWhere(userId),
        studyWeek: {
          ...activeOwnerTaskWhere(userId).studyWeek,
          startsOn: {
            lte: date
          },
          endsOn: {
            gte: date
          }
        },
        status: {
          notIn: [PrismaTaskStatus.CANCELLED, PrismaTaskStatus.SKIPPED]
        }
      }
    });
    const mappedToday = todaysTasks.map(mapDailyTask).sort(compareDailyTasksForLearner);
    const mainTask = mappedToday.find((task) => task.lesson.trackType !== "GERMAN") ?? null;
    const germanTask = mappedToday.find((task) => task.lesson.trackType === "GERMAN") ?? null;
    const plannedCount = weeklyTasks.length;
    const completedCount = weeklyTasks.filter((task) => task.status === PrismaTaskStatus.COMPLETED).length;

    return {
      date,
      tasks: mappedToday,
      mainTask,
      germanTask,
      estimatedStudyMinutes: mappedToday.reduce(
        (sum, task) => sum + task.plannedDurationMinutes,
        0
      ),
      weeklyProgress: {
        plannedCount,
        completedCount,
        weeklyCompletionPercentage:
          plannedCount === 0 ? 0 : Math.round((completedCount / plannedCount) * 100)
      },
      missedTasks: missedTasks.map(mapDailyTask)
    };
  }

  public async weeklyPlan(
    userId: string,
    weekNumber: number,
    today: Date
  ): Promise<readonly DailyTaskRecord[]> {
    await this.markMissedTasks(userId, today);

    const tasks = await this.prisma.dailyTask.findMany({
      where: {
        ...activeOwnerTaskWhere(userId),
        studyWeek: {
          ...activeOwnerTaskWhere(userId).studyWeek,
          weekNumber
        }
      },
      include: dailyTaskInclude,
      orderBy: [
        {
          scheduledOn: "asc"
        },
        {
          plannedDurationMinutes: "desc"
        }
      ]
    });

    return tasks.map(mapDailyTask);
  }

  public async dailyTask(
    userId: string,
    dailyTaskId: string,
    today: Date
  ): Promise<DailyTaskRecord> {
    await this.markMissedTasks(userId, today);
    return mapDailyTask(await this.requireTaskForUser(userId, dailyTaskId));
  }

  public async startDailyTask(userId: string, dailyTaskId: string): Promise<DailyTaskRecord> {
    const task = await this.requireTaskForUser(userId, dailyTaskId);

    if (task.status === PrismaTaskStatus.IN_PROGRESS) {
      return mapDailyTask(task);
    }

    if (task.status !== PrismaTaskStatus.PLANNED) {
      throw invalidStatusError();
    }

    const updated = await this.prisma.dailyTask.update({
      where: {
        id: dailyTaskId
      },
      data: {
        status: PrismaTaskStatus.IN_PROGRESS
      },
      include: dailyTaskInclude
    });

    return mapDailyTask(updated);
  }

  public async completeDailyTask(
    userId: string,
    input: CompleteDailyTaskInput
  ): Promise<DailyTaskRecord> {
    const task = await this.requireTaskForUser(userId, input.dailyTaskId);
    this.lessonCompletionService.assertCanComplete(task.status);

    await this.prisma.$transaction(async (transaction) => {
      const attempt = await transaction.taskAttempt.create({
        data: {
          dailyTaskId: task.id,
          userId,
          durationMinutes: input.durationMinutes,
          completionEvidence: input.completionEvidence as Prisma.InputJsonObject,
          lessonSnapshot: createLessonSnapshot(task, input)
        }
      });

      if (input.reflection !== null) {
        await transaction.reflection.create({
          data: {
            userId,
            taskAttemptId: attempt.id,
            studyWeekId: task.studyWeekId,
            visibility: PrismaReflectionVisibility.PRIVATE,
            body: input.reflection
          }
        });
      }

      await transaction.dailyTask.update({
        where: {
          id: task.id
        },
        data: {
          status: PrismaTaskStatus.COMPLETED
        }
      });

      await updateProgressSnapshot(transaction, userId, task);
      await this.createAuditEvent(
        transaction,
        userId,
        "DAILY_TASK_COMPLETED",
        "daily_tasks",
        task.id
      );
    });

    return mapDailyTask(await this.requireTaskForUser(userId, task.id));
  }

  public async proposeRecovery(
    userId: string,
    dailyTaskId: string,
    today: Date
  ): Promise<RecoveryProposalRecord> {
    await this.markMissedTasks(userId, today);
    return this.recoveryService.propose(await this.loadRecoveryContext(userId, dailyTaskId, today));
  }

  public async applyRecovery(
    userId: string,
    input: RescheduleTaskInput,
    today: Date
  ): Promise<readonly DailyTaskRecord[]> {
    await this.markMissedTasks(userId, today);
    const loaded = await this.loadRecoveryContextWithPlan(userId, input.dailyTaskId, today);
    const proposal = this.recoveryService.propose(loaded.context);
    const targetDate = input.targetDate ?? proposal.targetDate;
    assertRecoveryAvailable({
      ...proposal,
      targetDate
    });

    if (targetDate === null || !isStudyDate(targetDate, loaded.context.preferences)) {
      throw recoveryUnavailableError();
    }

    const usedMinutes = minutesByDate(loaded.context.scheduledTasks);

    if (
      !hasCapacity(
        targetDate,
        loaded.context.missedTask.plannedDurationMinutes,
        loaded.context.preferences,
        usedMinutes
      )
    ) {
      throw capacityError();
    }

    const createdTaskId = await this.prisma.$transaction(async (transaction) => {
      const week = weekForDate(loaded.enrollmentStartDate, targetDate);
      const studyWeek = await transaction.studyWeek.upsert({
        where: {
          studyPlanId_weekNumber: {
            studyPlanId: loaded.studyPlanId,
            weekNumber: week.weekNumber
          }
        },
        update: {
          startsOn: week.startsOn,
          endsOn: week.endsOn
        },
        create: {
          studyPlanId: loaded.studyPlanId,
          weekNumber: week.weekNumber,
          startsOn: week.startsOn,
          endsOn: week.endsOn
        }
      });

      await transaction.dailyTask.update({
        where: {
          id: input.dailyTaskId
        },
        data: {
          status: PrismaTaskStatus.RESCHEDULED,
          rescheduleReason: input.strategy
        }
      });

      const created = await transaction.dailyTask.create({
        data: {
          studyWeekId: studyWeek.id,
          lessonVersionId: loaded.lessonVersionId,
          scheduledOn: targetDate,
          status: PrismaTaskStatus.PLANNED,
          plannedDurationMinutes: loaded.context.missedTask.plannedDurationMinutes,
          isRequired: loaded.required,
          sourceTaskId: input.dailyTaskId,
          rescheduleReason: input.strategy
        }
      });

      await this.createAuditEvent(
        transaction,
        userId,
        "DAILY_TASK_RESCHEDULED",
        "daily_tasks",
        created.id
      );

      return created.id;
    });

    return [mapDailyTask(await this.requireTaskForUser(userId, createdTaskId))];
  }

  public async pauseEnrollment(
    userId: string,
    input: PauseEnrollmentInput
  ): Promise<PlanningEnrollmentRecord> {
    const enrollment = await this.requireEnrollmentForUser(userId, input.enrollmentId);

    const updated = await this.prisma.$transaction(async (transaction) => {
      const plan = await transaction.studyPlan.findUnique({
        where: {
          enrollmentId: enrollment.id
        }
      });

      if (plan !== null) {
        await transaction.pausePeriod.create({
          data: {
            studyPlanId: plan.id,
            startsOn: input.startsOn,
            endsOn: input.endsOn,
            reason: input.reason
          }
        });
      }

      const saved = await transaction.enrollment.update({
        where: {
          id: input.enrollmentId
        },
        data: {
          status: PrismaEnrollmentStatus.PAUSED
        },
        include: {
          track: true
        }
      });

      await this.createAuditEvent(
        transaction,
        userId,
        "ENROLLMENT_PAUSED",
        "enrollments",
        input.enrollmentId
      );

      return saved;
    });

    return mapEnrollment(updated);
  }

  public async resumeEnrollment(
    userId: string,
    enrollmentId: string
  ): Promise<PlanningEnrollmentRecord> {
    await this.requireEnrollmentForUser(userId, enrollmentId);
    const updated = await this.prisma.enrollment.update({
      where: {
        id: enrollmentId
      },
      data: {
        status: PrismaEnrollmentStatus.ACTIVE
      },
      include: {
        track: true
      }
    });
    await this.prisma.auditEvent.create({
      data: {
        actorUserId: userId,
        eventType: "ENROLLMENT_RESUMED",
        entityType: "enrollments",
        entityId: enrollmentId,
        safeMetadata: {}
      }
    });

    return mapEnrollment(updated);
  }

  private async requireActiveTrack(trackId: string): Promise<PrismaLearningTrack> {
    const track = await this.prisma.learningTrack.findFirst({
      where: {
        id: trackId,
        active: true
      }
    });

    if (track === null) {
      throw notFoundError();
    }

    return track;
  }

  private async createOrActivateEnrollment(
    transaction: Prisma.TransactionClient,
    userId: string,
    input: OnboardingInput,
    trackType: PrismaTrackType,
    existingDraftEnrollmentId: string | null
  ): Promise<PrismaEnrollmentWithTrack> {
    const data = {
      status: PrismaEnrollmentStatus.ACTIVE,
      startDate: input.startDate,
      targetOutcome: input.targetOutcome,
      experienceLevel: input.experienceLevel,
      learningPreferences: enrollmentPreferencesForTrack(trackType, input) ?? Prisma.DbNull
    } as const;

    if (existingDraftEnrollmentId !== null) {
      return transaction.enrollment.update({
        where: {
          id: existingDraftEnrollmentId
        },
        data,
        include: {
          track: true
        }
      });
    }

    return transaction.enrollment.create({
      data: {
        userId,
        trackId: input.trackId,
        ...data
      },
      include: {
        track: true
      }
    });
  }

  private async createStudyPlanSchedule(
    transaction: Prisma.TransactionClient,
    enrollmentId: string,
    input: OnboardingInput,
    schedule: ScheduleDraft
  ): Promise<void> {
    const studyPlan = await transaction.studyPlan.create({
      data: {
        enrollmentId,
        studyDays: [...input.studyDays],
        availableMinutesByDay: stringifyDayKeys(input.availableMinutesByDay),
        assessmentDay: input.assessmentDay,
        recoveryDay: input.recoveryDay,
        preferredSessionTime: toTimeDate(input.preferredSessionTime),
        pausePeriods: {
          create: input.pausePeriods.map((pausePeriod) => ({
            startsOn: pausePeriod.startsOn,
            endsOn: pausePeriod.endsOn,
            reason: pausePeriod.reason
          }))
        }
      }
    });
    const weekIdsByNumber = new Map<number, string>();

    for (const week of schedule.weeks) {
      const savedWeek = await transaction.studyWeek.create({
        data: {
          studyPlanId: studyPlan.id,
          weekNumber: week.weekNumber,
          startsOn: week.startsOn,
          endsOn: week.endsOn
        }
      });
      weekIdsByNumber.set(week.weekNumber, savedWeek.id);
    }

    for (const task of schedule.tasks) {
      const studyWeekId = weekIdsByNumber.get(task.weekNumber);

      if (studyWeekId === undefined) {
        throw new Error("Study week was not created for scheduled task.");
      }

      await transaction.dailyTask.create({
        data: {
          studyWeekId,
          lessonVersionId: task.lessonVersionId,
          scheduledOn: task.scheduledOn,
          status: PrismaTaskStatus.PLANNED,
          plannedDurationMinutes: task.plannedDurationMinutes,
          isRequired: task.required
        }
      });
    }
  }

  private async cancelEnrollmentInTransaction(
    transaction: Prisma.TransactionClient,
    userId: string,
    enrollmentId: string
  ): Promise<PrismaEnrollmentWithTrack> {
    await transaction.dailyTask.updateMany({
      where: {
        studyWeek: {
          studyPlan: {
            enrollmentId
          }
        },
        status: {
          in: [
            PrismaTaskStatus.PLANNED,
            PrismaTaskStatus.IN_PROGRESS,
            PrismaTaskStatus.MISSED
          ]
        }
      },
      data: {
        status: PrismaTaskStatus.CANCELLED,
        rescheduleReason: "ENROLLMENT_CANCELLED"
      }
    });

    const cancelled = await transaction.enrollment.update({
      where: {
        id: enrollmentId
      },
      data: {
        status: PrismaEnrollmentStatus.CANCELLED
      },
      include: {
        track: true
      }
    });

    await this.createAuditEvent(
      transaction,
      userId,
      "ENROLLMENT_CANCELLED",
      "enrollments",
      enrollmentId
    );

    return cancelled;
  }

  private async approvedLessonsForTrack(
    input: OnboardingInput,
    trackType: PrismaTrackType
  ): Promise<readonly ApprovedLessonForScheduling[]> {
    const lessons = await this.prisma.lesson.findMany({
      where: {
        module: {
          trackId: input.trackId
        },
        versions: {
          some: {
            status: PrismaContentStatus.APPROVED
          }
        }
      },
      include: {
        module: {
          include: {
            track: true
          }
        },
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
      },
      orderBy: [
        {
          module: {
            sequence: "asc"
          }
        },
        {
          sequence: "asc"
        }
      ]
    });

    const mappedLessons = lessons
      .map((lesson) => mapApprovedLesson(lesson))
      .filter((lesson): lesson is ApprovedLessonForScheduling => lesson !== null);

    return filterLessonsForEnrollment(mappedLessons, input, trackType);
  }

  private async markMissedTasks(userId: string, today: Date): Promise<void> {
    const tasks = await this.prisma.dailyTask.findMany({
      where: {
        ...activeOwnerTaskWhere(userId),
        scheduledOn: {
          lt: today
        },
        status: {
          in: [PrismaTaskStatus.PLANNED, PrismaTaskStatus.IN_PROGRESS]
        }
      },
      select: {
        id: true
      }
    });

    if (tasks.length === 0) {
      return;
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.dailyTask.updateMany({
        where: {
          id: {
            in: tasks.map((task) => task.id)
          }
        },
        data: {
          status: PrismaTaskStatus.MISSED
        }
      });

      await transaction.auditEvent.createMany({
        data: tasks.map((task) => ({
          actorUserId: userId,
          eventType: "DAILY_TASK_MISSED",
          entityType: "daily_tasks",
          entityId: task.id,
          safeMetadata: {}
        }))
      });
    });
  }

  private async requireTaskForUser(
    userId: string,
    dailyTaskId: string
  ): Promise<PrismaDailyTaskWithLesson> {
    const task = await this.prisma.dailyTask.findFirst({
      where: {
        id: dailyTaskId,
        studyWeek: {
          studyPlan: {
            enrollment: {
              userId
            }
          }
        }
      },
      include: dailyTaskInclude
    });

    if (task === null) {
      throw notFoundError();
    }

    return task;
  }

  private async requireEnrollmentForUser(
    userId: string,
    enrollmentId: string
  ): Promise<PrismaEnrollmentWithTrack> {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        userId
      },
      include: {
        track: true
      }
    });

    if (enrollment === null) {
      throw notFoundError();
    }

    return enrollment;
  }

  private async loadRecoveryContext(
    userId: string,
    dailyTaskId: string,
    today: Date
  ): Promise<RecoveryPlanContext> {
    return (await this.loadRecoveryContextWithPlan(userId, dailyTaskId, today)).context;
  }

  private async loadRecoveryContextWithPlan(
    userId: string,
    dailyTaskId: string,
    today: Date
  ): Promise<LoadedRecoveryContext> {
    const task = await this.requireTaskForUser(userId, dailyTaskId);

    if (task.status !== PrismaTaskStatus.MISSED) {
      throw invalidStatusError();
    }

    const plan = task.studyWeek.studyPlan;
    const scheduledTasks = await this.prisma.dailyTask.findMany({
      where: {
        studyWeek: {
          studyPlanId: plan.id
        }
      }
    });
    const preferences = mapPlanPreferences(plan);

    return {
      context: {
        preferences,
        today,
        missedTask: {
          id: task.id,
          scheduledOn: task.scheduledOn,
          status: task.status,
          plannedDurationMinutes: task.plannedDurationMinutes
        },
        scheduledTasks: scheduledTasks.map((scheduledTask) => ({
          id: scheduledTask.id,
          scheduledOn: scheduledTask.scheduledOn,
          status: scheduledTask.status,
          plannedDurationMinutes: scheduledTask.plannedDurationMinutes
        }))
      },
      studyPlanId: plan.id,
      enrollmentStartDate: plan.enrollment.startDate,
      lessonVersionId: task.lessonVersionId,
      required: task.isRequired
    };
  }

  private async createAuditEvent(
    transaction: Prisma.TransactionClient,
    actorUserId: string,
    eventType: string,
    entityType: string,
    entityId: string
  ): Promise<void> {
    await transaction.auditEvent.create({
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

const dailyTaskInclude = {
  studyWeek: {
    include: {
      studyPlan: {
        include: {
          pausePeriods: true,
          enrollment: {
            include: {
              track: true
            }
          }
        }
      }
    }
  },
  lessonVersion: {
    include: {
      resources: true,
      exercises: true,
      knowledgeChecks: true,
      lesson: {
        include: {
          prerequisites: {
            include: {
              prerequisiteLesson: true
            }
          },
          module: {
            include: {
              track: true
            }
          }
        }
      }
    }
  }
} as const;

function activeOwnerTaskWhere(userId: string) {
  return {
    studyWeek: {
      studyPlan: {
        enrollment: {
          userId,
          status: PrismaEnrollmentStatus.ACTIVE
        }
      }
    }
  } as const;
}

function mapApprovedLesson(lesson: PrismaLessonForSchedule): ApprovedLessonForScheduling | null {
  const version = lesson.versions[0];

  if (version === undefined) {
    return null;
  }

  return {
    lessonId: lesson.id,
    lessonVersionId: version.id,
    moduleSequence: lesson.module.sequence,
    lessonSequence: lesson.sequence,
    trackType: lesson.module.track.type,
    trackTitle: lesson.module.track.title,
    moduleTitle: lesson.module.title,
    title: version.title,
    learningObjective: version.learningObjective,
    outcomes: toStringArray(version.outcomes),
    explanationMarkdown: version.explanationMd,
    relevanceMarkdown: version.relevanceMd,
    examples: toStringArray(version.examples),
    commonMistakes: toStringArray(version.commonMistakes),
    assessmentTags: [...version.assessmentTags],
    durationMinutes: lesson.defaultDurationMinutes,
    required: lesson.required,
    prerequisiteLessonIds: lesson.prerequisites.map(
      (prerequisite) => prerequisite.prerequisiteLesson.id
    ),
    resources: version.resources.map(mapResource),
    exercises: version.exercises.map(mapExercise),
    knowledgeChecks: version.knowledgeChecks.map(mapKnowledgeCheck)
  };
}

function mapDailyTask(task: PrismaDailyTaskWithLesson): DailyTaskRecord {
  const version = task.lessonVersion;
  const firstExercise = version.exercises[0];

  if (firstExercise === undefined) {
    throw new Error("Scheduled lessons require at least one exercise.");
  }

  const guidedExercise =
    version.exercises.find((exercise) => exercise.kind === "guided") ?? firstExercise;
  const independentExercise =
    version.exercises.find((exercise) => exercise.kind === "independent") ?? firstExercise;

  return {
    id: task.id,
    studyWeekId: task.studyWeekId,
    scheduledOn: task.scheduledOn,
    status: task.status,
    plannedDurationMinutes: task.plannedDurationMinutes,
    required: task.isRequired,
    lesson: {
      lessonVersionId: version.id,
      title: version.title,
      moduleTitle: version.lesson.module.title,
      trackTitle: version.lesson.module.track.title,
      trackType: version.lesson.module.track.type,
      difficulty: version.lesson.difficulty,
      learningObjective: version.learningObjective,
      outcomes: toStringArray(version.outcomes),
      explanationMarkdown: version.explanationMd,
      businessRelevanceMarkdown: version.relevanceMd,
      examples: toStringArray(version.examples),
      commonMistakes: toStringArray(version.commonMistakes),
      assessmentTags: [...version.assessmentTags],
      resources: version.resources.map(mapResource),
      guidedExercise: mapExercise(guidedExercise),
      independentExercise: mapExercise(independentExercise),
      knowledgeChecks: version.knowledgeChecks.map(mapKnowledgeCheck)
    },
    rescheduleReason: task.rescheduleReason,
    studyWeekNumber: task.studyWeek.weekNumber
  };
}

function compareDailyTasksForLearner(left: DailyTaskRecord, right: DailyTaskRecord): number {
  return (
    left.lesson.trackTitle.localeCompare(right.lesson.trackTitle) ||
    left.lesson.moduleTitle.localeCompare(right.lesson.moduleTitle) ||
    left.lesson.title.localeCompare(right.lesson.title)
  );
}

function mapEnrollment(enrollment: PrismaEnrollmentWithTrack): PlanningEnrollmentRecord {
  return {
    id: enrollment.id,
    userId: enrollment.userId,
    status: enrollment.status,
    track: {
      id: enrollment.track.id,
      slug: enrollment.track.slug,
      type: enrollment.track.type,
      title: enrollment.track.title,
      description: enrollment.track.description,
      active: enrollment.track.active,
      modules: []
    },
    startDate: enrollment.startDate,
    targetOutcome: enrollment.targetOutcome,
    experienceLevel: enrollment.experienceLevel,
    ...germanEnrollmentFields(enrollment.learningPreferences)
  };
}

function filterLessonsForEnrollment(
  lessons: readonly ApprovedLessonForScheduling[],
  input: OnboardingInput,
  trackType: PrismaTrackType
): readonly ApprovedLessonForScheduling[] {
  if (trackType !== PrismaTrackType.GERMAN) {
    return lessons;
  }

  if (
    input.germanStartLevel === null ||
    input.germanTargetLevel === null ||
    input.germanSessionDurationMinutes === null
  ) {
    throw validationError("germanStartLevel");
  }

  const startLevel = normalizedGermanStartLevel(input.germanStartLevel);
  const targetLevel = input.germanTargetLevel;

  const sessionDurationMinutes = input.germanSessionDurationMinutes;

  return lessons
    .filter((lesson) => {
      const level = germanLevelFromDifficulty(lesson.title, lesson.moduleTitle);

      if (level === null) {
        return false;
      }

      return compareGermanLevels(level, startLevel) >= 0 && compareGermanLevels(level, targetLevel) <= 0;
    })
    .map((lesson) => ({
      ...lesson,
      durationMinutes: sessionDurationMinutes
    }));
}

function enrollmentPreferencesForTrack(
  trackType: PrismaTrackType,
  input: OnboardingInput
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
  PlanningEnrollmentRecord,
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

const germanLevelOrder = ["A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B1.2", "B2.1", "B2.2"] as const;

function normalizedGermanStartLevel(level: GermanLevel): Exclude<GermanLevel, "COMPLETE_BEGINNER"> {
  return level === "COMPLETE_BEGINNER" ? "A1.1" : level;
}

function germanLevelFromDifficulty(
  title: string,
  moduleTitle: string
): Exclude<GermanLevel, "COMPLETE_BEGINNER"> | null {
  const source = `${moduleTitle} ${title}`;
  return germanLevelOrder.find((level) => source.includes(level)) ?? null;
}

function compareGermanLevels(
  left: Exclude<GermanLevel, "COMPLETE_BEGINNER">,
  right: Exclude<GermanLevel, "COMPLETE_BEGINNER">
): number {
  return germanLevelOrder.indexOf(left) - germanLevelOrder.indexOf(right);
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
    value === "B2.2"
  );
}

function isGermanTargetLevel(value: unknown): value is Exclude<GermanLevel, "COMPLETE_BEGINNER"> {
  return isGermanLevel(value) && value !== "COMPLETE_BEGINNER";
}

function isGermanSessionDuration(value: unknown): value is 30 | 45 | 60 | 90 {
  return value === 30 || value === 45 || value === 60 || value === 90;
}

function mapPlanPreferences(plan: PrismaStudyPlan & {
  readonly pausePeriods: readonly PrismaPausePeriod[];
  readonly enrollment: PrismaEnrollment;
}): PlanPreferences {
  return {
    startDate: plan.enrollment.startDate,
    studyDays: [...plan.studyDays],
    availableMinutesByDay: parseAvailableMinutes(plan.availableMinutesByDay),
    assessmentDay: plan.assessmentDay,
    recoveryDay: plan.recoveryDay,
    pausePeriods: plan.pausePeriods.map((pausePeriod) => ({
      startsOn: pausePeriod.startsOn,
      endsOn: pausePeriod.endsOn,
      reason: pausePeriod.reason
    }))
  };
}

function mapResource(resource: PrismaResource) {
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

function mapExercise(exercise: PrismaExercise) {
  return {
    id: exercise.id,
    kind: exercise.kind,
    promptMarkdown: exercise.promptMd,
    expectedEvidence: exercise.expectedEvidence,
    solutionNotesMarkdown: exercise.solutionNotesMd
  };
}

function mapKnowledgeCheck(knowledgeCheck: PrismaKnowledgeCheck) {
  return {
    id: knowledgeCheck.id,
    question: knowledgeCheck.question,
    answerKey: toStringArray(knowledgeCheck.answerKey),
    explanation: knowledgeCheck.explanation
  };
}

function toStringArray(value: Prisma.JsonValue): readonly string[] {
  if (Array.isArray(value) && value.every((item): item is string => typeof item === "string")) {
    return value;
  }

  throw new Error("Expected string array JSON.");
}

function stringifyDayKeys(value: Readonly<Record<number, number>>): Prisma.InputJsonObject {
  return Object.fromEntries(
    Object.entries(value).map(([day, minutes]) => [String(day), minutes])
  ) as Prisma.InputJsonObject;
}

function parseAvailableMinutes(value: Prisma.JsonValue): Readonly<Record<number, number>> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Study plan availability must be a JSON object.");
  }

  return Object.fromEntries(
    Object.entries(value).map(([day, minutes]) => {
      if (typeof minutes !== "number") {
        throw new Error("Study plan availability values must be numbers.");
      }

      return [Number(day), minutes];
    })
  );
}

function toTimeDate(value: string | null): Date | null {
  if (value === null) {
    return null;
  }

  return new Date(`1970-01-01T${value.length === 5 ? `${value}:00` : value}.000Z`);
}

function minutesByDate(tasks: readonly ExistingScheduledTask[]): ReadonlyMap<string, number> {
  const minutes = new Map<string, number>();

  for (const task of tasks) {
    if (task.status === "CANCELLED" || task.status === "RESCHEDULED" || task.status === "SKIPPED") {
      continue;
    }

    minutes.set(dateKey(task.scheduledOn), (minutes.get(dateKey(task.scheduledOn)) ?? 0) + task.plannedDurationMinutes);
  }

  return minutes;
}

function createLessonSnapshot(
  task: PrismaDailyTaskWithLesson,
  input: CompleteDailyTaskInput
): Prisma.InputJsonObject {
  const lessonVersion = task.lessonVersion;

  return {
    trackTitle: lessonVersion.lesson.module.track.title,
    trackType: lessonVersion.lesson.module.track.type,
    moduleTitle: lessonVersion.lesson.module.title,
    lessonId: lessonVersion.lesson.id,
    lessonTitle: lessonVersion.title,
    lessonVersionId: lessonVersion.id,
    lessonVersion: lessonVersion.version,
    learningObjective: lessonVersion.learningObjective,
    outcomes: toStringArray(lessonVersion.outcomes),
    estimatedDurationMinutes: task.plannedDurationMinutes,
    actualDurationMinutes: input.durationMinutes,
    required: task.isRequired,
    assessmentTags: [...lessonVersion.assessmentTags],
    scheduledOn: dateKey(task.scheduledOn),
    statusAtCompletion: PrismaTaskStatus.COMPLETED,
    completionEvidenceKeys: Object.keys(input.completionEvidence)
  };
}

async function updateProgressSnapshot(
  transaction: Prisma.TransactionClient,
  userId: string,
  task: PrismaDailyTaskWithLesson
): Promise<void> {
  const enrollmentId = task.studyWeek.studyPlan.enrollment.id;
  const weekTasks = await transaction.dailyTask.findMany({
    where: {
      studyWeekId: task.studyWeekId,
      status: {
        notIn: [PrismaTaskStatus.CANCELLED, PrismaTaskStatus.SKIPPED]
      }
    }
  });
  const allEnrollmentTasks = await transaction.dailyTask.findMany({
    where: {
      studyWeek: {
        studyPlanId: task.studyWeek.studyPlanId
      },
      status: {
        notIn: [PrismaTaskStatus.CANCELLED, PrismaTaskStatus.SKIPPED]
      }
    }
  });
  const plannedCount = weekTasks.length;
  const completedCount = weekTasks.filter(
    (weekTask) => weekTask.id === task.id || weekTask.status === PrismaTaskStatus.COMPLETED
  ).length;
  const totalPlanned = allEnrollmentTasks.length;
  const totalCompleted = allEnrollmentTasks.filter(
    (enrollmentTask) =>
      enrollmentTask.id === task.id || enrollmentTask.status === PrismaTaskStatus.COMPLETED
  ).length;
  const weeklyCompletionPercentage = percentage(completedCount, plannedCount);
  const overallProgressPercentage = percentage(totalCompleted, totalPlanned);

  await transaction.progressSnapshot.upsert({
    where: {
      userId_enrollmentId_studyWeekId: {
        userId,
        enrollmentId,
        studyWeekId: task.studyWeekId
      }
    },
    update: {
      plannedCount,
      completedCount,
      weeklyCompletionPercentage,
      overallProgressPercentage,
      currentStreak: completedCount,
      assessmentCompleted: false
    },
    create: {
      userId,
      enrollmentId,
      studyWeekId: task.studyWeekId,
      plannedCount,
      completedCount,
      weeklyCompletionPercentage,
      overallProgressPercentage,
      currentStreak: completedCount,
      assessmentCompleted: false
    }
  });
}

function percentage(completedCount: number, plannedCount: number): number {
  if (plannedCount === 0) {
    return 0;
  }

  return Math.round((completedCount / plannedCount) * 10000) / 100;
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
    code: "VALIDATION_FAILED",
    message: apiErrorMessages.VALIDATION_FAILED,
    retryable: false,
    field: "status"
  });
}

function capacityError(): Error {
  return createApiGraphqlError({
    code: "PLAN_CAPACITY_EXCEEDED",
    message: apiErrorMessages.PLAN_CAPACITY_EXCEEDED,
    retryable: false,
    field: "targetDate"
  });
}

function recoveryUnavailableError(): Error {
  return createApiGraphqlError({
    code: "RECOVERY_NOT_AVAILABLE",
    message: apiErrorMessages.RECOVERY_NOT_AVAILABLE,
    retryable: false
  });
}
