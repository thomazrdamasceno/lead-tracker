import React from 'react';
import { Copy } from 'lucide-react';
import type { Website } from '../../../types';
import { TRACKING_CONFIG } from '../../../config/tracking';
import { Button } from '../../../components/ui/Button';

interface TrackingCodeProps {
  website: Website;
}

export const TrackingCode: React.FC<TrackingCodeProps> = ({ website }) => {
  const trackingCode = `
<!-- LeadTracker - Início -->
<script>
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s);
  j.async=true;
  j.src='${TRACKING_CONFIG.scriptUrl}';
  j.setAttribute('data-website-id', '${website.id}');
  ${website.pixel_id ? `j.setAttribute('data-pixel-id', '${website.pixel_id}');` : ''}
  j.setAttribute('data-api-version', '${TRACKING_CONFIG.version}');
  f.parentNode.insertBefore(j,f);
})(window,document,'script','_lt','${website.id}');
</script>
<!-- LeadTracker - Fim -->`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Código de Rastreamento</h3>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
          icon={<Copy className="w-4 h-4" />}
        >
          Copiar Código
        </Button>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
          {trackingCode}
        </pre>
      </div>

      <div className="text-sm text-gray-600">
        <p>Instruções:</p>
        <ol className="list-decimal ml-4 mt-2 space-y-2">
          <li>Copie o código acima</li>
          <li>Cole dentro da tag {'<head>'} do seu site</li>
          <li>As conversões configuradas serão rastreadas automaticamente</li>
        </ol>
      </div>
    </div>
  );
};