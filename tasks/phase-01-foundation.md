# Phase 1: Foundation

## Goal

Bootstrap the repository for implementation without building product features.

## Business Value

Creates the technical baseline needed for every later phase: consistent TypeScript, workspace scripts, local database, and CI gates.

## Required Reading

- `docs/00-index.md`
- `docs/02-product-requirements.md`
- `docs/07-mvp-scope.md`
- `docs/11-system-architecture.md`
- `docs/28-deployment.md`
- `docs/29-development-standards.md`
- `docs/30-implementation-roadmap.md`

## Dependencies

- Documentation baseline complete.

## Implementation Tasks

- [ ] Create pnpm workspace configuration.
- [ ] Add frontend and backend package shells without product feature code.
- [ ] Add shared TypeScript strict configuration.
- [ ] Add lint, typecheck, test, and build scripts.
- [ ] Add formatting configuration if selected.
- [ ] Add environment variable validation approach.

## Database Tasks

- [ ] Add Docker Compose PostgreSQL service.
- [ ] Document local database creation.
- [ ] Do not create domain migrations until schema implementation is scoped.

## Backend Tasks

- [ ] Create NestJS package shell.
- [ ] Add health-check placeholder.
- [ ] Add common error and logging structure.

## Frontend Tasks

- [ ] Create Vite React package shell.
- [ ] Add route shell for public and authenticated layouts.
- [ ] Add design-system token placeholders.

## Test Tasks

- [ ] Add Vitest configuration.
- [ ] Add smoke tests for package setup.
- [ ] Add CI test command.

## Documentation Tasks

- [ ] Update README with actual local setup commands.
- [ ] Update deployment doc with created Docker services.
- [ ] Record tooling decisions in `docs/38-decisions.md` if changed.

## Security Checks

- [ ] Confirm `.env` is ignored.
- [ ] Keep `.env.example` placeholders only.
- [ ] Do not commit secrets or generated credentials.

## Acceptance Criteria

- Supports future AC-AUTH, AC-TRACK, AC-PLAN, and AC-ASSESS implementation.
- Foundation scripts exist and run.

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Exit Criteria

- Workspace installs cleanly.
- Required scripts pass.
- CI workflow is present.
- Local PostgreSQL service can start.

## Excluded Work

- Authentication implementation.
- Product page implementation.
- Domain database migrations.
- AI integration.

## Checklist

- [ ] Implementation complete.
- [ ] Tests complete.
- [ ] Documentation updated.
- [ ] Validation commands passed.
