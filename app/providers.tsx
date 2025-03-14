'use client';

import { SessionProvider } from 'next-auth/react';
import { ChatLimitProvider } from './contexts/ChatLimitContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <ChatLimitProvider>
        {children}
      </ChatLimitProvider>
    </SessionProvider>
  );
} 