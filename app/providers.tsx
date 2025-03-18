'use client';

import { SessionProvider } from 'next-auth/react';
import { ChatLimitProvider } from './contexts/ChatLimitContext';
import Navigation from './components/Navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { getMockSession } from './api/setupMocksForBuild';

// Separate client component for layout
function AppContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#202124] text-gray-200">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-[#303134] py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p className="mb-2">© {new Date().getFullYear()} Immigration Helper AI. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Wrapper to prevent hydration mismatch
const SafeHydrate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <>
      {isClient ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </>
  );
};

// Create a conditional session initializer that's safe for both client and server
const getInitialSession = (): Session | null => {
  // Use typeof to check for window - this is safe in both client and server contexts
  if (typeof window === 'undefined') {
    // Server-side - use a mock session or null
    return null;
  }
  
  // Client-side - it's safe to return null, the actual session will be populated by next-auth
  return null;
};

export function Providers({ children }: { children: ReactNode }) {
  // Use the safe initializer
  const initialSession = getInitialSession();

  return (
    <SafeHydrate>
      <SessionProvider session={initialSession}>
        <ChatLimitProvider>
          <AppContent>
            {children}
          </AppContent>
        </ChatLimitProvider>
      </SessionProvider>
    </SafeHydrate>
  );
} 