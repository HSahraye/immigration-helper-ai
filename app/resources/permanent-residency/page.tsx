'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import AgentChat from '../../../components/AgentChat';

export default function PermanentResidencyPage() {
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
          <div className="bg-red-500 w-12 h-12 rounded-lg flex items-center justify-center text-white">
            <Home className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">Permanent Residency</h1>
        </div>

        <AgentChat
          title="Permanent Residency Assistant"
          description="Get help with permanent residency application and requirements"
          endpoint={`/api/permanent-residency-agent`}
        />
      </div>
    </div>
  );
} 