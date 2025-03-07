'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, BookOpen, User, Globe } from 'lucide-react';

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'chat',
      label: 'Chat',
      href: '/',
      icon: MessageSquare
    },
    {
      name: 'resources',
      label: 'Resources',
      href: '/resources',
      icon: BookOpen
    },
    {
      name: 'profile',
      label: 'Profile',
      href: '/profile',
      icon: User
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 text-center">
          <div className="flex justify-center mb-4">
            <Globe className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Immigration Helper AI</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal AI assistant for immigration-related questions and guidance
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 mb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-2">
            {tabs.map((tab) => {
              const isActive = 
                tab.href === '/' 
                  ? pathname === tab.href 
                  : pathname.startsWith(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex flex-col items-center p-2 ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-sm mt-1">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
} 