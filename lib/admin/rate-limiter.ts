interface RateLimitRecord {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

// In-memory store (use Redis/database in production)
const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Check if login attempt is allowed
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    // First attempt
    rateLimitStore.set(identifier, {
      attempts: 1,
      lastAttempt: now
    });
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - 1
    };
  }

  // Check if block has expired
  if (record.blockedUntil && now > record.blockedUntil) {
    rateLimitStore.delete(identifier);
    rateLimitStore.set(identifier, {
      attempts: 1,
      lastAttempt: now
    });
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - 1
    };
  }

  // Check if window has expired
  if (now - record.lastAttempt > WINDOW_MS) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      lastAttempt: now
    });
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - 1
    };
  }

  // Within window
  if (record.attempts >= MAX_ATTEMPTS) {
    // Block user
    if (!record.blockedUntil) {
      record.blockedUntil = now + BLOCK_DURATION_MS;
      rateLimitStore.set(identifier, record);
    }
    
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfter: record.blockedUntil - now
    };
  }

  // Increment attempts
  record.attempts++;
  record.lastAttempt = now;
  rateLimitStore.set(identifier, record);

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - record.attempts
  };
}

/**
 * Reset rate limit for identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Get rate limit status
 */
export function getRateLimitStatus(identifier: string): {
  attempts: number;
  isBlocked: boolean;
  retryAfter?: number;
} {
  const record = rateLimitStore.get(identifier);
  const now = Date.now();

  if (!record) {
    return { attempts: 0, isBlocked: false };
  }

  return {
    attempts: record.attempts,
    isBlocked: !!(record.blockedUntil && now < record.blockedUntil),
    retryAfter: record.blockedUntil ? Math.max(0, record.blockedUntil - now) : undefined
  };
}

/**
 * Cleanup expired records (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.blockedUntil && now > record.blockedUntil) {
      rateLimitStore.delete(key);
    } else if (now - record.lastAttempt > WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
}
