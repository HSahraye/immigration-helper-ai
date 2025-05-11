import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hash } from 'bcryptjs';
import { prisma, isBuildTime } from '@/lib/prisma';

// Add dynamic flag to prevent static generation attempts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Mock user for build time
const getMockUser = () => ({
  id: 'mock-user-id',
  name: 'Mock User',
  email: 'mock@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
});

export async function POST(req: Request) {
  try {
    // Return mock data during build time
    if (isBuildTime()) {
      console.log('Build time detected in register route, returning mock user');
      return NextResponse.json({
        message: 'User created successfully',
        user: getMockUser(),
        isMock: true
      }, { status: 201 });
    }

    const { name, email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if Prisma is initialized
    if (!prisma) {
      console.error('Prisma client not initialized');
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // If we're in build time and hit an error, return mock user
    if (isBuildTime()) {
      return NextResponse.json({
        message: 'User created successfully',
        user: getMockUser(),
        isMock: true
      }, { status: 201 });
    }
    
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 