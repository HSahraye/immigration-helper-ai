import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of API routes that should be counted against the chat quota
const quotaApiRoutes = [
  '/api/student-visas-agent',
  '/api/work-visa-agent',
  '/api/family-immigration-agent',
  '/api/general-immigration-agent',
];

// List of paths that should always be publicly accessible
const publicPaths = [
  '/documents',
  '/documents/',
  '/resources'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path should be publicly accessible
  if (publicPaths.some(path => pathname === path) || pathname.startsWith('/documents/')) {
    return NextResponse.next();
  }
  
  // Check if the route is an API that should be tracked for quota
  if (quotaApiRoutes.some(route => pathname.startsWith(route))) {
    // Get anonymous user identifier (IP or fingerprint)
    const anonymousId = request.cookies.get('anonymous-user-id')?.value || 
                         request.headers.get('x-real-ip') || 
                         request.headers.get('x-forwarded-for') || 
                         'unknown';
    
    // Get chat count from cookie
    const chatCountCookie = request.cookies.get('chat-count');
    const chatCount = chatCountCookie ? parseInt(chatCountCookie.value, 10) : 0;
    
    // Check for NextAuth session
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // If exceeded free limit, redirect to subscription page
    if (!token && chatCount >= 5) {
      // When redirecting to subscribe page, also pass the original intended URL
      const url = new URL('/subscribe', request.url);
      url.searchParams.set('redirect', request.nextUrl.pathname);
      url.searchParams.set('limit', 'reached');
      return NextResponse.redirect(url);
    }
    
    // For authenticated users or users within quota, allow access
    const response = NextResponse.next();
    
    if (!token) {
      // Set cookie with incremented chat count (will expire in 24 hours)
      response.cookies.set({
        name: 'chat-count',
        value: (chatCount + 1).toString(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        path: '/',
      });
      
      // Set anonymous ID cookie if it doesn't exist
      if (!request.cookies.get('anonymous-user-id')) {
        response.cookies.set({
          name: 'anonymous-user-id',
          value: anonymousId,
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          path: '/',
        });
      }
    }
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 