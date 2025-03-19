'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorDescription, setErrorDescription] = useState<string>('');
  const [helpText, setHelpText] = useState<string>('');
  
  useEffect(() => {
    const error = searchParams.get('error');
    
    if (error) {
      switch (error) {
        case 'Configuration':
          setErrorMessage('Authentication Configuration Error');
          setErrorDescription('There is a problem with the server configuration.');
          setHelpText('This usually happens when the environment variables are missing or incorrect. Check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET values.');
          break;
        case 'AccessDenied':
          setErrorMessage('Access Denied');
          setErrorDescription('You denied access to your account.');
          setHelpText('You need to approve the permissions to sign in. Please try again and click "Allow" when prompted.');
          break;
        case 'Verification':
          setErrorMessage('Email Verification Required');
          setErrorDescription('Your email has not been verified.');
          setHelpText('Please check your inbox and verify your email before continuing.');
          break;
        case 'OAuthSignin':
        case 'OAuthCallback':
        case 'OAuthCreateAccount':
        case 'EmailCreateAccount':
        case 'Callback':
          setErrorMessage('Authentication Error');
          setErrorDescription('There was a problem with the authentication process.');
          setHelpText('This is likely due to misconfigured credentials. Please see our troubleshooting guide for how to fix Google OAuth issues.');
          break;
        case 'invalid_client':
          setErrorMessage('OAuth Client Error');
          setErrorDescription('The OAuth client credentials are invalid.');
          setHelpText('Check that your Google Client ID and Secret are correct and properly configured in Google Cloud Console.');
          break;
        default:
          setErrorMessage('Authentication Error');
          setErrorDescription(`An error occurred: ${error}`);
          setHelpText('Please try again or contact support if the problem persists.');
      }
    } else {
      setErrorMessage('Authentication Error');
      setErrorDescription('An unknown error occurred during authentication.');
      setHelpText('Please try again or contact support if the problem persists.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-[#303134] rounded-xl shadow-lg border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="bg-red-900/30 p-4 rounded-full">
            <AlertCircle size={32} className="text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">{errorMessage}</h1>
        <p className="text-gray-400 text-center mb-6">{errorDescription}</p>
        
        <div className="bg-[#383840] p-4 rounded-lg mb-6">
          <p className="text-gray-300">{helpText}</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/auth/signin')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-center rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Return to Home</span>
          </Link>
          
          <Link
            href="/GOOGLE-OAUTH-SETUP.md"
            target="_blank"
            className="flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors mt-4"
          >
            <ExternalLink size={16} className="mr-2" />
            <span>View OAuth Setup Guide</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-[#303134] rounded-xl shadow-lg border border-gray-700">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-700 rounded-full w-12 mx-auto"></div>
            <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-700 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
} 