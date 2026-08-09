# Security

## Threat Model Scope

SkillTogether stores personal profiles, learning progress, private reflections, assessment answers, partner connections, and optional AI interaction metadata. The MVP threat model focuses on protecting private learner data and preventing unauthorized changes.

## Authentication Risks

| Risk | Control |
| --- | --- |
| Weak password storage | Argon2id password hashing with documented parameters. |
| Credential stuffing | Rate limits, generic errors, logging, alerting. |
| Session theft | HTTP-only cookies, secure flag in production, session hashing, revocation. |
| Session fixation | Rotate session on login. |

## Authorization and IDOR

- Every private query and mutation must check user ownership.
- Partner access must use Partner Connection checks.
- Admin access must use CONTENT_ADMIN role checks.
- Do not reveal whether another user's resource exists.
- Add tests for horizontal and vertical privilege escalation.

## Session Attacks and CSRF

- Use SameSite cookies.
- Require CSRF token for state-changing GraphQL operations.
- Validate allowed origins.
- Do not enable wildcard CORS with credentials.

Phase 2 stores only opaque session cookies in the browser, hashes session identifiers with HMAC-SHA-256 before persistence, and uses a signed double-submit CSRF cookie/header pair for GraphQL mutations.

## XSS

- Escape user-generated content by default.
- Sanitize rendered Markdown.
- Disallow arbitrary script, iframe, and unsafe HTML in lesson/admin content unless a future sanitizer policy explicitly permits safe subsets.
- Do not store tokens in localStorage.

## GraphQL Abuse

- Limit query depth and complexity.
- Disable introspection in production unless protected.
- Rate-limit expensive operations.
- Validate pagination limits.
- Avoid returning raw internal errors.

## Input Validation

- Validate all external input with GraphQL types and server-side schemas.
- Validate JSONB payloads before persistence.
- Validate URLs in resources.
- Validate AI provider output before display.

## Password Security

- Minimum password length: 12 characters for MVP unless product changes.
- Reject common weak passwords if a local list is available.
- Never log passwords.
- Never email passwords.

Phase 2 implementation uses Argon2id with memory cost 19,456 KiB, time cost 3, parallelism 1, and 32-byte output. The implemented password policy requires uppercase, lowercase, number, and symbol characters. No local common-password list is bundled yet.

## Secrets

- Keep secrets in environment variables or managed secret stores.
- `.env.example` contains placeholders only.
- Do not commit `.env`.
- Rotate exposed secrets immediately.

## Logging

Never log:

- password hashes;
- raw passwords;
- session IDs or token values;
- CSRF tokens;
- private reflections;
- exact assessment answers;
- full AI prompts containing private learner text.

## Dependency Risk

- Use lockfiles once dependencies are installed.
- Run dependency audit in CI when available.
- Keep GraphQL, session, Markdown sanitizer, and password hashing libraries current.

## AI-Specific Risks

| Risk | Control |
| --- | --- |
| Prompt injection | Treat lesson and learner input as untrusted; validate output. |
| Data leakage | Minimize prompt inputs and redact logs. |
| Hallucinated resources | AI resources are not official until reviewed. |
| Unauthorized decisions | AI cannot decide auth, scheduling, or official grading. |

## Personal Data

- Collect only data needed for learning and accountability.
- Provide privacy defaults for reflections.
- Keep partner sharing explicit.
- Document future account deletion before production if required by jurisdiction.

Phase 7 partner sharing is connection-scoped and returns only `ProgressSnapshot` summary fields. Invitation tokens are stored hashed; active partner dashboards do not expose private reflections, assessment answers, AI conversations, credentials, or session data.

## Backups

- Use managed PostgreSQL backups in production.
- Encrypt backups at rest where provider supports it.
- Limit backup access.
- Test restore procedure before production launch.

## Administrator Misuse

- Admin actions are role-gated.
- Content approval, archival, and assessment changes are audited.
- Admins do not get learner private answers by default unless grading workflow requires it and is audited.

## Incident Handling

1. Triage severity and affected data.
2. Revoke exposed sessions or credentials.
3. Preserve logs and audit events.
4. Patch vulnerability.
5. Notify affected users if required.
6. Record follow-up decision or control change.
