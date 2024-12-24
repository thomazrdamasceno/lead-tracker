import React from 'react';
import type { Website } from '../../../types';

interface WebsiteSelectorProps {
  websites: Website[];
  selectedWebsiteId: string;
  onSelect: (websiteId: string) => void;
}

export const WebsiteSelector: React.FC<WebsiteSelectorProps> = ({
  websites,
  selectedWebsiteId,
  onSelect
}) => {
  return (
    <select
      value={selectedWebsiteId}
      onChange={(e) => onSelect(e.target.value)}
      className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option value="">Selecione um website</option>
      {websites.map((website) => (
        <option key={website.id} value={website.id}>
          {website.name}
        </option>
      ))}
    </select>
  );
};