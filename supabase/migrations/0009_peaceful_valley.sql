/*
  # Fix Conversions RLS and Structure

  1. Changes
    - Drop and recreate conversions table with proper constraints
    - Add proper RLS policies with explicit permissions
    - Add performance optimizations
*/

-- Drop existing table and recreate with proper structure
DROP TABLE IF EXISTS conversions CASCADE;

CREATE TABLE conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id uuid NOT NULL,
  title text NOT NULL,
  trigger_type text NOT NULL,
  event_type text NOT NULL,
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_website
    FOREIGN KEY (website_id)
    REFERENCES websites(id)
    ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Create explicit policies for each operation
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

-- Add indexes for better performance
CREATE INDEX idx_conversions_website_id ON conversions(website_id);
CREATE INDEX idx_conversions_created_at ON conversions(created_at);