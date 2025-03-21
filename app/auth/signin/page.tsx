'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // Get callbackUrl from query string
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    // Collect debug information
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    setDebugInfo(JSON.stringify({
      url: window.location.href,
      params,
      authStatus: status,
      hasSession: !!session,
      callbackUrl,
    }, null, 2));
  }, [searchParams, status, session, callbackUrl]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (session && status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [session, status, router, callbackUrl]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    if (isRegistering && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (isRegistering) {
        // Register new user through API
        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        
        const registerData = await registerResponse.json();
        
        if (!registerResponse.ok) {
          setError(registerData.error || 'Registration failed');
          setIsLoading(false);
          return;
        }
        
        // After registration, sign in
        const result = await signIn('credentials', { 
          redirect: false,
          email, 
          password,
          callbackUrl 
        });
        
        if (result?.ok) {
          router.push(callbackUrl);
        } else {
          setError(result?.error || 'Failed to sign in after registration');
          setIsLoading(false);
        }
      } else {
        // Login using NextAuth
        const result = await signIn('credentials', { 
          redirect: false,
          email, 
          password,
          callbackUrl 
        });
        
        if (result?.ok) {
          router.push(callbackUrl);
        } else {
          setError('Invalid email or password');
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };
  
  if (status === 'loading') {
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
          <h1 className="text-3xl font-bold mb-2">
            {isRegistering ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400">
            {isRegistering 
              ? 'Create an account to access immigration assistance tools' 
              : 'Sign in to your account to continue'
            }
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <div className="bg-[#282830] rounded-lg p-8">          
          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#202124] border border-gray-600 rounded-lg py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#202124] border border-gray-600 rounded-lg py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#202124] border border-gray-600 rounded-lg py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={isRegistering ? 6 : undefined}
              />
            </div>
            
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Processing...
                </>
              ) : (
                isRegistering ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {isRegistering ? (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setIsRegistering(false)} 
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsRegistering(true)} 
                  className="text-blue-400 hover:text-blue-300"
                >
                  Create one
                </button>
              </>
            )}
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            By {isRegistering ? 'creating an account' : 'signing in'}, you agree to our{' '}
            <Link href="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </Link>
          </div>
          
          {/* Debug information (hidden by default) */}
          <details className="mt-8 text-xs text-gray-500 border-t border-gray-700 pt-4">
            <summary className="cursor-pointer">Debug Information</summary>
            <pre className="mt-2 p-2 bg-[#202124] rounded overflow-auto">{debugInfo}</pre>
            <div className="mt-2">
              <Link href="/auth-test" className="text-blue-400">Go to Auth Test Page</Link>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="max-w-md w-full p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            <div className="mt-8 h-12 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
} 