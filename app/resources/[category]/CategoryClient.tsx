import React, { Suspense } from 'react';
import AgentChat from '../../components/AgentChat';
import { Users, Briefcase, GraduationCap, Home, Plane, Scale, FileText, Folder } from 'lucide-react';

interface CategoryClientProps {
  category: string;
}

const categoryConfig = {
  'visa-applications': {
    title: 'Visa Applications',
    description: 'Get help with different types of visas and application processes',
    endpoint: '/api/visa-applications-agent',
    icon: Folder,
    color: 'bg-blue-500'
  },
  'citizenship': {
    title: 'Citizenship',
    description: 'Get help with citizenship application and requirements',
    endpoint: '/api/citizenship-agent',
    icon: Users,
    color: 'bg-green-500'
  },
  'work-permits': {
    title: 'Work Permits',
    description: 'Get help with work permit applications and employment-based immigration',
    endpoint: '/api/work-permits-agent',
    icon: Briefcase,
    color: 'bg-purple-500'
  },
  'family-sponsorship': {
    title: 'Family Sponsorship',
    description: 'Get help with sponsoring family members',
    endpoint: '/api/family-sponsorship-agent',
    icon: Users,
    color: 'bg-pink-500'
  },
  'student-visas': {
    title: 'Student Visas',
    description: 'Get help with student visa applications',
    endpoint: '/api/student-visas-agent',
    icon: GraduationCap,
    color: 'bg-yellow-500'
  },
  'permanent-residency': {
    title: 'Permanent Residency',
    description: 'Get help with permanent residency application and requirements',
    endpoint: '/api/permanent-residency-agent',
    icon: Home,
    color: 'bg-red-500'
  },
  'travel-documents': {
    title: 'Travel Documents',
    description: 'Get help with travel document requirements and applications',
    endpoint: '/api/travel-documents-agent',
    icon: Plane,
    color: 'bg-indigo-500'
  },
  'legal-assistance': {
    title: 'Legal Assistance',
    description: 'Get help with legal resources and immigration lawyer information',
    endpoint: '/api/legal-assistance-agent',
    icon: Scale,
    color: 'bg-orange-500'
  }
};

const CategoryClient: React.FC<CategoryClientProps> = ({ category }) => {
  const config = categoryConfig[category as keyof typeof categoryConfig];

  if (!config) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-400">The requested category does not exist.</p>
      </div>
    );
  }

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className={`${config.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">{config.title}</h1>
        </div>

        <Suspense fallback={
          <div className="bg-[#282830] rounded-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="space-y-3 mt-8">
                <div className="h-24 bg-gray-700 rounded"></div>
                <div className="h-24 bg-gray-700 rounded"></div>
              </div>
              <div className="h-12 bg-gray-700 rounded mt-4"></div>
            </div>
          </div>
        }>
          <AgentChat
            title={config.title}
            description={config.description}
            endpoint={config.endpoint}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default CategoryClient; 