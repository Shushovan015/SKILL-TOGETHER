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

- [ ] Implement registration flow.
- [ ] Implement login flow.
- [ ] Implement logout flow.
- [ ] Implement current-user query.
- [ ] Add session middleware or guard.
- [ ] Add CSRF protection for mutations.

## Database Tasks

- [ ] Create users table.
- [ ] Create user_profiles table.
- [ ] Create user_roles table.
- [ ] Create sessions table.
- [ ] Add indexes and uniqueness constraints.

## Backend Tasks

- [ ] Add AuthModule.
- [ ] Add password hashing service.
- [ ] Add session service.
- [ ] Add GraphQL auth resolvers.
- [ ] Add role and ownership guard foundation.
- [ ] Map auth errors to stable codes.

## Frontend Tasks

- [ ] Build registration page.
- [ ] Build login page.
- [ ] Add logout action.
- [ ] Add authenticated route guard.
- [ ] Handle session expiration.

## Test Tasks

- [ ] Unit test email normalization.
- [ ] Integration test password hashing and session creation.
- [ ] GraphQL test register, login, logout, me.
- [ ] Component test auth forms.
- [ ] E2E test registration and login.

## Documentation Tasks

- [ ] Update auth docs with implementation parameters.
- [ ] Update API docs if schema changes.
- [ ] Update error catalogue for new auth errors.

## Security Checks

- [ ] Passwords are never logged.
- [ ] Cookies are HTTP-only and secure in production.
- [ ] CSRF is enforced for mutations.
- [ ] Invalid credentials return generic message.
- [ ] Rate limits are applied to auth endpoints.

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

- [ ] Implementation complete.
- [ ] Tests complete.
- [ ] Security checks complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
