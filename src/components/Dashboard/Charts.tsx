import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export const DashboardCharts: React.FC = () => {
  const { data: leadsData } = useQuery({
    queryKey: ['leads-chart'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data } = await supabase
        .from('leads')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const dailyLeads = (data || []).reduce((acc: Record<string, number>, lead) => {
        const date = new Date(lead.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(dailyLeads).map(([date, count]) => ({
        date,
        leads: count
      }));
    }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Leads por Dia</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={leadsData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="leads" stroke="#2563eb" fill="#3b82f6" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};