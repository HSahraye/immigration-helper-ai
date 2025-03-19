'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AuthTestPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 p-8">
      <div className="max-w-2xl mx-auto bg-[#303134] p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Auth Status:</h2>
          <div className="bg-[#404148] p-4 rounded">
            <p><strong>Status:</strong> {status}</p>
            {session ? (
              <div className="mt-2">
                <p><strong>User:</strong> {session.user?.name || session.user?.email}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <pre className="mt-2 bg-[#202124] p-2 rounded overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="mt-2">No active session</p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">NextAuth Configuration:</h2>
          <div className="bg-[#404148] p-4 rounded">
            <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not set in client'}</p>
            <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? 'Set (hidden)' : 'Not set'}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Actions:</h2>
          <div className="space-y-2">
            <div>
              <Link href="/api/auth/signin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
                Sign In (API Route)
              </Link>
            </div>
            <div>
              <Link href="/auth/signin" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-block">
                Sign In (Custom Page)
              </Link>
            </div>
            <div>
              <Link href="/api/auth/signout" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded inline-block">
                Sign Out
              </Link>
            </div>
            <div>
              <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded inline-block">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Auth Debug:</h2>
          <div className="bg-[#404148] p-4 rounded">
            <p>Browser URL: <span id="current-url">Loading...</span></p>
            <p>Cookies: <span id="cookies-debug">Loading...</span></p>
            
            <script dangerouslySetInnerHTML={{ __html: `
              document.getElementById('current-url').textContent = window.location.href;
              document.getElementById('cookies-debug').textContent = document.cookie;
            `}} />
          </div>
        </div>
      </div>
    </div>
  );
} 