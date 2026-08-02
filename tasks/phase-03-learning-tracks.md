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

- [ ] Implement Learning Track browsing.
- [ ] Implement Module and Lesson summary queries.
- [ ] Implement Lesson Version status transitions.
- [ ] Implement basic admin content list.
- [ ] Implement admin Lesson Version editor.
- [ ] Seed first four weeks of approved content.

## Database Tasks

- [ ] Create learning_tracks, modules, lessons, lesson_versions tables.
- [ ] Create resources, exercises, knowledge_checks tables.
- [ ] Add content status enum and indexes.
- [ ] Add content audit events.

## Backend Tasks

- [ ] Add ContentModule.
- [ ] Add repositories for tracks and lesson versions.
- [ ] Add admin content service.
- [ ] Add approval validation.
- [ ] Exclude unapproved content from learner queries.

## Frontend Tasks

- [ ] Build track browse view.
- [ ] Build roadmap module list.
- [ ] Build admin content list.
- [ ] Build admin lesson editor form.
- [ ] Show loading, empty, error, and permission states.

## Test Tasks

- [ ] Integration test seed content idempotency.
- [ ] GraphQL test track listing.
- [ ] GraphQL test admin approval authorization.
- [ ] Component test admin content states.
- [ ] Accessibility test admin forms.

## Documentation Tasks

- [ ] Update seed-data doc with actual seed IDs.
- [ ] Update content model if implementation fields differ.
- [ ] Record decisions for content tooling changes.

## Security Checks

- [ ] Learners cannot approve content.
- [ ] Admin operations are role-gated.
- [ ] Rendered Markdown is sanitized.
- [ ] External resource URLs are validated.

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

- [ ] Implementation complete.
- [ ] Tests complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
