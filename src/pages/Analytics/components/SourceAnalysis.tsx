import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SourceAnalysisProps {
  websiteId: string;
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

export const SourceAnalysis: React.FC<SourceAnalysisProps> = ({ websiteId }) => {
  const { data: sourceData } = useQuery({
    queryKey: ['source-analysis', websiteId],
    queryFn: async () => {
      if (!websiteId) return null;

      const { data: events } = await supabase
        .from('events')
        .select('data')
        .eq('website_id', websiteId)
        .not('data->source', 'is', null);

      // Process events to get source distribution
      const sources = (events || []).reduce((acc: Record<string, number>, event) => {
        const source = event.data?.source || 'direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(sources).map(([name, value]) => ({ name, value }));
    },
    enabled: !!websiteId
  });

  if (!websiteId || !sourceData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Análise de Fontes</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sourceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {sourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};