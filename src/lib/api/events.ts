import { supabase } from '../supabase/client';
import { createOrUpdateLead } from './leads';
import { sendFacebookEvent } from '../services/facebook/api';
import { logger } from '../services/logging';
import type { EventData } from '../../types/events';

export async function createEvent(data: EventData, website: any) {
  try {
    let leadId: string | null = null;

    // Create/update lead if email is provided
    if (data.lead?.email) {
      const lead = await createOrUpdateLead(data.website_id, {
        email: data.lead.email,
        name: data.lead.name,
        phone: data.lead.phone,
        custom_data: data.lead.custom_data
      });
      leadId = lead.id;
    }

    // Create event in database
    const { error: eventError } = await supabase
      .from('events')
      .insert({
        website_id: data.website_id,
        lead_id: leadId,
        event_type: data.event_type,
        page_url: data.page_url,
        data: data.data || {},
      });

    if (eventError) throw eventError;

    // Send event to Facebook if pixel is configured
    let fbResult = null;
    if (website.pixel_id && website.pixel_token) {
      fbResult = await sendFacebookEvent(
        website.pixel_id,
        website.pixel_token,
        {
          event_name: data.event_type,
          event_time: Math.floor(Date.now() / 1000),
          user_data: {
            email: data.lead?.email,
            name: data.lead?.name,
            phone: data.lead?.phone,
            ...data.lead?.custom_data
          },
          custom_data: data.data || {}
        }
      );
      
      logger.info('Facebook event result:', fbResult);
    }

    return {
      success: true,
      lead_id: leadId,
      facebook_result: fbResult
    };
  } catch (error) {
    logger.error('Event creation error:', error);
    throw error;
  }
}