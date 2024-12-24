import React from 'react';
import { Card, CardContent } from '../ui/Card';
import type { FacebookResult } from '../../lib/services/facebook/types';

interface FacebookTestResultProps {
  result: FacebookResult;
}

export const FacebookTestResult: React.FC<FacebookTestResultProps> = ({ result }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h6 className="font-medium mb-2">Facebook Test Result</h6>
        <div className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
          {result.success ? 'Success' : 'Failed'}
        </div>
        
        {result.error && (
          <p className="text-sm text-red-600 mt-1">
            {result.error}
          </p>
        )}

        <div className="mt-2 space-y-2">
          {/* API URL */}
          <div>
            <h6 className="text-xs font-medium text-gray-600">Facebook API URL:</h6>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
              {result.apiUrl}
            </pre>
          </div>

          {/* Request */}
          <div>
            <h6 className="text-xs font-medium text-gray-600">Request:</h6>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(result.request, null, 2)}
            </pre>
          </div>
          
          {/* Response */}
          <div>
            <h6 className="text-xs font-medium text-gray-600">Facebook API Response:</h6>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(result.rawResponse, null, 2)}
            </pre>
          </div>

          {result.success && result.data?.events_received && (
            <div className="text-sm text-green-600">
              Events Received: {result.data.events_received}
            </div>
          )}

          {result.data?.messages?.length > 0 && (
            <div>
              <h6 className="text-xs font-medium text-gray-600">Messages:</h6>
              <ul className="text-xs text-gray-600 list-disc list-inside">
                {result.data.messages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          {result.data?.fbtrace_id && (
            <div className="text-xs text-gray-500">
              Trace ID: {result.data.fbtrace_id}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};