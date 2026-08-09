BEGIN;

CREATE TYPE task_status AS ENUM (
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'MISSED',
  'RESCHEDULED',
  'SKIPPED',
  'CANCELLED'
);

CREATE TABLE study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL UNIQUE REFERENCES enrollments(id) ON DELETE CASCADE,
  study_days integer[] NOT NULL,
  available_minutes_by_day jsonb NOT NULL,
  assessment_day integer NOT NULL,
  recovery_day integer NOT NULL,
  preferred_session_time time,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pause_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_plan_id uuid NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE study_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_plan_id uuid NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
  week_number integer NOT NULL,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT study_weeks_study_plan_id_week_number_key UNIQUE (study_plan_id, week_number)
);

CREATE TABLE daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_week_id uuid NOT NULL REFERENCES study_weeks(id) ON DELETE CASCADE,
  lesson_version_id uuid NOT NULL REFERENCES lesson_versions(id) ON DELETE RESTRICT,
  scheduled_on date NOT NULL,
  status task_status NOT NULL DEFAULT 'PLANNED',
  planned_duration_minutes integer NOT NULL,
  is_required boolean NOT NULL,
  source_task_id uuid REFERENCES daily_tasks(id) ON DELETE SET NULL,
  reschedule_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX pause_periods_study_plan_id_starts_on_idx ON pause_periods(study_plan_id, starts_on);
CREATE INDEX study_weeks_study_plan_id_starts_on_idx ON study_weeks(study_plan_id, starts_on);
CREATE INDEX daily_tasks_study_week_id_scheduled_on_idx ON daily_tasks(study_week_id, scheduled_on);
CREATE INDEX daily_tasks_status_scheduled_on_idx ON daily_tasks(status, scheduled_on);
CREATE INDEX daily_tasks_lesson_version_id_idx ON daily_tasks(lesson_version_id);

COMMIT;
