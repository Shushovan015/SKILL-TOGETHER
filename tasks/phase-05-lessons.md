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

- [ ] Build scheduled Lesson query.
- [ ] Build Lesson page.
- [ ] Build Exercise page or section.
- [ ] Implement start task mutation.
- [ ] Implement complete task mutation.
- [ ] Record duration and completion evidence.
- [ ] Record Learning Reflection with private default.
- [ ] Update Progress Snapshot after completion.

## Database Tasks

- [ ] Create task_attempts table.
- [ ] Create reflections table.
- [ ] Add lesson snapshot JSON validation.
- [ ] Add indexes for task attempts and reflections.

## Backend Tasks

- [ ] Add LessonCompletionService.
- [ ] Validate ownership and task status transitions.
- [ ] Validate completion evidence.
- [ ] Snapshot Lesson Version fields.
- [ ] Map completion errors to stable codes.

## Frontend Tasks

- [ ] Render Lesson sections.
- [ ] Render resources and knowledge checks.
- [ ] Build evidence form.
- [ ] Build reflection input.
- [ ] Handle save, completion, validation, and network errors.

## Test Tasks

- [ ] Unit test task status transitions.
- [ ] Integration test completion transaction.
- [ ] GraphQL test unauthorized task access.
- [ ] Component test Lesson page states.
- [ ] E2E test completing a lesson.

## Documentation Tasks

- [ ] Update content model if evidence schema changes.
- [ ] Update API docs if mutation shape changes.
- [ ] Update testing strategy with any new critical scenario.

## Security Checks

- [ ] Learners cannot complete another learner's task.
- [ ] Private reflection is not partner-visible by default.
- [ ] Markdown rendering is sanitized.

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

- [ ] Implementation complete.
- [ ] Tests complete.
- [ ] Security checks complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
