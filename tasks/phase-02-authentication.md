# Phase 2: Authentication

## Goal

Implement secure email/password registration, login, logout, sessions, current-user resolution, and authorization foundations.

## Business Value

Protects learner data and enables private Study Plans, tasks, assessments, and partner views.

## Required Reading

- `docs/05-functional-requirements.md`
- `docs/14-graphql-api-design.md`
- `docs/15-authentication-authorization.md`
- `docs/26-security.md`
- `docs/37-api-error-catalogue.md`
- `docs/39-definition-of-done.md`

## Dependencies

- Phase 1 complete.

## Implementation Tasks

- [x] Implement registration flow.
- [x] Implement login flow.
- [x] Implement logout flow.
- [x] Implement current-user query.
- [x] Add session middleware or guard.
- [x] Add CSRF protection for mutations.

## Database Tasks

- [x] Create users table.
- [x] Create user_profiles table.
- [x] Create user_roles table.
- [x] Create sessions table.
- [x] Add indexes and uniqueness constraints.

## Backend Tasks

- [x] Add AuthModule.
- [x] Add password hashing service.
- [x] Add session service.
- [x] Add GraphQL auth resolvers.
- [x] Add role and ownership guard foundation.
- [x] Map auth errors to stable codes.

## Frontend Tasks

- [x] Build registration page.
- [x] Build login page.
- [x] Add logout action.
- [x] Add authenticated route guard.
- [x] Handle session expiration.

## Test Tasks

- [x] Unit test email normalization.
- [x] Integration test password hashing and session creation.
- [x] GraphQL test register, login, logout, me.
- [x] Component test auth forms.
- [x] E2E test registration and login.

## Documentation Tasks

- [x] Update auth docs with implementation parameters.
- [x] Update API docs if schema changes.
- [x] Update error catalogue for new auth errors.

## Security Checks

- [x] Passwords are never logged.
- [x] Cookies are HTTP-only and secure in production.
- [x] CSRF is enforced for mutations.
- [x] Invalid credentials return generic message.
- [x] Rate limits are applied to auth endpoints.

## Acceptance Criteria

- AC-AUTH-001
- AC-AUTH-002
- AC-AUTH-003
- AC-AUTH-004

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Exit Criteria

- Auth flows work end to end.
- Anonymous users cannot access private operations.
- Required auth tests pass.

## Excluded Work

- Social login.
- Organization accounts.
- Payments.

## Checklist

- [x] Implementation complete.
- [x] Tests complete.
- [x] Security checks complete.
- [x] Documentation updated.
- [x] Validation commands passed.
- [x] Principal/security review corrections verified.
