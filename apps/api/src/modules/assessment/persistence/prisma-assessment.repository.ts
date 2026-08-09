import type {
  Answer as PrismaAnswer,
  Assessment as PrismaAssessment,
  AssessmentAttempt as PrismaAssessmentAttempt,
  AssessmentVersion as PrismaAssessmentVersion,
  DailyTask as PrismaDailyTask,
  Exercise as PrismaExercise,
  KnowledgeCheck as PrismaKnowledgeCheck,
  LearningModule as PrismaLearningModule,
  LearningTrack as PrismaLearningTrack,
  Lesson as PrismaLesson,
  LessonPrerequisite as PrismaLessonPrerequisite,
  LessonVersion as PrismaLessonVersion,
  PausePeriod as PrismaPausePeriod,
  Question as PrismaQuestion,
  Resource as PrismaResource,
  StudyPlan as PrismaStudyPlan,
  StudyWeek as PrismaStudyWeek
} from "../../../generated/prisma/client.js";
import {
  AssessmentAttemptStatus as PrismaAssessmentAttemptStatus,
  ContentStatus as PrismaContentStatus,
  EnrollmentStatus as PrismaEnrollmentStatus,
  Prisma,
  QuestionType as PrismaQuestionType,
  TaskStatus as PrismaTaskStatus
} from "../../../generated/prisma/client.js";
import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import type { JsonValue } from "../../../common/graphql/json.scalar.js";
import { PrismaService } from "../../../prisma/prisma.service.js";
import type { DailyTaskRecord } from "../../planning/domain/planning.types.js";
import { AssessmentEligibilityService } from "../domain/eligibility.service.js";
import { AssessmentScoringService } from "../domain/scoring.service.js";
import { WeakTopicService } from "../domain/weak-topic.service.js";
import type {
  AssessmentAttemptRecord,
  AssessmentAttemptStatus,
  AssessmentQuestionRecord,
  AssessmentResultRecord,
  QuestionType,
  SubmitAssessmentInput
} from "../domain/assessment.types.js";
import type { AssessmentRepository } from "./assessment.repository.js";

interface PrismaAssessmentVersionWithQuestions extends PrismaAssessmentVersion {
  readonly assessment: PrismaAssessment;
  readonly questions: readonly PrismaQuestion[];
}

interface PrismaAttemptWithRelations extends PrismaAssessmentAttempt {
  readonly studyWeek: PrismaStudyWeek & {
    readonly studyPlan: PrismaStudyPlan & {
      readonly pausePeriods: readonly PrismaPausePeriod[];
      readonly enrollment: {
        readonly id: string;
        readonly userId: string;
        readonly status: PrismaEnrollmentStatus;
        readonly trackId: string;
      };
    };
  };
  readonly assessmentVersion: PrismaAssessmentVersionWithQuestions;
  readonly answers: readonly (PrismaAnswer & {
    readonly question: PrismaQuestion;
  })[];
}

