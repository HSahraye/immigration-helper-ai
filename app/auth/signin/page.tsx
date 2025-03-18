'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get callbackUrl from query string or localStorage
  const callbackUrl = searchParams.get('callbackUrl') || 
    (typeof window !== 'undefined' ? localStorage.getItem('redirectAfterAuth') || '/resources' : '/resources');
  
  // If user is authenticated, redirect to the callbackUrl
  useEffect(() => {
    if (status === 'authenticated' && session) {
      console.log('User is authenticated, redirecting to:', callbackUrl);
      
      // Clear any stored redirect path since we're using it now
      try {
        localStorage.removeItem('redirectAfterAuth');
      } catch (e) {
        console.error('Could not access localStorage:', e);
      }
      
      // Redirect to the stored path or default to resources page
      router.push(callbackUrl);
    }
  }, [session, status, router, callbackUrl]);
  
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
  
  // If loading session or already authenticated, show loading indicator
  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-xl">Authenticating...</span>
          </div>
          <p className="text-gray-400 max-w-md text-center">
            We're signing you in. You'll be redirected shortly.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#303134] rounded-xl shadow-lg border border-gray-700 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome to Immigration Helper AI</h1>
          <p className="text-gray-400 mt-2">Sign in to access all features</p>
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
        
        <button
          onClick={() => handleSignIn('google')}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <Image 
                src="/google-logo.svg" 
                alt="Google" 
                width={20} 
                height={20} 
                className="mr-2"
              />
              <span>Sign in with Google</span>
            </>
          )}
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400">
            Having trouble?{' '}
            <Link href="/contact" className="text-blue-400 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 