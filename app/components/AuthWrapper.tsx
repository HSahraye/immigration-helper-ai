'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthWrapper = ({ children, requireAuth = true }: AuthWrapperProps) => {
  const router = useRouter();

  useEffect(() => {
    if (requireAuth) {
      router.push('/auth/signin');
    }
  }, [requireAuth, router]);

  if (requireAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default dynamic(() => Promise.resolve(AuthWrapper), {
  ssr: false
}); 