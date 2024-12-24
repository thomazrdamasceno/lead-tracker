/*
  # Fix Events Table Schema

  1. Changes
    - Drop and recreate events table with correct schema
    - Add proper foreign key constraints
    - Add necessary indexes
  
  2. Security
    - Enable RLS
    - Add policies for proper access control
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS events;

-- Create events table with correct schema
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id uuid NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  page_url text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view events from their websites"
  ON events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = events.website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_events_website_id ON events(website_id);
CREATE INDEX idx_events_lead_id ON events(lead_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at);