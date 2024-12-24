/*
  # Fix Conversions Table RLS

  1. New Tables
    - `conversions` (if not exists)
      - `id` (uuid, primary key)
      - `website_id` (uuid, references websites)
      - `title` (text)
      - `trigger_type` (text)
      - `event_type` (text) 
      - `configuration` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on conversions table
    - Add policies for authenticated users to manage their own conversions
*/

-- Create conversions table if it doesn't exist
CREATE TABLE IF NOT EXISTS conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id uuid REFERENCES websites(id) NOT NULL,
  title text NOT NULL,
  trigger_type text NOT NULL,
  event_type text NOT NULL,
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage own conversions" ON conversions;

-- Create new policy
CREATE POLICY "Users can manage own conversions"
  ON conversions
  FOR ALL
  TO authenticated
  USING (
    website_id IN (
      SELECT id FROM websites 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    website_id IN (
      SELECT id FROM websites 
      WHERE user_id = auth.uid()
    )
  );