# Observability

## Structured Logging

Use structured JSON logs with:

- timestamp;
- level;
- request ID;
- user ID where safe;
- operation name;
- error code;
- duration;
- redacted metadata.

Do not log sensitive fields listed in [26 Security](26-security.md).

## Request IDs

- Generate or accept a request ID at the API boundary.
- Include request ID in logs, error responses where safe, and external provider calls.
- Surface request ID on generic error pages.

## Metrics

Technical metrics:

- API request count, latency, and error rate;
- GraphQL operation latency;
- database query latency;
- session creation and rejection;
- background job success and failure;
- AI provider latency, timeout, and invalid-output count.

Product metrics:

- onboarding completion;
- daily task completion;
- missed-task count;
- recovery proposal acceptance;
- weekly assessment completion;
- partner invitation acceptance;
- weak-topic frequency.

## Tracing

Distributed tracing is optional for MVP. If introduced, trace:

- GraphQL request lifecycle;
- database calls;
- AI provider calls;
- background jobs.

## Audit Events

Audit:

- registration;
- login failure threshold events;
- logout and session revocation;
- onboarding activation;
- Daily Task completion;
- missed-task recovery application;
- assessment submission and grading;
- partner invitation acceptance, removal, and blocking;
- content approval and archival;
- role changes.

Audit metadata must be safe and redacted.

## Health Checks

| Check | Purpose |
| --- | --- |
| Liveness | Process is running. |
| Readiness | API can reach PostgreSQL and required dependencies. |
| Version | Build version and commit SHA when available. |

## Error Monitoring

- Use Sentry or equivalent.
- Group errors by stable code and stack.
- Redact GraphQL variables.
- Alert on repeated auth, database, scheduling, assessment, and AI failures.

## Alerting

Initial alerts:

- API error rate above threshold for 5 minutes;
- database unavailable;
- background job failing repeatedly;
- login failure spike;
- AI timeout spike if AI enabled;
- assessment submission failures.

## Dashboards

MVP operational dashboard:

- request rate and latency;
- error rate by operation;
- database health;
- job status;
- assessment submission health;
- recovery conflicts;
- AI health if enabled.

MVP product dashboard:

- active enrollments;
- daily completion rate;
- missed and recovered sessions;
- assessment pass rate;
- partner invitation conversion.

## Retention

- Application logs: 30 days for MVP unless provider policy differs.
- Audit events: retain indefinitely until a data-retention policy is finalized.
- AI diagnostic metadata: 30 days by default with redaction.

## Sensitive-Data Redaction

Redact:

- credentials;
- session and CSRF tokens;
- exact assessment answers;
- private reflections;
- AI prompt bodies containing learner text;
- partner private identifiers not needed for the log event.
