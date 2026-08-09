BEGIN;

CREATE TYPE reflection_visibility AS ENUM ('PRIVATE', 'PARTNER_VISIBLE');

CREATE TABLE task_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_task_id uuid NOT NULL REFERENCES daily_tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  duration_minutes integer NOT NULL,
  completion_evidence jsonb NOT NULL,
  lesson_snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_attempt_id uuid UNIQUE REFERENCES task_attempts(id) ON DELETE CASCADE,
  study_week_id uuid REFERENCES study_weeks(id) ON DELETE CASCADE,
  visibility reflection_visibility NOT NULL DEFAULT 'PRIVATE',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE progress_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  study_week_id uuid REFERENCES study_weeks(id) ON DELETE SET NULL,
  planned_count integer NOT NULL,
  completed_count integer NOT NULL,
  weekly_completion_percentage numeric(5,2) NOT NULL,
  current_streak integer NOT NULL,
  assessment_completed boolean NOT NULL DEFAULT false,
  overall_progress_percentage numeric(5,2) NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT progress_snapshots_user_enrollment_week_key UNIQUE (user_id, enrollment_id, study_week_id)
);

CREATE INDEX task_attempts_daily_task_id_idx ON task_attempts(daily_task_id);
CREATE INDEX task_attempts_user_id_submitted_at_idx ON task_attempts(user_id, submitted_at);
CREATE INDEX reflections_user_id_created_at_idx ON reflections(user_id, created_at);
CREATE INDEX reflections_study_week_id_idx ON reflections(study_week_id);
CREATE INDEX progress_snapshots_user_id_enrollment_id_study_week_id_idx ON progress_snapshots(user_id, enrollment_id, study_week_id);

COMMIT;
