'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthWrapper from '../components/AuthWrapper';
import { User, CreditCard, MessageSquare, FileText, Settings, LogOut } from 'lucide-react';

function ProfileContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#303134] text-gray-300 hover:bg-[#3a3a45]'
                  }`}
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
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full bg-[#202124] border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full bg-[#202124] border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Your email"
                    />
                  </div>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Subscription</h2>
                <div className="bg-[#202124] rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Current Plan</h3>
                  <p className="text-gray-400 mb-4">Free Plan</p>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Upgrade to Premium
                  </button>
                </div>
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
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mb-6">
                  Create New Document
                </button>
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