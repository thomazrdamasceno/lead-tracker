import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '../../ui/FormField';
import { createWebsite } from '../../../lib/api/websites';
import { useAuth } from '../../../hooks/useAuth';
import { Globe } from 'lucide-react';
import { useOnboarding } from '../OnboardingProvider';
import { Button } from '../../ui/Button';

export const WebsiteSetup: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentStep, setWebsiteId } = useOnboarding();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      if (!user?.id) throw new Error('Usuário não autenticado');

      const website = await createWebsite({
        user_id: user.id,
        name: data.name,
        domain: data.domain,
      });

      setWebsiteId(website.id);
      setCurrentStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar website');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Globe className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Configurar Website</h3>
        <p className="text-gray-600">
          Primeiro, vamos configurar seu website para começar a rastrear leads e conversões.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <FormField
          label="Nome do Website"
          name="name"
          register={register('name', { 
            required: 'Nome é obrigatório'
          })}
          error={errors.name}
          placeholder="Ex: Minha Loja Virtual"
        />

        <FormField
          label="Domínio"
          name="domain"
          register={register('domain', { 
            required: 'Domínio é obrigatório',
            pattern: {
              value: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
              message: 'Digite um domínio válido'
            }
          })}
          error={errors.domain}
          placeholder="Ex: minhaloja.com.br"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            Criar Website
          </Button>
        </div>
      </form>
    </div>
  );
};