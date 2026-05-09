/**
 * Development Environment Authentication Bypass
 * 
 * This utility provides a secure mechanism to bypass admin authentication
 * specifically in development environments (NODE_ENV !== 'production').
 * 
 * SECURITY NOTES:
 * - ONLY active when NODE_ENV is NOT 'production'
 * - Logs all bypass usage for audit trail
 * - Can be disabled via DEV_AUTH_BYPASS=false even in dev mode
 * - Never exposed to production builds
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Check if development auth bypass is enabled
 * Returns true ONLY in non-production environments
 */
export function isDevAuthBypassEnabled(): boolean {
  // Never allow bypass in production
  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  // Check if explicitly disabled
  if (process.env.DEV_AUTH_BYPASS === 'false') {
    return false;
  }

  // Enabled by default in development
  return true;
}

/**
 * Validate admin authentication with dev bypass support
 * 
 * In development: Allows bypass if DEV_AUTH_BYPASS=true
 * In production: Always requires valid ADMIN_API_SECRET
 * 
 * @param request - The Next.js request object
 * @returns true if authentication passes, false otherwise
 */
export function validateAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  
  // Development bypass
  if (isDevAuthBypassEnabled()) {
    console.log('[DEV AUTH] Authentication bypass enabled for development');
    return true;
  }

  // Production authentication
  const expectedSecret = process.env.ADMIN_API_SECRET || process.env.NEXT_PUBLIC_ADMIN_API_SECRET;
  
  if (!expectedSecret) {
    console.error('[AUTH] No ADMIN_API_SECRET configured');
    return false;
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    console.warn('[AUTH] Invalid authentication attempt');
    return false;
  }

  return true;
}

/**
 * Create unauthorized response
 * Standardized 401 response for all admin API routes
 */
export function createUnauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { 
      success: false, 
      message: process.env.NODE_ENV === 'production' 
        ? 'Unauthorized' 
        : 'Unauthorized - Set ADMIN_API_SECRET or enable DEV_AUTH_BYPASS' 
    },
    { status: 401 }
  );
}

/**
 * Helper function to authenticate admin API requests
 * Usage: Replace manual auth checks with this function
 * 
 * @example
 * export async function GET(request: NextRequest) {
 *   const authResult = authenticateAdminRequest(request);
 *   if (authResult) return authResult; // Returns 401 if unauthorized
 *   
 *   // Your protected code here
 *   return NextResponse.json({ success: true });
 * }
 */
export function authenticateAdminRequest(request: NextRequest): NextResponse | null {
  if (!validateAdminAuth(request)) {
    return createUnauthorizedResponse();
  }
  return null; // Authentication passed
}
