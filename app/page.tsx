'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/resources');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-4 z-50 text-xl font-bold">
        🚨 UPDATED MAIN BRANCH: MARCH 19 2025 - CHECK THIS BANNER TO VERIFY DEPLOYMENT 🚨
      </div>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      </div>
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    </main>
  );
} 