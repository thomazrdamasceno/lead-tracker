/*
  # Add Events Support

  1. New Tables
    - `events` table for storing tracked events
    - Includes lead tracking and website association
    - Supports custom data via JSONB

  2. Security
    - Enable RLS
    - Add policies for event management
    - Add necessary indexes for performance

  3. Changes
    - Add tracking capabilities
    - Support for custom event data
    - Optimized query performance
*/

-- Create events table if not exists
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id uuid NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  page_url text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
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

CREATE POLICY "Users can create events through API"
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
CREATE INDEX IF NOT EXISTS idx_events_website_id ON events(website_id);
CREATE INDEX IF NOT EXISTS idx_events_lead_id ON events(lead_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);