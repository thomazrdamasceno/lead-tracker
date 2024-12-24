import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Website } from '../types';

export function useWebsites(userId: string | undefined) {
  return useQuery({
    queryKey: ['websites', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const { data } = await supabase
        .from('websites')
        .select('*')
        .eq('user_id', userId);
      
      return (data || []) as Website[];
    },
    enabled: !!userId
  });
}