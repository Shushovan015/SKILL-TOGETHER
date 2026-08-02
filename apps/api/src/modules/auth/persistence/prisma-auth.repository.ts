import type {
  Session as PrismaSession,
  User as PrismaUser,
  UserProfile as PrismaUserProfile,
  UserRoleAssignment as PrismaUserRoleAssignment
} from "../../../generated/prisma/client.js";
import {
  Prisma,
  UserRole as PrismaUserRole,
  UserStatus as PrismaUserStatus
} from "../../../generated/prisma/client.js";

import { PrismaService } from "../../../prisma/prisma.service.js";
import type {
  AuthenticatedUser,
  AuthRole,
  CreateUserWithSessionInput,
  SessionRecord,
  UserStatus
} from "../domain/auth.types.js";
import {
  type AuthRepository,
  type CreateSessionInput,
  DuplicateEmailError
} from "./auth.repository.js";

interface PrismaUserWithProfileAndRoles extends PrismaUser {
  readonly profile: PrismaUserProfile | null;
  readonly roles: readonly PrismaUserRoleAssignment[];
}

export class PrismaAuthRepository implements AuthRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async createUserWithSession(input: CreateUserWithSessionInput): Promise<AuthenticatedUser> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: input.email,
          passwordHash: input.passwordHash,
          status: PrismaUserStatus.ACTIVE,
          profile: {
            create: {
              displayName: input.displayName,
              timeZone: input.timeZone
            }
          },
          roles: {
            create: {
              role: PrismaUserRole.LEARNER
            }
          },
          sessions: {
            create: {
              sessionHash: input.sessionHash,
              expiresAt: input.sessionExpiresAt
            }
          }
        },
        include: {
          profile: true,
          roles: true
        }
      });

      return mapPrismaUser(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new DuplicateEmailError();
      }

      throw error;
    }
  }

  public async createSession(input: CreateSessionInput): Promise<SessionRecord> {
    const session = await this.prisma.session.create({
      data: {
        userId: input.userId,
        sessionHash: input.sessionHash,
        expiresAt: input.expiresAt
      }
    });

    return mapPrismaSession(session);
  }

  public async findUserByEmail(email: string): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      },
      include: {
        profile: true,
        roles: true
      }
    });

    return user === null ? null : mapPrismaUser(user);
  }

  public async findUserById(id: string): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        profile: true,
        roles: true
      }
    });

    return user === null ? null : mapPrismaUser(user);
  }

  public async findActiveSessionByHash(
    sessionHash: string,
    now: Date
  ): Promise<SessionRecord | null> {
    const session = await this.prisma.session.findFirst({
      where: {
        sessionHash,
        revokedAt: null,
        expiresAt: {
          gt: now
        }
      }
    });

    return session === null ? null : mapPrismaSession(session);
  }

  public async revokeSessionById(sessionId: string, revokedAt: Date): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        id: sessionId,
        revokedAt: null
      },
      data: {
        revokedAt
      }
    });
  }

  public async revokeSessionByHash(sessionHash: string, revokedAt: Date): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        sessionHash,
        revokedAt: null
      },
      data: {
        revokedAt
      }
    });
  }
}

function mapPrismaUser(user: PrismaUserWithProfileAndRoles): AuthenticatedUser {
  if (user.profile === null) {
    throw new Error("User profile is required for authenticated users");
  }

  return {
    id: user.id,
    email: user.email,
    passwordHash: user.passwordHash,
    status: mapUserStatus(user.status),
    profile: {
      displayName: user.profile.displayName,
      timeZone: user.profile.timeZone,
      preferredSessionTime: formatTime(user.profile.preferredSessionTime)
    },
    roles: user.roles.map((role) => mapAuthRole(role.role))
  };
}

function mapPrismaSession(session: PrismaSession): SessionRecord {
  return {
    id: session.id,
    userId: session.userId,
    sessionHash: session.sessionHash,
    expiresAt: session.expiresAt,
    revokedAt: session.revokedAt
  };
}

function mapUserStatus(status: PrismaUserStatus): UserStatus {
  return status;
}

function mapAuthRole(role: PrismaUserRole): AuthRole {
  return role;
}

function formatTime(value: Date | null): string | null {
  if (value === null) {
    return null;
  }

  return value.toISOString().slice(11, 19);
}
