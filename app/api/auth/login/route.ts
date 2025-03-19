import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'crypto';

const prisma = new PrismaClient();

// Password verification function
function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  return verifyHash === hash;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
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
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 