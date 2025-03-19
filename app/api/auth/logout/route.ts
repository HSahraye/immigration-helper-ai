import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const sessionToken = cookies().get('session-token')?.value;

    if (sessionToken) {
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
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 