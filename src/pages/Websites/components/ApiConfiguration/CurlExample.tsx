import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { getApiExample } from '../../../../config/api';

interface CurlExampleProps {
  apiKey: string;
}

export const CurlExample: React.FC<CurlExampleProps> = ({ apiKey }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getApiExample(apiKey));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">API Usage Example</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            icon={<Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <pre className="text-sm bg-gray-50 p-4 rounded-md overflow-x-auto">
          {getApiExample(apiKey)}
        </pre>
      </CardContent>
    </Card>
  );
};