import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export const DashboardMap: React.FC = () => {
  const { data: locationStats } = useQuery({
    queryKey: ['location-stats'],
    queryFn: async () => {
      const { data: events } = await supabase
        .from('events')
        .select('data')
        .not('data->location', 'is', null);

      const locations = (events || []).reduce((acc: Record<string, number>, event) => {
        const location = event.data?.location?.country || 'Unknown';
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(locations)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count);
    }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Acessos por País</h3>
      <div className="space-y-2">
        {locationStats?.map(({ country, count }) => (
          <div key={country} className="flex justify-between items-center">
            <span className="text-gray-600">{country}</span>
            <span className="font-semibold">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};