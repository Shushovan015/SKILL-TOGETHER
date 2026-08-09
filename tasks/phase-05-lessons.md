# Phase 5: Lessons

## Goal

Implement scheduled Lesson experience, exercises, task completion, study-time recording, Task Attempt snapshots, and Learning Reflections.

## Business Value

Turns the Study Plan into actual learning sessions with evidence and durable progress.

## Required Reading

- `docs/17-learning-content-model.md`
- `docs/21-ui-ux-specification.md`
- `docs/22-page-specifications.md`
- `docs/25-testing-strategy.md`
- `docs/37-api-error-catalogue.md`

## Dependencies

- Phase 4 Daily Tasks.

## Implementation Tasks

- [x] Build scheduled Lesson query.
- [x] Build Lesson page.
- [x] Build Exercise page or section.
- [x] Implement start task mutation.
- [x] Implement complete task mutation.
- [x] Record duration and completion evidence.
- [x] Record Learning Reflection with private default.
- [x] Update Progress Snapshot after completion.

## Database Tasks

- [x] Create task_attempts table.
- [x] Create reflections table.
- [x] Add lesson snapshot JSON validation.
- [x] Add indexes for task attempts and reflections.

## Backend Tasks

- [x] Add LessonCompletionService.
- [x] Validate ownership and task status transitions.
- [x] Validate completion evidence.
- [x] Snapshot Lesson Version fields.
- [x] Map completion errors to stable codes.

## Frontend Tasks

- [x] Render Lesson sections.
- [x] Render resources and knowledge checks.
- [x] Build evidence form.
- [x] Build reflection input.
- [x] Handle save, completion, validation, and network errors.

## Test Tasks

- [ ] Unit test task status transitions.
- [ ] Integration test completion transaction.
- [ ] GraphQL test unauthorized task access.
- [ ] Component test Lesson page states.
- [ ] E2E test completing a lesson.

## Documentation Tasks

- [ ] Update content model if evidence schema changes.
- [x] Update API docs if mutation shape changes.
- [ ] Update testing strategy with any new critical scenario.

## Security Checks

- [x] Learners cannot complete another learner's task.
- [x] Private reflection is not partner-visible by default.
- [x] Markdown rendering is sanitized.

## Acceptance Criteria

- AC-LESSON-001
- AC-LESSON-002
- AC-LESSON-003

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Exit Criteria

- A scheduled Lesson can be completed end to end.
- Completion snapshot remains stable after content changes.
- Progress updates after completion.

## Excluded Work

- File uploads unless separately scoped.
- Video hosting.
- AI lesson help unless Phase 8 is active.

## Checklist

- [x] Implementation complete.
- [ ] Tests complete.
- [ ] Security checks complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
