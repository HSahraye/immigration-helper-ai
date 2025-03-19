'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Import server actions
import { createStripeSession, createTestSubscription } from '@/app/checkout/actions';

type CheckoutFormProps = {
  plan: string;
  isTestMode: boolean;
  isSignedIn: boolean;
  buttonText: string;
};

export function CheckoutForm({ plan, isTestMode, isSignedIn, buttonText }: CheckoutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create a FormData object from the form
      const formData = new FormData();
      formData.append('plan', plan);
      formData.append('is_signed_in', isSignedIn ? 'true' : 'false');
      
      if (isTestMode) {
        formData.append('test_mode', 'true');
      }
      
      if (!isSignedIn && plan !== 'basic') {
        formData.append('email', email);
      }

      // Call the server action
      const result = await createStripeSession(formData);
      
      // Navigate to the result URL
      if (result) {
        router.push(result);
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="is_signed_in" value={isSignedIn ? "true" : "false"} />
      <input type="hidden" name="plan" value={plan} />
      
      {!isSignedIn && plan !== 'basic' && (
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-[#202124] border border-gray-600 rounded-lg py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}
      
      {isTestMode && (
        <input type="hidden" name="test_mode" value="true" />
      )}
      
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
      
      {!isTestMode && plan !== 'basic' && (
        <div className="mt-4 text-center">
          <Link 
            href={`/checkout?plan=${plan}&test=true`}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Use test mode (no payment required)
          </Link>
        </div>
      )}
      
      {!isSignedIn && plan !== 'basic' && !isTestMode && (
        <div className="mt-4 text-center">
          <Link
            href={`/auth/signin?callbackUrl=${encodeURIComponent(`/checkout?plan=${plan}`)}`}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Already have an account? Sign in first
          </Link>
        </div>
      )}
    </form>
  );
} 