interface PrismaDailyTaskWithLesson extends PrismaDailyTask {
  readonly studyWeek: PrismaStudyWeek & {
    readonly studyPlan: PrismaStudyPlan & {
      readonly pausePeriods: readonly PrismaPausePeriod[];
      readonly enrollment: {
        readonly id: string;
        readonly userId: string;
        readonly status: PrismaEnrollmentStatus;
        readonly track: PrismaLearningTrack;
      };
    };
  };
  readonly lessonVersion: PrismaLessonVersion & {
    readonly resources: readonly PrismaResource[];
    readonly exercises: readonly PrismaExercise[];
    readonly knowledgeChecks: readonly PrismaKnowledgeCheck[];
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

interface EligibleWeek {
  readonly id: string;
  readonly weekNumber: number;
  readonly completedTags: readonly string[];
  readonly assessmentVersion: PrismaAssessmentVersionWithQuestions;
}

interface AttemptSnapshot {
  readonly assessmentVersionId: string;
  readonly questionIds: readonly string[];
  readonly passingPercentage: number;
  readonly maxRetakes: number;
  readonly selectedTags: readonly string[];
  readonly source: string;
}

const assessmentType = "WEEKLY";
const defaultMaxRetakes = 1;
const defaultPassingPercentage = 70;
const maxQuestionCount = 5;
const objectiveSeedSource = "phase-06-reviewed-seed";

export class PrismaAssessmentRepository implements AssessmentRepository {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly eligibilityService: AssessmentEligibilityService,
    private readonly scoringService: AssessmentScoringService,
    private readonly weakTopicService: WeakTopicService
  ) {}

  public async seedReviewedQuestions(): Promise<void> {
    const tracks = await this.prisma.learningTrack.findMany({
      where: {
        active: true
      },
      orderBy: {
        title: "asc"
      }
    });

    for (const track of tracks) {
      const tags = await this.approvedAssessmentTags(track.id);

      if (tags.length === 0) {
        continue;
      }

      const assessment = await this.prisma.assessment.upsert({
        where: {
          trackId_type: {
            trackId: track.id,
            type: assessmentType
          }
        },
        update: {
          title: `${track.title} Weekly Assessment`,
          type: assessmentType
        },
        create: {
          trackId: track.id,
          title: `${track.title} Weekly Assessment`,
          type: assessmentType
        }
      });

      const version = await this.prisma.assessmentVersion.upsert({
        where: {
          assessmentId_version: {
            assessmentId: assessment.id,
            version: 1
          }
        },
        update: {
          status: PrismaContentStatus.REVIEWED,
          passingPercentage: defaultPassingPercentage,
          rules: {
            maxRetakes: defaultMaxRetakes,
            selection: "completed-week-tags",
            source: objectiveSeedSource
          }
        },
        create: {
          assessmentId: assessment.id,
          version: 1,
          status: PrismaContentStatus.REVIEWED,
          passingPercentage: defaultPassingPercentage,
          rules: {
            maxRetakes: defaultMaxRetakes,
            selection: "completed-week-tags",
            source: objectiveSeedSource
          }
        }
      });

      for (const tag of tags) {
        await this.prisma.question.upsert({
          where: {
            assessmentVersionId_promptMd: {
              assessmentVersionId: version.id,
              promptMd: questionPrompt(tag)
            }
          },
          update: {
            type: PrismaQuestionType.MULTIPLE_CHOICE,
            options: questionOptions(tag),
            answerKey: "target",
            points: 1,
            assessmentTags: [tag],
            gradingMode: "AUTO"
          },
          create: {
            assessmentVersionId: version.id,
            type: PrismaQuestionType.MULTIPLE_CHOICE,
            promptMd: questionPrompt(tag),
            options: questionOptions(tag),
            answerKey: "target",
            points: 1,
            assessmentTags: [tag],
            gradingMode: "AUTO"
          }
        });
      }
    }
  }

  public async weeklyAssessment(userId: string, studyWeekId: string): Promise<AssessmentAttemptRecord> {
    await this.requireEligibleWeek(userId, studyWeekId);
    const attempt = await this.findLatestAttempt(userId, studyWeekId);

    if (attempt === null) {
      throw assessmentNotEligibleError();
    }

    return this.mapAttempt(attempt);
  }

  public async startWeeklyAssessment(
    userId: string,
    studyWeekId: string
  ): Promise<AssessmentAttemptRecord> {
    const eligibleWeek = await this.requireEligibleWeek(userId, studyWeekId);
    const attempts = await this.prisma.assessmentAttempt.findMany({
      where: {
        userId,
        studyWeekId,
        assessmentVersionId: eligibleWeek.assessmentVersion.id
      },
      include: attemptInclude,
      orderBy: {
        attemptNumber: "desc"
      }
    });
    const attemptStatuses = attempts.map((attempt) => attempt.status as AssessmentAttemptStatus);
    const activeAttempt = this.eligibilityService.hasActiveAttempt(attemptStatuses)
      ? attempts.find(
          (attempt) =>
            attempt.status === PrismaAssessmentAttemptStatus.NOT_STARTED ||
            attempt.status === PrismaAssessmentAttemptStatus.IN_PROGRESS
        )
      : undefined;

    if (activeAttempt !== undefined) {
      return this.mapAttempt(activeAttempt);
    }

    const maxAttempts = readMaxAttempts(eligibleWeek.assessmentVersion.rules);

    if (!this.eligibilityService.canCreateAttempt(attemptStatuses, maxAttempts)) {
      throw assessmentNotEligibleError();
    }

    const questions = selectQuestions(eligibleWeek.assessmentVersion.questions, eligibleWeek.completedTags);

    if (questions.length === 0) {
      throw assessmentNotEligibleError();
    }

    const snapshot: AttemptSnapshot = {
      assessmentVersionId: eligibleWeek.assessmentVersion.id,
      questionIds: questions.map((question) => question.id),
      passingPercentage: decimalToNumber(eligibleWeek.assessmentVersion.passingPercentage) ?? defaultPassingPercentage,
      maxRetakes: maxAttempts - 1,
      selectedTags: [...eligibleWeek.completedTags],
      source: objectiveSeedSource
    };

    const created = await this.prisma.assessmentAttempt.create({
      data: {
        userId,
        studyWeekId,
        assessmentVersionId: eligibleWeek.assessmentVersion.id,
        attemptNumber: attempts.length + 1,
        status: PrismaAssessmentAttemptStatus.IN_PROGRESS,
        assessmentSnapshot: snapshot as unknown as Prisma.InputJsonObject
      },
      include: attemptInclude
    });

    await this.prisma.auditEvent.create({
      data: {
        actorUserId: userId,
        eventType: "ASSESSMENT_ATTEMPT_STARTED",
        entityType: "assessment_attempts",
        entityId: created.id,
        safeMetadata: {}
      }
    });

    return this.mapAttempt(created);
  }

  public async submitAssessment(
    userId: string,
    input: SubmitAssessmentInput
  ): Promise<AssessmentAttemptRecord> {
    const attempt = await this.findAttemptForUser(userId, input.attemptId);

    if (attempt === null) {
      throw notFoundError();
    }

    if (
      attempt.status !== PrismaAssessmentAttemptStatus.NOT_STARTED &&
      attempt.status !== PrismaAssessmentAttemptStatus.IN_PROGRESS
    ) {
      throw alreadySubmittedError();
    }

    const questions = questionsForAttempt(attempt);
    const answersByQuestionId = new Map(input.answers.map((answer) => [answer.questionId, answer]));

    if (
      questions.length === 0 ||
      answersByQuestionId.size !== questions.length ||
      questions.some((question) => !answersByQuestionId.has(question.id))
    ) {
      throw invalidAnswerError();
    }

    const scoredAnswers = questions.map((question) => {
      const answer = answersByQuestionId.get(question.id);

      if (answer === undefined) {
        throw invalidAnswerError();
      }

      const scored = this.scoringService.score(
        {
          type: question.type as QuestionType,
          answerKey: toJsonValue(question.answerKey),
          points: question.points,
          assessmentTags: [...question.assessmentTags]
        },
        answer.response
      );

      return {
        question,
        answer,
        scored
      };
    });
    const manualPending = scoredAnswers.some((answer) => !answer.scored.autoScored);
    const scoreEarned = scoredAnswers.reduce(
      (total, answer) => total + (answer.scored.score ?? 0),
      0
    );
    const scorePossible = scoredAnswers.reduce((total, answer) => total + answer.question.points, 0);
    const percentage =
      scorePossible === 0 ? 0 : Math.round((scoreEarned / scorePossible) * 10_000) / 100;
    const passingPercentage = readPassingPercentage(attempt.assessmentSnapshot);
    const passed = manualPending ? null : percentage >= passingPercentage;
    const nextStatus = manualPending
      ? PrismaAssessmentAttemptStatus.NEEDS_MANUAL_GRADING
      : passed
        ? PrismaAssessmentAttemptStatus.PASSED
        : PrismaAssessmentAttemptStatus.FAILED;
    const now = new Date();

    await this.prisma.$transaction(async (transaction) => {
      for (const scoredAnswer of scoredAnswers) {
        await transaction.answer.upsert({
          where: {
            assessmentAttemptId_questionId: {
              assessmentAttemptId: attempt.id,
              questionId: scoredAnswer.question.id
            }
          },
          update: {
            response: toPrismaJson(scoredAnswer.answer.response),
            questionSnapshot: questionSnapshot(scoredAnswer.question) as unknown as Prisma.InputJsonObject,
            score: scoredAnswer.scored.score,
            feedback: scoredAnswer.scored.feedback,
            graderType: scoredAnswer.scored.autoScored ? "AUTO" : "MANUAL"
          },
          create: {
            assessmentAttemptId: attempt.id,
            questionId: scoredAnswer.question.id,
            response: toPrismaJson(scoredAnswer.answer.response),
            questionSnapshot: questionSnapshot(scoredAnswer.question) as unknown as Prisma.InputJsonObject,
            score: scoredAnswer.scored.score,
            feedback: scoredAnswer.scored.feedback,
            graderType: scoredAnswer.scored.autoScored ? "AUTO" : "MANUAL"
          }
        });
      }

      await transaction.assessmentAttempt.update({
        where: {
          id: attempt.id
        },
        data: {
          status: nextStatus,
          submittedAt: now,
          gradedAt: manualPending ? null : now,
          scoreEarned,
          scorePossible,
          percentage,
          passed
        }
      });

      await transaction.progressSnapshot.updateMany({
        where: {
          userId,
          enrollmentId: attempt.studyWeek.studyPlan.enrollment.id,
          studyWeekId: attempt.studyWeekId
        },
        data: {
          assessmentCompleted: true
        }
      });

      await transaction.auditEvent.create({
        data: {
          actorUserId: userId,
          eventType: "ASSESSMENT_ATTEMPT_SUBMITTED",
          entityType: "assessment_attempts",
          entityId: attempt.id,
          safeMetadata: {
            status: nextStatus,
            scorePossible
          }
        }
      });
    });

    const updated = await this.findAttemptForUser(userId, attempt.id);

    if (updated === null) {
      throw notFoundError();
    }

    return this.mapAttempt(updated);
  }

  public async assessmentResult(userId: string, attemptId: string): Promise<AssessmentResultRecord> {
    const attempt = await this.findAttemptForUser(userId, attemptId);

    if (attempt === null) {
      throw notFoundError();
    }

    const result = await this.buildResult(attempt);

    if (result === null) {
      throw assessmentNotEligibleError();
    }

    return {
      attemptId: attempt.id,
      status: attempt.status,
      ...result
    };
  }

  private async approvedAssessmentTags(trackId: string): Promise<readonly string[]> {
    const versions = await this.prisma.lessonVersion.findMany({
      where: {
        status: PrismaContentStatus.APPROVED,
        lesson: {
          module: {
            trackId
          }
        }
      },
      select: {
        assessmentTags: true
      },
      orderBy: [
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
        }
      ]
    });
    const tags = new Set<string>();

    for (const version of versions) {
      for (const tag of version.assessmentTags) {
        tags.add(tag);
      }
    }

    return [...tags];
  }

