/**
 * Shared configuration for dynamic routes
 */

import { NextResponse } from 'next/server';

// Function to provide empty static params for dynamic routes
export function generateStaticParams() {
  return [];
}

// Helper method to handle API errors consistently
export function handleApiError(error: unknown, message: string) {
  console.error(`API Error - ${message}:`, error);
  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
} 