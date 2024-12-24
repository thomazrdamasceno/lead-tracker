import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '../../ui/FormField';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { useOnboarding } from '../OnboardingProvider';
import { Target } from 'lucide-react';
import { updateWebsite } from '../../../lib/api/websites';

export const PixelSetup: React.FC = () => {
  const { setCurrentStep, websiteId } = useOnboarding();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      if (!websiteId) {
        throw new Error('Website não encontrado. Por favor, configure o website primeiro.');
      }

      await updateWebsite(websiteId, {
        pixel_id: data.pixel_id || null,
        pixel_token: data.access_token || null
      });
      
      // Automatically proceed to next step after saving
      setCurrentStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao configurar pixel');
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Target className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Pixel do Facebook</h3>
        <p className="text-gray-600">
          Conecte seu pixel do Facebook para sincronizar eventos automaticamente.
          <br />
          <span className="text-sm text-gray-500">(opcional)</span>
        </p>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <FormField
              label="Pixel ID"
              name="pixel_id"
              register={register('pixel_id')}
              error={errors.pixel_id}
              placeholder="Ex: 123456789012345"
            />

            <FormField
              label="Access Token"
              name="access_token"
              register={register('access_token')}
              error={errors.access_token}
              placeholder="Ex: EAAxxxxx..."
            />

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-500">
                Não tem um pixel do Facebook?{' '}
                <a 
                  href="https://www.facebook.com/business/help/952192354843755" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Saiba como criar
                </a>
              </div>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Próximo'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};