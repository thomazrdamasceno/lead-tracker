import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConversionFunnelProps {
  websiteId: string;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ websiteId }) => {
  const { data: funnelData } = useQuery({
    queryKey: ['conversion-funnel', websiteId],
    queryFn: async () => {
      if (!websiteId) return null;

      const [pageViews, interactions, leads, opportunities, conversions] = await Promise.all([
        // Total de visitas (eventos do tipo PageView)
        supabase
          .from('events')
          .select('*', { count: 'exact' })
          .eq('website_id', websiteId)
          .eq('event_type', 'PageView'),

        // Interações (qualquer evento que não seja PageView)
        supabase
          .from('events')
          .select('*', { count: 'exact' })
          .eq('website_id', websiteId)
          .neq('event_type', 'PageView'),

        // Total de leads
        supabase
          .from('leads')
          .select('*', { count: 'exact' })
          .eq('website_id', websiteId),

        // Oportunidades (leads que tiveram mais de 3 interações)
        supabase
          .from('leads')
          .select('id')
          .eq('website_id', websiteId)
          .in('id', (
            supabase
              .from('events')
              .select('lead_id')
              .eq('website_id', websiteId)
              .gt('count', 3)
              .groupBy('lead_id')
          )),

        // Conversões (eventos de compra, assinatura, etc)
        supabase
          .from('events')
          .select('*', { count: 'exact' })
          .eq('website_id', websiteId)
          .in('event_type', ['Purchase', 'Subscribe', 'StartTrial'])
      ]);

      return [
        { stage: 'Visitas', value: pageViews.count || 0 },
        { stage: 'Interações', value: interactions.count || 0 },
        { stage: 'Leads', value: leads.count || 0 },
        { stage: 'Oportunidades', value: opportunities.count || 0 },
        { stage: 'Conversões', value: conversions.count || 0 }
      ];
    },
    enabled: !!websiteId
  });

  if (!websiteId || !funnelData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Funil de Conversão</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={funnelData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="stage" type="category" />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};