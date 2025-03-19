'use client';

import React from 'react';
import Link from 'next/link';
import { Folder, Users, Briefcase, GraduationCap, Home, Plane, Scale } from 'lucide-react';
import AgentChat from '../../../components/AgentChat';

const categoryIcons = {
  'visa-applications': <Folder className="w-6 h-6" />,
  'citizenship': <Users className="w-6 h-6" />,
  'work-permits': <Briefcase className="w-6 h-6" />,
  'family-sponsorship': <Users className="w-6 h-6" />,
  'student-visas': <GraduationCap className="w-6 h-6" />,
  'permanent-residency': <Home className="w-6 h-6" />,
  'travel-documents': <Plane className="w-6 h-6" />,
  'legal-assistance': <Scale className="w-6 h-6" />,
};

const categoryColors = {
  'visa-applications': 'bg-blue-500',
  'citizenship': 'bg-green-500',
  'work-permits': 'bg-purple-500',
  'family-sponsorship': 'bg-pink-500',
  'student-visas': 'bg-yellow-500',
  'permanent-residency': 'bg-red-500',
  'travel-documents': 'bg-indigo-500',
  'legal-assistance': 'bg-orange-500',
};

const categoryTitles = {
  'visa-applications': 'Visa Applications',
  'citizenship': 'Citizenship',
  'work-permits': 'Work Permits',
  'family-sponsorship': 'Family Sponsorship',
  'student-visas': 'Student Visas',
  'permanent-residency': 'Permanent Residency',
  'travel-documents': 'Travel Documents',
  'legal-assistance': 'Legal Assistance',
};

const categoryDescriptions = {
  'visa-applications': 'Get help with different types of visas and application processes',
  'citizenship': 'Learn about citizenship application and requirements',
  'work-permits': 'Understand work permit applications and employment-based immigration',
  'family-sponsorship': 'Get information about sponsoring family members',
  'student-visas': 'Learn about student visa requirements and application process',
  'permanent-residency': 'Understand permanent residency application and requirements',
  'travel-documents': 'Get help with travel document requirements and applications',
  'legal-assistance': 'Access legal resources and immigration lawyer information',
};

// Add this function for static exports
export function generateStaticParams() {
  // Generate pages for all valid categories
  return Object.keys(categoryTitles).map(category => ({
    category,
  }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const icon = categoryIcons[params.category as keyof typeof categoryIcons];
  const color = categoryColors[params.category as keyof typeof categoryColors];
  const title = categoryTitles[params.category as keyof typeof categoryTitles];
  const description = categoryDescriptions[params.category as keyof typeof categoryDescriptions];

  if (!title) {
    return (
      <div className="min-h-screen bg-[#202124] text-gray-200 p-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/resources"
            className="text-blue-400 hover:text-blue-300 mb-8 inline-block"
          >
            ← Back to Resources
          </Link>
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/resources"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
            ← Back to Resources
          </Link>
          <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
            {icon}
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <AgentChat
          title={title}
          description={description}
          endpoint={`/api/${params.category}-agent`}
        />
      </div>
    </div>
  );
} 