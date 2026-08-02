# API Error Catalogue

Each API error must include a stable code, safe user message, internal detail, GraphQL handling, retryability, and logging level.

## Common

| Code | Meaning | Safe User Message | Internal Detail | Handling | Retryable | Log Level |
| --- | --- | --- | --- | --- | --- | --- |
| VALIDATION_FAILED | Input failed validation. | Check the highlighted fields and try again. | Field-level validation errors. | GraphQL user error with fields. | No | info |
| NOT_FOUND | Resource not found or unavailable. | This item is not available. | Resource missing or hidden by authorization. | GraphQL error. | No | info |
| CONFLICT | State changed before operation completed. | Refresh and try again. | Optimistic status mismatch. | GraphQL error. | Yes | warn |
| INTERNAL_ERROR | Unexpected server error. | Something went wrong. Try again later. | Exception details in logs only. | GraphQL error with request ID. | Yes | error |

## Authentication and Authorization

| Code | Meaning | Safe User Message | Internal Detail | Handling | Retryable | Log Level |
| --- | --- | --- | --- | --- | --- | --- |
| AUTH_REQUIRED | No valid session. | Please log in to continue. | Missing, expired, or revoked session. | GraphQL auth error. | No | info |
| AUTH_INVALID_CREDENTIALS | Login failed. | Email or password is incorrect. | Password verification failed or user missing. | GraphQL user error. | No | warn |
| AUTH_FORBIDDEN | User lacks permission. | You do not have access to this item. | Ownership or role check failed. | GraphQL forbidden error. | No | warn |
| CSRF_INVALID | CSRF token missing or invalid. | Refresh the page and try again. | Token mismatch. | Reject mutation. | Yes | warn |
| AUTH_RATE_LIMITED | Too many auth attempts. | Too many attempts. Try again later. | Rate limit exceeded. | GraphQL user error with retry-after. | Yes | warn |

Phase 2 auth mapping:

- Duplicate registration email uses `VALIDATION_FAILED` with `field: "email"`.
- Missing, expired, revoked, or disabled-user sessions use `AUTH_REQUIRED`.
- Missing or mismatched CSRF cookie/header pairs use `CSRF_INVALID`.
- Login with a missing user, disabled user, or bad password uses the generic `AUTH_INVALID_CREDENTIALS`.
- Exceeded process-local login throttles use `AUTH_RATE_LIMITED`.

## Planning and Lessons

| Code | Meaning | Safe User Message | Internal Detail | Handling | Retryable | Log Level |
| --- | --- | --- | --- | --- | --- | --- |
| PLAN_NOT_FOUND | Study Plan or Study Week not found. | The plan is not available. | Missing plan or unauthorized access. | GraphQL error. | No | info |
| PLAN_CAPACITY_EXCEEDED | Schedule exceeds availability. | This schedule does not fit your available time. | Capacity calculation failed. | Validation error. | No | info |
| PLAN_RECOVERY_CONFLICT | No automatic recovery option. | Review recovery options manually. | No valid deterministic slot. | Return conflict payload. | No | warn |
| LESSON_NOT_APPROVED | Lesson version is not approved for official use. | This lesson is not ready yet. | Content status invalid. | GraphQL error. | No | warn |
| LESSON_EVIDENCE_REQUIRED | Completion evidence missing or invalid. | Add the required completion evidence. | Evidence schema validation failed. | Field error. | No | info |
| TASK_ALREADY_COMPLETED | Completed task cannot be changed by this action. | This task is already completed. | Status transition rejected. | GraphQL conflict. | No | info |

## Assessments

| Code | Meaning | Safe User Message | Internal Detail | Handling | Retryable | Log Level |
| --- | --- | --- | --- | --- | --- | --- |
| ASSESSMENT_NOT_ELIGIBLE | Learner cannot start assessment. | This assessment is not available yet. | Missing completed approved lessons or version. | GraphQL error. | No | info |
| ASSESSMENT_ALREADY_SUBMITTED | Attempt already submitted. | This assessment was already submitted. | Duplicate submission. | Conflict. | No | info |
| ASSESSMENT_INVALID_ANSWER | Answer does not match question format. | Check your answer format. | Question-specific schema failed. | Field error. | No | info |
| ASSESSMENT_SCORING_FAILED | Scoring failed. | Your answers were saved. Scoring will be retried. | Scoring exception. | Mark retry/manual. | Yes | error |

## Partner

| Code | Meaning | Safe User Message | Internal Detail | Handling | Retryable | Log Level |
| --- | --- | --- | --- | --- | --- | --- |
| PARTNER_INVITATION_EXISTS | Duplicate pending invitation. | An invitation is already pending. | Same inviter and invitee email. | Conflict. | No | info |
| PARTNER_INVITATION_EXPIRED | Invitation expired. | This invitation has expired. | Expiration passed. | GraphQL error. | No | info |
| PARTNER_CONNECTION_NOT_FOUND | Connection unavailable. | This partner connection is not available. | Missing, removed, or unauthorized. | GraphQL error. | No | info |
| PARTNER_BLOCKED | Invitation blocked. | This invitation cannot be sent. | Block rule matched. | GraphQL error. | No | warn |

## Content Administration

| Code | Meaning | Safe User Message | Internal Detail | Handling | Retryable | Log Level |
| --- | --- | --- | --- | --- | --- | --- |
| CONTENT_NOT_FOUND | Content record missing. | This content is not available. | Missing or unauthorized admin content. | GraphQL error. | No | info |
| CONTENT_INVALID_STATUS | Invalid content state transition. | This content cannot move to that status. | Status transition rule failed. | Conflict. | No | warn |
| CONTENT_APPROVAL_FAILED | Approval validation failed. | Complete required content fields before approval. | Missing lesson or question fields. | Validation error. | No | info |
| CONTENT_VERSION_CONFLICT | Version changed during edit. | Refresh and review the latest version. | Optimistic version mismatch. | Conflict. | Yes | warn |

## AI

| Code | Meaning | Safe User Message | Internal Detail | Handling | Retryable | Log Level |
| --- | --- | --- | --- | --- | --- | --- |
| AI_DISABLED | AI provider disabled. | AI help is not enabled right now. | Provider set to disabled. | Hide or reject AI action. | No | info |
| AI_RATE_LIMITED | AI usage limit exceeded. | Try AI help again later. | User/action limit exceeded. | Retry-after response. | Yes | warn |
| AI_PROVIDER_TIMEOUT | AI provider timed out. | AI help is unavailable right now. | Timeout. | Fallback. | Yes | warn |
| AI_INVALID_OUTPUT | Provider output failed schema validation. | AI help is unavailable right now. | Invalid response shape. | Fallback and log. | No | warn |
| AI_SAFETY_REJECTED | AI action rejected by policy or validation. | This AI request cannot be completed. | Safety or privacy rule failed. | Safe rejection. | No | warn |
