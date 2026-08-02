export type UserStatus = "ACTIVE" | "DISABLED";
export type AuthRole = "CONTENT_ADMIN" | "LEARNER" | "SYSTEM_ADMIN";

export interface AuthenticatedUserProfile {
  readonly displayName: string;
  readonly timeZone: string;
  readonly preferredSessionTime: string | null;
}

export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly status: UserStatus;
  readonly profile: AuthenticatedUserProfile;
  readonly roles: readonly AuthRole[];
}

export interface PublicUser {
  readonly id: string;
  readonly email: string;
  readonly profile: AuthenticatedUserProfile;
  readonly roles: readonly AuthRole[];
}

export interface SessionRecord {
  readonly id: string;
  readonly userId: string;
  readonly sessionHash: string;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
}

export interface CreateUserWithSessionInput {
  readonly email: string;
  readonly passwordHash: string;
  readonly displayName: string;
  readonly timeZone: string;
  readonly sessionHash: string;
  readonly sessionExpiresAt: Date;
}
