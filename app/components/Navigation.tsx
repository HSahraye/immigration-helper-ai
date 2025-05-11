'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, ChevronDown, LogOut, Settings, Layout } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    router.push('/');
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  // Handle loading state
  if (status === 'loading') {
    return (
      <nav className="bg-black text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full mr-2">
                  <span className="text-white font-bold text-xl">Z</span>
                </div>
                <span className="text-xl md:text-2xl font-bold text-white">
                  Zazu Quick Prep
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full mr-2">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-white">
                Zazu Quick Prep
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="hover:bg-white hover:text-black px-3 py-2 rounded-md font-medium">
                Home
              </Link>
              <Link href="/learn-more" className="hover:bg-white hover:text-black px-3 py-2 rounded-md font-medium">
                Learn More
              </Link>
              <Link href="/pricing" className="hover:bg-white hover:text-black px-3 py-2 rounded-md font-medium">
                Pricing
              </Link>
              {session?.user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center bg-white text-black px-4 py-2 rounded-full font-medium transition-colors hover:bg-gray-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>{session.user.name || session.user.email?.split('@')[0]}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Layout className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          href="/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Account Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="bg-white text-black px-4 py-2 rounded-full font-medium transition-colors hover:bg-gray-200"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Profile info (visible even when menu is closed) */}
            {session?.user ? (
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-1 mr-3 flex items-center"
              >
                <User className="h-5 w-5 mr-1" />
                <span className="text-sm">{session.user.name || session.user.email?.split('@')[0]}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="p-1 mr-3 flex items-center"
              >
                <User className="h-5 w-5 mr-1" />
                <span className="text-sm">Sign In</span>
              </button>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-white hover:text-gray-300 focus:outline-none"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black border-t border-white">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/learn-more"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Learn More
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/account"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account Settings
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:text-black"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:text-black"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 