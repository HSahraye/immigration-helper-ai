'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/resources');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
} 