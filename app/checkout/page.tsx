'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, redirect } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { AlertCircle } from 'lucide-react';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  const planId = searchParams.get('plan');
  
  // Mock plans data - in a real app, this would be fetched from your database or API
  const planDetails = {
    'basic': { name: 'Basic', price: 9.99 },
    'professional': { name: 'Professional', price: 19.99 },
  };
  
  const selectedPlan = planId && planDetails[planId as keyof typeof planDetails];
  
  useEffect(() => {
    if (session.status === 'loading') {
      return;
    }

    if (session.status === 'unauthenticated') {
      redirect('/auth/signin');
    }

    setIsLoading(false);
  }, [session.status]);
  
  // Handle the checkout process
  const handleCheckout = async () => {
    if (!session.data?.user?.id) {
      setError('Please sign in to continue');
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.data.user.id,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      await stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
      setError('Failed to initiate checkout. Please try again.');
      console.error('Checkout error:', err);
    }
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="max-w-md p-8 bg-[#303134] rounded-xl shadow-lg border border-gray-700">
          <h1 className="text-2xl font-bold mb-4">No Plan Selected</h1>
          <p className="text-gray-400 mb-6">Please select a subscription plan to continue.</p>
          <Link
            href="/subscribe"
            className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-center rounded-lg font-medium transition-colors"
          >
            View Plans
          </Link>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-[#303134] p-8 rounded-xl">
            <div className="text-green-500 text-6xl mb-6 text-center">✓</div>
            <h1 className="text-2xl font-bold mb-4 text-center">Subscription Successful!</h1>
            <p className="text-gray-400 mb-8 text-center">
              Thank you for subscribing to our {selectedPlan.name} plan. You now have access to all premium features.
            </p>
            <div className="space-y-4">
              <Link 
                href="/profile" 
                className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-center rounded-lg font-medium transition-colors"
              >
                Go to Profile
              </Link>
              <Link 
                href="/resources" 
                className="block w-full py-3 bg-[#383840] hover:bg-[#45454d] text-center rounded-lg font-medium transition-colors"
              >
                Start Exploring
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-[#282830] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-4">
            <span>Premium Plan</span>
            <span>$9.99/month</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors"
          >
            Proceed to Payment
          </button>
        </div>

        <div className="text-sm text-gray-400">
          <p>By proceeding with the payment, you agree to our terms of service and privacy policy.</p>
        </div>
      </div>
    </div>
  );
} 