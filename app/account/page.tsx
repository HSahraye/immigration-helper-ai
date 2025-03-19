import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/account');
  }
  
  const isPro = session.user.plan === 'pro';
  const isActive = session.user.subscriptionStatus === 'active';
  
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-12">Account Settings</h1>
          
          <div className="bg-[#303134] rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative h-20 w-20 rounded-full overflow-hidden">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-blue-600 h-full w-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {session.user.name || 'User'}
                  </h2>
                  <p className="text-gray-400">{session.user.email}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-xl font-bold mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-gray-400 text-sm">Email</div>
                    <div>{session.user.email}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-gray-400 text-sm">User ID</div>
                    <div className="truncate">{session.user.id}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#303134] rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Your Subscription</h3>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-lg">
                      {isPro ? 'Pro Plan' : 'Basic Plan'}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive ? 'bg-green-600 bg-opacity-20 text-green-400' : 'bg-yellow-600 bg-opacity-20 text-yellow-400'
                    }`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <p className="text-gray-400">
                    {isPro 
                      ? 'You have access to all features including advanced document analysis, unlimited chat assistance, and priority support.'
                      : 'You have access to basic features. Upgrade to Pro for full access to all features.'}
                  </p>
                </div>
                <div>
                  {isPro ? (
                    <Link
                      href="/account/manage-subscription"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Manage Subscription
                    </Link>
                  ) : (
                    <Link
                      href="/checkout?plan=pro"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Upgrade to Pro
                    </Link>
                  )}
                </div>
              </div>
              
              {session.user.stripeCustomerId && (
                <div className="bg-[#202124] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Customer ID</div>
                  <div className="font-mono text-sm truncate">{session.user.stripeCustomerId}</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-[#303134] rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Account Actions</h3>
              
              <div className="space-y-4">
                <Link
                  href="/api/auth/signout"
                  className="block w-full py-2 px-4 bg-[#202124] hover:bg-[#2a2a2c] rounded-lg transition-colors"
                >
                  Sign Out
                </Link>
                
                <button
                  className="block w-full py-2 px-4 text-red-400 hover:text-red-300 bg-transparent hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors"
                  onClick={() => window.alert('This feature is not implemented yet')}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 