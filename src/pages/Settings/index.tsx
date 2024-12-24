import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { FormField } from '../../components/ui/FormField';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      email: user?.email || ''
    }
  });

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>

      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {/* Perfil */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Perfil</h2>
          <form className="space-y-4 max-w-lg">
            <FormField
              label="Email"
              name="email"
              type="email"
              register={register('email')}
              disabled
            />
          </form>
        </div>

        {/* Notificações */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notificações</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Notificações por Email</h3>
                <p className="text-sm text-gray-500">Receba atualizações sobre suas conversões e leads.</p>
              </div>
              <button
                type="button"
                className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Relatórios Semanais</h3>
                <p className="text-sm text-gray-500">Receba um resumo semanal das suas métricas.</p>
              </div>
              <button
                type="button"
                className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Segurança</h2>
          <div className="space-y-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Alterar Senha
            </button>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Sessões Ativas</h3>
              <p className="text-sm text-gray-500 mt-1">
                Gerencie seus dispositivos conectados e sessões ativas.
              </p>
            </div>
          </div>
        </div>

        {/* Dados */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Dados</h2>
          <div className="space-y-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Exportar Dados
            </button>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Faça o download de todos os seus dados em formato CSV.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};