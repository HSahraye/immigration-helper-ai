'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ManageSubscriptionPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/account/manage-subscription');
  }
  
  // Ensure the user has a subscription
  if (!session.user.plan || session.user.plan === 'basic') {
    redirect('/account');
  }
  
  const isPro = session.user.plan === 'pro';
  const isActive = session.user.subscriptionStatus === 'active';
  const isCanceled = session.user.subscriptionStatus === 'canceled';
  
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Link href="/account" className="text-gray-400 hover:text-white">
              ← Back to Account
            </Link>
            <h1 className="text-4xl font-bold">Manage Subscription</h1>
          </div>
          
          <div className="bg-[#303134] rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Current Subscription</h2>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="font-semibold text-xl">
                  {isPro ? 'Pro Plan' : 'Basic Plan'}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isActive && !isCanceled 
                    ? 'bg-green-600 bg-opacity-20 text-green-400' 
                    : isCanceled 
                      ? 'bg-red-600 bg-opacity-20 text-red-400'
                      : 'bg-yellow-600 bg-opacity-20 text-yellow-400'
                }`}>
                  {isActive && !isCanceled 
                    ? 'Active' 
                    : isCanceled
                      ? 'Canceled'
                      : 'Inactive'}
                </div>
              </div>
              
              {/* Subscription Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">Plan</div>
                  <div>{isPro ? 'Pro' : 'Basic'}</div>
                </div>
                {session.user?.currentPeriodEnd && (
                  <div className="space-y-2">
                    <div className="text-gray-400 text-sm">
                      {isCanceled ? 'Access Until' : 'Renews On'}
                    </div>
                    <div>
                      {new Date(session.user.currentPeriodEnd).toLocaleDateString()}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">Status</div>
                  <div>{isCanceled ? 'Canceled' : isActive ? 'Active' : 'Inactive'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">Price</div>
                  <div>$19.99 / month</div>
                </div>
              </div>
              
              {/* Subscription Actions */}
              <div className="space-y-4">
                <SubscriptionAction 
                  session={session} 
                  isCanceled={isCanceled} 
                  isActive={isActive} 
                />
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Link 
                    href="#"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                    onClick={async (e) => {
                      e.preventDefault();
                      
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
                          alert('Error accessing Stripe Customer Portal: ' + (data.error || 'Unknown error'));
                        }
                      } catch (error) {
                        console.error('Error:', error);
                        alert('An error occurred. Please try again.');
                      }
                    }}
                  >
                    Access Stripe Customer Portal →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#303134] rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Plan */}
                <div className={`bg-[#252529] p-6 rounded-lg border ${!isPro ? 'border-blue-500' : 'border-gray-700'}`}>
                  <h3 className="text-xl font-bold mb-2">Basic</h3>
                  <p className="text-2xl font-bold mb-4">Free</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Basic document analysis
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Limited chat assistance
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Access to basic resources
                    </li>
                  </ul>
                  
                  {isPro && (
                    <DowngradeAction isCanceled={isCanceled} />
                  )}
                </div>
                
                {/* Pro Plan */}
                <div className={`bg-[#252529] p-6 rounded-lg border ${isPro ? 'border-blue-500' : 'border-gray-700'}`}>
                  <h3 className="text-xl font-bold mb-2">Pro</h3>
                  <p className="text-2xl font-bold mb-4">$19.99<span className="text-sm">/month</span></p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Advanced document analysis
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Unlimited chat assistance
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Priority support
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Full resource access
                    </li>
                  </ul>
                  
                  {!isPro && (
                    <Link
                      href="/checkout?plan=pro"
                      className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Upgrade to Pro
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionAction({ session, isCanceled, isActive }) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const router = useRouter();

  const handleAction = async (action) => {
    setIsLoading(true);
    setActionError('');
    
    try {
      const response = await fetch('/api/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Refresh the page to show updated subscription status
        router.refresh();
      } else {
        setActionError(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setActionError('An unexpected error occurred');
    }
    
    setIsLoading(false);
  }
  
  if (isCanceled) {
    return (
      <div>
        <button
          onClick={() => handleAction('reactivate')}
          disabled={isLoading}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Processing...' : 'Reactivate Subscription'}
        </button>
        {actionError && (
          <p className="mt-2 text-red-400 text-sm">{actionError}</p>
        )}
        <p className="mt-2 text-gray-400 text-sm">
          Your subscription is currently canceled and will end on {session.user?.currentPeriodEnd ? new Date(session.user.currentPeriodEnd).toLocaleDateString() : 'the end of your billing period'}.
        </p>
      </div>
    );
  }
  
  if (isActive) {
    return (
      <div>
        <button
          onClick={() => handleAction('cancel')}
          disabled={isLoading}
          className="block w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Processing...' : 'Cancel Subscription'}
        </button>
        {actionError && (
          <p className="mt-2 text-red-400 text-sm">{actionError}</p>
        )}
        <p className="mt-2 text-gray-400 text-sm">
          Canceling will allow you to use Pro features until the end of your current billing period.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <Link
        href="/checkout?plan=pro"
        className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Renew Subscription
      </Link>
      <p className="mt-2 text-gray-400 text-sm">
        Your subscription is inactive. Renew to continue enjoying Pro features.
      </p>
    </div>
  );
}

function DowngradeAction({ isCanceled }) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const router = useRouter();
  
  const handleDowngrade = async () => {
    if (!confirm('Are you sure you want to downgrade to the Basic plan? You will lose access to Pro features at the end of your current billing period.')) {
      return;
    }
    
    setIsLoading(true);
    setActionError('');
    
    try {
      // If already canceled, we can downgrade immediately
      if (isCanceled) {
        // Implement immediate downgrade logic
        const response = await fetch('/api/downgrade-to-basic', {
          method: 'POST',
        });
        
        if (response.ok) {
          router.push('/account');
        } else {
          const data = await response.json();
          setActionError(data.error || 'Failed to downgrade');
        }
      } else {
        // Otherwise just cancel the subscription which will effectively downgrade at period end
        const response = await fetch('/api/manage-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'cancel' }),
        });
        
        if (response.ok) {
          router.refresh();
        } else {
          const data = await response.json();
          setActionError(data.error || 'Failed to initiate downgrade');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setActionError('An unexpected error occurred');
    }
    
    setIsLoading(false);
  };
  
  return (
    <div>
      <button
        onClick={handleDowngrade}
        disabled={isLoading}
        className="block w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        {isLoading ? 'Processing...' : isCanceled ? 'Downgrade Now' : 'Downgrade to Basic'}
      </button>
      {actionError && (
        <p className="mt-2 text-red-400 text-sm">{actionError}</p>
      )}
      <p className="mt-2 text-gray-400 text-sm">
        {isCanceled 
          ? 'Downgrade immediately and switch to the Basic plan.' 
          : 'You will be downgraded to the Basic plan at the end of your billing period.'}
      </p>
    </div>
  );
} 