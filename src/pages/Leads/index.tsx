import React, { useState } from 'react';
import { useLeads } from './hooks/useLeads';
import { LeadsList } from './components/LeadsList';
import { LeadDetails } from './components/LeadDetails';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import type { Lead } from '../../types';

export const LeadsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: leads, isLoading } = useLeads(user?.id);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
      </div>

      <LeadsList 
        leads={leads || []} 
        onViewDetails={setSelectedLead}
      />

      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <LeadDetails 
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </Modal>
    </div>
  );
};