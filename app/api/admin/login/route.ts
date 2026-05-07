import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/admin/password-utils';
import { verifyTOTP, verifyBackupCode } from '@/lib/admin/two-factor-auth';
import { checkRateLimit } from '@/lib/admin/rate-limiter';
import { createSession } from '@/lib/admin/session-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, totpCode, backupCode, useBackupCode } = body;

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `login_${ip}`;

    // Check rate limit
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many failed attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter
        },
        { status: 429 }
      );
    }

    // Verify password
    const passwordHash = process.env.NEXT_ADMIN_PASSWORD_HASH;
    if (!passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const passwordValid = await verifyPassword(password, passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid password',
          remainingAttempts: rateLimit.remainingAttempts
        },
        { status: 401 }
      );
    }

    // If 2FA is enabled, verify TOTP or backup code
    const twoFASecret = process.env.NEXT_ADMIN_2FA_SECRET;
    const requires2FA = !!twoFASecret;

    if (requires2FA) {
      if (useBackupCode) {
        // Verify backup code
        const backupCodesStr = process.env.NEXT_ADMIN_2FA_BACKUP_CODES;
        if (!backupCodesStr) {
          return NextResponse.json(
            { success: false, error: 'Backup codes not configured' },
            { status: 500 }
          );
        }

        const backupCodes = backupCodesStr.split(',');
        const verification = verifyBackupCode(backupCodes, backupCode);

        if (!verification.valid) {
          return NextResponse.json(
            { success: false, error: 'Invalid backup code' },
            { status: 401 }
          );
        }

        // Note: In production, update backup codes in database/env
      } else if (totpCode) {
        // Verify TOTP code
        const isValid = verifyTOTP(twoFASecret, totpCode);
        if (!isValid) {
          return NextResponse.json(
            { success: false, error: 'Invalid 2FA code' },
            { status: 401 }
          );
        }
      } else {
        // Request 2FA code
        return NextResponse.json({
          success: false,
          requires2FA: true,
          message: 'Please enter your 2FA code'
        });
      }
    }

    // Create session
    const session = createSession('admin', requires2FA);

    // Reset rate limit on successful login
    // rate-limiter'.resetRateLimit(rateLimitKey);

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      sessionId: session.sessionId,
      csrfToken: session.csrfToken,
      expiresAt: session.expiresAt,
      requires2FA: false
    });

    response.cookies.set('admin_session', session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/admin'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
