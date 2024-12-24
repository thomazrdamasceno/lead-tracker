import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/supabase/client';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { ApiKeyList } from './ApiKeyList';
import { ApiKeyForm } from './ApiKeyForm';
import type { Website } from '../../../../types';

interface ApiConfigurationProps {
  website: Website;
}

export const ApiConfiguration: React.FC<ApiConfigurationProps> = ({ website }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { data: apiKeys, refetch } = useQuery({
    queryKey: ['api-keys', website.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('website_id', website.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(text);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      refetch();
    } catch (err) {
      console.error('Failed to delete API key:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">API Configuration</h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          New API Key
        </Button>
      </div>

      <ApiKeyList
        apiKeys={apiKeys || []}
        website={website}
        onDelete={deleteApiKey}
        onCopy={copyToClipboard}
        copiedKey={copiedKey}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New API Key"
      >
        <ApiKeyForm
          websiteId={website.id}
          onSuccess={refetch}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};