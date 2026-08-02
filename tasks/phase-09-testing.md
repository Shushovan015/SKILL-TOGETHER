# Phase 9: Testing and Hardening

## Goal

Complete security, accessibility, observability, test coverage, and reliability hardening for MVP readiness.

## Business Value

Reduces launch risk and verifies private learning data, assessments, scheduling, and partner visibility behave correctly.

## Required Reading

- `docs/25-testing-strategy.md`
- `docs/26-security.md`
- `docs/27-observability.md`
- `docs/39-definition-of-done.md`
- `docs/06-non-functional-requirements.md`

## Dependencies

- Functional MVP flows from Phases 1 through 8 as applicable.

## Implementation Tasks

- [ ] Add missing critical unit tests.
- [ ] Add missing integration tests.
- [ ] Add missing GraphQL authorization tests.
- [ ] Add Playwright critical flows.
- [ ] Add accessibility test coverage.
- [ ] Add rate limits and query complexity limits.
- [ ] Add structured logs and request IDs.
- [ ] Add audit event coverage.

## Database Tasks

- [ ] Verify indexes for dashboard, tasks, assessments, and partner queries.
- [ ] Verify audit event retention fields.
- [ ] Verify snapshot data is preserved.

## Backend Tasks

- [ ] Add health checks.
- [ ] Add readiness checks.
- [ ] Add error monitoring integration.
- [ ] Add background job idempotency tests.
- [ ] Add GraphQL depth and complexity controls.

## Frontend Tasks

- [ ] Verify all critical pages have loading, empty, error, and success states.
- [ ] Verify keyboard flows.
- [ ] Add error boundary.
- [ ] Add request ID display for generic errors.

## Test Tasks

- [ ] Run full test suite.
- [ ] Run E2E suite.
- [ ] Run accessibility checks.
- [ ] Run security regression tests.
- [ ] Document any accepted residual risks.

## Documentation Tasks

- [ ] Update testing strategy with actual commands.
- [ ] Update observability doc with implemented metrics.
- [ ] Update security doc with final controls.
- [ ] Update definition of done if gate changes.

## Security Checks

- [ ] No private data in logs.
- [ ] CSRF enforced.
- [ ] Auth rate limits verified.
- [ ] Partner privacy verified.
- [ ] Admin actions audited.

## Acceptance Criteria

- AC-PAGE-003
- All P0 criteria from `docs/31-acceptance-criteria.md`

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Exit Criteria

- Critical flow tests pass.
- Security review issues are resolved or documented.
- Accessibility review passes MVP standard.
- Observability is sufficient for production triage.

## Excluded Work

- Major feature expansion.
- Native mobile apps.
- Marketplace or payment work.

## Checklist

- [ ] Implementation complete.
- [ ] Tests complete.
- [ ] Security checks complete.
- [ ] Accessibility checks complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
