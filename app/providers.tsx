'use client';

import { SessionProvider } from 'next-auth/react';
import { ChatLimitProvider } from './contexts/ChatLimitContext';
import Navigation from './components/Navigation';
import { ReactNode } from 'react';

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

// Fix for SessionProvider with proper typing
export function Providers({ 
  children,
  session = undefined, // Make session optional with a default value
}: { 
  children: ReactNode;
  session?: any; // Add session prop with proper typing
}) {
  return (
    <SessionProvider session={session}>
      <ChatLimitProvider>
        <AppContent>
          {children}
        </AppContent>
      </ChatLimitProvider>
    </SessionProvider>
  );
} 