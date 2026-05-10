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
 * 
 * PRODUCTION AUTHENTICATION:
 * - Validates session cookie (admin_session) from login flow
 * - Falls back to Bearer token (ADMIN_API_SECRET) for API-to-API calls
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from './session-manager';
import { ADMIN_AUTH_CONFIG } from './auth-config';

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
 * In production: Validates session cookie (admin_session) from login
 *               Falls back to Bearer token (ADMIN_API_SECRET) for API calls
 * 
 * @param request - The Next.js request object
 * @returns true if authentication passes, false otherwise
 */
export function validateAdminAuth(request: NextRequest): boolean {
  // Development bypass
  if (isDevAuthBypassEnabled()) {
    console.log('[DEV AUTH] Authentication bypass enabled for development');
    return true;
  }

  // Production authentication
  // Priority 1: Check session cookie (from login flow)
  const sessionCookie = request.cookies.get('admin_session')?.value;
  
  if (sessionCookie) {
    const sessionValidation = validateSession(sessionCookie);
    
    if (sessionValidation.valid) {
      console.log('[AUTH] Session validated successfully');
      return true;
    } else {
      console.warn('[AUTH] Invalid or expired session:', sessionValidation.expired ? 'expired' : 'not found');
    }
  }

  // Priority 2: Check Bearer token (for API-to-API calls)
  const authHeader = request.headers.get('authorization');
  const expectedSecret = ADMIN_AUTH_CONFIG.API_SECRET;
  
  if (authHeader && expectedSecret) {
    if (authHeader === `Bearer ${expectedSecret}`) {
      console.log('[AUTH] Bearer token validated successfully');
      return true;
    } else {
      console.warn('[AUTH] Invalid Bearer token');
    }
  }

  // If no session and no valid Bearer token
  if (!sessionCookie && !authHeader) {
    console.warn('[AUTH] No authentication credentials provided');
  }

  return false;
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
