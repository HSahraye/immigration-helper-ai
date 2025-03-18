'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { AlertCircle } from 'lucide-react';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
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
  
  // Handle authentication and redirect
  useEffect(() => {
    // Redirect to subscribe page if no plan is selected
    if (!planId || !selectedPlan) {
      router.push('/subscribe');
      return;
    }
    
    // If session is still loading, wait
    if (status === 'loading') return;
    
    // If not authenticated, redirect to signin with callback to this page
    if (status === 'unauthenticated') {
      setRedirecting(true);
      const callbackUrl = `/checkout?plan=${planId}`;
      
      // Use localStorage to remember the plan across auth
      try {
        localStorage.setItem('selectedPlan', planId);
        localStorage.setItem('redirectAfterAuth', callbackUrl);
      } catch (e) {
        console.error('Could not access localStorage:', e);
      }
      
      // Direct the user to sign in with Google
      setTimeout(() => {
        signIn('google', { 
          callbackUrl,
          redirect: true
        });
      }, 1000);
    }
  }, [planId, selectedPlan, router, status]);
  
  // Handle the checkout process
  const handleCheckout = async () => {
    if (!session?.user) {
      setError('You must be logged in to complete your purchase');
      return;
    }
    
    if (!planId) {
      setError('Please select a subscription plan');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call our API to create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/subscribe`,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating checkout session');
      }
      
      const { url, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
      
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout. Please try again.');
      setLoading(false);
    }
  };
  
  if (redirecting || status === 'loading' || (status === 'unauthenticated')) {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-xl">Redirecting to sign in...</span>
          </div>
          <p className="text-gray-400 max-w-md text-center">
            You need to be signed in to complete your purchase. We'll redirect you momentarily.
          </p>
        </div>
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
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="max-w-md mx-auto px-4 py-16">
        <Link 
          href="/subscribe" 
          className="text-blue-400 hover:text-blue-300 inline-block mb-8"
        >
          ← Back to Plans
        </Link>
        
        <div className="bg-[#303134] p-8 rounded-xl">
          <h1 className="text-2xl font-bold mb-6">Complete Your Order</h1>
          
          <div className="border-b border-gray-700 pb-6 mb-6">
            <div className="flex justify-between mb-2">
              <span>Plan</span>
              <span className="font-medium">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Price</span>
              <span className="font-medium">${selectedPlan.price}/month</span>
            </div>
            <div className="bg-[#383840] p-3 rounded-lg">
              <div className="flex justify-between">
                <span>Total (billed monthly)</span>
                <span className="font-bold">${selectedPlan.price}/month</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-center rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                Processing...
              </span>
            ) : (
              `Proceed to Checkout • $${selectedPlan.price}/month`
            )}
          </button>
          
          <p className="mt-4 text-sm text-gray-400 text-center">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
} 