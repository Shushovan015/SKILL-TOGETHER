# Phase 4: Daily Planner and Scheduling

## Goal

Implement onboarding, Enrollment, Study Plan, Study Weeks, Daily Tasks, Today dashboard, Weekly Plan, missed-task detection, and deterministic recovery.

## Business Value

Delivers the core promise: the learner knows what to do today and can recover from missed sessions without abandoning the programme.

## Required Reading

- `docs/02-product-requirements.md`
- `docs/09-domain-model.md`
- `docs/10-database-schema.md`
- `docs/19-scheduling-engine.md`
- `docs/21-ui-ux-specification.md`
- `docs/22-page-specifications.md`

## Dependencies

- Phase 3 approved content.

## Implementation Tasks

- [ ] Build onboarding workflow.
- [ ] Create Enrollment and Study Plan from preferences.
- [ ] Generate Study Weeks and Daily Tasks.
- [ ] Implement Today dashboard query.
- [ ] Implement Weekly Plan query.
- [ ] Implement missed-task detection.
- [ ] Implement recovery proposal and apply flow.
- [ ] Implement pause and resume basics.

## Database Tasks

- [ ] Create enrollments, study_plans, pause_periods, study_weeks, daily_tasks tables.
- [ ] Add task and enrollment status enums.
- [ ] Add indexes for user plan and scheduled dates.
- [ ] Add audit events for schedule changes.

## Backend Tasks

- [ ] Add PlanningModule.
- [ ] Add deterministic scheduling domain service.
- [ ] Add capacity validation.
- [ ] Add recovery service.
- [ ] Add GraphQL operations for onboarding, dashboard, weekly plan, recovery.

## Frontend Tasks

- [ ] Build onboarding schedule form.
- [ ] Build Today dashboard.
- [ ] Build Weekly Plan page.
- [ ] Build recovery proposal review UI.
- [ ] Build pause/resume settings UI if included in phase slice.

## Test Tasks

- [ ] Unit test scheduling algorithm.
- [ ] Unit test missed-task detection.
- [ ] Unit test recovery algorithm edge cases.
- [ ] Integration test onboarding plan creation.
- [ ] E2E test onboarding and recovery.

## Documentation Tasks

- [ ] Update scheduling doc with implemented edge cases.
- [ ] Update page specs for any UI changes.
- [ ] Update API docs if operation names change.

## Security Checks

- [ ] Learners can access only their own plans and tasks.
- [ ] Recovery changes are audited.
- [ ] Schedule preferences are validated server-side.

## Acceptance Criteria

- AC-ONBOARD-001
- AC-ONBOARD-002
- AC-ONBOARD-003
- AC-PLAN-001
- AC-PLAN-002
- AC-PLAN-003
- AC-PLAN-004
- AC-PLAN-005

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Exit Criteria

- Learner can create a valid plan and see Today and Weekly Plan.
- Missed tasks produce explainable recovery proposals.
- Completed tasks are never rescheduled.

## Excluded Work

- AI scheduling.
- Calendar integration.
- Long-term adaptive planning.

## Checklist

- [ ] Implementation complete.
- [ ] Tests complete.
- [ ] Security checks complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