  private async requireEligibleWeek(userId: string, studyWeekId: string): Promise<EligibleWeek> {
    const studyWeek = await this.prisma.studyWeek.findFirst({
      where: {
        id: studyWeekId,
        studyPlan: {
          enrollment: {
            userId,
            status: PrismaEnrollmentStatus.ACTIVE
          }
        }
      },
      include: {
        studyPlan: {
          include: {
            enrollment: {
              include: {
                track: true
              }
            }
          }
        },
        dailyTasks: {
          where: {
            isRequired: true,
            status: PrismaTaskStatus.COMPLETED,
            lessonVersion: {
              status: PrismaContentStatus.APPROVED
            }
          },
          include: {
            lessonVersion: true
          },
          orderBy: {
            scheduledOn: "asc"
          }
        }
      }
    });

    if (studyWeek === null) {
      throw notFoundError();
    }

    if (studyWeek.dailyTasks.length === 0) {
      throw assessmentNotEligibleError();
    }

    const assessmentVersion =
      (await this.findAssessmentVersion(studyWeek.studyPlan.enrollment.trackId)) ??
      (await this.seedAndFindAssessmentVersion(studyWeek.studyPlan.enrollment.trackId));

    if (assessmentVersion === null || assessmentVersion.questions.length === 0) {
      throw assessmentNotEligibleError();
    }

    return {
      id: studyWeek.id,
      weekNumber: studyWeek.weekNumber,
      completedTags: uniqueTags(
        studyWeek.dailyTasks.flatMap((task) => [...task.lessonVersion.assessmentTags])
      ),
      assessmentVersion
    };
  }

