# AI Integration

AI is optional for the MVP and must be isolated behind a provider interface. The product must remain usable when `AI_PROVIDER=disabled`.

## Allowed AI Features

- Explain a Lesson differently.
- Simplify an explanation.
- Create an additional example from approved content.
- Generate extra practice questions from approved content for non-official practice.
- Provide formative feedback on written answers.
- Summarize a weekly reflection for the learner.
- Recommend revision topics from approved tags and scores.

## Prohibited AI Responsibilities

AI must not:

- silently change official curriculum;
- create official assessments from unapproved sources;
- access another user's private information;
- overwrite approved content;
- decide authorization;
- control deterministic scheduling;
- be the only grader for objective questions;
- expose secrets;
- receive unnecessary personal information.

## Provider Interface

```ts
interface AiProvider {
  generate<TRequest, TResponse>(
    request: AiRequest<TRequest>,
    schema: ResponseSchema<TResponse>,
  ): Promise<AiProviderResult<TResponse>>;
}
```

The interface is conceptual documentation, not implementation code. Concrete adapters must support timeout, retry, redaction, and schema validation.

## Request Contract

| Field | Description |
| --- | --- |
| action | Stable action such as `EXPLAIN_DIFFERENTLY` or `FORMATIVE_FEEDBACK`. |
| userId | Internal ID for rate limiting and audit; do not send externally unless required. |
| lessonVersionId | Approved source content reference. |
| assessmentAttemptId | Optional, only for feedback actions. |
| promptInputs | Minimal approved lesson content, learner question, answer text, and requested style. |
| locale | Optional language or locale. |
| privacyLevel | Indicates whether private learner text is included. |

## Response Contract

| Field | Description |
| --- | --- |
| status | `SUCCESS`, `FALLBACK`, or `REJECTED`. |
| contentMarkdown | Learner-visible response if valid. |
| citations | References to approved lesson sections or resources used. |
| limitations | Short warning when feedback is formative, incomplete, or uncertain. |
| suggestedTags | Optional assessment tags for revision suggestions. |
| providerMetadata | Redacted operational metadata only. |

## Prompt Inputs

Allowed inputs:

- approved Lesson Version title, objective, explanation, examples, exercises, common mistakes, assessment tags;
- learner's current question;
- learner's own written answer when feedback is requested;
- score and weak tags when generating revision guidance.

Disallowed inputs:

- partner private records;
- exact answers from another learner;
- passwords, tokens, session IDs;
- raw audit logs;
- private reflections unless the learner requests the action.

## Structured Output and Validation

- Every AI action must define a response schema.
- Invalid output is discarded.
- User-facing fallback must be safe and non-blocking.
- Store redacted metadata for diagnostics, not full prompts by default.

## Rate Limiting, Timeout, and Retry

- Rate-limit by user and action.
- Default timeout: 15 seconds.
- Default retries: one retry for transient provider errors.
- Do not retry validation failures.
- Show fallback if provider remains unavailable.

## Privacy and Audit

- Log action, user ID, lesson version ID, status, provider latency, and error code.
- Redact learner private text unless explicit debugging retention is approved.
- Do not use AI logs as training data unless a future policy explicitly permits it.

## Prompt-Injection Considerations

- Treat lesson content and learner text as untrusted input.
- System instruction must state that approved curriculum and platform rules outrank user-provided text.
- AI output cannot trigger privileged operations.
- Links or resource suggestions from AI are not official until reviewed.

## Failure Fallbacks

| Failure | Fallback |
| --- | --- |
| Provider disabled | Hide or disable AI controls. |
| Timeout | Show message that AI help is unavailable and keep Lesson usable. |
| Invalid schema | Discard response and log `AI_INVALID_OUTPUT`. |
| Rate limit | Show retry-after guidance. |
| Safety rejection | Show a safe explanation and no generated content. |
