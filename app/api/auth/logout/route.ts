import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma, isBuildTime } from '@/lib/prisma';

// Add dynamic flag to prevent static generation attempts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    // Return success during build time
    if (isBuildTime()) {
      console.log('Build time detected in logout route, returning mock success');
      return NextResponse.json({ success: true, isMock: true });
    }

    const sessionToken = cookies().get('session-token')?.value;

    if (sessionToken) {
      // Check if Prisma is initialized
      if (!prisma) {
        console.error('Prisma client not initialized');
        return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
      }

      // Delete the session from the database
      await prisma.session.delete({
        where: { sessionToken },
      }).catch(() => {
        // Ignore errors if session not found
      });

      // Clear the cookie
      cookies().delete('session-token');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    
    // If we're in build time and hit an error, return mock success
    if (isBuildTime()) {
      return NextResponse.json({ success: true, isMock: true });
    }
    
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 