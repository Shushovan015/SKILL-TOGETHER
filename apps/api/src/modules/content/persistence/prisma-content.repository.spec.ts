import { describe, expect, it } from "vitest";

import { PrismaService } from "../../../prisma/prisma.service.js";
import { PrismaContentRepository } from "./prisma-content.repository.js";

type FakeTrackType = "SOFTWARE_ENGINEERING" | "GERMAN";
type FakeEnrollmentStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

interface FakeTrack {
  readonly id: string;
  readonly slug: string;
  readonly type: FakeTrackType;
  readonly title: string;
  readonly description: string;
  readonly active: boolean;
  readonly modules: readonly [];
}

interface FakeEnrollment {
  readonly id: string;
  readonly userId: string;
  readonly trackId: string;
  readonly status: FakeEnrollmentStatus;
  readonly startDate: Date;
  readonly targetOutcome: string;
  readonly experienceLevel: string;
  readonly learningPreferences: unknown;
  readonly createdAt: Date;
  readonly track: FakeTrack;
}

interface EnrollmentWhere {
  readonly id?: string;
  readonly userId?: string;
  readonly trackId?: string;
  readonly status?: FakeEnrollmentStatus | { readonly in: readonly FakeEnrollmentStatus[] };
}

interface EnrollmentCreateArgs {
  readonly data: {
    readonly userId: string;
    readonly trackId: string;
    readonly status: FakeEnrollmentStatus;
    readonly startDate: Date;
    readonly targetOutcome: string;
    readonly experienceLevel: string;
    readonly learningPreferences: unknown;
  };
}

interface EnrollmentUpdateArgs {
  readonly where: {
    readonly id: string;
  };
  readonly data: {
    readonly status?: FakeEnrollmentStatus;
    readonly startDate?: Date;
    readonly targetOutcome?: string;
    readonly experienceLevel?: string;
    readonly learningPreferences?: unknown;
  };
}

describe("PrismaContentRepository enrollment uniqueness", () => {
  it("returns simultaneous active enrollments for different tracks and rejects duplicate active track enrollment", async () => {
    const userId = "user-a";
    const repository = new PrismaContentRepository(
      createPrismaStub([
        {
          userId,
          trackId: "software",
          status: "ACTIVE",
          learningPreferences: null
        },
        {
          userId,
          trackId: "german",
          status: "ACTIVE",
          learningPreferences: {
            german: {
              startLevel: "COMPLETE_BEGINNER",
              targetLevel: "A1.2",
              sessionDurationMinutes: 60
            }
          }
        }
      ])
    );

    const enrollments = await repository.listEnrollmentsForUser(userId);

    expect(enrollments).toHaveLength(2);
    expect(enrollments.map((enrollment) => enrollment.track.title).sort()).toEqual([
      "German",
      "Software Engineering"
    ]);

    await expect(
      repository.selectLearningTrack(userId, {
        trackId: "software",
        startDate: new Date("2026-08-10T00:00:00.000Z"),
        experienceLevel: "JavaScript Frontend Developer - TypeScript New",
        targetOutcome: "Try duplicate software enrollment.",
        germanStartLevel: null,
        germanTargetLevel: null,
        germanSessionDurationMinutes: null
      })
    ).rejects.toMatchObject({
      extensions: {
        code: "CONFLICT"
      }
    });
  });
});

