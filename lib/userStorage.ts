import prisma from './prisma';
import { User } from '@prisma/client';
import crypto from 'crypto';

// Simple password hashing function
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

// Verify the password
export function verifyPassword(storedPassword: string, suppliedPassword: string): boolean {
  const [salt, storedHash] = storedPassword.split(':');
  const hash = crypto
    .pbkdf2Sync(suppliedPassword, salt, 1000, 64, 'sha512')
    .toString('hex');
  return storedHash === hash;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email }
  });
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id }
  });
}

// Create a new user
export async function createUser(name: string, email: string, password: string): Promise<User> {
  const hashedPassword = hashPassword(password);
  
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(), // Set as verified for simplicity
    }
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