import * as crypto from 'crypto';

export interface AdminSession {
  userId: string;
  createdAt: number;
  lastActivity: number;
  expiresAt: number;
  csrfToken: string;
  requires2FA: boolean;
  twoFactorVerified: boolean;
}

const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour
const SESSIONS = new Map<string, AdminSession>();

/**
 * Generate secure session ID
 */
function generateSessionId(): string {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Generate CSRF token
 */
function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create new session
 */
export function createSession(userId: string, requires2FA: boolean = true): {
  sessionId: string;
  csrfToken: string;
  expiresAt: number;
} {
  const sessionId = generateSessionId();
  const csrfToken = generateCSRFToken();
  const now = Date.now();
  
  const session: AdminSession = {
    userId,
    createdAt: now,
    lastActivity: now,
    expiresAt: now + SESSION_TIMEOUT_MS,
    csrfToken,
    requires2FA,
    twoFactorVerified: false
  };
  
  SESSIONS.set(sessionId, session);
  
  return {
    sessionId,
    csrfToken,
    expiresAt: session.expiresAt
  };
}

/**
 * Validate session
 */
export function validateSession(sessionId: string): {
  valid: boolean;
  session?: AdminSession;
  expired?: boolean;
} {
  const session = SESSIONS.get(sessionId);
  
  if (!session) {
    return { valid: false, expired: false };
  }
  
  const now = Date.now();
  
  if (now > session.expiresAt) {
    SESSIONS.delete(sessionId);
    return { valid: false, expired: true };
  }
  
  // Update last activity
  session.lastActivity = now;
  SESSIONS.set(sessionId, session);
  
  return { valid: true, session };
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(sessionId: string, csrfToken: string): boolean {
  const session = SESSIONS.get(sessionId);
  return session?.csrfToken === csrfToken;
}

/**
 * Mark 2FA as verified
 */
export function verify2FA(sessionId: string): boolean {
  const session = SESSIONS.get(sessionId);
  if (!session) return false;
  
  session.twoFactorVerified = true;
  SESSIONS.set(sessionId, session);
  return true;
}

/**
 * Destroy session (logout)
 */
export function destroySession(sessionId: string): void {
  SESSIONS.delete(sessionId);
}

/**
 * Cleanup expired sessions
 */
export function cleanupSessions(): void {
  const now = Date.now();
  for (const [id, session] of SESSIONS.entries()) {
    if (now > session.expiresAt) {
      SESSIONS.delete(id);
    }
  }
}

/**
 * Get active sessions count
 */
export function getActiveSessionsCount(): number {
  return SESSIONS.size;
}
