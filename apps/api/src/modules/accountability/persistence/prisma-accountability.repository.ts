import type {
  PartnerConnection as PrismaPartnerConnection,
  PartnerInvitation as PrismaPartnerInvitation,
  ProgressSnapshot as PrismaProgressSnapshot,
  User as PrismaUser,
  UserProfile as PrismaUserProfile
} from "../../../generated/prisma/client.js";
import {
  InvitationStatus as PrismaInvitationStatus,
  Prisma
} from "../../../generated/prisma/client.js";
import { apiErrorMessages, createApiGraphqlError } from "../../../common/errors/graphql-errors.js";
import { PrismaService } from "../../../prisma/prisma.service.js";
import { InvitationTokenService } from "../domain/invitation-token.service.js";
import {
  PartnerVisibilityService,
  type ProgressSnapshotForSharing
} from "../domain/partner-visibility.service.js";
import type {
  InvitePartnerInput,
  PartnerConnectionRecord,
  PartnerDashboardRecord,
  PartnerInvitationRecord,
  PartnerProgressRecord
} from "../domain/accountability.types.js";
import type { AccountabilityRepository } from "./accountability.repository.js";

interface PrismaInvitationWithInviter extends PrismaPartnerInvitation {
  readonly inviter: PrismaUser & {
    readonly profile: PrismaUserProfile | null;
  };
}

interface PrismaConnectionWithUsers extends PrismaPartnerConnection {
  readonly userA: PrismaUser & {
    readonly profile: PrismaUserProfile | null;
  };
  readonly userB: PrismaUser & {
    readonly profile: PrismaUserProfile | null;
  };
}

const invitationTtlMs = 7 * 24 * 60 * 60 * 1000;

