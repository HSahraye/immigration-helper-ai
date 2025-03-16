import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle redirects from (tabs) directory
  if (pathname.includes('/(tabs)') || pathname.startsWith('/(tabs)')) {
    const newPath = pathname.replace('/(tabs)', '');
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // Protect routes that require authentication
  if (
    pathname.startsWith('/profile') ||
    pathname.includes('/resources/')
  ) {
    // Check if the user is authenticated
    const authCookie = request.cookies.get('next-auth.session-token');
    
    if (!authCookie) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 