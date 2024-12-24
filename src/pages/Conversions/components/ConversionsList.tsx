import React from 'react';
import { Copy } from 'lucide-react';
import type { Website, Conversion } from '../../../types';
import { Button } from '../../../components/ui/Button';

interface ConversionsListProps {
  conversions: Conversion[];
  websites: Website[];
  onDuplicate: (id: string) => Promise<void>;
}

export const ConversionsList: React.FC<ConversionsListProps> = ({ 
  conversions,
  websites,
  onDuplicate
}) => {
  if (!conversions.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No conversions registered</h2>
        <p className="text-gray-600">Click the button above to add your first conversion.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conversion
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Website
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Load On
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trigger
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {conversions.map((conversion) => (
            <tr key={conversion.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {conversion.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {websites.find(w => w.id === conversion.website_id)?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {conversion.configuration.loadOn}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {conversion.trigger_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {conversion.event_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicate(conversion.id)}
                  icon={<Copy className="w-4 h-4" />}
                >
                  Duplicate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};