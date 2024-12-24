import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '../../../../components/ui/FormField';
import { Button } from '../../../../components/ui/Button';
import { supabase } from '../../../../lib/supabase/client';

interface ApiKeyFormProps {
  websiteId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ websiteId, onSuccess, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: { name: string }) => {
    try {
      const key = crypto.randomUUID().replace(/-/g, '');
      
      const { error: apiError } = await supabase
        .from('api_keys')
        .insert({
          website_id: websiteId,
          name: data.name,
          key
        });

      if (apiError) throw apiError;

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API key');
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
        label="Key Name"
        name="name"
        register={register('name', { required: 'Name is required' })}
        placeholder="e.g., Production API Key"
      />

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          Create Key
        </Button>
      </div>
    </form>
  );
};