export class PrismaAccountabilityRepository implements AccountabilityRepository {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: InvitationTokenService,
    private readonly visibilityService: PartnerVisibilityService
  ) {}

  public async dashboard(userId: string, userEmail: string): Promise<PartnerDashboardRecord> {
    const [invitations, connections, progress] = await Promise.all([
      this.partnerInvitations(userId, userEmail),
      this.partnerConnections(userId),
      this.partnerProgress(userId)
    ]);

    return {
      invitations,
      connections,
      progress
    };
  }

  public async partnerInvitations(
    userId: string,
    userEmail: string
  ): Promise<readonly PartnerInvitationRecord[]> {
    await this.expireVisiblePendingInvitations(userId, userEmail);
    const invitations = (await this.prisma.partnerInvitation.findMany({
      where: visibleInvitationWhere(userId, userEmail),
      include: invitationInclude,
      orderBy: {
        createdAt: "desc"
      }
    })) as readonly PrismaInvitationWithInviter[];

    return invitations.map((invitation) => mapInvitation(invitation, userId));
  }

  public async partnerConnections(userId: string): Promise<readonly PartnerConnectionRecord[]> {
    const connections = (await this.prisma.partnerConnection.findMany({
      where: activeConnectionWhere(userId),
      include: connectionInclude,
      orderBy: {
        createdAt: "desc"
      }
    })) as readonly PrismaConnectionWithUsers[];

    return connections.map((connection) => mapConnection(connection, userId));
  }

  public async partnerProgress(userId: string): Promise<readonly PartnerProgressRecord[]> {
    const connections = (await this.prisma.partnerConnection.findMany({
      where: activeConnectionWhere(userId),
      include: connectionInclude,
      orderBy: {
        createdAt: "desc"
      }
    })) as readonly PrismaConnectionWithUsers[];

    return Promise.all(
      connections.map(async (connection) => {
        const partner = partnerUser(connection, userId);
        const snapshot = await this.prisma.progressSnapshot.findFirst({
          where: {
            userId: partner.id
          },
          orderBy: {
            updatedAt: "desc"
          }
        });

        return this.visibilityService.toSharedProgress(
          snapshot === null ? null : mapSnapshot(snapshot, partnerDisplayName(partner)),
          {
            id: partner.id,
            displayName: partnerDisplayName(partner)
          }
        );
      })
    );
  }

  public async invitePartner(
    userId: string,
    userEmail: string,
    input: InvitePartnerInput
  ): Promise<PartnerInvitationRecord> {
    if (input.email === userEmail) {
      throw validationError("email");
    }

    await this.expirePendingInvitationsFromInviter(userId, input.email);
    const invitee = await this.prisma.user.findUnique({
      where: {
        email: input.email
      },
      select: {
        id: true
      }
    });

    if (invitee !== null) {
      if (await this.hasBlockBetween(userId, invitee.id)) {
        throw blockedError();
      }

      if (await this.hasActiveConnection(userId, invitee.id)) {
        throw conflictError();
      }
    }

    const existing = await this.prisma.partnerInvitation.findFirst({
      where: {
        inviterId: userId,
        inviteeEmail: input.email,
        status: PrismaInvitationStatus.PENDING
      }
    });

    if (existing !== null) {
      throw invitationExistsError();
    }

    try {
      const invitation = (await this.prisma.partnerInvitation.create({
        data: {
          inviterId: userId,
          inviteeEmail: input.email,
          inviteeUserId: invitee?.id ?? null,
          tokenHash: this.tokenService.hashToken(this.tokenService.createRawToken()),
          expiresAt: new Date(Date.now() + invitationTtlMs)
        },
        include: invitationInclude
      })) as PrismaInvitationWithInviter;

      return mapInvitation(invitation, userId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw invitationExistsError();
      }

      throw error;
    }
  }

  public async acceptInvitation(
    userId: string,
    userEmail: string,
    invitationId: string
  ): Promise<PartnerInvitationRecord> {
    const invitation = await this.findInvitationForInvitee(userId, userEmail, invitationId);

    if (invitation === null) {
      throw notFoundError();
    }

    if (invitation.status !== PrismaInvitationStatus.PENDING) {
      throw notFoundError();
    }

    if (invitation.expiresAt < new Date()) {
      await this.markInvitationExpired(invitation.id);
      throw expiredError();
    }

    if (await this.hasBlockBetween(userId, invitation.inviterId)) {
      throw blockedError();
    }

    const [userAId, userBId] = canonicalPair(userId, invitation.inviterId);
    const accepted = await this.prisma.$transaction(async (transaction) => {
      const connection = await transaction.partnerConnection.upsert({
        where: {
          userAId_userBId: {
            userAId,
            userBId
          }
        },
        update: {
          status: "ACTIVE",
          removedAt: null,
          sharingSettings: defaultSharingSettings()
        },
        create: {
          userAId,
          userBId,
          status: "ACTIVE",
          sharingSettings: defaultSharingSettings()
        }
      });

      await transaction.partnerInvitation.update({
        where: {
          id: invitation.id
        },
        data: {
          status: PrismaInvitationStatus.ACCEPTED,
          inviteeUserId: userId,
          respondedAt: new Date()
        }
      });

      await transaction.auditEvent.createMany({
        data: [
          {
            actorUserId: userId,
            eventType: "PARTNER_INVITATION_ACCEPTED",
            entityType: "partner_invitations",
            entityId: invitation.id,
            safeMetadata: {}
          },
          {
            actorUserId: userId,
            eventType: "PARTNER_CONNECTION_CREATED",
            entityType: "partner_connections",
            entityId: connection.id,
            safeMetadata: {}
          }
        ]
      });

      return connection.id;
    });

    await this.revokeDuplicatePendingInvitations(userId, invitation.inviterId, accepted);

    return this.requireVisibleInvitation(userId, userEmail, invitation.id);
  }

  public async rejectInvitation(
    userId: string,
    userEmail: string,
    invitationId: string
  ): Promise<PartnerInvitationRecord> {
    const invitation = await this.findInvitationForInvitee(userId, userEmail, invitationId);

    if (invitation === null) {
      throw notFoundError();
    }

    if (invitation.status !== PrismaInvitationStatus.PENDING) {
      throw notFoundError();
    }

    if (invitation.expiresAt < new Date()) {
      await this.markInvitationExpired(invitation.id);
      throw expiredError();
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.partnerInvitation.update({
        where: {
          id: invitation.id
        },
        data: {
          status: PrismaInvitationStatus.REJECTED,
          respondedAt: new Date()
        }
      });

      await transaction.auditEvent.create({
        data: {
          actorUserId: userId,
          eventType: "PARTNER_INVITATION_REJECTED",
          entityType: "partner_invitations",
          entityId: invitation.id,
          safeMetadata: {}
        }
      });
    });

    return this.requireVisibleInvitation(userId, userEmail, invitation.id);
  }

  public async revokeInvitation(
    userId: string,
    invitationId: string
  ): Promise<PartnerInvitationRecord> {
    const invitation = (await this.prisma.partnerInvitation.findFirst({
      where: {
        id: invitationId,
        inviterId: userId
      },
      include: invitationInclude
    })) as PrismaInvitationWithInviter | null;

    if (invitation === null) {
      throw notFoundError();
    }

    if (invitation.status !== PrismaInvitationStatus.PENDING) {
      throw notFoundError();
    }

    if (invitation.expiresAt < new Date()) {
      await this.markInvitationExpired(invitation.id);
      throw expiredError();
    }

    await this.prisma.partnerInvitation.update({
      where: {
        id: invitation.id
      },
      data: {
        status: PrismaInvitationStatus.REVOKED,
        respondedAt: new Date()
      }
    });

    return this.requireVisibleInvitation(userId, invitation.inviteeEmail, invitation.id);
  }

  public async removeConnection(userId: string, connectionId: string): Promise<boolean> {
    const connection = await this.prisma.partnerConnection.findFirst({
      where: {
        id: connectionId,
        ...activeConnectionWhere(userId)
      }
    });

    if (connection === null) {
      throw connectionNotFoundError();
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.partnerConnection.update({
        where: {
          id: connection.id
        },
        data: {
          status: "REMOVED",
          removedAt: new Date()
        }
      });

      await transaction.auditEvent.create({
        data: {
          actorUserId: userId,
          eventType: "PARTNER_CONNECTION_REMOVED",
          entityType: "partner_connections",
          entityId: connection.id,
          safeMetadata: {}
        }
      });
    });

    return true;
  }

  public async blockUser(
    userId: string,
    userEmail: string,
    blockedUserId: string
  ): Promise<boolean> {
    if (userId === blockedUserId) {
      throw validationError("userId");
    }

    const blockedUser = await this.prisma.user.findUnique({
      where: {
        id: blockedUserId
      },
      select: {
        id: true,
        email: true
      }
    });

    if (blockedUser === null) {
      throw notFoundError();
    }

    const [userAId, userBId] = canonicalPair(userId, blockedUserId);

    await this.prisma.$transaction(async (transaction) => {
      await transaction.blockedUser.upsert({
        where: {
          blockerId_blockedUserId: {
            blockerId: userId,
            blockedUserId
          }
        },
        update: {},
        create: {
          blockerId: userId,
          blockedUserId
        }
      });

      await transaction.partnerInvitation.updateMany({
        where: {
          status: PrismaInvitationStatus.PENDING,
          OR: [
            {
              inviterId: blockedUserId,
              inviteeUserId: userId
            },
            {
              inviterId: blockedUserId,
              inviteeEmail: userEmail
            },
            {
              inviterId: userId,
              inviteeUserId: blockedUserId
            },
            {
              inviterId: userId,
              inviteeEmail: blockedUser.email
            }
          ]
        },
        data: {
          status: PrismaInvitationStatus.REVOKED,
          respondedAt: new Date()
        }
      });

      await transaction.partnerConnection.updateMany({
        where: {
          userAId,
          userBId,
          status: "ACTIVE",
          removedAt: null
        },
        data: {
          status: "REMOVED",
          removedAt: new Date()
        }
      });

      await transaction.auditEvent.create({
        data: {
          actorUserId: userId,
          eventType: "PARTNER_USER_BLOCKED",
          entityType: "blocked_users",
          entityId: blockedUserId,
          safeMetadata: {}
        }
      });
    });

    return true;
  }

  private async findInvitationForInvitee(
    userId: string,
    userEmail: string,
    invitationId: string
  ): Promise<PrismaInvitationWithInviter | null> {
    return (await this.prisma.partnerInvitation.findFirst({
      where: {
        id: invitationId,
        OR: [
          {
            inviteeUserId: userId
          },
          {
            inviteeEmail: userEmail
          }
        ]
      },
      include: invitationInclude
    })) as PrismaInvitationWithInviter | null;
  }

  private async requireVisibleInvitation(
    userId: string,
    userEmail: string,
    invitationId: string
  ): Promise<PartnerInvitationRecord> {
    const invitation = (await this.prisma.partnerInvitation.findFirst({
      where: {
        id: invitationId,
        ...visibleInvitationWhere(userId, userEmail)
      },
      include: invitationInclude
    })) as PrismaInvitationWithInviter | null;

    if (invitation === null) {
      throw notFoundError();
    }

    return mapInvitation(invitation, userId);
  }

  private async markInvitationExpired(invitationId: string): Promise<void> {
    await this.prisma.partnerInvitation.update({
      where: {
        id: invitationId
      },
      data: {
        status: PrismaInvitationStatus.EXPIRED,
        respondedAt: new Date()
      }
    });
  }

  private async expireVisiblePendingInvitations(userId: string, userEmail: string): Promise<void> {
    await this.prisma.partnerInvitation.updateMany({
      where: {
        ...visibleInvitationWhere(userId, userEmail),
        status: PrismaInvitationStatus.PENDING,
        expiresAt: {
          lt: new Date()
        }
      },
      data: {
        status: PrismaInvitationStatus.EXPIRED,
        respondedAt: new Date()
      }
    });
  }

  private async expirePendingInvitationsFromInviter(
    inviterId: string,
    inviteeEmail: string
  ): Promise<void> {
    await this.prisma.partnerInvitation.updateMany({
      where: {
        inviterId,
        inviteeEmail,
        status: PrismaInvitationStatus.PENDING,
        expiresAt: {
          lt: new Date()
        }
      },
      data: {
        status: PrismaInvitationStatus.EXPIRED,
        respondedAt: new Date()
      }
    });
  }

  private async revokeDuplicatePendingInvitations(
    userId: string,
    partnerUserId: string,
    acceptedConnectionId: string
  ): Promise<void> {
    await this.prisma.partnerInvitation.updateMany({
      where: {
        status: PrismaInvitationStatus.PENDING,
        OR: [
          {
            inviterId: userId,
            inviteeUserId: partnerUserId
          },
          {
            inviterId: partnerUserId,
            inviteeUserId: userId
          }
        ]
      },
      data: {
        status: PrismaInvitationStatus.REVOKED,
        respondedAt: new Date()
      }
    });

    await this.prisma.auditEvent.create({
      data: {
        actorUserId: userId,
        eventType: "PARTNER_DUPLICATE_INVITATIONS_REVOKED",
        entityType: "partner_connections",
        entityId: acceptedConnectionId,
        safeMetadata: {}
      }
    });
  }

  private async hasBlockBetween(leftUserId: string, rightUserId: string): Promise<boolean> {
    const block = await this.prisma.blockedUser.findFirst({
      where: {
        OR: [
          {
            blockerId: leftUserId,
            blockedUserId: rightUserId
          },
          {
            blockerId: rightUserId,
            blockedUserId: leftUserId
          }
        ]
      },
      select: {
        blockerId: true
      }
    });

    return block !== null;
  }

  private async hasActiveConnection(leftUserId: string, rightUserId: string): Promise<boolean> {
    const [userAId, userBId] = canonicalPair(leftUserId, rightUserId);
    const connection = await this.prisma.partnerConnection.findFirst({
      where: {
        userAId,
        userBId,
        status: "ACTIVE",
        removedAt: null
      },
      select: {
        id: true
      }
    });

    return connection !== null;
  }
}

