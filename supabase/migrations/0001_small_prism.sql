/*
  # Initial Schema Setup for Lead Tracking SAAS

  1. Tables
    - users: Store user accounts
    - websites: Store website configurations
    - events: Store tracking events
    - conversions: Store conversion configurations
    - leads: Store lead information

  2. Security
    - RLS policies for all tables
    - Authentication using Supabase Auth
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Websites table
CREATE TABLE IF NOT EXISTS websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  name text NOT NULL,
  domain text NOT NULL,
  pixel_id text,
  pixel_token text,
  created_at timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id uuid REFERENCES websites(id) NOT NULL,
  email text,
  name text,
  phone text,
  custom_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id uuid REFERENCES websites(id) NOT NULL,
  lead_id uuid REFERENCES leads(id),
  event_type text NOT NULL,
  page_url text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Conversions table
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
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can manage own websites"
  ON websites
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage leads from own websites"
  ON leads
  TO authenticated
  USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage events from own websites"
  ON events
  TO authenticated
  USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage conversions from own websites"
  ON conversions
  TO authenticated
  USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_website_id ON leads(website_id);
CREATE INDEX IF NOT EXISTS idx_events_website_id ON events(website_id);
CREATE INDEX IF NOT EXISTS idx_events_lead_id ON events(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversions_website_id ON conversions(website_id);