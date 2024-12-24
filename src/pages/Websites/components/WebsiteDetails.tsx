import React from 'react';
import type { Website } from '../../../types';
import { TrackingCode } from './TrackingCode';
import { InstallationVerifier } from './InstallationVerifier';
import { ApiConfiguration } from './ApiConfiguration';

interface WebsiteDetailsProps {
  website: Website;
}

export const WebsiteDetails: React.FC<WebsiteDetailsProps> = ({ website }) => {
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-semibold">{website.name}</h2>
        <p className="text-gray-600 mt-1">{website.domain}</p>
      </div>

      <TrackingCode website={website} />
      <InstallationVerifier website={website} />
      <ApiConfiguration website={website} />
    </div>
  );
};