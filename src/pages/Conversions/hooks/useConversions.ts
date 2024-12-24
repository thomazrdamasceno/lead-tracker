import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { Conversion } from '../../../types';

export function useConversions(userId: string | undefined) {
  return useQuery({
    queryKey: ['conversions', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('conversions')
        .select(`
          id,
          website_id,
          title,
          trigger_type,
          event_type,
          configuration,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Conversion[];
    },
    enabled: !!userId
  });
}