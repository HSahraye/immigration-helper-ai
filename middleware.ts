import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of pages that require authentication
const protectedPages = [
  '/profile',
  '/billing',
  '/settings',
  '/checkout',
];

// List of API routes that should be counted against the chat quota
const quotaApiRoutes = [
  '/api/student-visas-agent',
  '/api/work-visa-agent',
  '/api/family-immigration-agent',
  '/api/general-immigration-agent',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if page requires full authentication
  if (protectedPages.some(page => pathname.startsWith(page))) {
    // Check if the user is authenticated by looking for session token
    // Check both possible cookie names (development vs production)
    const authCookie = request.cookies.get('next-auth.session-token') || 
                       request.cookies.get('__Secure-next-auth.session-token');
    
    if (!authCookie) {
      // Store the original URL to redirect back after login
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }
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
    
    // Check if user is authenticated (check both possible cookie names)
    const authCookie = request.cookies.get('next-auth.session-token') || 
                       request.cookies.get('__Secure-next-auth.session-token');
    
    // If not authenticated and exceeded free limit, redirect to subscription page
    if (!authCookie && chatCount >= 5) {
      // When redirecting to subscribe page, also pass the original intended URL
      const url = new URL('/subscribe', request.url);
      url.searchParams.set('redirect', request.nextUrl.pathname);
      url.searchParams.set('limit', 'reached');
      return NextResponse.redirect(url);
    }
    
    // For authenticated users or users within quota, allow access
    // Increment count will happen in the API route
    const response = NextResponse.next();
    
    if (!authCookie) {
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