import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AutomationForm } from './components/AutomationForm';
import { AutomationsList } from './components/AutomationsList';
import { useAuth } from '../../hooks/useAuth';

export const AutomationsPage: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: automations, refetch } = useQuery({
    queryKey: ['automations', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('automations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      return data;
    },
    enabled: !!user?.id
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Automações</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Nova Automação
        </Button>
      </div>

      <AutomationsList automations={automations || []} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Automação"
      >
        <AutomationForm
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
};