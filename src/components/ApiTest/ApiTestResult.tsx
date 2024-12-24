import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface ApiTestResultProps {
  result: {
    success: boolean;
    status: number;
    data: {
      success: boolean;
      lead_id: string;
      facebook_result?: {
        success: boolean;
        data?: any;
        error?: string;
        request?: any;
        rawResponse: any;
      };
      website_id: string;
    };
  };
}

export const ApiTestResult: React.FC<ApiTestResultProps> = ({ result }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h6 className="font-medium mb-2">API Test Result</h6>
        <div className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
          {result.success ? 'Success' : 'Failed'}
        </div>
        <div className="text-sm text-gray-600">Status: {result.status}</div>

        <div className="mt-4 space-y-4">
          <div>
            <h6 className="text-xs font-medium text-gray-600">API Request:</h6>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify({
                website_id: result.data.website_id,
                event_type: 'TestEvent',
                page_url: 'https://example.com/test',
                lead: {
                  email: 'test@example.com',
                  name: 'Test User'
                },
                data: {
                  test: true
                }
              }, null, 2)}
            </pre>
          </div>
          
          <div>
            <h6 className="text-xs font-medium text-gray-600">API Response:</h6>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify({
                success: result.data.success,
                lead_id: result.data.lead_id
              }, null, 2)}
            </pre>
          </div>

          {result.data.facebook_result && (
            <div>
              <h6 className="text-xs font-medium text-gray-600">Facebook API Result:</h6>
              <div className={`text-sm ${result.data.facebook_result.success ? 'text-green-600' : 'text-red-600'} mb-2`}>
                {result.data.facebook_result.success ? 'Success' : 'Failed'}
                {result.data.facebook_result.error && `: ${result.data.facebook_result.error}`}
              </div>
              
              <div className="space-y-2">
                <div>
                  <h6 className="text-xs font-medium text-gray-600">Facebook Request:</h6>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(result.data.facebook_result.request, null, 2)}
                  </pre>
                </div>

                <div>
                  <h6 className="text-xs font-medium text-gray-600">Facebook Response:</h6>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(result.data.facebook_result.rawResponse, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};