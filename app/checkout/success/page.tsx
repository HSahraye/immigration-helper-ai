import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Payment Successful - Immigration Helper AI',
  description: 'Your subscription has been successfully activated.',
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const userName = session.user?.name || 'there';

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-400 mb-8">
              Thank you for subscribing to Immigration Helper AI, {userName}! Your account has been upgraded.
            </p>
          </div>

          <div className="bg-[#303134] p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-semibold mb-6">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-4 border border-gray-700 rounded-lg transition-all hover:border-blue-500">
                <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
                <p className="text-gray-400 mb-4">
                  Update your profile to get personalized immigration assistance.
                </p>
                <Link 
                  href="/profile"
                  className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                >
                  Edit Profile
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg transition-all hover:border-blue-500">
                <h3 className="text-lg font-semibold mb-2">Document Analysis</h3>
                <p className="text-gray-400 mb-4">
                  Start analyzing your immigration documents with our advanced AI tools.
                </p>
                <Link 
                  href="/documents"
                  className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                >
                  Go to Documents
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg transition-all hover:border-blue-500">
                <h3 className="text-lg font-semibold mb-2">AI Chat Assistant</h3>
                <p className="text-gray-400 mb-4">
                  Get instant answers to your immigration questions from our AI.
                </p>
                <Link 
                  href="/chat"
                  className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                >
                  Start Chatting
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-[#303134] p-6 rounded-lg border border-gray-700 mb-8 text-left">
            <h3 className="text-lg font-semibold mb-4">Your Subscription Details</h3>
            <p className="text-gray-400 mb-2">
              • You can manage your subscription anytime from your profile settings
            </p>
            <p className="text-gray-400 mb-2">
              • Access to all premium features is now available
            </p>
            <p className="text-gray-400">
              • For any billing questions, please contact our support team
            </p>
          </div>

          <div className="space-x-4">
            <Link
              href="/profile"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Go to Profile
            </Link>
            <Link
              href="/resources"
              className="inline-block border border-gray-600 hover:border-blue-500 px-8 py-3 rounded-lg transition-colors"
            >
              Browse Resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 