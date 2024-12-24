import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { Website } from '../../../types';
import { verifyInstallation } from '../../../lib/api/websites';

interface InstallationVerifierProps {
  website: Website;
}

export const InstallationVerifier: React.FC<InstallationVerifierProps> = ({ website }) => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<{
    hasTrackingCode: boolean;
    hasScript: boolean;
    hasPixelId: boolean;
  } | null>(null);

  const verify = async () => {
    try {
      setStatus('checking');
      setError(null);
      setDetails(null);

      const result = await verifyInstallation(website.id);

      if (!result.success) {
        throw new Error(result.error || 'Falha na verificação');
      }

      setDetails({
        hasTrackingCode: result.hasTrackingCode,
        hasScript: result.hasScript,
        hasPixelId: result.hasPixelId
      });

      if (!result.hasTrackingCode || !result.hasScript || 
          (website.pixel_id && !result.hasPixelId)) {
        throw new Error('Instalação incompleta');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erro ao verificar instalação');
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Verificar Instalação</h3>
        <button
          onClick={verify}
          disabled={status === 'checking'}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {status === 'checking' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verificando...</span>
            </>
          ) : (
            <span>Verificar Agora</span>
          )}
        </button>
      </div>

      {status !== 'idle' && (
        <div className={`p-4 rounded-md ${
          status === 'success' 
            ? 'bg-green-50' 
            : status === 'error'
            ? 'bg-red-50'
            : 'bg-gray-50'
        }`}>
          {status === 'success' && (
            <div className="flex items-center space-x-3 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Código instalado corretamente!</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-red-700">
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
              
              {details && (
                <ul className="mt-2 space-y-1 text-sm text-red-600">
                  {!details.hasScript && (
                    <li>• Script principal não encontrado</li>
                  )}
                  {!details.hasTrackingCode && (
                    <li>• ID do website não encontrado</li>
                  )}
                  {website.pixel_id && !details.hasPixelId && (
                    <li>• Pixel ID não encontrado</li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p>O verificador irá checar:</p>
        <ul className="list-disc ml-4 mt-2 space-y-1">
          <li>Se o código está presente no site</li>
          <li>Se o Website ID está configurado corretamente</li>
          {website.pixel_id && (
            <li>Se o Pixel ID está configurado corretamente</li>
          )}
        </ul>
      </div>
    </div>
  );
};