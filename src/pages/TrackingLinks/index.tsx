import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWebsites } from '../../hooks/useWebsites';
import { useTrackingLinks } from './hooks/useTrackingLinks';
import { TrackingLinksList } from './components/TrackingLinksList';
import { TrackingLinkForm } from './components/TrackingLinkForm';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const TrackingLinksPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { data: websites, isLoading: websitesLoading } = useWebsites(user?.id);
  const { data: links, isLoading: linksLoading, refetch } = useTrackingLinks(user?.id);

  if (websitesLoading || linksLoading) {
    return <LoadingSpinner />;
  }

  if (!websites?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum website encontrado</h2>
        <p className="text-gray-600">Adicione um website antes de criar links de rastreamento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Links de Rastreamento</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Link</span>
        </button>
      </div>

      <TrackingLinksList links={links || []} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Link de Rastreamento"
      >
        <TrackingLinkForm
          websites={websites}
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
};