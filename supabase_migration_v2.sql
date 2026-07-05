-- ============================================================================
-- AYF Admin Panel — Migration v2 (Phase 1: Foundation)
-- Non-destructive. Safe to re-run (idempotent).
--
-- What this migration does:
--   1. Creates competition_meta master table (5 seeded competitions)
--   2. Adds competition_id FK column to the existing competitions table
--   3. Backfills competition_id by matching competition_name -> competition_meta.name
--   4. Creates audit_log table for admin activity tracking
--   5. Creates admin_settings table (key/value) for the Settings page
--   6. Enables RLS on new tables, adds permissive policies for authenticated users
--
-- What this migration does NOT do (deferred to later phases):
--   - Does NOT rename `competitions` to `participants` (would break existing API)
--   - Does NOT TRUNCATE any data
--   - Does NOT change existing status string values in competitions/volunteers
--   - Does NOT add CHECK constraints on status (existing data has multiple variants)
--
-- Run order:
--   1. Take a pg_dump backup (Settings -> Database -> Backups -> Export)
--   2. Paste this file in Supabase SQL Editor and Run
--   3. Verify with the SELECT statements at the bottom
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. competition_meta  (master list of competitions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS competition_meta (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL UNIQUE,
  description       TEXT,
  registration_open BOOLEAN NOT NULL DEFAULT TRUE,
  audition_date     TEXT,
  venue             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE competition_meta ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS competition_meta_read_authenticated ON competition_meta;
CREATE POLICY competition_meta_read_authenticated ON competition_meta
  FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS competition_meta_all_admin ON competition_meta;
CREATE POLICY competition_meta_all_admin ON competition_meta
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ----------------------------------------------------------------------------
-- 1b. Seed 5 competitions (idempotent via ON CONFLICT)
--     NOTE: These 5 names must match the competition_name values used by the
--     public registration form AND backfill the existing competitions rows.
-- ----------------------------------------------------------------------------
INSERT INTO competition_meta (name, description, registration_open) VALUES
  ('Group Singing',     'Vocal group performance',         TRUE),
  ('Solo Singing',      'Individual vocal performance',     TRUE),
  ('Dance',             'Group / solo dance competition',   TRUE),
  ('Photography',       'Themed photography contest',       TRUE),
  ('Short Film',        '5-minute short film competition',  TRUE)
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. Add competition_id FK to existing competitions table
--    (backfill from competition_name matching competition_meta.name)
-- ----------------------------------------------------------------------------
ALTER TABLE competitions
  ADD COLUMN IF NOT EXISTS competition_id UUID REFERENCES competition_meta(id) ON DELETE SET NULL;

-- Backfill where possible (only updates rows with a matching competition_meta row)
UPDATE competitions c
SET competition_id = cm.id
FROM competition_meta cm
WHERE c.competition_id IS NULL
  AND lower(trim(c.competition_name)) = lower(trim(cm.name));

-- ----------------------------------------------------------------------------
-- 3. audit_log  (admin action audit trail)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action      TEXT NOT NULL,             -- e.g. registration_status_changed, audition_slot_assigned
  entity_type TEXT NOT NULL,              -- e.g. registration, volunteer, competition_meta
  entity_id   UUID,
  actor_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  details     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_entity_idx      ON audit_log (entity_type, entity_id);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_log_all_admin ON audit_log;
CREATE POLICY audit_log_all_admin ON audit_log
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Allow any authenticated user to INSERT audit rows (for public registrations),
-- but only admins can read/update/delete.
DROP POLICY IF EXISTS audit_log_insert_authenticated ON audit_log;
CREATE POLICY audit_log_insert_authenticated ON audit_log
  FOR INSERT TO authenticated WITH CHECK (TRUE);

-- ----------------------------------------------------------------------------
-- 4. admin_settings  (key/value store for Settings page)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_settings_all_admin ON admin_settings;
CREATE POLICY admin_settings_all_admin ON admin_settings
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Allow authenticated (non-admin) users to read settings (e.g. registration_open
-- flag on the public registration form), but only admins can write.
DROP POLICY IF EXISTS admin_settings_read_authenticated ON admin_settings;
CREATE POLICY admin_settings_read_authenticated ON admin_settings
  FOR SELECT TO authenticated USING (TRUE);

-- ----------------------------------------------------------------------------
-- 5. updated_at triggers (auto-maintain updated_at on competition_meta)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS competition_meta_updated_at ON competition_meta;
CREATE TRIGGER competition_meta_updated_at
  BEFORE UPDATE ON competition_meta
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- VERIFICATION (run these manually after the migration to confirm)
-- ----------------------------------------------------------------------------
-- SELECT id, name, registration_open FROM competition_meta ORDER BY name;
-- SELECT count(*) AS competitions_total,
--        count(competition_id) AS with_competition_id
--   FROM competitions;
-- SELECT * FROM admin_settings;
-- SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 5;
