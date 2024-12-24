/*
  # Fix Conversions RLS Policies

  1. Changes
    - Drop and recreate conversions RLS policy with proper checks
    - Add index for better query performance
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage own conversions" ON conversions;

-- Create new policy with proper checks
CREATE POLICY "Users can manage own conversions"
  ON conversions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = conversions.website_id 
      AND websites.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = conversions.website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Add index for better join performance
CREATE INDEX IF NOT EXISTS idx_conversions_website_id ON conversions(website_id);