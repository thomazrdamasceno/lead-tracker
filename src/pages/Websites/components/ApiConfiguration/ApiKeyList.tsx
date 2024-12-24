import React from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { ApiKeyItem } from './ApiKeyItem';
import type { ApiKey } from '../../../../types/api';
import type { Website } from '../../../../types';

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  website: Website;
  onDelete: (id: string) => Promise<void>;
  onCopy: (text: string) => Promise<void>;
  copiedKey: string | null;
}

export const ApiKeyList: React.FC<ApiKeyListProps> = ({
  apiKeys,
  website,
  onDelete,
  onCopy,
  copiedKey
}) => {
  if (apiKeys.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">No API keys created yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {apiKeys.map((apiKey) => (
        <Card key={apiKey.id}>
          <CardContent className="p-4">
            <ApiKeyItem
              apiKey={apiKey}
              website={website}
              onDelete={onDelete}
              onCopy={onCopy}
              copiedKey={copiedKey}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};