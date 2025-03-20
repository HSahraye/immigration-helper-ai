"use client";

import React from 'react';
import { BackgroundLines } from './BackgroundLines';

interface PageHeroProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <BackgroundLines className="min-h-[60vh] flex items-center justify-center py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {title}
        </h1>
        <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300">
          {description}
        </p>
        {children}
      </div>
    </BackgroundLines>
  );
} 