import { supabase } from '../supabase/client';
import type { Lead } from '../../types';

export async function createOrUpdateLead(websiteId: string, leadData: Partial<Lead>) {
  const { data, error } = await supabase
    .from('leads')
    .upsert({
      website_id: websiteId,
      email: leadData.email,
      name: leadData.name,
      phone: leadData.phone,
      custom_data: leadData.custom_data || {},
    }, {
      onConflict: 'website_id,email'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}