'use client';

import React from 'react';
import { Folder } from 'lucide-react';
import AgentChat from '../../../components/AgentChat';
import BackButton from '../../components/BackButton';

export default function VisaApplicationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <BackButton />
        <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md">
          <Folder className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-white">Visa Applications</h1>
      </div>

      <AgentChat
        title="Visa Applications Assistant"
        description="Get help with different types of visas and application processes"
        endpoint="/api/visa-agent"
      />
    </div>
  );
} 