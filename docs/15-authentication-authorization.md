# Authentication and Authorization

## Registration

- Accept email, password, display name, and time zone.
- Normalize email by trimming and lowercasing before uniqueness checks.
- Validate password length and complexity according to implementation policy.
- Hash passwords with Argon2id preferred.
- Create a User, UserProfile, default LEARNER role, and server-side session in one transaction.
- Return a secure HTTP-only cookie.

Phase 2 implementation parameters:

- Email normalization trims leading/trailing whitespace and lowercases before validation and lookup.
- Password policy requires at least 12 characters and at least one uppercase letter, lowercase letter, number, and symbol.
- Password hashes use Argon2id through `@node-rs/argon2` with memory cost 19,456 KiB, time cost 3, parallelism 1, and 32-byte output.
- Duplicate registration emails return `VALIDATION_FAILED` with `field: "email"`.

## Login

- Use normalized email lookup.
- Verify password hash with constant-time comparison through the password library.
- Return a generic error for invalid credentials.
- Rate-limit by IP and normalized email.
- Rotate session on successful login.

Phase 2 rate limiting is process-local for the MVP: 5 failed login attempts per 15 minutes per IP and normalized email. A successful login resets the bucket.

## Logout

- Revoke the current session server-side.
- Clear the cookie.
- Treat repeated logout as successful.

## Sessions

- Store only an opaque session identifier in the cookie.
- Store a hash of the session identifier in the database.
- Use `HttpOnly`, `SameSite=Lax` for local development and production default, `Secure=true` in production.
- Set explicit expiration; MVP default is 14 days.
- Revoke sessions on logout and administrative disablement.

Phase 2 stores the raw opaque token only in the `skilltogether.sid` HTTP-only cookie. The database stores an HMAC-SHA-256 hash of that token using `SESSION_SECRET`.

## CSRF

- State-changing GraphQL operations require CSRF protection.
- Use SameSite cookies plus a CSRF token or double-submit strategy.
- Reject missing or invalid CSRF token with `CSRF_INVALID`.

Phase 2 exposes anonymous `csrfToken`, which sets `skilltogether.csrf` as a non-HTTP-only signed double-submit cookie. Mutations must echo the token in the `x-csrf-token` header. CSRF tokens are not authentication tokens.

## CORS

- Allow only configured frontend origins.
- Include credentials only for allowed origins.
- Do not use wildcard CORS with credentials.

Runtime configuration is controlled by `WEB_ORIGIN` and comma-separated `CORS_ALLOWED_ORIGINS`. Wildcard origins are not used with credentials.

## Password Reset

Password reset may be implemented during hardening if email is available:

- Generate one-time token, store only token hash, expire quickly.
- Do not reveal whether email exists.
- Invalidate existing sessions after reset.
- Audit reset completion.

## Email Verification

Email verification is recommended before production:

- Store verification token hash and expiration.
- Restrict sensitive account changes until verified where required.
- Keep login available or unavailable according to product decision recorded in [38 Decisions](38-decisions.md).

## Roles

| Role | Permission Summary |
| --- | --- |
| LEARNER | Own profile, enrollments, tasks, attempts, reflections, assessments, and partner invitations. |
| CONTENT_ADMIN | Manage Lesson Versions, Assessment Versions, Questions, and content audit views. |
| SYSTEM_ADMIN | Operational support only; avoid broad data access unless explicitly implemented and audited. |

## Object Ownership

Server-side authorization must check:

- user owns Enrollment, Study Plan, Study Week, Daily Task, Task Attempt, Reflection, and Assessment Attempt;
- user is a member of a Partner Connection before viewing shared progress;
- admin has CONTENT_ADMIN role before content mutations;
- archived or private content is not visible through learner queries unless already snapshotted in the learner's history.

## Partner Visibility

Partners may see:

- planned study-session count;
- completed-session count;
- weekly completion percentage;
- current streak;
- whether a weekly assessment was completed;
- overall Learning Track progress;
- optional encouragement status.

Partners may not see:

- private notes;
- exact assessment answers;
- AI conversations;
- passwords or authentication data;
- personal information not explicitly shared;
- private reflections unless learner opts in.

## Administrator Permissions

Content Administrators can:

- create and edit DRAFT content;
- submit content for review;
- approve reviewed content;
- archive content;
- manage reviewed assessment questions;
- view content audit history.

Content Administrators cannot bypass learner privacy by default.

## Threat Cases

| Threat | Control |
| --- | --- |
| Session theft | HTTP-only cookies, secure flag, session hashing, revocation. |
| Credential stuffing | Rate limiting, generic errors, monitoring. |
| CSRF | SameSite plus CSRF tokens for mutations. |
| IDOR | Object-level authorization before reads and writes. |
| Partner data leakage | Dedicated shared progress DTOs and tests. |
| Admin misuse | Role checks and audit events. |
| XSS token theft | No tokens in localStorage; output escaping and sanitization. |
