import React from 'react';
import { Eye } from 'lucide-react';
import type { Lead } from '../../../types';
import { formatDate } from '../../../utils/date';
import { LeadScore } from './LeadScore';
import { Button } from '../../../components/ui/Button';

interface LeadsListProps {
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
}

export const LeadsList: React.FC<LeadsListProps> = ({ leads, onViewDetails }) => {
  if (!leads.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No leads captured yet</h2>
        <p className="text-gray-600">Leads will appear here when they are captured.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lead
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last IP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Events
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {lead.name || 'Anonymous'}
                  </span>
                  {lead.email && (
                    <span className="text-sm text-gray-500">{lead.email}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <LeadScore leadId={lead.id} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.last_ip || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.events_count || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(lead.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(lead)}
                  icon={<Eye className="w-4 h-4" />}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};