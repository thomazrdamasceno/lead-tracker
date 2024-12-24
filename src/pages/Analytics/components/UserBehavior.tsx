import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserBehaviorProps {
  websiteId: string;
}

export const UserBehavior: React.FC<UserBehaviorProps> = ({ websiteId }) => {
  const { data: behaviorData } = useQuery({
    queryKey: ['user-behavior', websiteId],
    queryFn: async () => {
      if (!websiteId) return null;

      const { data: events } = await supabase
        .from('events')
        .select('created_at, event_type')
        .eq('website_id', websiteId)
        .order('created_at', { ascending: true });

      // Process events into time series data
      const timeSeriesData = (events || []).reduce((acc: any[], event) => {
        const date = new Date(event.created_at).toLocaleDateString();
        const existing = acc.find(item => item.date === date);
        
        if (existing) {
          existing.events += 1;
        } else {
          acc.push({ date, events: 1 });
        }
        
        return acc;
      }, []);

      return timeSeriesData;
    },
    enabled: !!websiteId
  });

  if (!websiteId || !behaviorData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Comportamento do Usuário</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={behaviorData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="events" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};