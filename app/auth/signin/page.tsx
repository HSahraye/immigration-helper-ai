'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get callbackUrl from query string or localStorage
  const callbackUrl = searchParams.get('callbackUrl') || 
    (typeof window !== 'undefined' ? localStorage.getItem('redirectAfterAuth') || '/resources' : '/resources');
  
  useEffect(() => {
    if (session.status === 'loading') {
      return;
    }

    if (session.status === 'authenticated') {
      redirect('/');
    }

    setIsLoading(false);
  }, [session.status]);
  
  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Signing in with ${provider}, callbackUrl:`, callbackUrl);
      
      // Store the callback URL in localStorage as a backup
      try {
        if (callbackUrl && callbackUrl !== '/resources') {
          localStorage.setItem('redirectAfterAuth', callbackUrl);
        }
      } catch (e) {
        console.error('Could not access localStorage:', e);
      }
      
      // Call the NextAuth signIn method
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });
      
      if (result?.error) {
        console.error('Sign-in error:', result.error);
        setError(result.error);
        setIsLoading(false);
      }
      
      // If successful and there's a URL to redirect to, the useEffect above will handle it
      
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('An error occurred during sign in. Please try again.');
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">
            Sign in to access your immigration assistance tools
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-gray-400 text-xs mt-2">
              If you're experiencing issues with Google sign-in, please check our{' '}
              <Link href="/auth/help" className="text-blue-400 hover:underline">
                troubleshooting guide
              </Link>.
            </p>
          </div>
        )}
        
        <div className="bg-[#282830] rounded-lg p-8">
          <button
            onClick={() => handleSignIn('google')}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 py-3 rounded-lg font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center text-sm text-gray-400">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 