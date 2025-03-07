'use client';

import React, { useState } from 'react';
import { User, Settings, Bell, Globe, Shield, Clock, BookMarked, FileText, History, HelpCircle } from 'lucide-react';

const profileSections = [
  {
    title: 'Personal Information',
    icon: <User className="w-6 h-6" />,
    items: [
      'Name and Contact Information',
      'Immigration Status',
      'Document Numbers',
      'Address History',
    ],
  },
  {
    title: 'Preferences',
    icon: <Settings className="w-6 h-6" />,
    items: [
      'Language Settings',
      'Notification Preferences',
      'Theme Settings',
      'Accessibility Options',
    ],
  },
  {
    title: 'Notifications',
    icon: <Bell className="w-6 h-6" />,
    items: [
      'Application Updates',
      'Document Reminders',
      'Important Deadlines',
      'Status Changes',
    ],
  },
  {
    title: 'Privacy & Security',
    icon: <Shield className="w-6 h-6" />,
    items: [
      'Privacy Settings',
      'Data Management',
      'Security Preferences',
      'Two-Factor Authentication',
    ],
  },
  {
    title: 'History',
    icon: <History className="w-6 h-6" />,
    items: [
      'Chat History',
      'Document History',
      'Application History',
      'Search History',
    ],
  },
  {
    title: 'Help & Support',
    icon: <HelpCircle className="w-6 h-6" />,
    items: [
      'FAQ',
      'Contact Support',
      'User Guide',
      'Feedback',
    ],
  },
];

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('personal');

  const sections = {
    personal: {
      title: 'Personal Information',
      icon: User,
      fields: [
        { label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { label: 'Email', type: 'email', placeholder: 'Enter your email' },
        { label: 'Phone', type: 'tel', placeholder: 'Enter your phone number' },
        { label: 'Country of Origin', type: 'text', placeholder: 'Enter your country' },
        { label: 'Current Immigration Status', type: 'text', placeholder: 'Enter your status' }
      ]
    },
    preferences: {
      title: 'Preferences',
      icon: Settings,
      settings: [
        { label: 'Language', options: ['English', 'Spanish', 'French', 'Chinese'] },
        { label: 'Time Zone', options: ['UTC-8', 'UTC-5', 'UTC+0', 'UTC+8'] },
        { label: 'Notification Preferences', type: 'checkbox', options: [
          'Email Notifications',
          'Document Reminders',
          'Application Updates',
          'News and Changes'
        ]}
      ]
    },
    documents: {
      title: 'My Documents',
      icon: FileText,
      documents: [
        { type: 'Passport', status: 'Valid', expiry: '2025-12-31' },
        { type: 'Visa', status: 'Processing', expiry: 'N/A' },
        { type: 'Work Permit', status: 'Expired', expiry: '2023-06-30' }
      ]
    },
    timeline: {
      title: 'Immigration Timeline',
      icon: Clock,
      events: [
        { date: '2024-03-07', event: 'Application Submitted' },
        { date: '2024-02-15', event: 'Documents Received' },
        { date: '2024-01-01', event: 'Process Started' }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileSections.map((section) => (
            <div
              key={section.title}
              className="bg-[#303134] rounded-xl p-6 hover:bg-[#404144] transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="text-gray-400 hover:text-gray-200">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 