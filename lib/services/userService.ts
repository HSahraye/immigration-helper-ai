import { prisma } from '@/lib/prisma';
import { Prisma, User } from '@prisma/client';

export type UserWithoutPassword = Omit<User, 'password' | 'salt'>;

export interface PaginatedUsers {
  users: UserWithoutPassword[];
  total: number;
  hasMore: boolean;
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 10,
  orderBy: keyof User = 'createdAt',
  order: 'asc' | 'desc' = 'desc'
): Promise<PaginatedUsers> {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { [orderBy]: order },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    hasMore: skip + users.length < total,
  };
}

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  
  return user?.role === 'ADMIN';
} 