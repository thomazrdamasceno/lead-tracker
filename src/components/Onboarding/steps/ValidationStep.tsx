import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { verifyInstallation } from '../../../lib/api/websites';
import { useOnboarding } from '../OnboardingProvider';

interface ValidationStatus {
  step: string;
  status: 'pending' | 'checking' | 'success' | 'error';
  error?: string;
  fixStep: number;
}

export const ValidationStep: React.FC = () => {
  const { setCurrentStep, websiteId } = useOnboarding();
  const [isValidating, setIsValidating] = useState(false);
  const [validationSteps, setValidationSteps] = useState<ValidationStatus[]>([
    { 
      step: 'Verificando integração JavaScript...', 
      status: 'pending',
      fixStep: 2 // Step para instalação do código
    },
    { 
      step: 'Verificando configuração do Pixel...', 
      status: 'pending',
      fixStep: 1 // Step para configuração do pixel
    }
  ]);

  const runAllValidations = async () => {
    if (!websiteId) {
      setCurrentStep(0);
      return;
    }

    setIsValidating(true);

    try {
      // Atualiza todos os status para 'checking'
      setValidationSteps(steps => 
        steps.map(step => ({ ...step, status: 'checking' }))
      );

      const result = await verifyInstallation(websiteId);

      // Atualiza os status com base no resultado
      setValidationSteps(steps => steps.map((step, index) => {
        let status: 'success' | 'error' = 'error';
        let error: string | undefined;

        switch (index) {
          case 0: // JavaScript integration
            status = result.hasScript ? 'success' : 'error';
            error = !result.hasScript ? 'Script principal não encontrado' : undefined;
            break;
          case 1: // Pixel configuration
            status = result.hasPixelId ? 'success' : 'error';
            error = !result.hasPixelId ? 'Pixel ID não encontrado' : undefined;
            break;
        }

        return { ...step, status, error };
      }));

      // Se todos os passos foram bem sucedidos, avança para o próximo
      if (result.success) {
        setTimeout(() => setCurrentStep(4), 1000);
      }
    } catch (err) {
      setValidationSteps(steps =>
        steps.map(step => ({
          ...step,
          status: 'error',
          error: err instanceof Error ? err.message : 'Erro na verificação'
        }))
      );
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (websiteId) {
      runAllValidations();
    }
  }, [websiteId]);

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Verificando Configurações</h3>
        <p className="text-gray-600">
          Aguarde enquanto verificamos se tudo está configurado corretamente.
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="space-y-4">
            {validationSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {step.status === 'checking' && (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  {step.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {step.status === 'error' && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`${
                    step.status === 'error' ? 'text-red-600' : 'text-gray-700'
                  }`}>
                    {step.step}
                    {step.error && (
                      <span className="block text-sm text-red-500">
                        {step.error}
                      </span>
                    )}
                  </span>
                </div>
                {step.status === 'error' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(step.fixStep)}
                  >
                    Corrigir
                  </Button>
                )}
              </div>
            ))}
          </div>

          {!isValidating && validationSteps.some(step => step.status === 'error') && (
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="primary"
                onClick={runAllValidations}
              >
                Verificar Novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};