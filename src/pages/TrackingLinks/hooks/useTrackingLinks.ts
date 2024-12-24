import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { TrackingLink } from '../../../types/tracking-link';

export function useTrackingLinks(userId: string | undefined) {
  return useQuery({
    queryKey: ['tracking-links', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const { data: websites } = await supabase
        .from('websites')
        .select('id')
        .eq('user_id', userId);

      if (!websites?.length) return [];

      const websiteIds = websites.map(w => w.id);

      const { data, error } = await supabase
        .from('tracking_links')
        .select('*')
        .in('website_id', websiteIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TrackingLink[];
    },
    enabled: !!userId
  });
}