const invitationInclude = {
  inviter: {
    include: {
      profile: true
    }
  }
} as const;

const connectionInclude = {
  userA: {
    include: {
      profile: true
    }
  },
  userB: {
    include: {
      profile: true
    }
  }
} as const;

function visibleInvitationWhere(userId: string, userEmail: string): Prisma.PartnerInvitationWhereInput {
  return {
    OR: [
      {
        inviterId: userId
      },
      {
        inviteeUserId: userId
      },
      {
        inviteeEmail: userEmail
      }
    ]
  };
}

function activeConnectionWhere(userId: string): Prisma.PartnerConnectionWhereInput {
  return {
    status: "ACTIVE",
    removedAt: null,
    OR: [
      {
        userAId: userId
      },
      {
        userBId: userId
      }
    ]
  };
}

function mapInvitation(
  invitation: PrismaInvitationWithInviter,
  currentUserId: string
): PartnerInvitationRecord {
  return {
    id: invitation.id,
    inviterDisplayName: partnerDisplayName(invitation.inviter),
    inviteeEmail: invitation.inviteeEmail,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
    direction: invitation.inviterId === currentUserId ? "SENT" : "RECEIVED"
  };
}

function mapConnection(
  connection: PrismaConnectionWithUsers,
  currentUserId: string
): PartnerConnectionRecord {
  const partner = partnerUser(connection, currentUserId);

  return {
    id: connection.id,
    partnerUserId: partner.id,
    partnerDisplayName: partnerDisplayName(partner),
    status: connection.status,
    createdAt: connection.createdAt
  };
}

