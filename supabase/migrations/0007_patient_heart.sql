/*
  # Fix Conversions RLS Policy

  1. Changes
    - Drop and recreate the conversions RLS policy with proper permissions
    - Add better error handling for the policy
    - Ensure proper website ownership verification
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage own conversions" ON conversions;

-- Create new policy with improved checks
CREATE POLICY "Users can manage own conversions"
  ON conversions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM websites 
      WHERE websites.id = conversions.website_id 
      AND websites.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM websites 
      WHERE websites.id = conversions.website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Refresh the RLS
ALTER TABLE conversions DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;