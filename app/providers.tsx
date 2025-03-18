'use client';

import { ReactNode, Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ChatLimitProvider } from './contexts/ChatLimitContext';
import Navigation from './components/Navigation';

// Separate client component for content
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

// Loading state for Suspense
function LoadingState() {
  return (
    <div className="flex flex-col min-h-screen bg-[#202124] text-gray-200">
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}

// SessionWrapper to handle auth
function SessionWrapper({ children, session }: { children: ReactNode, session?: any }) {
  return (
    <SessionProvider session={session}>
      <ChatLimitProvider>
        {children}
      </ChatLimitProvider>
    </SessionProvider>
  );
}

// Main providers component with Suspense
export function Providers({ 
  children,
  session,
}: { 
  children: ReactNode;
  session?: any;
}) {
  return (
    <Suspense fallback={<LoadingState />}>
      <SessionWrapper session={session}>
        <AppContent>
          {children}
        </AppContent>
      </SessionWrapper>
    </Suspense>
  );
} 