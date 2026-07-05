-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This adds RLS policies so admin users can update registrations and volunteers.

-- ============================================================
-- 1. Enable RLS (safe to run even if already enabled)
-- ============================================================
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. Drop existing policies to make this idempotent
-- ============================================================
DROP POLICY IF EXISTS competitions_admin_all ON competitions;
DROP POLICY IF EXISTS volunteers_admin_all ON volunteers;

-- ============================================================
-- 3. Create policies: admin users can do everything
--    Uses a subquery to check profiles.role for the current user.
-- ============================================================
CREATE POLICY competitions_admin_all ON competitions
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY volunteers_admin_all ON volunteers
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 4. Also allow regular authenticated users to read (if not already)
-- ============================================================
DROP POLICY IF EXISTS competitions_read_authenticated ON competitions;
CREATE POLICY competitions_read_authenticated ON competitions
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS volunteers_read_authenticated ON volunteers;
CREATE POLICY volunteers_read_authenticated ON volunteers
  FOR SELECT
  USING (auth.role() = 'authenticated');
