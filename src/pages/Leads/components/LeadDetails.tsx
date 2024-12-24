import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabase/client';
import { LeadScore } from './LeadScore';
import { LeadTimeline } from './LeadTimeline';
import { LeadContactInfo } from './LeadContactInfo';
import { LeadCustomData } from './LeadCustomData';
import { LeadAnalytics } from './LeadAnalytics';
import type { Lead } from '../../../types';

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
}

export const LeadDetails: React.FC<LeadDetailsProps> = ({ lead, onClose }) => {
  const { data: events } = useQuery({
    queryKey: ['lead-events', lead.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('lead_id', lead.id)
        .order('created_at', { ascending: false });
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {lead.name || 'Anonymous Lead'}
          </h2>
          <p className="text-sm text-gray-500">ID: {lead.id}</p>
        </div>
        <LeadScore leadId={lead.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <LeadContactInfo lead={lead} />
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <LeadAnalytics events={events || []} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Data */}
      <Card>
        <CardContent className="p-6">
          <LeadCustomData data={lead.custom_data} />
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent className="p-6">
          <LeadTimeline events={events || []} />
        </CardContent>
      </Card>
    </div>
  );
};