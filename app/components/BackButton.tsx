'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label?: string;
  destination?: string;
  className?: string;
}

export default function BackButton({ 
  label = 'Back to Services', 
  destination = '/resources',
  className = '' 
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push(destination)}
      className={`flex items-center text-gray-400 hover:text-blue-400 transition-colors ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      <span>{label}</span>
    </button>
  );
} 