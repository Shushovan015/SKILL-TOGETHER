# German Resource Architecture

Resource records should support curriculum authoring without duplicating content for every session length. Activities reference resources and scheduling selects which activities fit the available time.

## Resource Types

| Resource type | Purpose | Examples | Required metadata |
|---|---|---|---|
| OFFICIAL_DOCS | Authoritative grammar, CEFR, or institutional reference | CEFR descriptor notes, spelling conventions, form templates | level, domain, license/source, update date |
| TEXT_INPUT | Reading source for a learning unit | dialogue, notice, article excerpt, email, report | level, word count, register, vocabulary tags, grammar tags |
| AUDIO_INPUT | Listening source | dialogue, announcement, interview, lecture excerpt | level, duration, speed, speaker count, accent, transcript status |
| VISUAL_INPUT | Meaning-bearing image, chart, form, or diagram | map, menu, timetable, chart, official form | level, alt text, domain, task use |
| VOCABULARY_SET | Words, chunks, collocations, and word families | shopping chunks, stance markers, domain terminology | level, domain, part of speech, collocation group |
| GRAMMAR_PROMPT_SET | Contextualized grammar examples and transformations | word-order prompts, passive process prompts | level, concept, prerequisite, answer key |
| PRONUNCIATION_CUE | Segmental or prosodic practice cue | ch contrast, sentence stress, presentation prosody | level, sound/prosody tag, audio support, feedback rule |
| PRACTICE_BANK | Controlled and guided practice items | matching, cloze, transformation, role cards | level, skill, answer key/rubric, priority |
| TASK_CARD | Real-world task definition | appointment change, chart briefing, expert synthesis | level, evidence type, rubric, time range |
| RUBRIC | Assessment scoring guide | weekly check rubric, module task rubric | level, assessment type, dimensions, mastery threshold |
| CULTURE_NOTE | Pragmatic-cultural guidance | du/Sie, official tone, hedging, irony risk | level, context, convention, examples |
| REMEDIATION_PACK | Recovery activities for missed concepts | review prompts, alternate input, micro-check | target concept, source unit, estimated time, priority |

## Activity-to-Resource Mapping

| Activity type | Typical resource dependencies |
|---|---|
| explanation/input | OFFICIAL_DOCS, TEXT_INPUT, CULTURE_NOTE |
| vocabulary activity | VOCABULARY_SET, TEXT_INPUT, AUDIO_INPUT |
| grammar-in-context | GRAMMAR_PROMPT_SET, TEXT_INPUT |
| listening | AUDIO_INPUT, transcript, task questions |
| reading | TEXT_INPUT, VISUAL_INPUT, annotation prompts |
| pronunciation | PRONUNCIATION_CUE, AUDIO_INPUT |
| controlled practice | PRACTICE_BANK, answer key |
| guided production | TASK_CARD, model text/dialogue, rubric |
| independent production | TASK_CARD, RUBRIC |
| speaking | role cards, TASK_CARD, RUBRIC |
| writing | prompt, model, RUBRIC |
| interaction | role cards, repair phrase bank, RUBRIC |
| mediation | source input, audience profile, RUBRIC |
| retrieval/review | REMEDIATION_PACK, spaced retrieval set |
| knowledge check | item bank, answer key, threshold rule |
| real-world task | TASK_CARD, resources required by task, RUBRIC |

## Authoring Rules

- Keep resources reusable across 30, 45, 60, and 90 minute sessions.
- Store duration and priority on activities, not duplicate resources.
- Tag resources by CEFR sublevel, module, learning unit, skill, grammar concept, vocabulary domain, pronunciation target, and assessment purpose.
- Do not create mass seed content from this architecture. Author learner-facing resources in controlled batches and verify them through assessment and accessibility review.
