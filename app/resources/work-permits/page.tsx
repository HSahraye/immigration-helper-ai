'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import AgentChat from '../../../components/AgentChat';

export default function WorkPermitsPage() {
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
          <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center text-white">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">Work Permits</h1>
        </div>

        <AgentChat
          title="Work Permits Assistant"
          description="Get help with work permit applications and employment-based immigration"
          apiEndpoint="/api/work-permits-agent"
        />
      </div>
    </div>
  );
} 