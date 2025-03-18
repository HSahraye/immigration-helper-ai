import { prisma } from '../prisma';
import { UsageType } from '@prisma/client';

/**
 * Track a user event for analytics
 */
export async function trackEvent(
  userId: string,
  eventType: string,
  metadata: Record<string, any> = {}
) {
  try {
    // Store the event in the database (using UsageRecord table for now)
    await prisma.usageRecord.create({
      data: {
        userId,
        type: 'AI_FEATURE_ACCESS' as UsageType, // We're repurposing this field for analytics
        count: 1,
        metadata: {
          eventType,
          ...metadata,
          timestamp: new Date().toISOString(),
        },
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking event:', error);
    return false;
  }
}

/**
 * Get user behavior analytics for a specific user
 */
export async function getUserBehaviorAnalytics(userId: string) {
  try {
    // Get all events for this user
    const events = await prisma.usageRecord.findMany({
      where: {
        userId,
        metadata: {
          path: ['eventType'],
          not: null,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Process events to create a user journey
    const userJourney = events.map((event) => {
      const metadata = event.metadata as any;
      return {
        eventType: metadata.eventType,
        timestamp: metadata.timestamp || event.date.toISOString(),
        details: metadata,
      };
    });

    return userJourney;
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw new Error('Failed to get user analytics');
  }
}

/**
 * Get aggregated analytics data for all users
 */
export async function getAggregatedAnalytics(startDate?: Date, endDate?: Date) {
  try {
    // Set default date range to last 30 days if not provided
    const end = endDate || new Date();
    const start = startDate || new Date(end);
    if (!startDate) {
      start.setDate(start.getDate() - 30);
    }

    // Get all usage records within date range
    const usageRecords = await prisma.usageRecord.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    // Get all users with subscriptions
    const users = await prisma.user.findMany({
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    // Calculate analytics
    const analytics = {
      totalUsers: users.length,
      paidUsers: users.filter(u => u.subscription && u.subscription.status === 'ACTIVE').length,
      totalUsage: usageRecords.reduce((sum, record) => sum + record.count, 0),
      usageByType: {} as Record<string, number>,
      activeUsers: new Set(usageRecords.map(r => r.userId)).size,
      averageUsagePerUser: 0,
      subscriptionByPlan: {} as Record<string, number>,
    };

    // Calculate usage by type
    usageRecords.forEach(record => {
      const type = record.type;
      if (!analytics.usageByType[type]) {
        analytics.usageByType[type] = 0;
      }
      analytics.usageByType[type] += record.count;
    });

    // Calculate average usage per user
    analytics.averageUsagePerUser = analytics.activeUsers 
      ? analytics.totalUsage / analytics.activeUsers 
      : 0;

    // Calculate subscriptions by plan
    users.forEach(user => {
      if (user.subscription && user.subscription.status === 'ACTIVE') {
        const planName = user.subscription.plan.name;
        if (!analytics.subscriptionByPlan[planName]) {
          analytics.subscriptionByPlan[planName] = 0;
        }
        analytics.subscriptionByPlan[planName]++;
      }
    });

    return analytics;
  } catch (error) {
    console.error('Error getting aggregated analytics:', error);
    throw new Error('Failed to get aggregated analytics');
  }
}

/**
 * Get daily active users (DAU)
 */
export async function getDailyActiveUsers(days = 30) {
  try {
    const result = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Count unique users who had activity on this day
      const uniqueUsers = await prisma.usageRecord.findMany({
        where: {
          date: {
            gte: date,
            lt: nextDay,
          },
        },
        distinct: ['userId'],
        select: {
          userId: true,
        },
      });
      
      result.push({
        date: date.toISOString().split('T')[0],
        count: uniqueUsers.length,
      });
    }
    
    // Sort by date ascending
    return result.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error getting daily active users:', error);
    throw new Error('Failed to get daily active users');
  }
}

/**
 * Get user retention metrics
 */
export async function getUserRetention() {
  try {
    // Get all users with their first and most recent activity
    const users = await prisma.user.findMany({
      include: {
        usageRecords: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    });
    
    // Calculate retention
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    const retention = {
      daily: 0,
      weekly: 0,
      monthly: 0,
      total: users.length,
    };
    
    // Count users active in the last day, week, and month
    users.forEach(user => {
      if (user.usageRecords.length > 0) {
        const lastActivity = user.usageRecords[0].date;
        const timeSince = now.getTime() - lastActivity.getTime();
        
        if (timeSince <= dayInMs) {
          retention.daily++;
        }
        
        if (timeSince <= 7 * dayInMs) {
          retention.weekly++;
        }
        
        if (timeSince <= 30 * dayInMs) {
          retention.monthly++;
        }
      }
    });
    
    // Calculate percentages
    if (retention.total > 0) {
      retention.daily = Math.round((retention.daily / retention.total) * 100);
      retention.weekly = Math.round((retention.weekly / retention.total) * 100);
      retention.monthly = Math.round((retention.monthly / retention.total) * 100);
    }
    
    return retention;
  } catch (error) {
    console.error('Error getting user retention:', error);
    throw new Error('Failed to get user retention');
  }
} 