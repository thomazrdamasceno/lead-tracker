import { supabase } from '../supabase';

interface CreateTrackingLinkData {
  website_id: string;
  name: string;
  url: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export async function createTrackingLink(data: CreateTrackingLinkData) {
  const { data: link, error } = await supabase
    .from('tracking_links')
    .insert({
      website_id: data.website_id,
      name: data.name,
      url: data.url,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_term: data.utm_term,
      utm_content: data.utm_content,
      clicks: 0
    })
    .select()
    .single();

  if (error) {
    console.error('Create tracking link error:', error);
    throw new Error('Failed to create tracking link');
  }

  return link;
}