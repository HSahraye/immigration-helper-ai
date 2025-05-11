'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Layout, FileText, MessageSquare, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
              Welcome back, {session.user?.name || 'User'}!
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Manage your documents and access our services from your dashboard.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-gray-900">
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="flex-1">
                <Link href="/services/immigration-documents" className="block mt-2">
                  <div className="flex items-center mb-4">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <p className="ml-2 text-xl font-semibold text-white">Immigration Documents</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Prepare and manage your immigration documents with AI assistance.
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-gray-900">
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="flex-1">
                <Link href="/chat" className="block mt-2">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                    <p className="ml-2 text-xl font-semibold text-white">AI Chat Assistant</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Get instant answers to your immigration and legal questions.
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-gray-900">
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="flex-1">
                <Link href="/account" className="block mt-2">
                  <div className="flex items-center mb-4">
                    <Settings className="h-6 w-6 text-blue-500" />
                    <p className="ml-2 text-xl font-semibold text-white">Account Settings</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Manage your account preferences and subscription.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          <div className="mt-4 bg-gray-900 rounded-lg shadow p-6">
            <p className="text-gray-400">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 