  private async findAssessmentVersion(
    trackId: string
  ): Promise<PrismaAssessmentVersionWithQuestions | null> {
    const versions = await this.prisma.assessmentVersion.findMany({
      where: {
        status: {
          in: [PrismaContentStatus.APPROVED, PrismaContentStatus.REVIEWED]
        },
        assessment: {
          trackId,
          type: assessmentType
        }
      },
      include: assessmentVersionInclude,
      orderBy: {
        version: "desc"
      }
    });

    return versions.find((version) => version.status === PrismaContentStatus.APPROVED) ?? versions[0] ?? null;
  }

  private async seedAndFindAssessmentVersion(
    trackId: string
  ): Promise<PrismaAssessmentVersionWithQuestions | null> {
    await this.seedReviewedQuestions();
    return this.findAssessmentVersion(trackId);
  }

  private async findLatestAttempt(
    userId: string,
    studyWeekId: string
  ): Promise<PrismaAttemptWithRelations | null> {
    return this.prisma.assessmentAttempt.findFirst({
      where: {
        userId,
        studyWeekId
      },
      include: attemptInclude,
      orderBy: {
        attemptNumber: "desc"
      }
    });
  }

  private async findAttemptForUser(
    userId: string,
    attemptId: string
  ): Promise<PrismaAttemptWithRelations | null> {
    return this.prisma.assessmentAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
        studyWeek: {
          studyPlan: {
            enrollment: {
              userId
            }
          }
        }
      },
      include: attemptInclude
    });
  }

  private async mapAttempt(attempt: PrismaAttemptWithRelations): Promise<AssessmentAttemptRecord> {
    return {
      id: attempt.id,
      studyWeekId: attempt.studyWeekId,
      studyWeekNumber: attempt.studyWeek.weekNumber,
      attemptNumber: attempt.attemptNumber,
      status: attempt.status,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      gradedAt: attempt.gradedAt,
      questions: questionsForAttempt(attempt).map(mapQuestion),
      result: await this.buildResult(attempt)
    };
  }

  private async buildResult(
    attempt: PrismaAttemptWithRelations
  ): Promise<AssessmentAttemptRecord["result"]> {
    if (attempt.submittedAt === null) {
      return null;
    }

    const weakTopics = this.weakTopicService.weakTopics(
      attempt.answers.map((answer) => ({
        tags: [...answer.question.assessmentTags],
        score: decimalToNumber(answer.score),
        points: answer.question.points
      }))
    );

    return {
      scoreEarned: decimalToNumber(attempt.scoreEarned),
      scorePossible: decimalToNumber(attempt.scorePossible),
      percentage: decimalToNumber(attempt.percentage),
      passed: attempt.passed,
      weakTopics,
      revisionRecommendations: await this.revisionRecommendations(
        attempt.userId,
        attempt.studyWeekId,
        weakTopics
      )
    };
  }

  private async revisionRecommendations(
    userId: string,
    studyWeekId: string,
    weakTopics: readonly string[]
  ): Promise<readonly DailyTaskRecord[]> {
    if (weakTopics.length === 0) {
      return [];
    }

    const tasks = await this.prisma.dailyTask.findMany({
      where: {
        studyWeekId,
        studyWeek: {
          studyPlan: {
            enrollment: {
              userId
            }
          }
        },
        lessonVersion: {
          assessmentTags: {
            hasSome: [...weakTopics]
          }
        }
      },
      include: dailyTaskInclude,
      orderBy: {
        scheduledOn: "asc"
      }
    });

    return tasks.map(mapDailyTask);
  }
}

