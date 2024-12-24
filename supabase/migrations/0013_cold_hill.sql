/*
  # API Endpoint Configuration

  1. Changes
    - Add last_ip column to leads table
    - Add indexes for better performance
*/

-- Add last_ip column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_ip text;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_website_email ON leads(website_id, email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_lead_id ON events(lead_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);