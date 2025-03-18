'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckIcon, XIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Define the pricing plans
const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    description: 'For individuals seeking basic immigration guidance',
    features: [
      { name: 'Unlimited AI conversations', included: true },
      { name: 'Basic document analysis', included: true },
      { name: 'Access to all immigration topics', included: true },
      { name: 'Save conversation history', included: true },
      { name: 'Document templates', included: false },
      { name: 'Priority support', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 19.99,
    description: 'For those needing comprehensive immigration assistance',
    features: [
      { name: 'Unlimited AI conversations', included: true },
      { name: 'Advanced document analysis', included: true },
      { name: 'Access to all immigration topics', included: true },
      { name: 'Save and export conversations', included: true },
      { name: 'Document templates', included: true },
      { name: 'Priority support', included: true },
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'For immigration firms and organizations',
    features: [
      { name: 'Everything in Professional', included: true },
      { name: 'API access', included: true },
      { name: 'White-labeling', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Multi-user access', included: true },
    ],
  },
];

export default function SubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('professional');
  const redirectUrl = searchParams.get('redirect') || '/resources';

  // If user is not authenticated, store the plan selection for after sign-in
  const handlePlanSelect = (planId: string) => {
    if (status === 'authenticated') {
      // If user is logged in, proceed to checkout with this plan
      router.push(`/checkout?plan=${planId}`);
    } else {
      // Store the selected plan in localStorage before redirecting to sign in
      localStorage.setItem('selectedPlan', planId);
      localStorage.setItem('redirectAfterAuth', window.location.pathname + window.location.search);
      
      // Redirect to sign in
      router.push('/auth/signin');
    }
  };
  
  const proceedToCheckout = (planId: string) => {
    // In a real implementation, this would redirect to a Stripe checkout page
    // For now, we'll just log and navigate to a thank you page
    console.log(`Proceeding to checkout with plan: ${planId}`);
    
    // Redirect to a mock checkout success page
    // In your actual implementation, you would:
    // 1. Create a checkout session with Stripe
    // 2. Redirect to the Stripe checkout page
    // 3. Handle the webhook and success/cancel redirects
    router.push(`/checkout?plan=${planId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center mb-4">
        <Link href={redirectUrl} className="flex items-center text-gray-400 hover:text-blue-400 transition-colors mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </Link>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Upgrade to unlock unlimited conversations and advanced features to make your immigration journey smoother.
        </p>
        
        {/* If user hit their free limit, show this message */}
        {searchParams.get('limit') === 'reached' && (
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg max-w-2xl mx-auto">
            <p className="text-yellow-400">
              You've reached your daily limit of 5 free conversations. 
              Upgrade to continue getting immigration assistance without limits.
            </p>
          </div>
        )}
      </div>
      
      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`
              bg-[#303134] rounded-xl overflow-hidden border-2 transition-all hover:translate-y-[-4px]
              ${selectedPlanId === plan.id 
                ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                : 'border-gray-700 hover:border-blue-500/50'}
              ${plan.popular ? 'relative' : ''}
            `}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              
              <div className="mb-6">
                {typeof plan.price === 'number' ? (
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold">{plan.price}</div>
                )}
              </div>
              
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? '' : 'text-gray-500'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              {plan.id === 'enterprise' ? (
                <Link
                  href="mailto:contact@immigrationhelper.ai?subject=Enterprise%20Plan%20Inquiry"
                  className="w-full block text-center py-3 px-6 bg-[#383840] hover:bg-[#45454d] transition-colors rounded-lg font-medium"
                >
                  Contact Sales
                </Link>
              ) : (
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`
                    w-full py-3 px-6 rounded-lg font-medium transition-colors
                    ${selectedPlanId === plan.id
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-[#383840] hover:bg-[#45454d]'}
                  `}
                >
                  {status === 'authenticated' ? 'Upgrade Now' : 'Select Plan'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-[#303134] p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
            <h3 className="text-xl font-semibold mb-2">Can I cancel my subscription at any time?</h3>
            <p className="text-gray-400">Yes, you can cancel your subscription at any time. You'll continue to have access to your premium features until the end of your billing period.</p>
          </div>
          
          <div className="bg-[#303134] p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
            <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-400">We accept all major credit cards, including Visa, Mastercard, American Express, and Discover.</p>
          </div>
          
          <div className="bg-[#303134] p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
            <h3 className="text-xl font-semibold mb-2">Is my information secure?</h3>
            <p className="text-gray-400">Yes, we use industry-standard encryption to protect your personal and payment information. We never store your full credit card details on our servers.</p>
          </div>
          
          <div className="bg-[#303134] p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
            <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-gray-400">If you're not satisfied with our service, contact us within 7 days of your subscription payment, and we'll issue a full refund.</p>
          </div>
        </div>
      </div>
      
      {/* Return Link */}
      <div className="text-center mt-12">
        <Link
          href={redirectUrl}
          className="text-blue-400 hover:text-blue-300 border border-blue-400/30 rounded-full px-6 py-2 hover:bg-blue-400/10 transition-colors"
        >
          Continue with free plan
        </Link>
      </div>
    </div>
  );
} 