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

- [x] Build onboarding workflow.
- [x] Create Enrollment and Study Plan from preferences.
- [x] Generate Study Weeks and Daily Tasks.
- [x] Implement Today dashboard query.
- [x] Implement Weekly Plan query.
- [x] Implement missed-task detection.
- [x] Implement recovery proposal and apply flow.
- [x] Implement pause and resume basics.

## Database Tasks

- [x] Create enrollments, study_plans, pause_periods, study_weeks, daily_tasks tables.
- [x] Add task and enrollment status enums.
- [x] Add indexes for user plan and scheduled dates.
- [x] Add audit events for schedule changes.

## Backend Tasks

- [x] Add PlanningModule.
- [x] Add deterministic scheduling domain service.
- [x] Add capacity validation.
- [x] Add recovery service.
- [x] Add GraphQL operations for onboarding, dashboard, weekly plan, recovery.

## Frontend Tasks

- [x] Build onboarding schedule form.
- [x] Build Today dashboard.
- [x] Build Weekly Plan page.
- [x] Build recovery proposal review UI.
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
- [x] Update API docs if operation names change.

## Security Checks

- [x] Learners can access only their own plans and tasks.
- [x] Recovery changes are audited.
- [x] Schedule preferences are validated server-side.

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

- [x] Implementation complete.
- [ ] Tests complete.
- [ ] Security checks complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
