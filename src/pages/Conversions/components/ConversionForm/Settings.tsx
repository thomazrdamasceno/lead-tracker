import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from '../../../../components/ui/FormField';
import { LOAD_ON_OPTIONS, TRIGGER_TYPES, EVENT_TYPES } from './constants';

interface SettingsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export const Settings: React.FC<SettingsProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
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

      <div className="text-sm text-gray-600">
        <p>Configurações adicionais estarão disponíveis com base no tipo de gatilho selecionado.</p>
      </div>
    </div>
  );
};