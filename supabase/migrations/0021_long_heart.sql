/*
  # Add unique constraint to leads table
  
  1. Changes
    - Add unique constraint on (website_id, email) for leads table
    - Add NOT NULL constraint to email field
    
  2. Security
    - No changes to RLS policies needed
*/

-- Add NOT NULL constraint to email and unique constraint
ALTER TABLE leads 
  ALTER COLUMN email SET NOT NULL,
  ADD CONSTRAINT leads_website_id_email_key UNIQUE (website_id, email);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_leads_website_email ON leads(website_id, email);