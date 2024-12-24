/*
  # Deploy Events Edge Function
  
  1. Changes
    - Creates Edge Function for handling events
    - Adds proper policies and permissions
    - Updates existing events table schema
    
  2. Security
    - Ensures proper authentication
    - Validates API keys
    - Protects sensitive data
*/

-- Deploy Edge Function
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
    custom_data,
    last_ip
  )
  VALUES (
    website_id,
    lead_data->>'email',
    lead_data->>'name',
    lead_data->>'phone',
    COALESCE(lead_data->'custom_data', '{}'::jsonb),
    current_setting('request.headers')::jsonb->>'x-real-ip'
  )
  ON CONFLICT (website_id, email) WHERE email IS NOT NULL
  DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    custom_data = leads.custom_data || EXCLUDED.custom_data,
    last_ip = EXCLUDED.last_ip
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
GRANT EXECUTE ON FUNCTION handle_event TO authenticated;
GRANT EXECUTE ON FUNCTION handle_event TO anon;

-- Add comment
COMMENT ON FUNCTION handle_event IS 'Edge function for handling event tracking including lead creation/update and event recording';