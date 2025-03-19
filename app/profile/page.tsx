'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AuthWrapper from '../components/AuthWrapper';
import { User, CreditCard, MessageSquare, FileText, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const activeTab = searchParams.get('tab') || 'profile';
  const [isLoading, setIsLoading] = useState(false);

  // Derive subscription info from session
  const plan = session?.user?.plan || 'basic';
  const subscriptionStatus = session?.user?.subscriptionStatus || 'inactive';
  const hasActiveSubscription = subscriptionStatus === 'active' || subscriptionStatus === 'ACTIVE';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabChange = (tabId: string) => {
    router.push(`/profile?tab=${tabId}`);
  };

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex overflow-x-auto pb-2 mb-8 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#303134] text-gray-300 hover:bg-[#3a3a45]'
                  } mr-2 whitespace-nowrap`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="bg-[#303134] rounded-lg p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div className="mb-6 flex items-center">
                    {session?.user?.image && (
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">{session?.user?.name || 'User'}</h3>
                      <p className="text-gray-400">{session?.user?.email || 'No email'}</p>
                      <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          plan === 'pro' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-200'
                        }`}>
                          {plan === 'pro' ? 'Pro Plan' : 'Basic Plan'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full bg-[#202124] border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Your name"
                      defaultValue={session?.user?.name || ''}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full bg-[#202124] border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Your email"
                      defaultValue={session?.user?.email || ''}
                      disabled={true}
                    />
                    <p className="text-sm text-gray-400 mt-1">Email cannot be changed (managed by Google)</p>
                  </div>
                  <button 
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Subscription</h2>
                <div className="bg-[#202124] rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-2">Current Plan</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                    plan === 'pro' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-200'
                  }`}>
                    {plan === 'pro' ? 'Pro Plan' : 'Basic Plan'}
                  </div>

                  <div className="space-y-4">
                    {plan === 'basic' ? (
                      <>
                        <p className="text-gray-400">You are currently on the <span className="text-white font-medium">Basic (Free) Plan</span>.</p>
                        <p className="text-gray-400">Upgrade to unlock premium features:</p>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                          <li>Advanced document analysis</li>
                          <li>Unlimited chat assistance</li>
                          <li>Priority support</li>
                          <li>Full resource access</li>
                        </ul>
                        <div className="pt-4">
                          <Link
                            href="/checkout?plan=pro"
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-block"
                          >
                            Upgrade to Pro
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-400">You are currently on the <span className="text-white font-medium">Pro Plan</span>.</p>
                        <p className="text-gray-400">Subscription status: <span className={`font-medium ${hasActiveSubscription ? 'text-green-400' : 'text-yellow-400'}`}>
                          {subscriptionStatus?.toUpperCase()}</span></p>
                        <p className="text-gray-400 mb-4">You have access to all premium features:</p>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                          <li>Advanced document analysis</li>
                          <li>Unlimited chat assistance</li>
                          <li>Priority support</li>
                          <li>Full resource access</li>
                          <li>Custom templates</li>
                          <li>Advanced analytics</li>
                        </ul>
                        <div className="pt-4 space-x-4">
                          <button 
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            onClick={async () => {
                              setIsLoading(true);
                              try {
                                const response = await fetch('/api/manage-subscription', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ action: 'customer-portal' }),
                                });
                                
                                const data = await response.json();
                                
                                if (data.url) {
                                  window.location.href = data.url;
                                } else {
                                  alert('Error accessing billing portal: ' + (data.error || 'Unknown error'));
                                }
                              } catch (error) {
                                console.error('Error accessing billing portal:', error);
                                alert('Failed to access billing portal. Please try again later.');
                              } finally {
                                setIsLoading(false);
                              }
                            }}
                          >
                            {isLoading ? 'Loading...' : 'Manage Subscription'}
                          </button>
                          {hasActiveSubscription && (
                            <button 
                              className="border border-gray-500 text-white px-6 py-2 rounded-lg hover:bg-[#3a3a40] transition-colors"
                              onClick={async () => {
                                if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.')) {
                                  return;
                                }
                                
                                setIsLoading(true);
                                try {
                                  const response = await fetch('/api/manage-subscription', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ action: 'cancel' }),
                                  });
                                  
                                  const data = await response.json();
                                  
                                  if (response.ok) {
                                    alert('Your subscription has been canceled and will end at the end of your current billing period.');
                                    router.refresh();
                                  } else {
                                    alert('Error canceling subscription: ' + (data.error || 'Unknown error'));
                                  }
                                } catch (error) {
                                  console.error('Error canceling subscription:', error);
                                  alert('Failed to cancel subscription. Please try again later.');
                                } finally {
                                  setIsLoading(false);
                                }
                              }}
                            >
                              Cancel Subscription
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {plan === 'basic' && (
                  <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">Pro Plan Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#202124] bg-opacity-30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">Advanced AI Analysis</h4>
                        <p className="text-gray-300">Get deeper insights into your immigration documents and cases</p>
                      </div>
                      <div className="bg-[#202124] bg-opacity-30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">Unlimited Chat</h4>
                        <p className="text-gray-300">No limits on AI assistant conversations</p>
                      </div>
                      <div className="bg-[#202124] bg-opacity-30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">Priority Support</h4>
                        <p className="text-gray-300">Get faster responses from our support team</p>
                      </div>
                      <div className="bg-[#202124] bg-opacity-30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">Premium Resources</h4>
                        <p className="text-gray-300">Access all premium guides and resources</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'conversations' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Conversation History</h2>
                <div className="space-y-4">
                  <div className="bg-[#202124] rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Visa Application Discussion</h3>
                    <p className="text-gray-400 text-sm">2 days ago</p>
                    <p className="text-gray-300 mt-2">Last message: What documents do I need for a student visa?</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Document Management</h2>
                <Link 
                  href="/documents/new" 
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mb-6 inline-block"
                >
                  Create New Document
                </Link>
                <div className="space-y-4">
                  <div className="bg-[#202124] rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Student Visa Application</h3>
                    <p className="text-gray-400 text-sm">Last modified: 1 week ago</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-gray-400 text-sm">Receive updates about your account</p>
                    </div>
                    <button className="bg-[#202124] px-4 py-2 rounded-lg hover:bg-[#3a3a45] transition-colors">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Privacy Settings</h3>
                      <p className="text-gray-400 text-sm">Manage your privacy preferences</p>
                    </div>
                    <button className="bg-[#202124] px-4 py-2 rounded-lg hover:bg-[#3a3a45] transition-colors">
                      Configure
                    </button>
                  </div>
                  <div className="pt-6 border-t border-gray-700 mt-6">
                    <h3 className="font-semibold mb-4">Danger Zone</h3>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthWrapper>
      <Suspense fallback={
        <div className="min-h-screen bg-[#202124] text-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-8">
                <div className="flex space-x-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-[#303134] rounded-lg w-32"></div>
                  ))}
                </div>
                <div className="bg-[#303134] rounded-lg p-6 space-y-6">
                  <div className="h-8 bg-[#202124] rounded w-1/4"></div>
                  <div className="space-y-4">
                    <div className="h-12 bg-[#202124] rounded"></div>
                    <div className="h-12 bg-[#202124] rounded"></div>
                    <div className="h-10 bg-[#202124] rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <ProfileContent />
      </Suspense>
    </AuthWrapper>
  );
} 