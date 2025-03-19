'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
  
  const planId = searchParams.get('plan');
  
  // Plan details
  const planDetails = {
    'basic': { name: 'Basic', price: 9.99 },
    'professional': { name: 'Professional', price: 19.99 },
  };
  
  const selectedPlan = planId && planDetails[planId as keyof typeof planDetails];
  
  useEffect(() => {
    if (session.status === 'loading') return;
    
    if (session.status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    setIsLoading(false);
  }, [session.status, router]);
  
  // Handle the checkout process
  const handleCheckout = async () => {
    if (!session.data?.user?.id) {
      setError('Please sign in to continue');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.data.user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to initiate checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
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
  
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-[#303134] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <div>
                <h3 className="font-medium">{selectedPlan.name}</h3>
                <p className="text-sm text-gray-400">Monthly subscription</p>
              </div>
              <span>${selectedPlan.price}/month</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Total</span>
              <span className="text-xl font-bold">${selectedPlan.price}/month</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>

        <div className="text-sm text-gray-400">
          <p>By proceeding with the payment, you agree to our terms of service and privacy policy.</p>
        </div>
      </div>
    </div>
  );
} 