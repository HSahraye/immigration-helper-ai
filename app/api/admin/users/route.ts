import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAllUsers, isAdmin } from '@/lib/services/userService';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const isUserAdmin = await isAdmin(session.user.email);
    if (!isUserAdmin) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 