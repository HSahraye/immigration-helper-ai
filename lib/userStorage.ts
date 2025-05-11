import prisma from './prisma';
import crypto from 'crypto';

type User = Awaited<ReturnType<typeof prisma.user.findUnique>>;

// Simple password hashing function
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Generate a random salt
function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Create a new user
export async function createUser(email: string, password: string, name?: string): Promise<User> {
  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      salt,
      name,
    },
  });
}

// Find a user by email
export async function findUserByEmail(email: string): Promise<User> {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Get user by ID
export async function getUserById(id: string): Promise<User> {
  return prisma.user.findUnique({
    where: { id }
  });
}

// Verify a user's password
export async function verifyPassword(user: { password: string | null, salt: string | null }, password: string): Promise<boolean> {
  if (!user.password || !user.salt) return false;
  const hashedPassword = hashPassword(password, user.salt);
  return hashedPassword === user.password;
}

// Update a user's password
export async function updatePassword(userId: string, newPassword: string): Promise<User> {
  const salt = generateSalt();
  const hashedPassword = hashPassword(newPassword, salt);

  return prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      salt,
    },
  });
}

// Update user last login time
export async function updateUserLastLogin(id: string): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: {
      updatedAt: new Date()
    }
  });
}

// Generate a session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Create a session for user
export async function createSession(userId: string, token: string, expires: Date) {
  return prisma.session.create({
    data: {
      sessionToken: token,
      userId,
      expires
    }
  });
}

// Get session by token
export async function getSessionByToken(token: string) {
  return prisma.session.findUnique({
    where: { sessionToken: token },
    include: { user: true }
  });
}

// Delete session
export async function deleteSession(token: string) {
  return prisma.session.delete({
    where: { sessionToken: token }
  });
} 