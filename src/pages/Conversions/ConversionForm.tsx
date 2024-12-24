import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';

interface ConversionFormData {
  title: string;
  loadOn: string;
  triggerType: string;
  eventType: string;
  productInfo?: {
    name?: string;
    id?: string;
    value?: number;
    currency?: string;
  };
  advanced?: {
    specificPixelIds?: string[];
  };
}

const LOAD_ON_OPTIONS = [
  { value: 'specific-pages', label: 'Páginas específicas' },
  { value: 'page-path', label: 'Caminho da página' },
  { value: 'regex', label: 'Expressão Regular (Regex)' },
  { value: 'all', label: 'Todo o site' },
];

const TRIGGER_TYPES = [
  { value: 'time-on-page', label: 'Tempo de Permanência na Página' },
  { value: 'video-watch', label: 'Tempo Assistido do Vídeo' },
  { value: 'form-submit', label: 'Formulário Enviado / Submetido' },
  { value: 'button-click', label: 'Clique no Botão / Elemento' },
  { value: 'element-view', label: 'Visualização de Elemento / Sessão' },
  { value: 'mouse-hover', label: 'Passar o Mouse sobre Elemento' },
  { value: 'scroll-percentage', label: 'Percentual de Rolagem de Página' },
  { value: 'page-visit', label: 'Acessou à Página' },
];

const EVENT_TYPES = [
  { value: 'AddToWishlist', label: 'AddToWishlist - Adicionar a Lista de Desejo' },
  { value: 'AddPaymentInfo', label: 'AddPaymentInfo - Adicionar Informações de Pagamento' },
  { value: 'InitiateCheckout', label: 'InitiateCheckout - Iniciar Finalização da Compra' },
  { value: 'StartTrial', label: 'StartTrial - Iniciar período de avaliação' },
  { value: 'Subscribe', label: 'Subscribe - Assinou/Renovou um Plano de Assinatura' },
  { value: 'Purchase', label: 'Purchase - Compra Confirmada' },
  { value: 'Contact', label: 'Contact - Entrar em contato' },
  { value: 'CompleteRegistration', label: 'CompleteRegistration - Cadastro Completo' },
  // ... outros tipos de evento
];

export const ConversionForm: React.FC<{ websiteId: string }> = ({ websiteId }) => {
  const [activeTab, setActiveTab] = useState('settings');
  const { register, handleSubmit } = useForm<ConversionFormData>();

  const onSubmit = async (data: ConversionFormData) => {
    await supabase.from('conversions').insert({
      website_id: websiteId,
      title: data.title,
      trigger_type: data.triggerType,
      event_type: data.eventType,
      configuration: {
        loadOn: data.loadOn,
        triggerConfig: {},
        productInfo: data.productInfo,
        advanced: data.advanced,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['settings', 'product', 'advanced'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'settings' && (
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
      )}

      {/* Outras abas serão implementadas de forma similar */}

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Salvar Conversão
        </button>
      </div>
    </form>
  );
};