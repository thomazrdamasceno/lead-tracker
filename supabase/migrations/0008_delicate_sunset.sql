/*
  # Final RLS Policy Fix for Conversions

  1. Changes
    - Drop and recreate the conversions table with proper constraints
    - Recreate RLS policy with proper permissions
    - Add necessary indexes
*/

-- Recreate conversions table with proper constraints
CREATE TABLE IF NOT EXISTS conversions_new (
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

-- Copy data if exists
INSERT INTO conversions_new
SELECT * FROM conversions;

-- Drop old table and rename new one
DROP TABLE IF EXISTS conversions;
ALTER TABLE conversions_new RENAME TO conversions;

-- Enable RLS
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Create policy with proper permissions
CREATE POLICY "Users can manage conversions"
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversions_website_id ON conversions(website_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at);