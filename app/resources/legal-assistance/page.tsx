'use client';

import React from 'react';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import AgentChat from '../../../components/AgentChat';

export default function LegalAssistancePage() {
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
          <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center text-white">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">Legal Assistance</h1>
        </div>

        <AgentChat
          title="Legal Assistance"
          description="Get help with legal resources and immigration lawyer information"
          endpoint={`/api/legal-assistance-agent`}
        />
      </div>
    </div>
  );
} 