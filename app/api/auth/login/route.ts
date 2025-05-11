import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'crypto';
import { prisma, isBuildTime } from '@/lib/prisma';

// Add dynamic flag to prevent static generation attempts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Password verification function
function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  return verifyHash === hash;
}

// Mock user for build time
const getMockUser = () => ({
  id: 'mock-user-id',
  name: 'Mock User',
  email: 'mock@example.com',
  image: null,
});

export async function POST(request: NextRequest) {
  try {
    // Return mock data during build time
    if (isBuildTime()) {
      console.log('Build time detected in login route, returning mock user');
      return NextResponse.json({ 
        user: getMockUser(),
        isMock: true
      });
    }

    const { email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if Prisma is initialized
    if (!prisma) {
      console.error('Prisma client not initialized');
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true,
        salt: true,
      },
    });

    if (!user || !user.password || !user.salt) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify the password
    if (!verifyPassword(password, user.password, user.salt)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate a session token
    const sessionToken = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Save the session
    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      },
    });

    // Set cookie
    cookies().set('session-token', sessionToken, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // Return user without sensitive data
    const { password: _, salt: __, ...userWithoutSensitiveData } = user;
    
    return NextResponse.json({ user: userWithoutSensitiveData });
  } catch (error) {
    console.error('Login error:', error);
    
    // If we're in build time and hit an error, return mock user
    if (isBuildTime()) {
      return NextResponse.json({ 
        user: getMockUser(),
        isMock: true
      });
    }
    
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 