function createPrismaStub(
  initialEnrollments: readonly {
    readonly userId: string;
    readonly trackId: string;
    readonly status: FakeEnrollmentStatus;
    readonly learningPreferences: unknown;
  }[] = []
): PrismaService {
  const tracks = [
    createTrack({
      id: "software",
      slug: "software-engineering",
      title: "Software Engineering",
      type: "SOFTWARE_ENGINEERING"
    }),
    createTrack({
      id: "german",
      slug: "german",
      title: "German",
      type: "GERMAN"
    })
  ];
  const enrollments: FakeEnrollment[] = initialEnrollments.map((enrollment, index) =>
    createEnrollment({
      id: `initial-enrollment-${index + 1}`,
      data: {
        userId: enrollment.userId,
        trackId: enrollment.trackId,
        status: enrollment.status,
        startDate: new Date("2026-08-10T00:00:00.000Z"),
        targetOutcome: "Initial active enrollment",
        experienceLevel: enrollment.trackId === "german" ? "COMPLETE_BEGINNER" : "Beginner",
        learningPreferences: enrollment.learningPreferences
      },
      track: requireTrack(tracks, enrollment.trackId),
      createdAt: new Date(`2026-08-10T00:00:0${index + 1}.000Z`)
    })
  );
  let nextEnrollmentId = 1;

  return {
    dailyTask: {
      findMany: async (): Promise<readonly []> => []
    },
    learningTrack: {
      findFirst: async (args: {
        readonly where: { readonly id?: string; readonly active?: boolean };
      }): Promise<FakeTrack | null> =>
        tracks.find(
          (track) =>
            (args.where.id === undefined || track.id === args.where.id) &&
            (args.where.active === undefined || track.active === args.where.active)
        ) ?? null
    },
    enrollment: {
      findMany: async (args: { readonly where: EnrollmentWhere }): Promise<readonly FakeEnrollment[]> =>
        enrollments.filter((enrollment) => matchesEnrollmentWhere(enrollment, args.where)),
      findFirst: async (args: { readonly where: EnrollmentWhere }): Promise<FakeEnrollment | null> =>
        enrollments.find((enrollment) => matchesEnrollmentWhere(enrollment, args.where)) ?? null,
      create: async (args: EnrollmentCreateArgs): Promise<FakeEnrollment> => {
        const enrollment = createEnrollment({
          id: `enrollment-${nextEnrollmentId}`,
          data: args.data,
          track: requireTrack(tracks, args.data.trackId),
          createdAt: new Date(`2026-08-10T00:00:0${nextEnrollmentId}.000Z`)
        });
        nextEnrollmentId += 1;
        enrollments.push(enrollment);
        return enrollment;
      },
      update: async (args: EnrollmentUpdateArgs): Promise<FakeEnrollment> => {
        const currentIndex = enrollments.findIndex((enrollment) => enrollment.id === args.where.id);
        const current = enrollments[currentIndex];

        if (current === undefined) {
          throw new Error("Enrollment not found in test stub");
        }

        const updated = {
          ...current,
          ...args.data,
          learningPreferences:
            args.data.learningPreferences === undefined
              ? current.learningPreferences
              : normalizeLearningPreferences(args.data.learningPreferences)
        };
        enrollments[currentIndex] = updated;
        return updated;
      }
    }
  } as unknown as PrismaService;
}

function createTrack(input: {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly type: FakeTrackType;
}): FakeTrack {
  return {
    id: input.id,
    slug: input.slug,
    type: input.type,
    title: input.title,
    description: `${input.title} description`,
    active: true,
    modules: []
  };
}

function createEnrollment(input: {
  readonly id: string;
  readonly data: EnrollmentCreateArgs["data"];
  readonly track: FakeTrack;
  readonly createdAt: Date;
}): FakeEnrollment {
  return {
    id: input.id,
    userId: input.data.userId,
    trackId: input.data.trackId,
    status: input.data.status,
    startDate: input.data.startDate,
    targetOutcome: input.data.targetOutcome,
    experienceLevel: input.data.experienceLevel,
    learningPreferences: normalizeLearningPreferences(input.data.learningPreferences),
    createdAt: input.createdAt,
    track: input.track
  };
}

function matchesEnrollmentWhere(enrollment: FakeEnrollment, where: EnrollmentWhere): boolean {
  return (
    (where.id === undefined || enrollment.id === where.id) &&
    (where.userId === undefined || enrollment.userId === where.userId) &&
    (where.trackId === undefined || enrollment.trackId === where.trackId) &&
    (where.status === undefined || matchesEnrollmentStatus(enrollment.status, where.status))
  );
}

function matchesEnrollmentStatus(
  status: FakeEnrollmentStatus,
  expected: NonNullable<EnrollmentWhere["status"]>
): boolean {
  if (typeof expected === "string") {
    return status === expected;
  }

  return expected.in.includes(status);
}

function normalizeLearningPreferences(value: unknown): unknown {
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "german" in value
  ) {
    return value;
  }

  return null;
}

function requireTrack(tracks: readonly FakeTrack[], trackId: string): FakeTrack {
  const track = tracks.find((candidate) => candidate.id === trackId);

  if (track === undefined) {
    throw new Error("Track not found in test stub");
  }

  return track;
}
