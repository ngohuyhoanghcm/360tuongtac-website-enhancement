import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security headers middleware
 */
export function securityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (HTTPS only)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  
  // Content Security Policy (restrictive)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
  
  // Cross-Origin policies
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  
  // Remove server header
  response.headers.delete('X-Powered-By');
  
  return response;
}

/**
 * Admin route protection middleware
 */
export function adminAuthMiddleware(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;
  
  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return null;
  }
  
  // Skip login page
  if (pathname === '/admin' || pathname === '/admin/login') {
    return null;
  }
  
  // Check for session cookie
  const sessionId = request.cookies.get('admin_session')?.value;
  
  if (!sessionId) {
    // Redirect to login
    const loginUrl = new URL('/admin', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return null; // Allow request to continue
}
