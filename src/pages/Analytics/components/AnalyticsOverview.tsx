import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { TrendingUp, TrendingDown, Users, Target, MousePointer, Clock } from 'lucide-react';
import { calculateTrend } from '../utils/trends';

interface AnalyticsOverviewProps {
  websiteId: string;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ websiteId }) => {
  const { data: stats } = useQuery({
    queryKey: ['analytics-overview', websiteId],
    queryFn: async () => {
      if (!websiteId) return null;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const previousThirtyDays = new Date(thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30));

      // Dados do período atual
      const [currentLeads, currentEvents, currentConversions, avgTimeToConvert] = await Promise.all([
        // Total de leads atual
        supabase
          .from('leads')
          .select('*', { count: 'exact' })
          .eq('website_id', websiteId)
          .gte('created_at', thirtyDaysAgo.toISOString()),

        // Total de eventos atual
        supabase
          .from('events')
          .select('*', { count: 'exact' })
          .eq('website_id', websiteId)
          .gte('created_at', thirtyDaysAgo.toISOString()),

        // Total de conversões atual
        supabase
          .from('events')
          .select('*', { count: 'exact' })
          .eq('website_id', websiteId)
          .in('event_type', ['Purchase', 'Subscribe', 'StartTrial'])
          .gte('created_at', thirtyDaysAgo.toISOString()),

        // Tempo médio até conversão
        supabase
          .from('events')
          .select('lead_id, created_at')
          .eq('website_id', websiteId)
          .in('event_type', ['Purchase', 'Subscribe', 'StartTrial'])
          .order('created_at', { ascending: true })
      ]);

      // Dados do período anterior para comparação
      const [previousLeads, previousEvents, previousConversions] = await Promise.all([
        supabase
          .from('leads')
          .select('*', { count: 'exact' })
          .eq('website_id', websiteId)
          .gte('created_at', previousThirtyDays.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString()),

        supabase
          .from('events')
          .select('*', { count: 'exact' })
          .eq('website_id', websiteId)
          .gte('created_at', previousThirtyDays.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString()),

        supabase
          .from('events')
          .select('*', { count: 'exact' })
          .eq('website_id', websiteId)
          .in('event_type', ['Purchase', 'Subscribe', 'StartTrial'])
          .gte('created_at', previousThirtyDays.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString())
      ]);

      // Calcular tendências
      const leadsTrend = calculateTrend(previousLeads.count || 0, currentLeads.count || 0);
      const conversionsTrend = calculateTrend(previousConversions.count || 0, currentConversions.count || 0);
      const eventsPerLeadTrend = calculateTrend(
        previousEvents.count && previousLeads.count ? previousEvents.count / previousLeads.count : 0,
        currentEvents.count && currentLeads.count ? currentEvents.count / currentLeads.count : 0
      );

      // Calcular tempo médio até conversão
      let avgTimeInDays = 0;
      if (avgTimeToConvert.data?.length) {
        const conversionTimes = avgTimeToConvert.data.map(event => {
          const conversionDate = new Date(event.created_at);
          const leadCreationDate = new Date(event.lead_created_at);
          return (conversionDate.getTime() - leadCreationDate.getTime()) / (1000 * 60 * 60 * 24);
        });
        avgTimeInDays = conversionTimes.reduce((a, b) => a + b, 0) / conversionTimes.length;
      }

      return {
        totalLeads: currentLeads.count || 0,
        totalEvents: currentEvents.count || 0,
        totalConversions: currentConversions.count || 0,
        conversionRate: currentLeads.count ? ((currentConversions.count || 0) / currentLeads.count) * 100 : 0,
        avgTimeToConvert: `${avgTimeInDays.toFixed(1)} dias`,
        trends: {
          leads: leadsTrend,
          conversions: conversionsTrend,
          eventsPerLead: eventsPerLeadTrend
        }
      };
    },
    enabled: !!websiteId
  });

  if (!websiteId || !stats) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">Selecione um website para ver as análises</p>
      </div>
    );
  }

  const metrics = [
    {
      name: 'Total de Leads',
      value: stats.totalLeads,
      change: `${stats.trends.leads.percentage}%`,
      trend: stats.trends.leads.direction,
      icon: Users
    },
    {
      name: 'Taxa de Conversão',
      value: `${stats.conversionRate.toFixed(1)}%`,
      change: `${stats.trends.conversions.percentage}%`,
      trend: stats.trends.conversions.direction,
      icon: Target
    },
    {
      name: 'Eventos por Lead',
      value: (stats.totalEvents / stats.totalLeads || 0).toFixed(1),
      change: `${stats.trends.eventsPerLead.percentage}%`,
      trend: stats.trends.eventsPerLead.direction,
      icon: MousePointer
    },
    {
      name: 'Tempo Médio até Conversão',
      value: stats.avgTimeToConvert,
      change: '-12%',
      trend: 'up',
      icon: Clock
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div key={metric.name} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <metric.icon className="w-6 h-6 text-blue-600" />
            <div className={`flex items-center ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="ml-1 text-sm">{metric.change}</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{metric.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};