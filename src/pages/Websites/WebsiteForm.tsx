import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { createWebsite } from '../../lib/api';
import { FormField } from '../../components/ui/FormField';

interface WebsiteFormData {
  name: string;
  domain: string;
  pixel_id?: string;
  pixel_token?: string;
}

interface WebsiteFormProps {
  onSuccess?: () => void;
}

export const WebsiteForm: React.FC<WebsiteFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { 
    register, 
    handleSubmit, 
    formState: { isSubmitting, errors } 
  } = useForm<WebsiteFormData>();

  const onSubmit = async (data: WebsiteFormData) => {
    try {
      setError(null);
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      await createWebsite({
        user_id: user.id,
        name: data.name,
        domain: data.domain,
        pixel_id: data.pixel_id || null,
        pixel_token: data.pixel_token || null,
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create website');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
      />

      <FormField
        label="Domínio"
        name="domain"
        placeholder="exemplo.com.br"
        register={register('domain', { 
          required: 'Domínio é obrigatório',
          pattern: {
            value: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
            message: 'Digite um domínio válido'
          }
        })}
        error={errors.domain}
      />

      <FormField
        label="Pixel ID (opcional)"
        name="pixel_id"
        register={register('pixel_id')}
      />

      <FormField
        label="Pixel Token (opcional)"
        name="pixel_token"
        register={register('pixel_token')}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Website'}
        </button>
      </div>
    </form>
  );
};