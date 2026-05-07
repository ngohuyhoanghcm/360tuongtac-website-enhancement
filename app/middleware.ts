import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders } from '@/lib/admin/security-headers';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security headers to all responses
  securityHeaders(response);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