const assessmentVersionInclude = {
  assessment: true,
  questions: {
    orderBy: {
      promptMd: "asc"
    }
  }
} as const;

const attemptInclude = {
  studyWeek: {
    include: {
      studyPlan: {
        include: {
          pausePeriods: true,
          enrollment: true
        }
      }
    }
  },
  assessmentVersion: {
    include: assessmentVersionInclude
  },
  answers: {
    include: {
      question: true
    }
  }
} as const;

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

function selectQuestions(
  questions: readonly PrismaQuestion[],
  completedTags: readonly string[]
): readonly PrismaQuestion[] {
  const completedTagSet = new Set(completedTags);
  const taggedQuestions = questions.filter((question) =>
    question.assessmentTags.some((tag) => completedTagSet.has(tag))
  );
  const selected = taggedQuestions.length === 0 ? questions : taggedQuestions;

  return [...selected]
    .sort((left, right) => left.promptMd.localeCompare(right.promptMd))
    .slice(0, maxQuestionCount);
}

function questionsForAttempt(attempt: PrismaAttemptWithRelations): readonly PrismaQuestion[] {
  const snapshot = parseAttemptSnapshot(attempt.assessmentSnapshot);
  const questionIds = snapshot?.questionIds ?? [];

  if (questionIds.length === 0) {
    return attempt.assessmentVersion.questions;
  }

  const questionsById = new Map(
    attempt.assessmentVersion.questions.map((question) => [question.id, question])
  );

  return questionIds
    .map((questionId) => questionsById.get(questionId))
    .filter((question): question is PrismaQuestion => question !== undefined);
}

