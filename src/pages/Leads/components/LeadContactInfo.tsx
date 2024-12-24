import React from 'react';
import { Mail, Phone, MapPin, Globe, Clock } from 'lucide-react';
import type { Lead } from '../../../types';

interface LeadContactInfoProps {
  lead: Lead;
}

export const LeadContactInfo: React.FC<LeadContactInfoProps> = ({ lead }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Contact Information</h3>
      
      <div className="space-y-4">
        {lead.email && (
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">{lead.email}</p>
              <p className="text-xs text-gray-500">Email</p>
            </div>
          </div>
        )}

        {lead.phone && (
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">{lead.phone}</p>
              <p className="text-xs text-gray-500">Phone</p>
            </div>
          </div>
        )}

        {lead.last_ip && (
          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">{lead.last_ip}</p>
              <p className="text-xs text-gray-500">Last IP Address</p>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {new Date(lead.created_at).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">First Seen</p>
          </div>
        </div>
      </div>
    </div>
  );
};