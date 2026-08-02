import type {
  AuthenticatedUser,
  CreateUserWithSessionInput,
  SessionRecord
} from "../domain/auth.types.js";

export const AUTH_REPOSITORY = Symbol("AUTH_REPOSITORY");

export class DuplicateEmailError extends Error {
  public constructor() {
    super("Email already exists");
    this.name = "DuplicateEmailError";
  }
}

export interface CreateSessionInput {
  readonly userId: string;
  readonly sessionHash: string;
  readonly expiresAt: Date;
}

export interface AuthRepository {
  createUserWithSession(input: CreateUserWithSessionInput): Promise<AuthenticatedUser>;
  createSession(input: CreateSessionInput): Promise<SessionRecord>;
  findUserByEmail(email: string): Promise<AuthenticatedUser | null>;
  findUserById(id: string): Promise<AuthenticatedUser | null>;
  findActiveSessionByHash(sessionHash: string, now: Date): Promise<SessionRecord | null>;
  revokeSessionById(sessionId: string, revokedAt: Date): Promise<void>;
  revokeSessionByHash(sessionHash: string, revokedAt: Date): Promise<void>;
}
