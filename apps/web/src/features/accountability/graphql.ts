import { gql } from "@apollo/client";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "REVOKED";
export type InvitationDirection = "SENT" | "RECEIVED";

export interface PartnerInvitation {
  readonly id: string;
  readonly inviterDisplayName: string;
  readonly inviteeEmail: string;
  readonly status: InvitationStatus;
  readonly expiresAt: string;
  readonly createdAt: string;
  readonly direction: InvitationDirection;
}

export interface PartnerConnection {
  readonly id: string;
  readonly partnerUserId: string;
  readonly partnerDisplayName: string;
  readonly status: string;
  readonly createdAt: string;
}

export interface PartnerProgressSummary {
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

export interface PartnerDashboard {
  readonly invitations: readonly PartnerInvitation[];
  readonly connections: readonly PartnerConnection[];
  readonly progress: readonly PartnerProgressSummary[];
}

export interface PartnerDashboardQueryData {
  readonly partnerDashboard: PartnerDashboard;
}

export interface InvitePartnerMutationData {
  readonly invitePartner: PartnerInvitation;
}

export interface InvitePartnerMutationVariables {
  readonly input: {
    readonly email: string;
  };
}

export interface PartnerInvitationMutationData {
  readonly acceptPartnerInvitation?: PartnerInvitation;
  readonly rejectPartnerInvitation?: PartnerInvitation;
  readonly revokePartnerInvitation?: PartnerInvitation;
}

export interface InvitationIdVariables {
  readonly invitationId: string;
}

export interface RemovePartnerConnectionMutationData {
  readonly removePartnerConnection: boolean;
}

export interface ConnectionIdVariables {
  readonly connectionId: string;
}

export interface BlockUserMutationData {
  readonly blockUser: boolean;
}

export interface BlockUserVariables {
  readonly userId: string;
}

export const PARTNER_INVITATION_FIELDS = gql`
  fragment PartnerInvitationFields on PartnerInvitation {
    id
    inviterDisplayName
    inviteeEmail
    status
    expiresAt
    createdAt
    direction
  }
`;

export const PARTNER_CONNECTION_FIELDS = gql`
  fragment PartnerConnectionFields on PartnerConnection {
    id
    partnerUserId
    partnerDisplayName
    status
    createdAt
  }
`;

export const PARTNER_PROGRESS_FIELDS = gql`
  fragment PartnerProgressFields on PartnerProgressSummary {
    userId
    displayName
    plannedSessionCount
    completedSessionCount
    weeklyCompletionPercentage
    currentStreak
    assessmentCompleted
    overallTrackProgressPercentage
    encouragementStatus
  }
`;

export const PARTNER_DASHBOARD_QUERY = gql`
  query PartnerDashboard {
    partnerDashboard {
      invitations {
        ...PartnerInvitationFields
      }
      connections {
        ...PartnerConnectionFields
      }
      progress {
        ...PartnerProgressFields
      }
    }
  }
  ${PARTNER_INVITATION_FIELDS}
  ${PARTNER_CONNECTION_FIELDS}
  ${PARTNER_PROGRESS_FIELDS}
`;

export const INVITE_PARTNER_MUTATION = gql`
  mutation InvitePartner($input: InvitePartnerInput!) {
    invitePartner(input: $input) {
      ...PartnerInvitationFields
    }
  }
  ${PARTNER_INVITATION_FIELDS}
`;

export const ACCEPT_PARTNER_INVITATION_MUTATION = gql`
  mutation AcceptPartnerInvitation($invitationId: ID!) {
    acceptPartnerInvitation(invitationId: $invitationId) {
      ...PartnerInvitationFields
    }
  }
  ${PARTNER_INVITATION_FIELDS}
`;

export const REJECT_PARTNER_INVITATION_MUTATION = gql`
  mutation RejectPartnerInvitation($invitationId: ID!) {
    rejectPartnerInvitation(invitationId: $invitationId) {
      ...PartnerInvitationFields
    }
  }
  ${PARTNER_INVITATION_FIELDS}
`;

export const REVOKE_PARTNER_INVITATION_MUTATION = gql`
  mutation RevokePartnerInvitation($invitationId: ID!) {
    revokePartnerInvitation(invitationId: $invitationId) {
      ...PartnerInvitationFields
    }
  }
  ${PARTNER_INVITATION_FIELDS}
`;

export const REMOVE_PARTNER_CONNECTION_MUTATION = gql`
  mutation RemovePartnerConnection($connectionId: ID!) {
    removePartnerConnection(connectionId: $connectionId)
  }
`;

export const BLOCK_USER_MUTATION = gql`
  mutation BlockUser($userId: ID!) {
    blockUser(userId: $userId)
  }
`;
