import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '../../../components/ui/Card';

interface Event {
  event_type: string;
  created_at: string;
}

interface LeadAnalyticsProps {
  events: Event[];
}

export const LeadAnalytics: React.FC<LeadAnalyticsProps> = ({ events }) => {
  const stats = useMemo(() => {
    const eventCounts = events.reduce((acc: Record<string, number>, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(eventCounts).map(([type, count]) => ({
      type,
      count
    }));

    return {
      totalEvents: events.length,
      uniqueEventTypes: Object.keys(eventCounts).length,
      chartData
    };
  }, [events]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Analytics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalEvents}
            </div>
            <div className="text-sm text-gray-500">Total Events</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.uniqueEventTypes}
            </div>
            <div className="text-sm text-gray-500">Unique Event Types</div>
          </CardContent>
        </Card>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};