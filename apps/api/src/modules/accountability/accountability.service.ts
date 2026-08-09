import { Inject, Injectable } from "@nestjs/common";

import type { AuthenticatedUser } from "../auth/domain/auth.types.js";
import {
  validateAccountabilityId,
  validateInvitePartnerInput
} from "./domain/accountability.validation.js";
import type {
  PartnerConnectionRecord,
  PartnerDashboardRecord,
  PartnerInvitationRecord,
  PartnerProgressRecord
} from "./domain/accountability.types.js";
import {
  ACCOUNTABILITY_REPOSITORY,
  type AccountabilityRepository
} from "./persistence/accountability.repository.js";

@Injectable()
export class AccountabilityService {
  public constructor(
    @Inject(ACCOUNTABILITY_REPOSITORY) private readonly repository: AccountabilityRepository
  ) {}

  public dashboard(user: AuthenticatedUser): Promise<PartnerDashboardRecord> {
    return this.repository.dashboard(user.id, user.email);
  }

  public partnerInvitations(user: AuthenticatedUser): Promise<readonly PartnerInvitationRecord[]> {
    return this.repository.partnerInvitations(user.id, user.email);
  }

  public partnerConnections(user: AuthenticatedUser): Promise<readonly PartnerConnectionRecord[]> {
    return this.repository.partnerConnections(user.id);
  }

  public partnerProgress(user: AuthenticatedUser): Promise<readonly PartnerProgressRecord[]> {
    return this.repository.partnerProgress(user.id);
  }

  public invitePartner(
    user: AuthenticatedUser,
    input: unknown
  ): Promise<PartnerInvitationRecord> {
    return this.repository.invitePartner(user.id, user.email, validateInvitePartnerInput(input));
  }

  public acceptInvitation(
    user: AuthenticatedUser,
    invitationId: string
  ): Promise<PartnerInvitationRecord> {
    return this.repository.acceptInvitation(
      user.id,
      user.email,
      validateAccountabilityId(invitationId)
    );
  }

  public rejectInvitation(
    user: AuthenticatedUser,
    invitationId: string
  ): Promise<PartnerInvitationRecord> {
    return this.repository.rejectInvitation(
      user.id,
      user.email,
      validateAccountabilityId(invitationId)
    );
  }

  public revokeInvitation(
    user: AuthenticatedUser,
    invitationId: string
  ): Promise<PartnerInvitationRecord> {
    return this.repository.revokeInvitation(user.id, validateAccountabilityId(invitationId));
  }

  public removeConnection(user: AuthenticatedUser, connectionId: string): Promise<boolean> {
    return this.repository.removeConnection(user.id, validateAccountabilityId(connectionId));
  }

  public blockUser(user: AuthenticatedUser, blockedUserId: string): Promise<boolean> {
    return this.repository.blockUser(user.id, user.email, validateAccountabilityId(blockedUserId));
  }
}
