import React from 'react';
import { useOnboarding } from './OnboardingProvider';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { WebsiteSetup } from './steps/WebsiteSetup';
import { PixelSetup } from './steps/PixelSetup';
import { ApiSetup } from './steps/ApiSetup';
import { ValidationStep } from './steps/ValidationStep';
import { CompletionStep } from './steps/CompletionStep';

const steps = [
  {
    title: 'Configuração do Website',
    component: WebsiteSetup,
  },
  {
    title: 'Configuração do Pixel',
    component: PixelSetup,
  },
  {
    title: 'Configuração da API',
    component: ApiSetup,
  },
  {
    title: 'Validação',
    component: ValidationStep,
  },
  {
    title: 'Conclusão',
    component: CompletionStep,
  },
];

export const OnboardingModal: React.FC = () => {
  const { currentStep, isComplete, skipOnboarding } = useOnboarding();
  const CurrentStepComponent = steps[currentStep].component;

  if (isComplete) return null;

  return (
    <Modal
      isOpen={!isComplete}
      onClose={() => {}}
      title={steps[currentStep].title}
      size="lg"
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Progresso
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {Math.round((currentStep / (steps.length - 1)) * 100)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
            />
          </div>
        </div>

        {/* Step Content */}
        <CurrentStepComponent />

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={skipOnboarding}
          >
            Pular por enquanto
          </Button>
        </div>
      </div>
    </Modal>
  );
};