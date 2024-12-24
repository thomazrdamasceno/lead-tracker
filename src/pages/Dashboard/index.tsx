import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardStats } from '../../components/Dashboard/Stats';
import { DashboardCharts } from '../../components/Dashboard/Charts';
import { DashboardMap } from '../../components/Dashboard/Map';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data: websites } = await supabase
        .from('websites')
        .select('id')
        .eq('user_id', user.id);

      const websiteIds = websites?.map(w => w.id) || [];

      const [
        { count: totalLeads },
        { count: totalEvents },
        { count: totalConversions }
      ] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact' }).in('website_id', websiteIds),
        supabase.from('events').select('*', { count: 'exact' }).in('website_id', websiteIds),
        supabase.from('conversions').select('*', { count: 'exact' }).in('website_id', websiteIds)
      ]);

      const avgEventsPerLead = totalLeads ? totalEvents / totalLeads : 0;

      return {
        totalLeads: totalLeads || 0,
        totalEvents: totalEvents || 0,
        avgEventsPerLead,
        totalConversions: totalConversions || 0
      };
    },
    enabled: !!user?.id // Only run query when we have a user
  });

  if (authLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Please log in to view the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <DashboardStats
        totalLeads={stats?.totalLeads || 0}
        totalEvents={stats?.totalEvents || 0}
        avgEventsPerLead={stats?.avgEventsPerLead || 0}
        totalConversions={stats?.totalConversions || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts />
        <DashboardMap />
      </div>
    </div>
  );
};