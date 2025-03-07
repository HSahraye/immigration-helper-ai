import React from 'react';
import { Folder, Users, Briefcase, GraduationCap, Home, Plane, Scale } from 'lucide-react';

const categories = [
  {
    title: 'Visa Applications',
    description: 'Information about different types of visas and application processes',
    icon: <Folder className="w-6 h-6" />,
    color: 'bg-blue-500',
  },
  {
    title: 'Citizenship',
    description: 'Guide to citizenship application and requirements',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-green-500',
  },
  {
    title: 'Work Permits',
    description: 'Work permit applications and employment-based immigration',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'bg-purple-500',
  },
  {
    title: 'Family Sponsorship',
    description: 'Information about sponsoring family members',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-pink-500',
  },
  {
    title: 'Student Visas',
    description: 'Student visa requirements and application process',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'bg-yellow-500',
  },
  {
    title: 'Permanent Residency',
    description: 'Permanent residency application and requirements',
    icon: <Home className="w-6 h-6" />,
    color: 'bg-red-500',
  },
  {
    title: 'Travel Documents',
    description: 'Travel document requirements and applications',
    icon: <Plane className="w-6 h-6" />,
    color: 'bg-indigo-500',
  },
  {
    title: 'Legal Assistance',
    description: 'Legal resources and immigration lawyer information',
    icon: <Scale className="w-6 h-6" />,
    color: 'bg-orange-500',
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Immigration Resources</h1>
        <p className="text-gray-400 mb-8">Comprehensive guides and information for your immigration journey</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="bg-[#303134] rounded-xl p-6 hover:bg-[#404144] transition-colors cursor-pointer"
            >
              <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-400">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 