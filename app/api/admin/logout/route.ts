import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/admin/session-manager';
import { resetRateLimit } from '@/lib/admin/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('admin_session')?.value;

    if (sessionId) {
      // Destroy session
      destroySession(sessionId);
      
      // Reset rate limit
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      resetRateLimit(`login_${ip}`);
    }

    // Clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/admin'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
