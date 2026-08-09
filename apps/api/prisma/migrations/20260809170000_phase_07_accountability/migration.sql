BEGIN;

CREATE TYPE invitation_status AS ENUM (
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED',
  'REVOKED'
);

CREATE TABLE partner_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitee_email text NOT NULL,
  invitee_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status invitation_status NOT NULL DEFAULT 'PENDING',
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partner_invitations_token_hash_key UNIQUE (token_hash)
);

CREATE TABLE partner_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'ACTIVE',
  sharing_settings jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  removed_at timestamptz,
  CONSTRAINT partner_connections_distinct_users_check CHECK (user_a_id <> user_b_id),
  CONSTRAINT partner_connections_user_a_id_user_b_id_key UNIQUE (user_a_id, user_b_id)
);

CREATE TABLE blocked_users (
  blocker_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blocked_users_distinct_users_check CHECK (blocker_id <> blocked_user_id),
  PRIMARY KEY (blocker_id, blocked_user_id)
);

CREATE INDEX partner_invitations_inviter_id_status_idx ON partner_invitations(inviter_id, status);
CREATE INDEX partner_invitations_invitee_email_status_idx ON partner_invitations(invitee_email, status);
CREATE INDEX partner_invitations_invitee_user_id_status_idx ON partner_invitations(invitee_user_id, status);
CREATE UNIQUE INDEX partner_invitations_pending_unique_idx
  ON partner_invitations(inviter_id, invitee_email)
  WHERE status = 'PENDING';
CREATE INDEX partner_connections_user_a_id_status_idx ON partner_connections(user_a_id, status);
CREATE INDEX partner_connections_user_b_id_status_idx ON partner_connections(user_b_id, status);
CREATE INDEX blocked_users_blocked_user_id_idx ON blocked_users(blocked_user_id);

COMMIT;
