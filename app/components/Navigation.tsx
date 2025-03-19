'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Menu, X, User } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const session = useSession();
  const isAuthenticated = session.status === 'authenticated';

  return (
    <nav className="bg-[#202124] text-gray-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 text-xl font-bold">
              Immigration Helper AI
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="hover:text-blue-400 px-3 py-2 rounded-md font-medium">
                Home
              </Link>
              <Link href="/resources" className="hover:text-blue-400 px-3 py-2 rounded-md font-medium">
                Services
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/chat" className="hover:text-blue-400 px-3 py-2 rounded-md font-medium">
                    Chat
                  </Link>
                  <Link href="/documents" className="hover:text-blue-400 px-3 py-2 rounded-md font-medium">
                    Documents
                  </Link>
                </>
              )}
              {isAuthenticated ? (
                <Link href="/profile" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full font-medium transition-colors">
                  My Account
                </Link>
              ) : (
                <Link href="/auth/signin" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full font-medium transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Profile button (visible even when menu is closed) */}
            {isAuthenticated ? (
              <Link href="/profile" className="p-1 mr-3">
                <User className="h-6 w-6" />
              </Link>
            ) : null}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-gray-200 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#303134] border-t border-gray-700">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#404148]"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#404148]"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            {!isAuthenticated && (
              <Link
                href="/auth/signin"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#404148] text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Link
                  href="/chat"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#404148]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Chat
                </Link>
                <Link
                  href="/documents"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#404148]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Documents
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#404148]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  href="/profile?tab=subscription"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#404148]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Subscription
                </Link>
                <Link
                  href="/profile?tab=history"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#404148]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Chat History
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#404148] text-red-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Out
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 