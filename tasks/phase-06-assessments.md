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

- [ ] Implement assessment eligibility.
- [ ] Implement Assessment Version and Question management.
- [ ] Create Weekly Assessment Attempt.
- [ ] Implement answer draft or submission flow.
- [ ] Implement objective scoring.
- [ ] Implement manual grading pending state.
- [ ] Implement assessment result page.
- [ ] Implement weak-topic revision recommendations.

## Database Tasks

- [ ] Create assessments, assessment_versions, questions tables.
- [ ] Create assessment_attempts and answers tables.
- [ ] Add assessment status and question type enums.
- [ ] Add snapshots for attempts and answers.

## Backend Tasks

- [ ] Add AssessmentModule.
- [ ] Add eligibility service.
- [ ] Add deterministic question selection.
- [ ] Add scoring service.
- [ ] Add weak-topic detection service.
- [ ] Add GraphQL assessment operations.

## Frontend Tasks

- [ ] Build Weekly Assessment page.
- [ ] Build question controls for MVP question types.
- [ ] Build result page.
- [ ] Show manual grading pending state.
- [ ] Link revision recommendations to lessons or tasks.

## Test Tasks

- [ ] Unit test eligibility and question selection.
- [ ] Unit test scoring.
- [ ] Unit test weak-topic detection.
- [ ] Integration test submission transaction.
- [ ] E2E test assessment completion.

## Documentation Tasks

- [ ] Update assessment engine with implemented scoring details.
- [ ] Update API docs if contract changes.
- [ ] Update seed data with reviewed question IDs.

## Security Checks

- [ ] Learner can access only own Assessment Attempts.
- [ ] Partner cannot see exact answers.
- [ ] Official assessments exclude unapproved content.

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

- [ ] Implementation complete.
- [ ] Tests complete.
- [ ] Security checks complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
