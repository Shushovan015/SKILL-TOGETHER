import { randomUUID } from "node:crypto";

import type {
  AuthenticatedUser,
  CreateUserWithSessionInput,
  SessionRecord
} from "../domain/auth.types.js";
import {
  type AuthRepository,
  type CreateSessionInput,
  DuplicateEmailError
} from "./auth.repository.js";

type StoredUser = AuthenticatedUser;

export class InMemoryAuthRepository implements AuthRepository {
  private readonly usersById = new Map<string, StoredUser>();
  private readonly userIdsByEmail = new Map<string, string>();
  private readonly sessionsById = new Map<string, SessionRecord>();
  private readonly sessionIdsByHash = new Map<string, string>();

  public async createUserWithSession(input: CreateUserWithSessionInput): Promise<AuthenticatedUser> {
    if (this.userIdsByEmail.has(input.email)) {
      throw new DuplicateEmailError();
    }

    const user: StoredUser = {
      id: randomUUID(),
      email: input.email,
      passwordHash: input.passwordHash,
      status: "ACTIVE",
      profile: {
        displayName: input.displayName,
        timeZone: input.timeZone,
        preferredSessionTime: null
      },
      roles: ["LEARNER"]
    };

    this.usersById.set(user.id, user);
    this.userIdsByEmail.set(user.email, user.id);
    await this.createSession({
      userId: user.id,
      sessionHash: input.sessionHash,
      expiresAt: input.sessionExpiresAt
    });

    return this.copyUser(user);
  }

  public async createSession(input: CreateSessionInput): Promise<SessionRecord> {
    const session: SessionRecord = {
      id: randomUUID(),
      userId: input.userId,
      sessionHash: input.sessionHash,
      expiresAt: input.expiresAt,
      revokedAt: null
    };

    this.sessionsById.set(session.id, session);
    this.sessionIdsByHash.set(session.sessionHash, session.id);

    return this.copySession(session);
  }

  public async findUserByEmail(email: string): Promise<AuthenticatedUser | null> {
    const userId = this.userIdsByEmail.get(email);

    if (userId === undefined) {
      return null;
    }

    return this.findUserById(userId);
  }

  public async findUserById(id: string): Promise<AuthenticatedUser | null> {
    const user = this.usersById.get(id);
    return user === undefined ? null : this.copyUser(user);
  }

  public async findActiveSessionByHash(
    sessionHash: string,
    now: Date
  ): Promise<SessionRecord | null> {
    const sessionId = this.sessionIdsByHash.get(sessionHash);

    if (sessionId === undefined) {
      return null;
    }

    const session = this.sessionsById.get(sessionId);

    if (session === undefined || session.revokedAt !== null || session.expiresAt <= now) {
      return null;
    }

    return this.copySession(session);
  }

  public async revokeSessionById(sessionId: string, revokedAt: Date): Promise<void> {
    const session = this.sessionsById.get(sessionId);

    if (session !== undefined && session.revokedAt === null) {
      this.sessionsById.set(sessionId, {
        ...session,
        revokedAt
      });
    }
  }

  public async revokeSessionByHash(sessionHash: string, revokedAt: Date): Promise<void> {
    const sessionId = this.sessionIdsByHash.get(sessionHash);

    if (sessionId !== undefined) {
      await this.revokeSessionById(sessionId, revokedAt);
    }
  }

  private copyUser(user: StoredUser): AuthenticatedUser {
    return {
      ...user,
      profile: {
        ...user.profile
      },
      roles: [...user.roles]
    };
  }

  private copySession(session: SessionRecord): SessionRecord {
    return {
      ...session,
      expiresAt: new Date(session.expiresAt),
      revokedAt: session.revokedAt === null ? null : new Date(session.revokedAt)
    };
  }
}
