'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function BillingPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else {
      // Redirect to profile page with subscription tab active
      router.push('/profile?tab=subscription');
    }
  }, [router, status]);

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
      <div className="animate-pulse">Redirecting to billing information...</div>
    </div>
  );
} 