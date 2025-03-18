'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ExternalLink, ArrowLeft } from 'lucide-react';

export default function AuthHelpPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('invalid-client');
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/auth/signin"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Sign In</span>
        </Link>
        
        <div className="bg-[#303134] rounded-xl overflow-hidden border border-gray-700">
          <div className="p-8 border-b border-gray-700">
            <h1 className="text-3xl font-bold mb-4">Authentication Troubleshooting</h1>
            <p className="text-gray-400">
              This guide can help you resolve common issues when signing in with Google.
            </p>
          </div>
          
          <div className="divide-y divide-gray-700">
            {/* Invalid Client Error */}
            <div className="p-6">
              <button
                onClick={() => toggleSection('invalid-client')}
                className="w-full flex justify-between items-center text-left"
              >
                <h2 className="text-xl font-semibold">Error 401: invalid_client</h2>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedSection === 'invalid-client' ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              
              {expandedSection === 'invalid-client' && (
                <div className="mt-4 text-gray-400 space-y-4">
                  <p>
                    This error occurs when Google does not recognize the OAuth client credentials 
                    used by our application.
                  </p>
                  
                  <div className="bg-[#252629] p-4 rounded-lg border border-gray-700">
                    <h3 className="font-semibold mb-2">Solution:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>The application admin needs to configure valid Google OAuth credentials</li>
                      <li>Make sure the authorized redirect URIs include the correct callback URL</li>
                      <li>Verify that your browser accepts cookies from Google authentication services</li>
                    </ol>
                  </div>
                  
                  <p>
                    If you're the administrator of this application, please follow the setup guide 
                    in the <code className="bg-[#252629] px-2 py-1 rounded">GOOGLE-OAUTH-SETUP.md</code> file.
                  </p>
                </div>
              )}
            </div>
            
            {/* Redirect URI Mismatch */}
            <div className="p-6">
              <button
                onClick={() => toggleSection('redirect-uri')}
                className="w-full flex justify-between items-center text-left"
              >
                <h2 className="text-xl font-semibold">redirect_uri_mismatch</h2>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedSection === 'redirect-uri' ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              
              {expandedSection === 'redirect-uri' && (
                <div className="mt-4 text-gray-400 space-y-4">
                  <p>
                    This error occurs when the redirect URI used in the authentication request 
                    does not match any of the authorized redirect URIs configured in the Google Cloud Console.
                  </p>
                  
                  <div className="bg-[#252629] p-4 rounded-lg border border-gray-700">
                    <h3 className="font-semibold mb-2">Solution:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>
                        The application admin needs to add the following URLs to the authorized 
                        redirect URIs in Google Cloud Console:
                        <ul className="list-disc list-inside ml-6 mt-2">
                          <li>http://localhost:3000/api/auth/callback/google</li>
                          <li>https://yourdomain.com/api/auth/callback/google</li>
                        </ul>
                      </li>
                      <li>Ensure you're accessing the site from a URL that matches the configured domains</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
            
            {/* Access Denied */}
            <div className="p-6">
              <button
                onClick={() => toggleSection('access-denied')}
                className="w-full flex justify-between items-center text-left"
              >
                <h2 className="text-xl font-semibold">Access Denied / Account Selection Issues</h2>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedSection === 'access-denied' ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              
              {expandedSection === 'access-denied' && (
                <div className="mt-4 text-gray-400 space-y-4">
                  <p>
                    This can happen if you denied access permissions or if there were issues 
                    with the Google account selection process.
                  </p>
                  
                  <div className="bg-[#252629] p-4 rounded-lg border border-gray-700">
                    <h3 className="font-semibold mb-2">Solution:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Try signing in again and grant all required permissions</li>
                      <li>Try clearing your browser cookies for Google services</li>
                      <li>If using multiple Google accounts in your browser, make sure to select the correct account</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
            
            {/* Browser Issues */}
            <div className="p-6">
              <button
                onClick={() => toggleSection('browser-issues')}
                className="w-full flex justify-between items-center text-left"
              >
                <h2 className="text-xl font-semibold">Browser-Related Issues</h2>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedSection === 'browser-issues' ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              
              {expandedSection === 'browser-issues' && (
                <div className="mt-4 text-gray-400 space-y-4">
                  <p>
                    Sometimes browser settings or extensions can interfere with the authentication process.
                  </p>
                  
                  <div className="bg-[#252629] p-4 rounded-lg border border-gray-700">
                    <h3 className="font-semibold mb-2">Solution:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Disable privacy-focused browser extensions that might block third-party cookies</li>
                      <li>Ensure third-party cookies are enabled in your browser settings</li>
                      <li>Try using a different browser</li>
                      <li>Clear your browser cache and cookies</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-[#303134] rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Still Having Issues?</h2>
          <p className="text-gray-400 mb-4">
            If you've tried the solutions above and are still experiencing problems, please contact our support team.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:support@immigrationhelper.ai"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              <span>Email Support</span>
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
            
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-[#383840] hover:bg-[#45454d] rounded-lg font-medium transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 