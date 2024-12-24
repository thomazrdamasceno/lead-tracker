import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get API key from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Missing or invalid Authorization header');
    }
    const apiKey = authHeader.replace('Bearer ', '');

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify API key
    const { data: keyData, error: keyError } = await supabaseClient
      .from('api_keys')
      .select('website_id')
      .eq('key', apiKey)
      .eq('enabled', true)
      .single();

    if (keyError || !keyData) {
      throw new Error('Invalid or disabled API key');
    }

    // Parse request body
    const data = await req.json();

    // Validate website_id matches API key
    if (keyData.website_id !== data.website_id) {
      throw new Error('API key does not match website');
    }

    // Create or update lead
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .upsert(
        {
          website_id: data.website_id,
          email: data.lead?.email,
          name: data.lead?.name,
          phone: data.lead?.phone,
          custom_data: data.lead?.custom_data || {},
          last_ip: req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for'),
        },
        {
          onConflict: 'website_id,email',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (leadError) {
      throw new Error('Failed to create/update lead');
    }

    // Create event
    const { error: eventError } = await supabaseClient
      .from('events')
      .insert({
        website_id: data.website_id,
        lead_id: lead.id,
        event_type: data.event_type,
        page_url: data.page_url,
        data: data.data || {},
      });

    if (eventError) {
      throw new Error('Failed to create event');
    }

    // Update API key last used timestamp
    await supabaseClient
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key', apiKey);

    return new Response(
      JSON.stringify({ success: true, lead }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});