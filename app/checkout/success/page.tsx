'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/profile?tab=subscription');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-xl mb-8">Your subscription has been activated successfully.</p>
        <p className="text-gray-400">Redirecting to your profile in {countdown} seconds...</p>
        <div className="mt-8">
          <a href="/profile?tab=subscription" className="text-blue-400 hover:text-blue-300">
            View Subscription Details →
          </a>
        </div>
      </div>
    </div>
  );
} 