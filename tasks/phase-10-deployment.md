# Phase 10: Deployment

## Goal

Prepare and verify production deployment, environment configuration, migrations, monitoring, backups, and rollback.

## Business Value

Makes the MVP operable outside local development with controlled risk and clear recovery procedures.

## Required Reading

- `docs/28-deployment.md`
- `docs/27-observability.md`
- `docs/26-security.md`
- `docs/39-definition-of-done.md`
- `docs/38-decisions.md`

## Dependencies

- Phase 9 hardening complete.

## Implementation Tasks

- [ ] Select deployment targets or confirm vendor-neutral implementation.
- [ ] Configure production build pipeline.
- [ ] Configure environment variables.
- [ ] Configure production secure cookies and CORS.
- [ ] Configure error monitoring.
- [ ] Configure deployment verification checklist.

## Database Tasks

- [ ] Apply migrations in staging.
- [ ] Verify production migration procedure.
- [ ] Enable managed backups.
- [ ] Test restore procedure.
- [ ] Document rollback or forward-fix plan.

## Backend Tasks

- [ ] Expose liveness and readiness checks.
- [ ] Verify database connectivity checks.
- [ ] Verify migration compatibility.
- [ ] Verify structured logging in target environment.

## Frontend Tasks

- [ ] Verify production API origin configuration.
- [ ] Verify route fallback for client-side routing.
- [ ] Verify error pages.
- [ ] Verify asset caching headers where supported.

## Test Tasks

- [ ] Run full validation commands in CI.
- [ ] Run smoke tests against staging or preview.
- [ ] Run auth cookie verification in production-like environment.
- [ ] Run critical E2E flow in staging.

## Documentation Tasks

- [ ] Update deployment runbook with selected vendors.
- [ ] Update `.env.example` if variables changed.
- [ ] Record deployment decision in `docs/38-decisions.md`.
- [ ] Update README with production status.

## Security Checks

- [ ] Production secrets are managed outside source control.
- [ ] Cookies use Secure and HTTP-only.
- [ ] CORS allow list is exact.
- [ ] Database is not publicly exposed without provider controls.
- [ ] Backups are access-controlled.

## Acceptance Criteria

- MVP exit criteria from `docs/07-mvp-scope.md`
- Deployment readiness criteria from `docs/39-definition-of-done.md`

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Exit Criteria

- Staging or preview deployment passes verification.
- Health checks pass.
- Rollback plan is documented.
- Production readiness risks are documented.

## Excluded Work

- Vendor lock-in without ADR.
- Organization accounts.
- Payment infrastructure.
- Native mobile deployment.

## Checklist

- [ ] Implementation complete.
- [ ] Tests complete.
- [ ] Security checks complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
