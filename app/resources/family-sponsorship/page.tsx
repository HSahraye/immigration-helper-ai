'use client';

import React from 'react';
import { Users } from 'lucide-react';
import AgentChat from '../../../components/AgentChat';
import BackButton from '../../components/BackButton';

export default function FamilySponsorshipPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <BackButton />
        <div className="bg-pink-500 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md">
          <Users className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-white">Family Sponsorship</h1>
      </div>

      <AgentChat
        title="Family Sponsorship Assistant"
        description="Get help with sponsoring family members"
        endpoint="/api/family-sponsorship-agent"
      />
    </div>
  );
} 