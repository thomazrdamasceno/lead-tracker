import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createConversion, updateConversion } from '../../../../lib/api';
import { FormField } from '../../../../components/ui/FormField';
import { Settings } from './Settings';
import type { Website, Conversion } from '../../../../types';

interface ConversionFormProps {
  websites: Website[];
  conversion?: Conversion | null;
  onSuccess?: () => void;
}

export const ConversionForm: React.FC<ConversionFormProps> = ({ 
  websites,
  conversion,
  onSuccess 
}) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    defaultValues: conversion ? {
      websiteId: conversion.website_id,
      title: conversion.title,
      triggerType: conversion.trigger_type,
      eventType: conversion.event_type,
      loadOn: conversion.configuration.loadOn
    } : undefined
  });

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      
      if (!data.websiteId) {
        throw new Error('Please select a website');
      }

      const conversionData = {
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
      };

      if (conversion) {
        await updateConversion(conversion.id, conversionData);
      } else {
        await createConversion(conversionData);
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save conversion');
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
          required: 'Website is required' 
        })}
        error={errors.websiteId}
        options={websites.map(website => ({
          value: website.id,
          label: website.name
        }))}
      />

      <FormField
        label="Title"
        name="title"
        register={register('title', { 
          required: 'Title is required' 
        })}
        error={errors.title}
      />

      <Settings register={register} errors={errors} />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : conversion ? 'Update Conversion' : 'Create Conversion'}
        </button>
      </div>
    </form>
  );
};