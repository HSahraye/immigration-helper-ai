'use client';

import { SessionProvider } from 'next-auth/react';
import { ChatLimitProvider } from './contexts/ChatLimitContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChatLimitProvider>
        {children}
      </ChatLimitProvider>
    </SessionProvider>
  );
} 