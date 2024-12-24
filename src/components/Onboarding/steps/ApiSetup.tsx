import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Copy } from 'lucide-react';
import { useOnboarding } from '../OnboardingProvider';

export const ApiSetup: React.FC = () => {
  const { websiteId, setCurrentStep } = useOnboarding();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!websiteId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Website não encontrado. Por favor, configure o website primeiro.</p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => setCurrentStep(0)}
        >
          Voltar para Configuração
        </Button>
      </div>
    );
  }

  const trackingCode = `
<!-- LeadTracker - Início -->
<script>
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s);
  j.async=true;
  j.src='https://cdn.leadtracker.com/lt.js';
  j.setAttribute('data-website-id', '${websiteId}');
  f.parentNode.insertBefore(j,f);
})(window,document,'script','_lt','${websiteId}');
</script>
<!-- LeadTracker - Fim -->`;

  return (
    <div className="space-y-6">
      <div className="prose">
        <h3>Instalação do Código de Rastreamento</h3>
        <p>
          Copie o código abaixo e cole dentro da tag {'<head>'} do seu site.
          Este código é responsável por rastrear todas as interações dos usuários.
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
              {trackingCode}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(trackingCode)}
              icon={<Copy className="w-4 h-4" />}
            >
              {isCopied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>Instruções:</p>
            <ol className="list-decimal ml-4 space-y-2">
              <li>Copie o código acima</li>
              <li>Acesse o código-fonte do seu site</li>
              <li>Localize a tag {'<head>'}</li>
              <li>Cole o código antes do fechamento da tag {'</head>'}</li>
              <li>Salve as alterações</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => setCurrentStep(3)}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};