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

- [x] Implement invitation creation.
- [x] Implement invitation acceptance and rejection.
- [x] Implement invitation expiration.
- [x] Implement Partner Connection shared progress query.
- [x] Implement connection removal.
- [x] Implement blocking.
- [x] Implement encouragement status if included in MVP slice.

## Database Tasks

- [x] Create partner_invitations table.
- [x] Create partner_connections table.
- [x] Create blocked_users table.
- [x] Add progress snapshot fields used for sharing.
- [x] Add indexes for invitation and connection lookups.

## Backend Tasks

- [x] Add AccountabilityModule.
- [x] Add invitation service.
- [x] Add partner visibility service.
- [x] Add progress DTO mapper.
- [x] Add audit events for acceptance, removal, and blocking.

## Frontend Tasks

- [x] Build Partner page.
- [x] Show visibility summary before invitation.
- [x] Build invitation form.
- [x] Build accept/reject states.
- [x] Build shared progress dashboard.
- [x] Build remove and block confirmations.

## Test Tasks

- [ ] Integration test invitation lifecycle.
- [ ] GraphQL test partner-scoped progress.
- [ ] Authorization test private data exclusion.
- [ ] Component test partner empty and connected states.
- [ ] E2E test invitation acceptance.

## Documentation Tasks

- [x] Update accountability doc with implemented expiration duration.
- [x] Update API docs if operation names change.
- [x] Update security doc for any sharing changes.

## Security Checks

- [x] Partner cannot view private reflections by default.
- [x] Partner cannot view exact answers or AI conversations.
- [x] Blocked users cannot send valid invitations.
- [x] Invitation tokens are stored hashed.

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

- [x] Implementation complete.
- [ ] Tests complete.
- [x] Privacy checks complete.
- [x] Documentation updated.
- [ ] Validation commands passed.
