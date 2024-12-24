import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isComplete: boolean;
  markComplete: () => void;
  skipOnboarding: () => void;
  websiteId: string | null;
  setWebsiteId: (id: string | null) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(true);
  const [websiteId, setWebsiteId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    const { data } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', user?.id)
      .single();

    setIsComplete(!!data?.onboarding_completed);
  };

  const markComplete = async () => {
    if (user) {
      await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
      setIsComplete(true);
    }
  };

  const skipOnboarding = async () => {
    if (user) {
      await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
      setIsComplete(true);
    }
  };

  return (
    <OnboardingContext.Provider value={{
      currentStep,
      setCurrentStep,
      isComplete,
      markComplete,
      skipOnboarding,
      websiteId,
      setWebsiteId
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};