'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [countdown, setCountdown] = useState(5);
  
  // Redirect to profile after countdown if authenticated
  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile');
      return;
    }
    
    if (status === 'authenticated') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/profile');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [status, router]);
  
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-xl">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#303134] rounded-xl shadow-lg border border-gray-700 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="h-10 w-10 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        
        <p className="text-gray-400 mb-8">
          Thank you for subscribing to Immigration Helper AI. Your account has been successfully upgraded, and you now have access to all premium features.
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
            className="flex items-center justify-center space-x-2 w-full py-3 bg-[#444448] hover:bg-[#505055] text-center rounded-lg font-medium transition-colors"
          >
            <span>Explore Resources</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <p className="text-sm text-gray-400 mt-6">
          Redirecting to profile in {countdown} seconds...
        </p>
      </div>
    </div>
  );
} 