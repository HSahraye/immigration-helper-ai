import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { isBuildTime, getMockSession } from '../../setupMocksForBuild';

// Add dynamic flag to prevent static generation attempts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Initialize Prisma client
let prisma: PrismaClient;

// Only initialize PrismaClient if not in build time to prevent connection errors
if (!isBuildTime()) {
  prisma = new PrismaClient();
}

export async function GET() {
  try {
    // Return mock data during build time
    if (isBuildTime()) {
      console.log('Build time detected in session route, returning mock session');
      return NextResponse.json({ 
        user: getMockSession()?.user || null,
        isMock: true
      });
    }

    const sessionToken = cookies().get('session-token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    // Find the session
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    // Check if session exists and is not expired
    if (!session || session.expires < new Date()) {
      // Clear invalid cookie
      cookies().delete('session-token');
      return NextResponse.json({ user: null });
    }

    // Return user without password and salt
    const { password, salt, ...userWithoutSensitiveData } = session.user;
    return NextResponse.json({ user: userWithoutSensitiveData });
  } catch (error) {
    console.error('Session retrieval error:', error);
    
    // If we're in build time and hit an error, return a mock session
    if (isBuildTime()) {
      return NextResponse.json({ 
        user: getMockSession()?.user || null,
        isMock: true
      });
    }
    
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 