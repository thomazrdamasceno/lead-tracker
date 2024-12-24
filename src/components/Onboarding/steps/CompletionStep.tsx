import React from 'react';
import { useOnboarding } from '../OnboardingProvider';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { CheckCircle } from 'lucide-react';

export const CompletionStep: React.FC = () => {
  const { markComplete } = useOnboarding();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Parabéns! Tudo configurado!</h3>
        <p className="text-gray-600">
          Sua conta está pronta para começar a rastrear leads e conversões.
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium">Próximos passos:</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  1
                </span>
                <span>Configure suas primeiras conversões no menu "Conversões"</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  2
                </span>
                <span>Crie links de rastreamento para suas campanhas</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  3
                </span>
                <span>Acompanhe seus resultados no Dashboard</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={markComplete}
        >
          Começar a usar
        </Button>
      </div>
    </div>
  );
};