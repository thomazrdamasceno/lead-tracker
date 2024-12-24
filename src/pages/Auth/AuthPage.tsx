import React from 'react';
import { AuthForm } from './AuthForm';
import { Target } from 'lucide-react';

export const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl shadow-xl">
            <Target className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text">
            LeadFlow
          </span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Plataforma Avançada de Analytics e Rastreamento de Leads
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};