function partnerUser(connection: PrismaConnectionWithUsers, currentUserId: string) {
  return connection.userAId === currentUserId ? connection.userB : connection.userA;
}

function partnerDisplayName(user: PrismaUser & { readonly profile: PrismaUserProfile | null }): string {
  return user.profile?.displayName ?? "Learner";
}

function mapSnapshot(
  snapshot: PrismaProgressSnapshot,
  displayName: string
): ProgressSnapshotForSharing {
  return {
    userId: snapshot.userId,
    displayName,
    plannedCount: snapshot.plannedCount,
    completedCount: snapshot.completedCount,
    weeklyCompletionPercentage: decimalToNumber(snapshot.weeklyCompletionPercentage),
    currentStreak: snapshot.currentStreak,
    assessmentCompleted: snapshot.assessmentCompleted,
    overallProgressPercentage: decimalToNumber(snapshot.overallProgressPercentage)
  };
}

function canonicalPair(leftUserId: string, rightUserId: string): readonly [string, string] {
  return leftUserId.localeCompare(rightUserId) <= 0
    ? [leftUserId, rightUserId]
    : [rightUserId, leftUserId];
}

function defaultSharingSettings(): Prisma.InputJsonObject {
  return {
    progress: true,
    reflections: "partner_visible_only"
  };
}

function decimalToNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  if (typeof value === "object" && value !== null && "toNumber" in value) {
    const decimal = value as { readonly toNumber: () => number };
    return decimal.toNumber();
  }

  return 0;
}

function validationError(field: string): Error {
  return createApiGraphqlError({
    code: "VALIDATION_FAILED",
    message: apiErrorMessages.VALIDATION_FAILED,
    retryable: false,
    field
  });
}

function invitationExistsError(): Error {
  return createApiGraphqlError({
    code: "PARTNER_INVITATION_EXISTS",
    message: apiErrorMessages.PARTNER_INVITATION_EXISTS,
    retryable: false
  });
}

function expiredError(): Error {
  return createApiGraphqlError({
    code: "PARTNER_INVITATION_EXPIRED",
    message: apiErrorMessages.PARTNER_INVITATION_EXPIRED,
    retryable: false
  });
}

function connectionNotFoundError(): Error {
  return createApiGraphqlError({
    code: "PARTNER_CONNECTION_NOT_FOUND",
    message: apiErrorMessages.PARTNER_CONNECTION_NOT_FOUND,
    retryable: false
  });
}

function blockedError(): Error {
  return createApiGraphqlError({
    code: "PARTNER_BLOCKED",
    message: apiErrorMessages.PARTNER_BLOCKED,
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

function notFoundError(): Error {
  return createApiGraphqlError({
    code: "NOT_FOUND",
    message: apiErrorMessages.NOT_FOUND,
    retryable: false
  });
}
