# Phase 6: Assessments

## Goal

Implement predefined Weekly Assessments, attempts, answers, objective scoring, manual grading states, results, weak-topic detection, and revision recommendations.

## Business Value

Gives learners proof of understanding and directs revision instead of relying on passive lesson completion.

## Required Reading

- `docs/18-assessment-engine.md`
- `docs/14-graphql-api-design.md`
- `docs/10-database-schema.md`
- `docs/25-testing-strategy.md`
- `docs/37-api-error-catalogue.md`

## Dependencies

- Phase 3 approved content and reviewed questions.
- Phase 5 Task Attempts and progress.

## Implementation Tasks

- [x] Implement assessment eligibility.
- [x] Implement Assessment Version and Question management.
- [x] Create Weekly Assessment Attempt.
- [x] Implement answer draft or submission flow.
- [x] Implement objective scoring.
- [x] Implement manual grading pending state.
- [x] Implement assessment result page.
- [x] Implement weak-topic revision recommendations.

## Database Tasks

- [x] Create assessments, assessment_versions, questions tables.
- [x] Create assessment_attempts and answers tables.
- [x] Add assessment status and question type enums.
- [x] Add snapshots for attempts and answers.

## Backend Tasks

- [x] Add AssessmentModule.
- [x] Add eligibility service.
- [x] Add deterministic question selection.
- [x] Add scoring service.
- [x] Add weak-topic detection service.
- [x] Add GraphQL assessment operations.

## Frontend Tasks

- [x] Build Weekly Assessment page.
- [x] Build question controls for MVP question types.
- [x] Build result page.
- [x] Show manual grading pending state.
- [x] Link revision recommendations to lessons or tasks.

## Test Tasks

- [ ] Unit test eligibility and question selection.
- [ ] Unit test scoring.
- [ ] Unit test weak-topic detection.
- [ ] Integration test submission transaction.
- [ ] E2E test assessment completion.

## Documentation Tasks

- [x] Update assessment engine with implemented scoring details.
- [x] Update API docs if contract changes.
- [ ] Update seed data with reviewed question IDs.

## Security Checks

- [x] Learner can access only own Assessment Attempts.
- [x] Partner cannot see exact answers.
- [x] Official assessments exclude unapproved content.

## Acceptance Criteria

- AC-ASSESS-001
- AC-ASSESS-002
- AC-ASSESS-003
- AC-ASSESS-004
- AC-ADMIN-002

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Exit Criteria

- Eligible learner can complete a Weekly Assessment.
- Result shows score, pass/fail or pending manual grading, weak topics, and revision recommendations.

## Excluded Work

- Production AI grading without review controls.
- Certificates.
- Public score sharing.

## Checklist

- [x] Implementation complete.
- [ ] Tests complete.
- [x] Security checks complete.
- [x] Documentation updated.
- [ ] Validation commands passed.
