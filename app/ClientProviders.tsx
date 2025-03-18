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
  return (
    <SessionProvider>
      <ChatLimitProvider>
        {children}
      </ChatLimitProvider>
    </SessionProvider>
  );
} 