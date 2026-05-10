/**
 * Admin Authentication Configuration
 * 
 * This file stores admin credentials securely as TypeScript constants.
 * 
 * SECURITY NOTES:
 * - This file should be in .gitignore in production
 * - For development, commit this file with test credentials
 * - For production, mount via Docker volume or CI/CD secrets
 * - Password should be bcrypt hashed (12 rounds)
 * - 2FA secret is Base32 encoded
 * 
 * GENERATE NEW HASH:
 * npx tsx scripts/generate-hash.ts <your-password>
 * 
 * GENERATE 2FA SECRET:
 * npx tsx scripts/setup-2fa.ts
 */

export const ADMIN_AUTH_CONFIG = {
  // Password hash (bcrypt, 12 rounds)
  // Generate with: npx tsx scripts/generate-hash.ts <password>
  PASSWORD_HASH: '$2b$12$u1n0lxpM5Lpp0f8Rt9KrY.taOsIdmltzU4xcCRRRI6TwgN3ssRZIW',
  
  // 2FA Configuration
  TWO_FACTOR_ENABLED: true,
  TWO_FACTOR_SECRET: 'CJSTAM4QEUGDMP3Y2SZD44HDCYQPRQUV', // Base32
  
  // Session Configuration
  SESSION_TIMEOUT_SECONDS: 86400, // 24 hours
  
  // API Security
  API_SECRET: 'production-secure-key-2026-random-string-abc123xyz',
} as const;

// Type for the config
export type AdminAuthConfig = typeof ADMIN_AUTH_CONFIG;
