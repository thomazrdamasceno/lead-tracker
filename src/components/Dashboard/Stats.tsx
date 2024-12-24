import React from 'react';
import { BarChart, Activity, Users, Target } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
      </div>
      <div className="text-blue-500">{icon}</div>
    </div>
  </div>
);

export const DashboardStats: React.FC<{
  totalLeads: number;
  totalEvents: number;
  avgEventsPerLead: number;
  totalConversions: number;
}> = ({ totalLeads, totalEvents, avgEventsPerLead, totalConversions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Leads"
        value={totalLeads}
        icon={<Users className="w-6 h-6" />}
      />
      <StatsCard
        title="Total Events"
        value={totalEvents}
        icon={<Activity className="w-6 h-6" />}
      />
      <StatsCard
        title="Avg Events/Lead"
        value={avgEventsPerLead.toFixed(2)}
        icon={<BarChart className="w-6 h-6" />}
      />
      <StatsCard
        title="Total Conversions"
        value={totalConversions}
        icon={<Target className="w-6 h-6" />}
      />
    </div>
  );
};