function parseAttemptSnapshot(value: Prisma.JsonValue): AttemptSnapshot | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const questionIds = value["questionIds"];
  const passingPercentage = value["passingPercentage"];
  const maxRetakes = value["maxRetakes"];
  const selectedTags = value["selectedTags"];
  const assessmentVersionId = value["assessmentVersionId"];
  const source = value["source"];

  if (
    !Array.isArray(questionIds) ||
    !questionIds.every((item): item is string => typeof item === "string") ||
    typeof passingPercentage !== "number" ||
    typeof maxRetakes !== "number" ||
    !Array.isArray(selectedTags) ||
    !selectedTags.every((item): item is string => typeof item === "string") ||
    typeof assessmentVersionId !== "string" ||
    typeof source !== "string"
  ) {
    return null;
  }

  return {
    assessmentVersionId,
    questionIds,
    passingPercentage,
    maxRetakes,
    selectedTags,
    source
  };
}

function readMaxAttempts(value: Prisma.JsonValue): number {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return defaultMaxRetakes + 1;
  }

  const maxRetakes = value["maxRetakes"];

  return typeof maxRetakes === "number" && Number.isInteger(maxRetakes) && maxRetakes >= 0
    ? maxRetakes + 1
    : defaultMaxRetakes + 1;
}

function readPassingPercentage(value: Prisma.JsonValue): number {
  const snapshot = parseAttemptSnapshot(value);
  return snapshot?.passingPercentage ?? defaultPassingPercentage;
}

function questionPrompt(tag: string): string {
  return `Which weekly topic does "${humanizeTag(tag)}" represent?`;
}

function questionOptions(tag: string): Prisma.InputJsonArray {
  return [
    {
      id: "target",
      label: humanizeTag(tag)
    },
    {
      id: "unrelated",
      label: "Unrelated review topic"
    }
  ];
}

function humanizeTag(tag: string): string {
  return tag
    .split("-")
    .filter((part) => part.length > 0)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function mapQuestion(question: PrismaQuestion): AssessmentQuestionRecord {
  return {
    id: question.id,
    type: question.type,
    promptMarkdown: question.promptMd,
    options: question.options === null ? null : toJsonValue(question.options),
    points: question.points,
    assessmentTags: [...question.assessmentTags]
  };
}

function questionSnapshot(question: PrismaQuestion): JsonValue {
  return {
    id: question.id,
    type: question.type,
    promptMarkdown: question.promptMd,
    options: question.options === null ? null : toJsonValue(question.options),
    points: question.points,
    assessmentTags: [...question.assessmentTags]
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

function mapResource(resource: PrismaResource) {
  return {
    id: resource.id,
    title: resource.title,
    url: resource.url,
    resourceType: resource.resourceType,
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

function uniqueTags(tags: readonly string[]): readonly string[] {
  return [...new Set(tags)].sort((left, right) => left.localeCompare(right));
}

function toStringArray(value: Prisma.JsonValue): readonly string[] {
  if (Array.isArray(value) && value.every((item): item is string => typeof item === "string")) {
    return value;
  }

  throw new Error("Expected string array JSON.");
}

function toJsonValue(value: Prisma.JsonValue): JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(toJsonValue);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, nestedValue]) =>
        nestedValue === undefined ? [] : [[key, toJsonValue(nestedValue)]]
      )
    );
  }

  throw new Error("Expected JSON value.");
}

function toPrismaJson(value: JsonValue): Prisma.InputJsonValue | Prisma.JsonNullValueInput {
  return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

function decimalToNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  if (typeof value === "object" && "toNumber" in value) {
    const decimal = value as { readonly toNumber: () => number };
    return decimal.toNumber();
  }

  return null;
}

function notFoundError(): Error {
  return createApiGraphqlError({
    code: "NOT_FOUND",
    message: apiErrorMessages.NOT_FOUND,
    retryable: false
  });
}

function assessmentNotEligibleError(): Error {
  return createApiGraphqlError({
    code: "ASSESSMENT_NOT_ELIGIBLE",
    message: apiErrorMessages.ASSESSMENT_NOT_ELIGIBLE,
    retryable: false
  });
}

function invalidAnswerError(): Error {
  return createApiGraphqlError({
    code: "ASSESSMENT_INVALID_ANSWER",
    message: apiErrorMessages.ASSESSMENT_INVALID_ANSWER,
    retryable: false,
    field: "answers"
  });
}

function alreadySubmittedError(): Error {
  return createApiGraphqlError({
    code: "ASSESSMENT_ALREADY_SUBMITTED",
    message: apiErrorMessages.ASSESSMENT_ALREADY_SUBMITTED,
    retryable: false
  });
}
