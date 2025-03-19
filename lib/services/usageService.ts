import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth';

// Define the enums locally since they're not exported by Prisma
export enum UsageType {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  DOCUMENT_ANALYSIS = 'DOCUMENT_ANALYSIS',
  DOCUMENT_GENERATION = 'DOCUMENT_GENERATION',
  AI_FEATURE_ACCESS = 'AI_FEATURE_ACCESS'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
  TRIALING = 'TRIALING'
}

// Default limits for free users
const FREE_TIER_LIMITS: Record<UsageType, number> = {
  CHAT_MESSAGE: 5, // 5 chat messages per day
  DOCUMENT_ANALYSIS: 0, // Not available in free tier
  DOCUMENT_GENERATION: 0, // Not available in free tier
  AI_FEATURE_ACCESS: 0, // Not available in free tier
};

// User type with subscription and plan
export type UserWithSubscription = {
  id: string;
  subscription?: {
    id: string;
    status: string;
    plan: {
      id: string;
      name: string;
    };
  } | null;
};

/**
 * Tracks usage for a specific user and usage type
 */
export async function trackUsage(userId: string, type: UsageType, count: number = 1, metadata: Record<string, any> = {}) {
  try {
    // Create usage record
    await prisma.usageRecord.create({
      data: {
        userId,
        type,
        count,
        metadata,
      },
    });

    // Return updated usage count for today
    return await getTodayUsage(userId, type);
  } catch (error) {
    console.error('Error tracking usage:', error);
    throw new Error('Failed to track usage');
  }
}

/**
 * Get usage for a specific user and type for the current day
 */
export async function getTodayUsage(userId: string, type: UsageType) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageRecords = await prisma.usageRecord.findMany({
      where: {
        userId,
        type,
        date: {
          gte: today,
        },
      },
    });

    return usageRecords.reduce((total: number, record: { count: number }) => total + record.count, 0);
  } catch (error) {
    console.error('Error getting today usage:', error);
    throw new Error('Failed to get today usage');
  }
}

/**
 * Checks if a user has exceeded their usage limit
 */
export async function hasExceededLimit(userId: string, type: UsageType): Promise<boolean> {
  try {
    // Get the user with their subscription and plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    // If no user found, they're unauthorized
    if (!user) return true;

    // If user has an active subscription with a valid plan, they have unlimited access
    if (
      user.subscription && 
      user.subscription.status === 'ACTIVE' && 
      user.subscription.plan &&
      ['Basic', 'Professional', 'Enterprise'].includes(user.subscription.plan.name)
    ) {
      return false;
    }

    // For free tier users, check limits
    const currentUsage = await getTodayUsage(userId, type);
    const limit = FREE_TIER_LIMITS[type] || 0;

    return currentUsage >= limit;
  } catch (error) {
    console.error('Error checking usage limit:', error);
    throw new Error('Failed to check usage limit');
  }
}

/**
 * Get usage statistics for a specific user
 */
export async function getUserUsageStats(userId: string) {
  try {
    // Get usage for the current month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const usageRecords = await prisma.usageRecord.findMany({
      where: {
        userId,
        date: {
          gte: firstDayOfMonth,
        },
      },
    });

    // Group by type
    const usageByType = usageRecords.reduce((acc: Record<string, number>, record: { type: string; count: number }) => {
      const { type, count } = record;
      if (!acc[type]) acc[type] = 0;
      acc[type] += count;
      return acc;
    }, {} as Record<string, number>);

    return usageByType;
  } catch (error) {
    console.error('Error getting user usage stats:', error);
    throw new Error('Failed to get user usage statistics');
  }
}

/**
 * Server action to check if the current user can access a premium feature
 */
export async function canAccessPremiumFeature(type: UsageType) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { canAccess: false, reason: 'unauthenticated' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      return { canAccess: false, reason: 'user-not-found' };
    }

    // For free tier, check if they've exceeded limits
    if (!user.subscription || user.subscription.status !== 'ACTIVE') {
      const exceeded = await hasExceededLimit(user.id, type);
      
      if (exceeded) {
        return { 
          canAccess: false, 
          reason: 'limit-exceeded',
          redirect: `/subscribe?limit=reached&redirect=${encodeURIComponent(type.toString().toLowerCase())}` 
        };
      }
      
      // If it's a premium-only feature and user doesn't have subscription
      if (FREE_TIER_LIMITS[type] === 0) {
        return { 
          canAccess: false, 
          reason: 'premium-only',
          redirect: `/subscribe?feature=${encodeURIComponent(type.toString().toLowerCase())}` 
        };
      }
      
      // Track usage for free tier
      await trackUsage(user.id, type);
      return { canAccess: true };
    }
    
    // For paid tiers, just track usage without limits
    await trackUsage(user.id, type);
    return { canAccess: true };
  } catch (error) {
    console.error('Error checking feature access:', error);
    return { canAccess: false, reason: 'error' };
  }
}

type ResourceType = 'DOCUMENT_GENERATION' | 'DOCUMENT_ANALYSIS' | 'CHAT';

class UsageService {
  /**
   * Check the user's subscription status
   */
  async checkSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        subscription: {
          include: {
            plan: true
          }
        } 
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.subscription || !user.subscription.plan) {
      return SubscriptionStatus.UNPAID;
    }

    const now = new Date();
    const subscriptionEndDate = new Date(user.subscription.currentPeriodEnd);

    if (now > subscriptionEndDate || user.subscription.status !== 'ACTIVE') {
      return SubscriptionStatus.UNPAID;
    }

    // Check plan name from the Plan model
    const planName = user.subscription.plan.name.toUpperCase();
    if (planName === 'PRO' || planName === 'PROFESSIONAL') {
      return SubscriptionStatus.ACTIVE;
    } else if (planName === 'ENTERPRISE') {
      return SubscriptionStatus.ACTIVE;
    }
    return SubscriptionStatus.UNPAID;
  }

  /**
   * Check if the user has access to a resource based on their usage
   */
  async checkResourceAccess(
    userId: string,
    type: UsageType,
    limit: number
  ): Promise<boolean> {
    // First check subscription status
    const subscriptionStatus = await this.checkSubscriptionStatus(userId);
    
    // Active subscriptions have unlimited access
    if (subscriptionStatus === SubscriptionStatus.ACTIVE) {
      return true;
    }

    // For unpaid/free users, check usage limits
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageCount = await prisma.usageRecord.count({
      where: {
        userId,
        type,
        date: {
          gte: today,
        },
      },
    });

    return usageCount < limit;
  }

  /**
   * Track usage of a resource
   */
  async trackUsage(userId: string, type: UsageType): Promise<void> {
    await prisma.usageRecord.create({
      data: {
        userId,
        type,
        count: 1,
      },
    });
  }

  /**
   * Get usage statistics for a user
   */
  async getUsageStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.usageRecord.groupBy({
      by: ['type'],
      where: {
        userId,
        date: {
          gte: today,
        },
      },
      _sum: {
        count: true,
      },
    });

    return usage.reduce((acc, curr) => {
      acc[curr.type] = curr._sum.count || 0;
      return acc;
    }, {} as Record<UsageType, number>);
  }

  /**
   * Reset usage statistics for a user
   */
  async resetUsage(userId: string): Promise<void> {
    await prisma.usageRecord.deleteMany({
      where: { userId },
    });
  }
}

export const usageService = new UsageService(); 