BEGIN;

CREATE TYPE track_type AS ENUM ('SOFTWARE_ENGINEERING', 'PROJECT_MANAGEMENT', 'GERMAN');
CREATE TYPE enrollment_status AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');
CREATE TYPE content_status AS ENUM ('DRAFT', 'REVIEWED', 'APPROVED', 'ARCHIVED');

CREATE TABLE learning_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  type track_type NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learning_tracks_slug_key UNIQUE (slug)
);

CREATE TABLE modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES learning_tracks(id) ON DELETE CASCADE,
  sequence integer NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT modules_track_id_sequence_key UNIQUE (track_id, sequence)
);

CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  slug text NOT NULL,
  sequence integer NOT NULL,
  default_duration_minutes integer NOT NULL,
  difficulty text NOT NULL,
  required boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lessons_module_id_sequence_key UNIQUE (module_id, sequence),
  CONSTRAINT lessons_module_id_slug_key UNIQUE (module_id, slug)
);

CREATE TABLE lesson_prerequisites (
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  prerequisite_lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
  PRIMARY KEY (lesson_id, prerequisite_lesson_id)
);

CREATE TABLE lesson_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  version integer NOT NULL,
  status content_status NOT NULL DEFAULT 'DRAFT',
  title text NOT NULL,
  learning_objective text NOT NULL,
  outcomes jsonb NOT NULL,
  explanation_md text NOT NULL,
  relevance_md text NOT NULL,
  examples jsonb NOT NULL,
  common_mistakes jsonb NOT NULL,
  assessment_tags text[] NOT NULL,
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  reviewer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lesson_versions_lesson_id_version_key UNIQUE (lesson_id, version)
);

CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_version_id uuid NOT NULL REFERENCES lesson_versions(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  resource_type text NOT NULL,
  required boolean NOT NULL DEFAULT false,
  approved boolean NOT NULL DEFAULT false,
  citation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_version_id uuid NOT NULL REFERENCES lesson_versions(id) ON DELETE CASCADE,
  kind text NOT NULL,
  prompt_md text NOT NULL,
  expected_evidence text NOT NULL,
  solution_notes_md text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE knowledge_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_version_id uuid NOT NULL REFERENCES lesson_versions(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer_key jsonb NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES learning_tracks(id) ON DELETE RESTRICT,
  status enrollment_status NOT NULL DEFAULT 'DRAFT',
  start_date date NOT NULL,
  target_outcome text NOT NULL,
  experience_level text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  safe_metadata jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX learning_tracks_type_active_idx ON learning_tracks(type, active);
CREATE INDEX modules_track_id_sequence_idx ON modules(track_id, sequence);
CREATE INDEX lessons_module_id_sequence_idx ON lessons(module_id, sequence);
CREATE INDEX lesson_prerequisites_prerequisite_lesson_id_idx ON lesson_prerequisites(prerequisite_lesson_id);
CREATE INDEX lesson_versions_lesson_id_status_idx ON lesson_versions(lesson_id, status);
CREATE INDEX lesson_versions_assessment_tags_idx ON lesson_versions USING gin(assessment_tags);
CREATE INDEX enrollments_user_id_track_id_status_idx ON enrollments(user_id, track_id, status);
CREATE UNIQUE INDEX enrollments_active_user_track_key ON enrollments(user_id, track_id) WHERE status = 'ACTIVE';
CREATE INDEX audit_events_entity_type_entity_id_created_at_idx ON audit_events(entity_type, entity_id, created_at);

COMMIT;
