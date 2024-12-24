import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Plus, Filter } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { SegmentForm } from './SegmentForm';

export const LeadSegments: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: segments } = useQuery({
    queryKey: ['segments'],
    queryFn: async () => {
      const { data } = await supabase
        .from('segments')
        .select('*')
        .order('created_at', { ascending: false });
      return data;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Segmentos</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Novo Segmento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments?.map((segment) => (
          <Card key={segment.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-brand-600" />
                  <h3 className="font-medium">{segment.name}</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {segment.lead_count} leads
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {segment.description}
              </p>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  Ver Leads
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Segmento"
      >
        <SegmentForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};