'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const session = useSession();
  const isAuthenticated = session.status === 'authenticated';

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
          Navigate Immigration <span className="text-blue-500">Confidently</span>
        </h1>
        <p className="text-xl md:text-2xl text-center max-w-3xl mb-10">
          Get AI-powered guidance for visas, citizenship, and immigration processes.
          No account required to start.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/resources" 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium text-center transition-colors">
            Start Chatting Now
          </Link>
          {!isAuthenticated && (
            <Link href="/auth/signin" 
                  className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-full font-medium text-center transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#2d2d30] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How We Can Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Visa Applications" 
              description="Get instant guidance on student, work, and visitor visa requirements and processes." 
              icon="📝" 
              href="/resources/visa-applications"
            />
            <FeatureCard 
              title="Family Sponsorship" 
              description="Learn about sponsoring family members and navigating the reunification process." 
              icon="👨‍👩‍👧‍👦" 
              href="/resources/family-sponsorship"
            />
            <FeatureCard 
              title="Citizenship" 
              description="Understand the path to citizenship including eligibility, tests, and documentation." 
              icon="🗽" 
              href="/resources/citizenship"
            />
            <FeatureCard 
              title="Document Analysis" 
              description="Upload your immigration documents for AI-powered analysis and guidance." 
              icon="📄" 
              href="/resources"
            />
            <FeatureCard 
              title="Work Permits" 
              description="Navigate work authorization processes and requirements for different countries." 
              icon="💼" 
              href="/resources/work-permits"
            />
            <FeatureCard 
              title="Legal Assistance" 
              description="Get connected with immigration attorneys when you need specialized help." 
              icon="⚖️" 
              href="/resources/legal-assistance"
            />
          </div>
        </div>
      </div>

      {/* Free vs Premium Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Free to Start, Premium When You Need It</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-[#2d2d30] p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Free Access</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>5 free AI conversations per day</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Access to all immigration topics</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Basic document analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span className="text-gray-400">Save conversation history</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span className="text-gray-400">Advanced document analysis</span>
              </li>
            </ul>
          </div>
          <div className="bg-blue-900 p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Premium Access</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unlimited AI conversations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Advanced document analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Save and export conversations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Document templates and generation</span>
              </li>
            </ul>
            <Link href="/subscribe" 
                  className="w-full mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium text-center block transition-colors">
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  title, 
  description, 
  icon, 
  href 
}: { 
  title: string; 
  description: string; 
  icon: string; 
  href: string; 
}) {
  return (
    <Link href={href} className="bg-[#32323a] p-6 rounded-xl hover:bg-[#3a3a45] transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </Link>
  );
} 