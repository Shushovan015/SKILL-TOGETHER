# Phase 7: Accountability

## Goal

Implement partner invitations, Partner Connections, privacy-scoped shared progress, removal, and blocking.

## Business Value

Supports consistency through cooperation while protecting private learner data.

## Required Reading

- `docs/20-accountability-system.md`
- `docs/15-authentication-authorization.md`
- `docs/26-security.md`
- `docs/31-acceptance-criteria.md`
- `docs/37-api-error-catalogue.md`

## Dependencies

- Phase 4 progress snapshots.
- Phase 6 assessment completion data.

## Implementation Tasks

- [ ] Implement invitation creation.
- [ ] Implement invitation acceptance and rejection.
- [ ] Implement invitation expiration.
- [ ] Implement Partner Connection shared progress query.
- [ ] Implement connection removal.
- [ ] Implement blocking.
- [ ] Implement encouragement status if included in MVP slice.

## Database Tasks

- [ ] Create partner_invitations table.
- [ ] Create partner_connections table.
- [ ] Create blocked_users table.
- [ ] Add progress snapshot fields used for sharing.
- [ ] Add indexes for invitation and connection lookups.

## Backend Tasks

- [ ] Add AccountabilityModule.
- [ ] Add invitation service.
- [ ] Add partner visibility service.
- [ ] Add progress DTO mapper.
- [ ] Add audit events for acceptance, removal, and blocking.

## Frontend Tasks

- [ ] Build Partner page.
- [ ] Show visibility summary before invitation.
- [ ] Build invitation form.
- [ ] Build accept/reject states.
- [ ] Build shared progress dashboard.
- [ ] Build remove and block confirmations.

## Test Tasks

- [ ] Integration test invitation lifecycle.
- [ ] GraphQL test partner-scoped progress.
- [ ] Authorization test private data exclusion.
- [ ] Component test partner empty and connected states.
- [ ] E2E test invitation acceptance.

## Documentation Tasks

- [ ] Update accountability doc with implemented expiration duration.
- [ ] Update API docs if operation names change.
- [ ] Update security doc for any sharing changes.

## Security Checks

- [ ] Partner cannot view private reflections by default.
- [ ] Partner cannot view exact answers or AI conversations.
- [ ] Blocked users cannot send valid invitations.
- [ ] Invitation tokens are stored hashed.

## Acceptance Criteria

- AC-PARTNER-001
- AC-PARTNER-002
- AC-PARTNER-003
- AC-PARTNER-004

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Exit Criteria

- Partner flow works end to end.
- Shared progress contains only approved fields.
- Removal and blocking stop sharing.

## Excluded Work

- Public profiles.
- Leaderboards.
- Real-time messaging.
- Public chat.

## Checklist

- [ ] Implementation complete.
- [ ] Tests complete.
- [ ] Privacy checks complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
