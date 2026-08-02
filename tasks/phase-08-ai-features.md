# Phase 8: AI Features

## Goal

Add optional AI-assisted explanations and formative feedback behind a provider interface, with validation, privacy controls, rate limits, and fallbacks.

## Business Value

Helps learners understand difficult material without making AI authoritative for curriculum, scheduling, authorization, or official grading.

## Required Reading

- `docs/16-ai-integration.md`
- `docs/17-learning-content-model.md`
- `docs/18-assessment-engine.md`
- `docs/26-security.md`
- `docs/37-api-error-catalogue.md`

## Dependencies

- Core lesson and assessment flows complete.
- Approved Lesson Versions available.

## Implementation Tasks

- [ ] Add AI provider interface.
- [ ] Add disabled provider for local and default mode.
- [ ] Add provider adapter if selected.
- [ ] Add prompt builder for alternate explanation.
- [ ] Add formative feedback action if in scope.
- [ ] Add response schema validation.
- [ ] Add AI fallback UI.
- [ ] Add feature flag and rate limiting.

## Database Tasks

- [ ] Add AI audit or metadata table if needed.
- [ ] Ensure no full private prompts are stored by default.
- [ ] Add indexes for AI rate-limit tracking if persisted.

## Backend Tasks

- [ ] Add AiModule.
- [ ] Add action-specific request contracts.
- [ ] Add privacy redaction.
- [ ] Add timeout and retry handling.
- [ ] Map provider errors to AI error codes.

## Frontend Tasks

- [ ] Add AI help control to Lesson page only when enabled.
- [ ] Show generated explanation with limitations.
- [ ] Show provider unavailable fallback.
- [ ] Avoid blocking task completion on AI failure.

## Test Tasks

- [ ] Unit test prompt input minimization.
- [ ] Unit test schema validation rejection.
- [ ] Integration test provider timeout fallback.
- [ ] Security test redacted logging.
- [ ] Component test AI disabled and error states.

## Documentation Tasks

- [ ] Update AI integration doc with provider selected.
- [ ] Update security doc with provider-specific privacy notes.
- [ ] Record provider decision in `docs/38-decisions.md`.

## Security Checks

- [ ] AI receives only necessary context.
- [ ] AI cannot access partner private data.
- [ ] AI cannot mutate curriculum, schedule, auth, or grades.
- [ ] AI logs are redacted.

## Acceptance Criteria

- AC-AI-001
- AC-AI-002

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Exit Criteria

- App works with AI disabled.
- Enabled AI actions are grounded, validated, rate-limited, and non-blocking.

## Excluded Work

- AI scheduling.
- Official autonomous grading.
- Full curriculum generation.
- Voice tutoring.

## Checklist

- [ ] Implementation complete.
- [ ] Tests complete.
- [ ] Privacy checks complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
