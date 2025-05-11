export enum DocumentStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED'
}

export enum DocumentType {
  VISA_APPLICATION = 'VISA_APPLICATION',
  COVER_LETTER = 'COVER_LETTER',
  SUPPORT_LETTER = 'SUPPORT_LETTER',
  LEGAL_DOCUMENT = 'LEGAL_DOCUMENT',
  OTHER = 'OTHER'
}

export enum UsageType {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  DOCUMENT_ANALYSIS = 'DOCUMENT_ANALYSIS',
  DOCUMENT_GENERATION = 'DOCUMENT_GENERATION',
  AI_FEATURE_ACCESS = 'AI_FEATURE_ACCESS'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT'
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  password: string | null;
  salt: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: DocumentType;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any> | null;
}

export type { Prisma } from '@prisma/client'; 