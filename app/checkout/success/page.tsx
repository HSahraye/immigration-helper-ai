'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const session = useSession();
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect to profile after countdown if authenticated
  useEffect(() => {
    if (session.status === 'loading') {
      return;
    }

    if (session.status === 'unauthenticated') {
      redirect('/auth/signin');
    }

    setIsLoading(false);
  }, [session.status]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-[#282830] rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-300 mb-6">
            Your payment was successful and your subscription is now active.
          </p>
          <div className="space-y-4">
            <Link
              href="/profile"
              className="block w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors"
            >
              View Your Profile
            </Link>
            <Link
              href="/"
              className="block w-full bg-[#383840] hover:bg-[#45454d] py-3 rounded-lg font-medium transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 