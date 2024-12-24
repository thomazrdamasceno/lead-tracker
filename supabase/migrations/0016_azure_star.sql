/*
  # Add Events Edge Function Support

  1. New Functions
    - Create events Edge Function
    - Add necessary permissions and configuration

  2. Security
    - Enable secure access to the function
    - Set up proper authentication

  3. Changes
    - Add support for event tracking
    - Configure function environment
*/

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS extensions;

-- Enable HTTP Extensions
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Create function to handle events
CREATE OR REPLACE FUNCTION handle_event(
  website_id uuid,
  event_type text,
  page_url text,
  lead_data jsonb DEFAULT '{}'::jsonb,
  event_data jsonb DEFAULT '{}'::jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lead_id uuid;
  result jsonb;
BEGIN
  -- Create or update lead
  INSERT INTO leads (
    website_id,
    email,
    name,
    phone,
    custom_data
  )
  VALUES (
    website_id,
    lead_data->>'email',
    lead_data->>'name',
    lead_data->>'phone',
    COALESCE(lead_data->'custom_data', '{}'::jsonb)
  )
  ON CONFLICT (website_id, email) WHERE email IS NOT NULL
  DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    custom_data = leads.custom_data || EXCLUDED.custom_data
  RETURNING id INTO lead_id;

  -- Create event
  INSERT INTO events (
    website_id,
    lead_id,
    event_type,
    page_url,
    data
  )
  VALUES (
    website_id,
    lead_id,
    event_type,
    page_url,
    event_data
  );

  -- Return result
  SELECT jsonb_build_object(
    'success', true,
    'lead_id', lead_id
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT EXECUTE ON FUNCTION handle_event TO authenticated;

-- Add comment
COMMENT ON FUNCTION handle_event IS 'Handles event tracking including lead creation/update and event recording';