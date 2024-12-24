import { supabase } from '../supabase/client';
import { createEvent } from './events';
import type { EventData } from '../../types/events';

export async function verifyApiKey(apiKey: string, websiteId: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('website_id')
    .eq('key', apiKey)
    .eq('enabled', true)
    .single();

  if (error || !data) {
    throw new Error('Invalid or disabled API key');
  }

  if (data.website_id !== websiteId) {
    throw new Error('API key does not match website');
  }

  return true;
}

export async function testApiEndpoint(apiKey: string, data: EventData) {
  try {
    await verifyApiKey(apiKey, data.website_id);

    // Get website details for Facebook pixel info
    const { data: website } = await supabase
      .from('websites')
      .select('*')
      .eq('id', data.website_id)
      .single();

    const result = await createEvent(data, website);

    return {
      success: true,
      status: 200,
      data: {
        ...result,
        website_id: data.website_id
      }
    };
  } catch (error) {
    return {
      success: false,
      status: 400,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}