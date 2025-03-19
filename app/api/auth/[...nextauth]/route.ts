import NextAuth from "next-auth";
import { authOptions } from '@/lib/auth';
import { generateStaticParams } from './config';

const handler = NextAuth(authOptions);

// Export the generateStaticParams function for static export compatibility
export { generateStaticParams };

export { handler as GET, handler as POST }; 