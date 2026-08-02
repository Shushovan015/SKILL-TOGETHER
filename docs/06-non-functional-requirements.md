# Non-Functional Requirements

## Performance

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-PERF-001 | Dashboard initial API response for authenticated users. | p95 under 500 ms with seeded MVP data. |
| NFR-PERF-002 | Lesson page API response. | p95 under 700 ms excluding optional AI calls. |
| NFR-PERF-003 | Scheduling recovery proposal. | p95 under 1 second for one active Enrollment. |
| NFR-PERF-004 | Frontend route transition after data is cached. | User-visible update under 200 ms. |

## Accessibility

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-A11Y-001 | WCAG target. | WCAG 2.2 AA for MVP critical flows. |
| NFR-A11Y-002 | Keyboard support. | All interactive controls reachable and operable by keyboard. |
| NFR-A11Y-003 | Focus visibility. | Visible focus indicator for all controls. |
| NFR-A11Y-004 | Assessment controls. | Question groups, validation, and feedback exposed semantically. |

## Security

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-SEC-001 | Session storage. | Server-side sessions with secure HTTP-only cookies. |
| NFR-SEC-002 | Password hashing. | Argon2id preferred with documented parameters. |
| NFR-SEC-003 | Authorization. | Object-level checks for every private resource. |
| NFR-SEC-004 | Rate limiting. | Login, registration, AI, and mutation endpoints protected. |

## Availability and Reliability

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-REL-001 | MVP uptime goal after production launch. | 99.5% monthly excluding planned maintenance. |
| NFR-REL-002 | Health checks. | Liveness and readiness endpoints for API and database dependency. |
| NFR-REL-003 | Background retries. | Retry safe jobs with bounded attempts and idempotency keys. |

## Browser Support and Responsiveness

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-BROWSER-001 | Supported browsers. | Latest two stable versions of Chrome, Edge, Firefox, and Safari. |
| NFR-RESP-001 | Responsive breakpoints. | Usable at 360 px width and above. |
| NFR-RESP-002 | Dashboard layout. | Today's task remains first on mobile and desktop. |

## Maintainability

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-MAINT-001 | TypeScript strictness. | `strict: true`; no unjustified `any`. |
| NFR-MAINT-002 | Module boundaries. | Feature modules with explicit public APIs. |
| NFR-MAINT-003 | Documentation drift. | API, database, and domain docs updated with behavior changes. |

## Privacy and Data Integrity

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-PRIV-001 | Partner privacy. | Shared progress DTOs exclude private notes, exact answers, AI conversations, and credentials. |
| NFR-PRIV-002 | Data minimization. | AI prompts include only fields required for the specific action. |
| NFR-DATA-001 | Historical snapshots. | Completed attempts retain lesson and assessment snapshot fields. |
| NFR-DATA-002 | Constraints. | Database constraints enforce unique, foreign-key, and enum invariants where possible. |

## Observability

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-OBS-001 | Structured logging. | JSON logs with request ID, user ID where safe, operation, and error code. |
| NFR-OBS-002 | Metrics. | Request latency, error rate, assessment completion, scheduling conflicts, AI failures. |
| NFR-OBS-003 | Audit events. | Authentication, admin content changes, assessment submission, partner sharing changes. |

## Backup and Recovery

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-BACKUP-001 | Database backups. | Daily managed backups in production with documented restore test. |
| NFR-BACKUP-002 | Recovery point objective. | 24 hours for MVP. |
| NFR-BACKUP-003 | Recovery time objective. | 4 hours for MVP. |

## Testing

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-TEST-001 | Critical domain tests. | Scheduling, assessment, authorization, and partner visibility covered before MVP release. |
| NFR-TEST-002 | CI gates. | Lint, typecheck, test, and build pass before merge. |
| NFR-TEST-003 | E2E coverage. | Registration, onboarding, lesson completion, recovery, assessment, and partner invitation. |

## Scalability

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-SCALE-001 | MVP design. | Modular monolith supports hundreds of active learners without architectural change. |
| NFR-SCALE-002 | Database indexes. | Index user-scoped access paths, due dates, statuses, and foreign keys. |
| NFR-SCALE-003 | AI isolation. | AI calls can be disabled, rate-limited, and retried independently. |
