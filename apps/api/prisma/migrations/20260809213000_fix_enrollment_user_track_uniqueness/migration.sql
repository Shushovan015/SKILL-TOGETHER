BEGIN;

DO $$
DECLARE
  constraint_name text;
  user_id_attnum smallint;
BEGIN
  SELECT attnum
  INTO user_id_attnum
  FROM pg_attribute
  WHERE attrelid = 'public.enrollments'::regclass
    AND attname = 'user_id'
    AND NOT attisdropped;

  FOR constraint_name IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.enrollments'::regclass
      AND contype = 'u'
      AND array_length(conkey, 1) = 1
      AND conkey[1] = user_id_attnum
  LOOP
    EXECUTE format('ALTER TABLE public.enrollments DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

DO $$
DECLARE
  index_name text;
  user_id_attnum smallint;
BEGIN
  SELECT attnum
  INTO user_id_attnum
  FROM pg_attribute
  WHERE attrelid = 'public.enrollments'::regclass
    AND attname = 'user_id'
    AND NOT attisdropped;

  FOR index_name IN
    SELECT index_class.relname
    FROM pg_index index_record
    JOIN pg_class table_class ON table_class.oid = index_record.indrelid
    JOIN pg_namespace table_namespace ON table_namespace.oid = table_class.relnamespace
    JOIN pg_class index_class ON index_class.oid = index_record.indexrelid
    LEFT JOIN pg_constraint constraint_record ON constraint_record.conindid = index_record.indexrelid
    WHERE table_namespace.nspname = 'public'
      AND table_class.relname = 'enrollments'
      AND index_record.indisunique
      AND index_record.indnkeyatts = 1
      AND index_record.indkey[0] = user_id_attnum
      AND constraint_record.oid IS NULL
  LOOP
    EXECUTE format('DROP INDEX IF EXISTS public.%I', index_name);
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS enrollments_user_id_track_id_status_idx
ON public.enrollments(user_id, track_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS enrollments_active_user_track_key
ON public.enrollments(user_id, track_id)
WHERE status = 'ACTIVE';

COMMIT;
