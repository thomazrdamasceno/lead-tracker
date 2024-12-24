import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '../../../components/ui/FormField';
import { createTrackingLink } from '../../../lib/api/tracking-links';
import type { Website } from '../../../types';

interface TrackingLinkFormProps {
  websites: Website[];
  onSuccess?: () => void;
}

export const TrackingLinkForm: React.FC<TrackingLinkFormProps> = ({ 
  websites,
  onSuccess 
}) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      await createTrackingLink({
        website_id: data.websiteId,
        name: data.name,
        url: data.url,
        utm_source: data.utmSource,
        utm_medium: data.utmMedium,
        utm_campaign: data.utmCampaign,
        utm_term: data.utmTerm,
        utm_content: data.utmContent,
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tracking link');
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
        register={register('websiteId', { required: 'Website é obrigatório' })}
        error={errors.websiteId}
        options={websites.map(website => ({
          value: website.id,
          label: website.name
        }))}
      />

      <FormField
        label="Nome do Link"
        name="name"
        register={register('name', { required: 'Nome é obrigatório' })}
        error={errors.name}
      />

      <FormField
        label="URL"
        name="url"
        register={register('url', { 
          required: 'URL é obrigatória',
          pattern: {
            value: /^https?:\/\/.+/,
            message: 'Digite uma URL válida começando com http:// ou https://'
          }
        })}
        error={errors.url}
      />

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Parâmetros UTM</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="UTM Source"
            name="utmSource"
            register={register('utmSource')}
          />

          <FormField
            label="UTM Medium"
            name="utmMedium"
            register={register('utmMedium')}
          />

          <FormField
            label="UTM Campaign"
            name="utmCampaign"
            register={register('utmCampaign')}
          />

          <FormField
            label="UTM Term"
            name="utmTerm"
            register={register('utmTerm')}
          />

          <FormField
            label="UTM Content"
            name="utmContent"
            register={register('utmContent')}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Criar Link'}
        </button>
      </div>
    </form>
  );
};