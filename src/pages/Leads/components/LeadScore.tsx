import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Target, Activity } from 'lucide-react';

interface LeadScoreProps {
  leadId: string;
}

export const LeadScore: React.FC<LeadScoreProps> = ({ leadId }) => {
  const { data: score } = useQuery({
    queryKey: ['lead-score', leadId],
    queryFn: async () => {
      const { data: events } = await supabase
        .from('events')
        .select('event_type, data')
        .eq('lead_id', leadId);

      // Calculate score based on events
      let score = 0;
      events?.forEach(event => {
        switch (event.event_type) {
          case 'PageView':
            score += 1;
            break;
          case 'FormSubmit':
            score += 5;
            break;
          case 'Purchase':
            score += 20;
            break;
          case 'Subscribe':
            score += 15;
            break;
          case 'Custom':
            score += event.data?.score || 0;
            break;
        }
      });

      // Calculate engagement level
      let level = 'Baixo';
      if (score >= 50) level = 'Alto';
      else if (score >= 20) level = 'Médio';

      return { score, level };
    }
  });

  if (!score) return null;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Target className={`w-5 h-5 ${
          score.level === 'Alto' ? 'text-green-500' :
          score.level === 'Médio' ? 'text-yellow-500' :
          'text-gray-400'
        }`} />
        <span className="text-sm font-medium">{score.score} pontos</span>
      </div>
      <div className="flex items-center space-x-2">
        <Activity className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-medium">Engajamento {score.level}</span>
      </div>
    </div>
  );
};