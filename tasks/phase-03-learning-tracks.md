# Phase 3: Learning Tracks

## Goal

Implement predefined Learning Tracks, Modules, Lessons, Lesson Versions, resources, exercises, and basic content administration.

## Business Value

Gives learners approved curriculum content and gives administrators a safe way to manage versioned lessons.

## Required Reading

- `docs/09-domain-model.md`
- `docs/10-database-schema.md`
- `docs/17-learning-content-model.md`
- `docs/32-seed-data.md`
- `docs/33-curriculum-software-engineering.md`
- `docs/34-curriculum-project-management.md`
- `docs/35-curriculum-german.md`
- `docs/36-content-authoring-guide.md`

## Dependencies

- Phase 2 authentication and admin role support.

## Implementation Tasks

- [x] Implement Learning Track browsing.
- [x] Implement Module and Lesson summary queries.
- [x] Implement Lesson Version status transitions.
- [x] Implement basic admin content list.
- [x] Implement admin Lesson Version editor.
- [x] Seed first four weeks of approved content and the complete Software Engineering career programme.

## Database Tasks

- [x] Create learning_tracks, modules, lessons, lesson_versions tables.
- [x] Create resources, exercises, knowledge_checks tables.
- [x] Add content status enum and indexes.
- [x] Add content audit events.

## Backend Tasks

- [x] Add ContentModule.
- [x] Add repositories for tracks and lesson versions.
- [x] Add admin content service.
- [x] Add approval validation.
- [x] Exclude unapproved content from learner queries.

## Frontend Tasks

- [x] Build track browse view.
- [x] Build roadmap module list.
- [x] Build admin content list.
- [x] Build admin lesson editor form.
- [x] Show loading, empty, error, and permission states.

## Test Tasks

- [ ] Integration test seed content idempotency.
- [ ] GraphQL test track listing.
- [ ] GraphQL test admin approval authorization.
- [ ] Component test admin content states.
- [ ] Accessibility test admin forms.

## Documentation Tasks

- [x] Update seed-data doc with actual seed IDs.
- [ ] Update content model if implementation fields differ.
- [x] Record decisions for content tooling changes.

## Security Checks

- [x] Learners cannot approve content.
- [x] Admin operations are role-gated.
- [ ] Rendered Markdown is sanitized.
- [x] External resource URLs are validated.

## Acceptance Criteria

- AC-TRACK-001
- AC-TRACK-002
- AC-ADMIN-001

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Exit Criteria

- Active predefined tracks are queryable.
- Approved Lesson Versions are available for scheduling.
- Unapproved content is not used in learner scheduling.

## Excluded Work

- Public marketplace.
- Generated curricula.
- Full CMS workflow beyond basic admin content management.

## Checklist

- [x] Implementation complete.
- [ ] Tests complete.
- [x] Documentation updated.
- [x] Validation commands passed.
