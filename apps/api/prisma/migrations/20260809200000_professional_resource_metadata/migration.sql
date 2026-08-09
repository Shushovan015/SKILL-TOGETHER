ALTER TABLE resources
  ADD COLUMN provider text NOT NULL DEFAULT 'Unknown',
  ADD COLUMN difficulty text NOT NULL DEFAULT 'Foundational',
  ADD COLUMN estimated_minutes integer NOT NULL DEFAULT 15,
  ADD COLUMN description text NOT NULL DEFAULT '',
  ADD COLUMN verification_status text NOT NULL DEFAULT 'VERIFIED';

UPDATE resources
SET provider = COALESCE(NULLIF(citation, ''), 'Unknown')
WHERE provider = 'Unknown';
