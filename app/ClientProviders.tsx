'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
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
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  if (!isBrowser) {
    // During static generation, render children without providers
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      <ChatLimitProvider>
        {children}
      </ChatLimitProvider>
    </SessionProvider>
  );
} 