'use client';

import { ReactNode, Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ChatLimitProvider } from './contexts/ChatLimitContext';

/**
 * ClientProviders handles all client-side context providers
 * This is the proper pattern for provider architecture in Next.js App Router
 */
export default function ClientProviders({ 
  children,
}: { 
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <ChatLimitProvider>
        <Suspense fallback={
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        }>
          {children}
        </Suspense>
      </ChatLimitProvider>
    </SessionProvider>
  );
} 