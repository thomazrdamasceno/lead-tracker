import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { ConversionFormData, LOAD_ON_OPTIONS, TRIGGER_TYPES, EVENT_TYPES } from './types';

interface SettingsTabProps {
  register: UseFormRegister<ConversionFormData>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ register }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Carregar em</label>
        <select
          {...register('loadOn')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {LOAD_ON_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Gatilho</label>
        <select
          {...register('triggerType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {TRIGGER_TYPES.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Evento</label>
        <select
          {...register('eventType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {EVENT_TYPES.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};