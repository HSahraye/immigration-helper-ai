'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Client-side only component wrapper
import dynamic from 'next/dynamic';

const ClientOnlySubscribePage = () => {
  const session = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (session.status === 'loading') {
      return;
    }

    if (session.status === 'unauthenticated') {
      redirect('/auth/signin');
    }

    setIsLoading(false);
  }, [session.status]);
  
  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    setProcessing(true);
    setError(null);
    
    try {
      // Store the selected plan in localStorage to remember across auth
      try {
        localStorage.setItem('selectedPlan', planId);
      } catch (e) {
        console.error('Could not access localStorage:', e);
      }
      
      // If authenticated, redirect to checkout
      router.push(`/checkout?plan=${planId}`);
      
    } catch (err) {
      console.error('Error selecting plan:', err);
      setError('An error occurred. Please try again.');
      setProcessing(false);
    }
  };
  
  // Plans data
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '4.99',
      features: [
        'Up to 50 messages per month',
        'Basic document analysis',
        'Email support',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '9.99',
      features: [
        'Unlimited messages',
        'Advanced document analysis',
        'Priority support',
        'Custom templates',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '24.99',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom integrations',
        'API access',
      ],
    },
  ];
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the plan that best fits your needs. All plans include access to our AI-powered immigration assistance.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-[#282830] rounded-lg p-6 ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={`/checkout?plan=${plan.id}`}
                className={`block w-full py-3 text-center rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-[#383840] hover:bg-[#45454d]'
                }`}
              >
                Select {plan.name}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400">
            Questions about our plans?{' '}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Use dynamic import with ssr: false to prevent server-side rendering
const SubscribePage = dynamic(() => Promise.resolve(ClientOnlySubscribePage), {
  ssr: false,
});

export default SubscribePage; 