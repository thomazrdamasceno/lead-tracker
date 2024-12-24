import React from 'react';
import { Tag } from 'lucide-react';

interface LeadCustomDataProps {
  data: Record<string, any>;
}

export const LeadCustomData: React.FC<LeadCustomDataProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Tag className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-medium">Custom Data</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            className="bg-gray-50 rounded-lg p-4"
          >
            <p className="text-sm font-medium text-gray-900">{key}</p>
            <p className="text-sm text-gray-500 mt-1">
              {typeof value === 'object' 
                ? JSON.stringify(value) 
                : String(value)
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};