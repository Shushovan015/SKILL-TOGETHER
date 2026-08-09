BEGIN;

CREATE TYPE assessment_attempt_status AS ENUM (
  'NOT_STARTED',
  'IN_PROGRESS',
  'SUBMITTED',
  'NEEDS_MANUAL_GRADING',
  'GRADED',
  'PASSED',
  'FAILED'
);

CREATE TYPE question_type AS ENUM (
  'MULTIPLE_CHOICE',
  'MULTIPLE_SELECT',
  'TRUE_FALSE',
  'SHORT_ANSWER',
  'CODE_CHALLENGE',
  'DEBUGGING_CHALLENGE',
  'SCENARIO',
  'CASE_STUDY',
  'PRACTICAL_ASSIGNMENT',
  'REFLECTION'
);

CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES learning_tracks(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assessments_track_id_type_key UNIQUE (track_id, type)
);

CREATE TABLE assessment_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  version integer NOT NULL,
  status content_status NOT NULL DEFAULT 'REVIEWED',
  passing_percentage numeric(5,2) NOT NULL,
  rules jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  CONSTRAINT assessment_versions_assessment_id_version_key UNIQUE (assessment_id, version)
);

CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_version_id uuid NOT NULL REFERENCES assessment_versions(id) ON DELETE CASCADE,
  type question_type NOT NULL,
  prompt_md text NOT NULL,
  options jsonb,
  answer_key jsonb NOT NULL,
  points integer NOT NULL,
  assessment_tags text[] NOT NULL,
  grading_mode text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT questions_assessment_version_id_prompt_md_key UNIQUE (assessment_version_id, prompt_md)
);

CREATE TABLE assessment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  study_week_id uuid NOT NULL REFERENCES study_weeks(id) ON DELETE CASCADE,
  assessment_version_id uuid NOT NULL REFERENCES assessment_versions(id) ON DELETE RESTRICT,
  attempt_number integer NOT NULL DEFAULT 1,
  status assessment_attempt_status NOT NULL DEFAULT 'NOT_STARTED',
  started_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  graded_at timestamptz,
  score_earned numeric(7,2),
  score_possible numeric(7,2),
  percentage numeric(5,2),
  passed boolean,
  assessment_snapshot jsonb NOT NULL,
  CONSTRAINT assessment_attempts_user_week_version_attempt_key UNIQUE (user_id, study_week_id, assessment_version_id, attempt_number)
);

CREATE TABLE answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_attempt_id uuid NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  response jsonb NOT NULL,
  question_snapshot jsonb NOT NULL,
  score numeric(7,2),
  feedback text,
  grader_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT answers_assessment_attempt_id_question_id_key UNIQUE (assessment_attempt_id, question_id)
);

CREATE INDEX assessment_versions_assessment_id_status_idx ON assessment_versions(assessment_id, status);
CREATE INDEX questions_assessment_version_id_type_idx ON questions(assessment_version_id, type);
CREATE INDEX questions_assessment_tags_idx ON questions USING gin(assessment_tags);
CREATE INDEX assessment_attempts_user_id_study_week_id_idx ON assessment_attempts(user_id, study_week_id);

COMMIT;
