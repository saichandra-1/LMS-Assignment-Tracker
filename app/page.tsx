'use client';

import { useState } from 'react';
import CredentialsForm from './components/CredentialsForm';
import LoadingSteps from './components/LoadingSteps';
import AssignmentsDisplay from './components/AssignmentsDisplay';

export interface Assignment {
  name: string;
  date: string;
  timestamp: number | null;
  rawDate: string | null;
  assignmentId: string | null;
  eventId: string | null;
  url: string | null;
  eventType: string;
  course: string | null;
}

type Step = 'idle' | 'loading' | 'success' | 'error';

export default function Home() {
  const [step, setStep] = useState<Step>('idle');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string>('');
  const [loadingStep, setLoadingStep] = useState<string>('');

  const handleScrape = async (username: string, password: string) => {
    setStep('loading');
    setError('');
    setAssignments([]);
    setLoadingStep('Connecting to LMS...');

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape assignments');
      }

      setAssignments(data.assignments || []);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setStep('error');
    }
  };

  const handleReset = () => {
    setStep('idle');
    setAssignments([]);
    setError('');
    setLoadingStep('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              📚 LMS Assignment Tracker
            </h1>
            <p className="text-gray-600 text-lg">
              Automatically fetch and organize your assignments
            </p>
          </div>

          {/* Main Content */}
          {step === 'idle' && (
            <CredentialsForm onScrape={handleScrape} />
          )}

          {step === 'loading' && (
            <LoadingSteps currentStep={loadingStep} />
          )}

          {step === 'success' && (
            <AssignmentsDisplay 
              assignments={assignments} 
              onReset={handleReset}
            />
          )}

          {step === 'error' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
