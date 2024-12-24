import { supabase } from '../supabase';
import { verifyWebsiteInstallation } from '../services/verification';
import type { Website } from '../../types';

export async function createWebsite(data: Omit<Website, 'id' | 'created_at'>) {
  const { data: website, error } = await supabase
    .from('websites')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Create website error:', error);
    if (error.code === '23503') {
      throw new Error('User account not properly initialized. Please try logging out and back in.');
    }
    throw new Error('Failed to create website');
  }

  return website;
}

export async function updateWebsite(
  id: string,
  data: Partial<Omit<Website, 'id' | 'created_at'>>
) {
  const { data: website, error } = await supabase
    .from('websites')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update website error:', error);
    throw new Error('Failed to update website');
  }

  return website;
}

export async function verifyInstallation(websiteId: string) {
  try {
    // Get website info
    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .select('*')
      .eq('id', websiteId)
      .single();

    if (websiteError || !website) {
      throw new Error('Website not found');
    }

    return await verifyWebsiteInstallation(
      website.domain,
      website.id,
      website.pixel_id
    );
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      hasTrackingCode: false,
      hasScript: false,
      hasPixelId: false,
      error: error instanceof Error ? error.message : 'Failed to verify installation'
    };
  }
}