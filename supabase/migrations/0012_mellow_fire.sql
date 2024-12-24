/*
  # API Configuration

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `website_id` (uuid, references websites)
      - `name` (text)
      - `key` (text, unique)
      - `enabled` (boolean)
      - `created_at` (timestamptz)
      - `last_used_at` (timestamptz)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policies for authenticated users
*/

-- Create API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id uuid NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  name text NOT NULL,
  key text UNIQUE NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their website's API keys"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = api_keys.website_id 
      AND websites.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = api_keys.website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Add indexes
CREATE INDEX idx_api_keys_website_id ON api_keys(website_id);
CREATE INDEX idx_api_keys_key ON api_keys(key);