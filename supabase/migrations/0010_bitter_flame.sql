/*
  # Fix Conversions Policies

  1. Changes
    - Drop and recreate all conversion policies with proper permissions
    - Add explicit policies for each operation type
    - Improve security checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage conversions" ON conversions;
DROP POLICY IF EXISTS "Users can view own conversions" ON conversions;
DROP POLICY IF EXISTS "Users can create conversions" ON conversions;
DROP POLICY IF EXISTS "Users can update own conversions" ON conversions;
DROP POLICY IF EXISTS "Users can delete own conversions" ON conversions;

-- Create new explicit policies
CREATE POLICY "Users can view own conversions"
  ON conversions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM websites 
      WHERE websites.id = conversions.website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversions"
  ON conversions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM websites 
      WHERE websites.id = website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own conversions"
  ON conversions
  FOR UPDATE
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
      WHERE websites.id = website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own conversions"
  ON conversions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM websites 
      WHERE websites.id = conversions.website_id 
      AND websites.user_id = auth.uid()
    )
  );