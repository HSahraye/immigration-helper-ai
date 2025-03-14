'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import AgentChat from '../../../components/AgentChat';

export default function StudentVisasPage() {
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
          <div className="bg-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">Student Visas</h1>
        </div>

        <AgentChat
          title="Student Visas Assistant"
          description="Get help with student visa requirements and application process"
          apiEndpoint="/api/student-visas-agent"
        />
      </div>
    </div>
  );
} 