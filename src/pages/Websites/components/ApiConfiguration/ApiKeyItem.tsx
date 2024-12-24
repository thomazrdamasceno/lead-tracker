import React from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { ApiTestSection } from './ApiTestSection';
import { CurlExample } from './CurlExample';
import type { ApiKey } from '../../../../types/api';
import type { Website } from '../../../../types';

interface ApiKeyItemProps {
  apiKey: ApiKey;
  website: Website;
  onDelete: (id: string) => Promise<void>;
  onCopy: (text: string) => Promise<void>;
  copiedKey: string | null;
}

export const ApiKeyItem: React.FC<ApiKeyItemProps> = ({
  apiKey,
  website,
  onDelete,
  onCopy,
  copiedKey
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{apiKey.name}</h4>
          <p className="text-sm text-gray-500 mt-1">
            Created: {new Date(apiKey.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => onCopy(apiKey.key)}
            variant="outline"
            size="sm"
            icon={<Copy className="w-4 h-4" />}
          >
            {copiedKey === apiKey.key ? 'Copied!' : 'Copy Key'}
          </Button>
          <Button
            onClick={() => onDelete(apiKey.id)}
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
          />
        </div>
      </div>

      <CurlExample apiKey={apiKey.key} />

      <ApiTestSection 
        apiKey={apiKey.key} 
        websiteId={website.id}
        pixelId={website.pixel_id}
        pixelToken={website.pixel_token}
      />
    </div>
  );
};