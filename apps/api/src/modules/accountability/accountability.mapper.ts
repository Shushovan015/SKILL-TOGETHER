import type {
  PartnerConnectionRecord,
  PartnerDashboardRecord,
  PartnerInvitationRecord,
  PartnerProgressRecord
} from "./domain/accountability.types.js";
import {
  InvitationStatusDto,
  PartnerConnectionDto,
  PartnerDashboardDto,
  PartnerInvitationDto,
  PartnerProgressSummaryDto
} from "./dto/accountability.dto.js";

export function toPartnerInvitationDto(invitation: PartnerInvitationRecord): PartnerInvitationDto {
  return {
    id: invitation.id,
    inviterDisplayName: invitation.inviterDisplayName,
    inviteeEmail: invitation.inviteeEmail,
    status: invitation.status as InvitationStatusDto,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
    direction: invitation.direction
  };
}

export function toPartnerConnectionDto(connection: PartnerConnectionRecord): PartnerConnectionDto {
  return {
    id: connection.id,
    partnerUserId: connection.partnerUserId,
    partnerDisplayName: connection.partnerDisplayName,
    status: connection.status,
    createdAt: connection.createdAt
  };
}

export function toPartnerProgressDto(progress: PartnerProgressRecord): PartnerProgressSummaryDto {
  return {
    userId: progress.userId,
    displayName: progress.displayName,
    plannedSessionCount: progress.plannedSessionCount,
    completedSessionCount: progress.completedSessionCount,
    weeklyCompletionPercentage: progress.weeklyCompletionPercentage,
    currentStreak: progress.currentStreak,
    assessmentCompleted: progress.assessmentCompleted,
    overallTrackProgressPercentage: progress.overallTrackProgressPercentage,
    encouragementStatus: progress.encouragementStatus
  };
}

export function toPartnerDashboardDto(dashboard: PartnerDashboardRecord): PartnerDashboardDto {
  return {
    invitations: dashboard.invitations.map(toPartnerInvitationDto),
    connections: dashboard.connections.map(toPartnerConnectionDto),
    progress: dashboard.progress.map(toPartnerProgressDto)
  };
}
