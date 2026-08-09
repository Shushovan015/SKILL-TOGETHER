export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "REVOKED";
export type InvitationDirection = "SENT" | "RECEIVED";

export interface InvitePartnerInput {
  readonly email: string;
}

export interface PartnerInvitationRecord {
  readonly id: string;
  readonly inviterDisplayName: string;
  readonly inviteeEmail: string;
  readonly status: InvitationStatus;
  readonly expiresAt: Date;
  readonly createdAt: Date;
  readonly direction: InvitationDirection;
}

export interface PartnerConnectionRecord {
  readonly id: string;
  readonly partnerUserId: string;
  readonly partnerDisplayName: string;
  readonly status: string;
  readonly createdAt: Date;
}

export interface PartnerProgressRecord {
  readonly userId: string;
  readonly displayName: string;
  readonly plannedSessionCount: number;
  readonly completedSessionCount: number;
  readonly weeklyCompletionPercentage: number;
  readonly currentStreak: number;
  readonly assessmentCompleted: boolean;
  readonly overallTrackProgressPercentage: number;
  readonly encouragementStatus: string | null;
}

export interface PartnerDashboardRecord {
  readonly invitations: readonly PartnerInvitationRecord[];
  readonly connections: readonly PartnerConnectionRecord[];
  readonly progress: readonly PartnerProgressRecord[];
}
