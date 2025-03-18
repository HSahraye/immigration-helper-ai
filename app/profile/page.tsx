'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, CreditCard, MessageSquare, FileText, Settings, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<string | null>(null);
  const [subscriptionDate, setSubscriptionDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('account');

  // Read tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['account', 'subscription', 'history', 'documents', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Get subscription from localStorage (in production, this would come from your API/database)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSubscription = localStorage.getItem('userSubscription');
      const storedDate = localStorage.getItem('subscriptionDate');
      
      setSubscription(storedSubscription);
      setSubscriptionDate(storedDate);
    }
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
        <div className="animate-pulse">Redirecting to login...</div>
      </div>
    );
  }

  // Format subscription info
  const subscriptionInfo = {
    basic: {
      name: 'Basic Plan',
      price: '$9.99/month',
      features: ['Unlimited AI conversations', 'Basic document analysis', 'Conversation history', 'All immigration topics'],
    },
    professional: {
      name: 'Professional Plan',
      price: '$19.99/month',
      features: ['Everything in Basic', 'Advanced document analysis', 'Document templates', 'Priority support'],
    },
  };

  const currentPlan = subscription ? subscriptionInfo[subscription as keyof typeof subscriptionInfo] : null;
  
  // Format date
  const formattedDate = subscriptionDate 
    ? new Date(subscriptionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-gray-400">
            Manage your profile, subscription, and preferences
          </p>
        </div>
        
        {/* Profile Layout - Sidebar and Content */}
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          
          {/* Sidebar Navigation */}
          <div className="bg-[#303134] rounded-xl p-4 h-fit">
            <nav>
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => setActiveTab('account')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === 'account' ? 'bg-blue-600' : 'hover:bg-[#3a3a42]'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Account</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('subscription')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === 'subscription' ? 'bg-blue-600' : 'hover:bg-[#3a3a42]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Subscription</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === 'history' ? 'bg-blue-600' : 'hover:bg-[#3a3a42]'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Chat History</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === 'documents' ? 'bg-blue-600' : 'hover:bg-[#3a3a42]'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span>My Documents</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-[#3a3a42]'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                </li>
                <li className="pt-4 border-t border-gray-700 mt-4">
                  <Link 
                    href="/api/auth/signout"
                    className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-red-400 hover:bg-[#3a3a42] transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Main Content Area */}
          <div className="bg-[#303134] rounded-xl p-6">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Information</h2>
                
                <div className="space-y-6">
                  {/* User Profile */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold overflow-hidden">
                      {session.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt={session.user.name || 'User'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        session.user?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{session.user?.name || 'User'}</h3>
                      <p className="text-gray-400">{session.user?.email}</p>
                    </div>
                  </div>
                  
                  {/* Account Details */}
                  <div className="bg-[#282830] p-4 rounded-lg">
                    <h4 className="font-medium mb-4">Account Details</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <span className="text-gray-400">Name:</span>
                        <span>{session.user?.name || 'Not provided'}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <span className="text-gray-400">Email:</span>
                        <span>{session.user?.email}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <span className="text-gray-400">Member Since:</span>
                        <span>
                          {/* In a real app, this would come from your database */}
                          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <span className="text-gray-400">Plan:</span>
                        <span>
                          {currentPlan ? (
                            <span className="text-blue-400">{currentPlan.name}</span>
                          ) : (
                            <span className="text-yellow-400">Free Plan</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="pt-4">
                    <button className="px-4 py-2 bg-[#383840] hover:bg-[#45454d] rounded-lg transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Subscription Management</h2>
                
                {currentPlan ? (
                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="bg-[#282830] p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{currentPlan.name}</h3>
                          <p className="text-gray-400">{currentPlan.price}</p>
                        </div>
                        <span className="bg-green-900/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          Active
                        </span>
                      </div>
                      
                      {formattedDate && (
                        <p className="text-sm text-gray-400 mb-4">
                          Started on {formattedDate}
                        </p>
                      )}
                      
                      <ul className="space-y-2 mb-6">
                        {currentPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-[#383840] hover:bg-[#45454d] rounded-lg transition-colors">
                          Change Plan
                        </button>
                        <button className="px-4 py-2 border border-red-700 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                    
                    {/* Payment Method */}
                    <div className="bg-[#282830] p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#383840] p-2 rounded">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-gray-400">Expires 12/25</p>
                        </div>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Update payment method
                      </button>
                    </div>
                    
                    {/* Billing History */}
                    <div className="bg-[#282830] p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span>
                            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          <span>{currentPlan.price}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span>
                            {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          <span>{currentPlan.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#282830] p-6 rounded-lg text-center">
                    <h3 className="text-lg font-semibold mb-2">You're on the Free Plan</h3>
                    <p className="text-gray-400 mb-6">
                      Upgrade to unlock unlimited conversations and advanced features.
                    </p>
                    <Link
                      href="/subscribe"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg inline-block font-medium transition-colors"
                    >
                      View Subscription Plans
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Chat History Tab */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Conversation History</h2>
                
                {subscription ? (
                  <div className="space-y-4">
                    {/* Sample conversation history - in a real app, this would come from your database */}
                    <div className="bg-[#282830] p-4 rounded-lg hover:bg-[#2a2a33] transition-colors cursor-pointer">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Student Visa Application</h3>
                        <span className="text-sm text-gray-400">Today</span>
                      </div>
                      <p className="text-gray-400 text-sm truncate">I need help with my F-1 student visa application for...</p>
                    </div>
                    
                    <div className="bg-[#282830] p-4 rounded-lg hover:bg-[#2a2a33] transition-colors cursor-pointer">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">H-1B Work Visa Requirements</h3>
                        <span className="text-sm text-gray-400">Yesterday</span>
                      </div>
                      <p className="text-gray-400 text-sm truncate">What are the requirements for an H-1B visa renewal?</p>
                    </div>
                    
                    <div className="bg-[#282830] p-4 rounded-lg hover:bg-[#2a2a33] transition-colors cursor-pointer">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Green Card Process</h3>
                        <span className="text-sm text-gray-400">3 days ago</span>
                      </div>
                      <p className="text-gray-400 text-sm truncate">I'm applying for a Green Card through marriage...</p>
                    </div>
                    
                    <div className="bg-[#282830] p-4 rounded-lg hover:bg-[#2a2a33] transition-colors cursor-pointer">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Document Analysis</h3>
                        <span className="text-sm text-gray-400">Last week</span>
                      </div>
                      <p className="text-gray-400 text-sm truncate">I uploaded my I-20 form for analysis...</p>
                    </div>
                    
                    <Link 
                      href="/resources" 
                      className="block w-full text-center py-3 bg-[#383840] hover:bg-[#45454d] rounded-lg transition-colors"
                    >
                      Start New Conversation
                    </Link>
                  </div>
                ) : (
                  <div className="bg-[#282830] p-6 rounded-lg text-center">
                    <h3 className="text-lg font-semibold mb-2">Conversation History Not Available</h3>
                    <p className="text-gray-400 mb-6">
                      Upgrade to a paid plan to save and access your conversation history.
                    </p>
                    <Link
                      href="/subscribe"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg inline-block font-medium transition-colors"
                    >
                      Upgrade Now
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Documents</h2>
                
                {subscription ? (
                  <div className="space-y-6">
                    <div className="flex justify-between mb-4">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Upload Document</span>
                      </button>
                      
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-[#383840] hover:bg-[#45454d] rounded-lg transition-colors">
                          Recent
                        </button>
                        <button className="px-4 py-2 bg-[#383840] hover:bg-[#45454d] rounded-lg transition-colors">
                          All
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-[#282830] rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-700 flex justify-between items-center text-sm text-gray-400 font-medium">
                        <span className="w-1/2">Name</span>
                        <span className="w-1/4">Type</span>
                        <span className="w-1/4">Date</span>
                      </div>
                      
                      <div className="divide-y divide-gray-700">
                        <div className="p-4 flex justify-between items-center hover:bg-[#2a2a33] transition-colors cursor-pointer">
                          <div className="w-1/2 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <span className="truncate">I-20_Form.pdf</span>
                          </div>
                          <span className="w-1/4 text-gray-400">PDF</span>
                          <span className="w-1/4 text-gray-400">Today</span>
                        </div>
                        
                        <div className="p-4 flex justify-between items-center hover:bg-[#2a2a33] transition-colors cursor-pointer">
                          <div className="w-1/2 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <span className="truncate">Passport_Scan.jpg</span>
                          </div>
                          <span className="w-1/4 text-gray-400">Image</span>
                          <span className="w-1/4 text-gray-400">Yesterday</span>
                        </div>
                        
                        <div className="p-4 flex justify-between items-center hover:bg-[#2a2a33] transition-colors cursor-pointer">
                          <div className="w-1/2 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <span className="truncate">Employment_Letter.docx</span>
                          </div>
                          <span className="w-1/4 text-gray-400">Document</span>
                          <span className="w-1/4 text-gray-400">Last week</span>
                        </div>
                        
                        <div className="p-4 flex justify-between items-center hover:bg-[#2a2a33] transition-colors cursor-pointer">
                          <div className="w-1/2 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <span className="truncate">Bank_Statement.pdf</span>
                          </div>
                          <span className="w-1/4 text-gray-400">PDF</span>
                          <span className="w-1/4 text-gray-400">Last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#282830] p-6 rounded-lg text-center">
                    <h3 className="text-lg font-semibold mb-2">Document Storage Not Available</h3>
                    <p className="text-gray-400 mb-6">
                      Upgrade to a paid plan to store and manage your immigration documents.
                    </p>
                    <Link
                      href="/subscribe"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg inline-block font-medium transition-colors"
                    >
                      Upgrade Now
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                
                <div className="space-y-8">
                  {/* Notification Settings */}
                  <div className="bg-[#282830] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-400">Receive emails about your account and activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-gray-400">Receive updates about new features and promotions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Language Settings */}
                  <div className="bg-[#282830] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Language Preferences</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="language" className="block mb-2">Display Language</label>
                        <select 
                          id="language" 
                          className="w-full p-3 bg-[#202124] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="zh">中文</option>
                          <option value="hi">हिन्दी</option>
                          <option value="ar">العربية</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Privacy Settings */}
                  <div className="bg-[#282830] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Analytics</p>
                          <p className="text-sm text-gray-400">Allow us to collect anonymous usage data to improve our services</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Share Conversation Data</p>
                          <p className="text-sm text-gray-400">Allow us to use your conversations to improve our AI models</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="text-red-400 hover:text-red-300">
                        Delete My Account
                      </button>
                    </div>
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