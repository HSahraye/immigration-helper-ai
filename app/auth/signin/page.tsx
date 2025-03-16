'use client';

import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get('callbackUrl') || '/resources';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(true);
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });
      
      if (result?.error) {
        console.error('Sign in error:', result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to continue
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get unlimited access to immigration assistance
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleSignIn('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                Signing in...
              </div>
            ) : (
              <>
                <Image
                  src="/google-icon.svg"
                  alt="Google logo"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Continue with Google
              </>
            )}
          </button>
          {/* Apple sign-in will be added later */}
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
} 