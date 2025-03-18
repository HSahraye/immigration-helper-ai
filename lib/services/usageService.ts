import { prisma } from '../prisma';
import { UsageType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';

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
    // Get the user with their subscription
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

    // If user has an active subscription, they have unlimited access
    if (
      user.subscription && 
      user.subscription.status === 'ACTIVE' && 
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

export class UsageService {
  /**
   * Track usage of a specific feature for a user
   */
  async trackUsage(userId: string, type: UsageType, count: number = 1): Promise<void> {
    try {
      // Create new usage record
      await prisma.usageRecord.create({
        data: {
          userId,
          type,
          count,
          date: new Date(),
        },
      });
    } catch (error) {
      console.error(`Error tracking usage for user ${userId}:`, error);
      throw new Error('Failed to track usage');
    }
  }

  /**
   * Check if a user has access to a resource based on usage limits
   */
  async checkResourceAccess(
    userId: string,
    type: UsageType,
    limit: number,
    period: 'day' | 'week' | 'month' = 'day'
  ): Promise<boolean> {
    try {
      // Get subscription status
      const subscriptionStatus = await this.checkSubscriptionStatus(userId);
      
      // Premium users have unlimited access
      if (subscriptionStatus !== 'FREE') {
        return true;
      }

      // Set date range based on period
      const now = new Date();
      let startDate = new Date();
      
      if (period === 'day') {
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'week') {
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(startDate.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'month') {
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      }

      // Count usage for the specified period
      const usageRecords = await prisma.usageRecord.findMany({
        where: {
          userId,
          type,
          date: {
            gte: startDate,
            lte: now,
          },
        },
      });

      // Calculate total usage
      const totalUsage = usageRecords.reduce((total, record) => total + record.count, 0);
      
      // Check if user is within limits
      return totalUsage < limit;
    } catch (error) {
      console.error(`Error checking resource access for user ${userId}:`, error);
      // Default to allowed if there's an error to avoid blocking users
      return true;
    }
  }

  /**
   * Check the user's subscription status
   */
  async checkSubscriptionStatus(userId: string): Promise<'FREE' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE'> {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        include: { plan: true },
      });

      if (!subscription || subscription.status !== 'ACTIVE') {
        return 'FREE';
      }

      // Return plan name as subscription tier
      const planName = subscription.plan.name.toUpperCase();
      
      if (planName.includes('BASIC')) {
        return 'BASIC';
      } else if (planName.includes('PROFESSIONAL') || planName.includes('PRO')) {
        return 'PROFESSIONAL';
      } else if (planName.includes('ENTERPRISE')) {
        return 'ENTERPRISE';
      }
      
      return 'FREE';
    } catch (error) {
      console.error(`Error checking subscription status for user ${userId}:`, error);
      // Default to free tier if there's an error
      return 'FREE';
    }
  }

  /**
   * Get usage statistics for a user
   */
  async getUserUsageStats(userId: string): Promise<Record<UsageType, number>> {
    try {
      // Get current month's usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Get all usage types
      const usageTypes = Object.values(UsageType);
      
      // Initialize stats with 0 for all types
      const stats: Partial<Record<UsageType, number>> = {};
      usageTypes.forEach(type => {
        stats[type] = 0;
      });

      // Get usage records for current month
      const usageRecords = await prisma.usageRecord.findMany({
        where: {
          userId,
          date: {
            gte: startOfMonth,
          },
        },
      });

      // Calculate usage per type
      usageRecords.forEach(record => {
        stats[record.type] = (stats[record.type] || 0) + record.count;
      });

      return stats as Record<UsageType, number>;
    } catch (error) {
      console.error(`Error getting usage stats for user ${userId}:`, error);
      throw new Error('Failed to get usage statistics');
    }
  }

  /**
   * Get subscription details for a user
   */
  async getUserSubscriptionDetails(userId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        include: { plan: true },
      });

      if (!subscription) {
        return {
          tier: 'FREE',
          features: ['Basic chat access', '5 chats per day', 'Limited document generation'],
          limits: {
            chatMessages: 5,
            documentGeneration: 3,
            documentAnalysis: 2,
          }
        };
      }

      // Return appropriate limits based on plan
      const planName = subscription.plan.name.toUpperCase();
      
      if (planName.includes('BASIC')) {
        return {
          tier: 'BASIC',
          status: subscription.status,
          renewalDate: subscription.currentPeriodEnd,
          features: subscription.plan.features,
          limits: {
            chatMessages: 50,
            documentGeneration: 10,
            documentAnalysis: 5
          }
        };
      } else if (planName.includes('PROFESSIONAL') || planName.includes('PRO')) {
        return {
          tier: 'PROFESSIONAL',
          status: subscription.status,
          renewalDate: subscription.currentPeriodEnd,
          features: subscription.plan.features,
          limits: {
            chatMessages: 500,
            documentGeneration: 50,
            documentAnalysis: 50
          }
        };
      } else if (planName.includes('ENTERPRISE')) {
        return {
          tier: 'ENTERPRISE',
          status: subscription.status,
          renewalDate: subscription.currentPeriodEnd,
          features: subscription.plan.features,
          limits: {
            chatMessages: 'Unlimited',
            documentGeneration: 'Unlimited',
            documentAnalysis: 'Unlimited'
          }
        };
      }
      
      // Default free tier
      return {
        tier: 'FREE',
        features: ['Basic chat access', '5 chats per day', 'Limited document generation'],
        limits: {
          chatMessages: 5,
          documentGeneration: 3,
          documentAnalysis: 2
        }
      };
    } catch (error) {
      console.error(`Error getting subscription details for user ${userId}:`, error);
      throw new Error('Failed to get subscription details');
    }
  }
}

// Singleton instance
export const usageService = new UsageService(); 