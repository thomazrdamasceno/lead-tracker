import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConversionForm } from './components/ConversionForm';
import { ConversionsList } from './components/ConversionsList';
import { useAuth } from '../../hooks/useAuth';
import { useWebsites } from '../../hooks/useWebsites';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { duplicateConversion } from '../../lib/api/duplicate';
import type { Conversion } from '../../types';

export const ConversionsPage: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null);
  
  // Get user's websites
  const { data: websites, isLoading: websitesLoading } = useWebsites(user?.id);

  // Get conversions for user's websites
  const { data: conversions, isLoading: conversionsLoading, refetch } = useQuery({
    queryKey: ['conversions', user?.id],
    queryFn: async () => {
      if (!websites?.length) return [];

      const websiteIds = websites.map(w => w.id);
      const { data } = await supabase
        .from('conversions')
        .select('*')
        .in('website_id', websiteIds)
        .order('created_at', { ascending: false });

      return data;
    },
    enabled: !!websites?.length
  });

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateConversion(id);
      refetch();
    } catch (error) {
      console.error('Failed to duplicate conversion:', error);
    }
  };

  if (websitesLoading || conversionsLoading) {
    return <LoadingSpinner />;
  }

  if (!websites?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No websites found</h2>
        <p className="text-gray-600">Add a website before creating conversions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Conversions</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          New Conversion
        </Button>
      </div>

      <ConversionsList 
        conversions={conversions || []} 
        websites={websites}
        onEdit={setSelectedConversion}
        onDuplicate={handleDuplicate}
      />

      <Modal
        isOpen={isModalOpen || !!selectedConversion}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedConversion(null);
        }}
        title={selectedConversion ? "Edit Conversion" : "New Conversion"}
      >
        <ConversionForm
          websites={websites}
          conversion={selectedConversion}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedConversion(null);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
};