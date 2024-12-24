import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { Lead } from '../../../types';

export function useLeads(userId: string | undefined) {
  return useQuery({
    queryKey: ['leads', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const { data: websites } = await supabase
        .from('websites')
        .select('id')
        .eq('user_id', userId);

      if (!websites?.length) return [];

      const websiteIds = websites.map(w => w.id);

      // First get leads
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .in('website_id', websiteIds)
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      // Then get events count for each lead
      const leadsWithCounts = await Promise.all(leads.map(async (lead) => {
        const [eventsResponse, conversionsResponse] = await Promise.all([
          // Get total events count
          supabase
            .from('events')
            .select('id', { count: 'exact', head: true })
            .eq('lead_id', lead.id),
          
          // Get conversions count
          supabase
            .from('events')
            .select('id', { count: 'exact', head: true })
            .eq('lead_id', lead.id)
            .in('event_type', ['Purchase', 'Subscribe', 'StartTrial'])
        ]);

        return {
          ...lead,
          events_count: eventsResponse.count || 0,
          conversions_count: conversionsResponse.count || 0
        };
      }));

      return leadsWithCounts as Lead[];
    },
    enabled: !!userId
  });
}