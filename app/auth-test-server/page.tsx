import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function AuthTestServerPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 p-8">
      <div className="max-w-2xl mx-auto bg-[#303134] p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Server-Side Authentication Test</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Server Session:</h2>
          <div className="bg-[#404148] p-4 rounded">
            {session ? (
              <div>
                <p><strong>User:</strong> {session.user?.name || session.user?.email}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <pre className="mt-2 bg-[#202124] p-2 rounded overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            ) : (
              <p>No active session on server</p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Environment Check:</h2>
          <div className="bg-[#404148] p-4 rounded">
            <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL ? 'Set on server' : 'Not set on server'}</p>
            <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? 'Set on server' : 'Not set on server'}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <Link href="/auth-test" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded inline-block">
              Client-Side Auth Test
            </Link>
          </div>
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
    </div>
  );
} 