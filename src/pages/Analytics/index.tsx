import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AnalyticsOverview } from './components/AnalyticsOverview';
import { ConversionFunnel } from './components/ConversionFunnel';
import { UserBehavior } from './components/UserBehavior';
import { SourceAnalysis } from './components/SourceAnalysis';
import { useWebsites } from '../../hooks/useWebsites';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { WebsiteSelector } from './components/WebsiteSelector';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: websites, isLoading } = useWebsites(user?.id);
  const [selectedWebsiteId, setSelectedWebsiteId] = React.useState<string>('');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <WebsiteSelector
          websites={websites || []}
          selectedWebsiteId={selectedWebsiteId}
          onSelect={setSelectedWebsiteId}
        />
      </div>

      <AnalyticsOverview websiteId={selectedWebsiteId} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionFunnel websiteId={selectedWebsiteId} />
        <UserBehavior websiteId={selectedWebsiteId} />
      </div>

      <SourceAnalysis websiteId={selectedWebsiteId} />
    </div>
  );
};