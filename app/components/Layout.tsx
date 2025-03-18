'use client';

import { ReactNode } from 'react';
import Navigation from './Navigation';
import { SessionProvider } from 'next-auth/react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SessionProvider>
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
  );
} 