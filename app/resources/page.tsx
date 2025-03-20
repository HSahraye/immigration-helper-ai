'use client';

import React from 'react';
import { Folder, Users, Briefcase, GraduationCap, Home, Plane, Scale, FileText } from 'lucide-react';
import { PageHero } from '../components/aceternity-ui/PageHero';
import { ResourceCard } from '../components/aceternity-ui/ResourceCard';

const categories = [
  {
    title: 'Visa Applications',
    description: 'Information about different types of visas and application processes',
    icon: <Folder className="w-6 h-6" />,
    color: 'bg-blue-500/[0.2] text-blue-500',
    id: 'visa-applications',
    path: '/resources/visa-applications',
  },
  {
    title: 'Citizenship',
    description: 'Guide to citizenship application and requirements',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-green-500/[0.2] text-green-500',
    id: 'citizenship',
    path: '/resources/citizenship',
  },
  {
    title: 'Work Permits',
    description: 'Work permit applications and employment-based immigration',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'bg-purple-500/[0.2] text-purple-500',
    id: 'work-permits',
    path: '/resources/work-permits',
  },
  {
    title: 'Family Sponsorship',
    description: 'Information about sponsoring family members',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-pink-500/[0.2] text-pink-500',
    id: 'family-sponsorship',
    path: '/resources/family-sponsorship',
  },
  {
    title: 'Student Visas',
    description: 'Student visa requirements and application process',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'bg-yellow-500/[0.2] text-yellow-500',
    id: 'student-visas',
    path: '/resources/student-visas',
  },
  {
    title: 'Permanent Residency',
    description: 'Permanent residency application and requirements',
    icon: <Home className="w-6 h-6" />,
    color: 'bg-red-500/[0.2] text-red-500',
    id: 'permanent-residency',
    path: '/resources/permanent-residency',
  },
  {
    title: 'Travel Documents',
    description: 'Travel document requirements and applications',
    icon: <Plane className="w-6 h-6" />,
    color: 'bg-indigo-500/[0.2] text-indigo-500',
    id: 'travel-documents',
    path: '/resources/travel-documents',
  },
  {
    title: 'Legal Assistance',
    description: 'Legal resources and immigration lawyer information',
    icon: <Scale className="w-6 h-6" />,
    color: 'bg-orange-500/[0.2] text-orange-500',
    id: 'legal-assistance',
    path: '/resources/legal-assistance',
  },
  {
    title: 'Document Analysis',
    description: 'Upload and analyze your immigration documents',
    icon: <FileText className="w-6 h-6" />,
    color: 'bg-teal-500/[0.2] text-teal-500',
    id: 'document-analysis',
    path: '/documents',
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Our Immigration Services
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Get expert AI-powered guidance on all aspects of your immigration journey
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <ResourceCard
            key={category.id}
            title={category.title}
            description={category.description}
            icon={category.icon}
            color={category.color}
            path={category.path}
          />
        ))}
      </div>
    </div>
  );
} 