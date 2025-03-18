'use client';

import { ReactNode, useEffect, useState } from 'react';
import Navigation from './Navigation';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { getMockSession } from '../api/setupMocksForBuild';

interface LayoutProps {
  children: ReactNode;
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

export default function Layout({ children }: LayoutProps) {
  // Create an empty session object with the required properties
  const emptySession: Session = getMockSession();

  return (
    <SafeHydrate>
      <SessionProvider session={emptySession}>
        <div className="min-h-screen bg-[#202124] text-gray-200 flex flex-col">
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
      </SessionProvider>
    </SafeHydrate>
  );
} 