import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createConversion } from '../../../lib/api';
import { FormField } from '../../../components/ui/FormField';
import type { Website } from '../../../types';
import { LOAD_ON_OPTIONS, TRIGGER_TYPES, EVENT_TYPES } from './constants';

interface ConversionFormProps {
  websites: Website[];
  onSuccess?: () => void;
}

export const ConversionForm: React.FC<ConversionFormProps> = ({ 
  websites,
  onSuccess 
}) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      
      if (!data.websiteId) {
        throw new Error('Please select a website');
      }

      await createConversion({
        website_id: data.websiteId,
        title: data.title,
        trigger_type: data.triggerType,
        event_type: data.eventType,
        configuration: {
          loadOn: data.loadOn,
          triggerConfig: {},
          productInfo: {},
          advanced: {},
        },
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversion');
      console.error('Form submission error:', err);
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
        label="Website"
        name="websiteId"
        type="select"
        register={register('websiteId', { 
          required: 'Website é obrigatório' 
        })}
        error={errors.websiteId}
        options={websites.map(website => ({
          value: website.id,
          label: website.name
        }))}
      />

      <FormField
        label="Título"
        name="title"
        register={register('title', { 
          required: 'Título é obrigatório' 
        })}
        error={errors.title}
      />

      <FormField
        label="Carregar em"
        name="loadOn"
        type="select"
        register={register('loadOn', { 
          required: 'Este campo é obrigatório' 
        })}
        error={errors.loadOn}
        options={LOAD_ON_OPTIONS}
      />

      <FormField
        label="Tipo de Gatilho"
        name="triggerType"
        type="select"
        register={register('triggerType', { 
          required: 'Este campo é obrigatório' 
        })}
        error={errors.triggerType}
        options={TRIGGER_TYPES}
      />

      <FormField
        label="Tipo de Evento"
        name="eventType"
        type="select"
        register={register('eventType', { 
          required: 'Este campo é obrigatório' 
        })}
        error={errors.eventType}
        options={EVENT_TYPES}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Conversão'}
        </button>
      </div>
    </form>
  );
};