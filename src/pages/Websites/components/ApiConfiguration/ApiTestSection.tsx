import React, { useState } from 'react';
import { logger } from '../../../../lib/services/logging';
import { testApiEndpoint } from '../../../../lib/api/testing';
import { sendFacebookEvent } from '../../../../lib/services/facebook/api';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import { ApiTestResult } from '../../../../components/ApiTest/ApiTestResult';
import { FacebookTestResult } from '../../../../components/ApiTest/FacebookTestResult';
import type { FacebookResult } from '../../../../lib/services/facebook/types';

interface ApiTestSectionProps {
  apiKey: string;
  websiteId: string;
  pixelId?: string | null;
  pixelToken?: string | null;
}

export const ApiTestSection: React.FC<ApiTestSectionProps> = ({
  apiKey,
  websiteId,
  pixelId,
  pixelToken
}) => {
  const [testResult, setTestResult] = useState<any>(null);
  const [fbResult, setFbResult] = useState<FacebookResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testEventCode, setTestEventCode] = useState('');

  const runTest = async () => {
    try {
      setIsLoading(true);
      logger.info('Running API test', { websiteId });

      // Test API endpoint
      const result = await testApiEndpoint(apiKey, {
        website_id: websiteId,
        event_type: 'TestEvent',
        page_url: 'https://example.com/test',
        lead: {
          email: 'test@example.com',
          name: 'Test User'
        },
        data: {
          test: true
        }
      });

      setTestResult(result);

      // Test Facebook Pixel if configured
      if (pixelId && pixelToken) {
        const fbResult = await sendFacebookEvent(
          pixelId,
          pixelToken,
          {
            event_name: 'TestEvent',
            event_time: Math.floor(Date.now() / 1000),
            user_data: {
              email: 'test@example.com',
              name: 'Test User'
            },
            custom_data: {
              test: true
            }
          },
          testEventCode || undefined // Only pass if not empty
        );

        setFbResult(fbResult);
      }
    } catch (error) {
      logger.error('API test failed', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Test failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {pixelId && pixelToken && (
            <div>
              <label 
                htmlFor="testEventCode" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Facebook Test Event Code
              </label>
              <input
                id="testEventCode"
                type="text"
                value={testEventCode}
                onChange={(e) => setTestEventCode(e.target.value)}
                placeholder="e.g., TEST123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              onClick={runTest}
              variant="outline"
              size="sm"
              isLoading={isLoading}
            >
              Run Test
            </Button>
          </div>

          {testResult && (
            <div className="space-y-4">
              <ApiTestResult result={testResult} />
              {fbResult && <FacebookTestResult result={fbResult} />}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};