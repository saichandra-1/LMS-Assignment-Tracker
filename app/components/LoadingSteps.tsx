'use client';

import { useEffect, useState } from 'react';

interface LoadingStepsProps {
  currentStep: string;
}

const steps = [
  { icon: '🌐', text: 'Connecting to LMS...', key: 'connect' },
  { icon: '🔐', text: 'Logging in...', key: 'login' },
  { icon: '📅', text: 'Navigating to calendar...', key: 'calendar' },
  { icon: '🔍', text: 'Extracting assignments...', key: 'extract' },
  { icon: '📚', text: 'Getting course information...', key: 'courses' },
  { icon: '✨', text: 'Finalizing...', key: 'finalize' },
];

export default function LoadingSteps({ currentStep }: LoadingStepsProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Simulate progress through steps
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block animate-spin text-6xl mb-4">⚙️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Fetching Your Assignments</h2>
        <p className="text-gray-600">{currentStep || 'Please wait...'}</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = index <= activeStep;
          const isCurrent = index === activeStep;

          return (
            <div
              key={step.key}
              className={`flex items-center p-4 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200'
                  : 'bg-gray-50 border-2 border-transparent'
              }`}
            >
              <div
                className={`text-3xl mr-4 transition-transform ${
                  isCurrent ? 'animate-bounce' : ''
                }`}
              >
                {step.icon}
              </div>
              <div className="flex-1">
                <div
                  className={`font-semibold transition-colors ${
                    isActive ? 'text-purple-700' : 'text-gray-400'
                  }`}
                >
                  {step.text}
                </div>
                {isCurrent && (
                  <div className="mt-2">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse w-full"></div>
                    </div>
                  </div>
                )}
              </div>
              {isActive && (
                <div className="text-green-500 text-2xl">✓</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>This may take 30-60 seconds...</p>
      </div>
    </div>
  );
}

