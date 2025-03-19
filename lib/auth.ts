import { getServerSession, type NextAuthOptions } from 'next-auth';
import prisma from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createHash } from 'crypto';

// Password verification function
function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  return verifyHash === hash;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google provider has been removed per user request
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            password: true,
            salt: true,
          },
        });

        if (!user || !user.password || !user.salt) {
          return null;
        }

        // Verify the password
        if (!verifyPassword(credentials.password, user.password, user.salt)) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, token }) {
      // Add user id to the session
      if (session.user && token.sub) {
        session.user.id = token.sub;
        
        // Get user's subscription data from database
        const subscription = await prisma.subscription.findUnique({
          where: { userId: token.sub },
          include: { plan: true }
        });
        
        if (subscription) {
          session.user.stripeCustomerId = subscription.stripeCustomerId || null;
          session.user.stripeSubscriptionId = subscription.stripeSubscriptionId || null;
          session.user.subscriptionStatus = subscription.status || null;
          session.user.plan = subscription.plan?.name?.toLowerCase() || null;
          session.user.currentPeriodEnd = subscription.currentPeriodEnd ? subscription.currentPeriodEnd.toISOString() : null;
        } else {
          // Set defaults for users without subscriptions
          session.user.plan = 'basic';
          session.user.subscriptionStatus = 'inactive';
        }
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      // Include user ID in token for easier access
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper to get session on the server
export async function getAuthSession() {
  return await getServerSession(authOptions);
}

// Extend the next-auth session type to include user id
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
      subscriptionStatus?: string | null;
      plan?: string | null;
      currentPeriodEnd?: string | null;
    };
  }
  
  interface JWT {
    userId?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    plan?: string;
  }
} 