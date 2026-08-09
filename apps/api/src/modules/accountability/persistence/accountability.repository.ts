import type {
  InvitePartnerInput,
  PartnerConnectionRecord,
  PartnerDashboardRecord,
  PartnerInvitationRecord,
  PartnerProgressRecord
} from "../domain/accountability.types.js";

export const ACCOUNTABILITY_REPOSITORY = Symbol("ACCOUNTABILITY_REPOSITORY");

export interface AccountabilityRepository {
  dashboard(userId: string, userEmail: string): Promise<PartnerDashboardRecord>;
  partnerInvitations(userId: string, userEmail: string): Promise<readonly PartnerInvitationRecord[]>;
  partnerConnections(userId: string): Promise<readonly PartnerConnectionRecord[]>;
  partnerProgress(userId: string): Promise<readonly PartnerProgressRecord[]>;
  invitePartner(
    userId: string,
    userEmail: string,
    input: InvitePartnerInput
  ): Promise<PartnerInvitationRecord>;
  acceptInvitation(
    userId: string,
    userEmail: string,
    invitationId: string
  ): Promise<PartnerInvitationRecord>;
  rejectInvitation(
    userId: string,
    userEmail: string,
    invitationId: string
  ): Promise<PartnerInvitationRecord>;
  revokeInvitation(userId: string, invitationId: string): Promise<PartnerInvitationRecord>;
  removeConnection(userId: string, connectionId: string): Promise<boolean>;
  blockUser(userId: string, userEmail: string, blockedUserId: string): Promise<boolean>;
}
