/*
  # Add tracking links table
  
  1. New Tables
    - `tracking_links`
      - `id` (uuid, primary key)
      - `website_id` (uuid, foreign key to websites)
      - `name` (text)
      - `url` (text)
      - `utm_source` (text, optional)
      - `utm_medium` (text, optional)
      - `utm_campaign` (text, optional)
      - `utm_term` (text, optional)
      - `utm_content` (text, optional)
      - `clicks` (integer)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on tracking_links table
    - Add policies for authenticated users to manage their own tracking links
    
  3. Performance
    - Add indexes for common query patterns
*/

-- Create tracking_links table
CREATE TABLE IF NOT EXISTS tracking_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id uuid NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE tracking_links ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view own tracking links"
  ON tracking_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = tracking_links.website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tracking links"
  ON tracking_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own tracking links"
  ON tracking_links
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = tracking_links.website_id 
      AND websites.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own tracking links"
  ON tracking_links
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = tracking_links.website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_tracking_links_website_id ON tracking_links(website_id);
CREATE INDEX idx_tracking_links_created_at ON tracking_links(created_at);
CREATE INDEX idx_tracking_links_clicks ON tracking_links(clicks);