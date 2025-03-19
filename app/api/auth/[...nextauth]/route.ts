import NextAuth from "next-auth";
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

// Add this function for static exports
export function generateStaticParams() {
  // For authentication API, we can provide empty paths
  // This is just to satisfy the static export requirement
  return [];
}

export { handler as GET, handler as POST }; 