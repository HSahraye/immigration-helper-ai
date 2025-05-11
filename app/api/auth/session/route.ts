import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { prisma, isBuildTime } from '@/lib/prisma';

// Add dynamic flag to prevent static generation attempts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Mock session for build time
const getMockSession = () => ({
  user: {
    id: 'mock-user-id',
    name: 'Mock User',
    email: 'mock@example.com',
    role: 'USER',
  }
});

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

    // Check if Prisma is initialized
    if (!prisma) {
      console.error('Prisma client not initialized');
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
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