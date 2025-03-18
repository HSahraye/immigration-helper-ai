'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { CheckCircle2 } from 'lucide-react';

export default function SubscribePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if there's a stored plan from a previous redirection
  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        setSelectedPlan(storedPlan);
        // Only clear if we're authenticated - otherwise keep for after auth
        if (status === 'authenticated') {
          localStorage.removeItem('selectedPlan');
        }
      }
    } catch (e) {
      console.error('Could not access localStorage:', e);
    }
  }, [status]);
  
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
      
      // If not authenticated, redirect to signin page
      if (status === 'unauthenticated') {
        const callbackUrl = `/checkout?plan=${planId}`;
        
        // Use localStorage to remember the redirect path after authentication
        try {
          localStorage.setItem('redirectAfterAuth', callbackUrl);
        } catch (e) {
          console.error('Could not access localStorage:', e);
        }
        
        // Redirect to sign in page
        setTimeout(() => {
          signIn('google', { 
            callbackUrl,
            redirect: true
          });
        }, 500);
        return;
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
      price: '$9.99',
      period: 'month',
      description: 'Great for individuals with occasional immigration needs',
      features: [
        '100 AI messages per month',
        'Document analysis',
        'Basic templates',
        'Email support',
      ],
      highlight: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$19.99',
      period: 'month',
      description: 'Perfect for those with complex immigration situations',
      features: [
        'Unlimited AI messages',
        'Advanced document analysis',
        'Premium templates',
        'Priority support',
        'Case tracking',
        'Document storage',
      ],
      highlight: true,
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Subscription Plan</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get personalized immigration assistance with our AI-powered platform
          </p>
        </div>
        
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-[#303134] rounded-xl overflow-hidden border ${
                plan.highlight 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-700'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-1">/{plan.period}</span>
                </div>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={processing && selectedPlan === plan.id}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-[#444448] hover:bg-[#505055] text-white'
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {processing && selectedPlan === plan.id ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                      Processing...
                    </span>
                  ) : (
                    `Select ${plan.name} Plan`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 max-w-2xl mx-auto">
            All plans include a 7-day money-back guarantee. Cancel anytime. 
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
} 