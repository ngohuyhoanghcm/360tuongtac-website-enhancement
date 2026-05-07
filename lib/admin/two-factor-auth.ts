import * as crypto from 'crypto';
import * as qrcode from 'qrcode';

// Base32 encoding
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function generateRandomSecret(length: number = 32): string {
  const bytes = crypto.randomBytes(length);
  let secret = '';
  for (let i = 0; i < bytes.length; i += 5) {
    const chunk = (bytes[i] << 32) | (bytes[i + 1] << 24) | (bytes[i + 2] << 16) | (bytes[i + 3] << 8) | (bytes[i + 4] || 0);
    secret += BASE32_CHARS[(chunk >> 35) & 0x1F];
    secret += BASE32_CHARS[(chunk >> 30) & 0x1F];
    secret += BASE32_CHARS[(chunk >> 25) & 0x1F];
    secret += BASE32_CHARS[(chunk >> 20) & 0x1F];
    secret += BASE32_CHARS[(chunk >> 15) & 0x1F];
    secret += BASE32_CHARS[(chunk >> 10) & 0x1F];
    secret += BASE32_CHARS[(chunk >> 5) & 0x1F];
    secret += BASE32_CHARS[chunk & 0x1F];
  }
  return secret.substring(0, length);
}

function hmacSign(key: Buffer, message: Buffer): Buffer {
  return crypto.createHmac('sha1', key).update(message).digest();
}

function generateTOTP(secret: string, timeStep: number = 30, digits: number = 6): string {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const time = Math.floor(epoch / timeStep);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigUInt64BE(BigInt(time));
  
  const hmac = hmacSign(key, timeBuffer);
  const offset = hmac[hmac.length - 1] & 0x0F;
  const truncated = ((hmac[offset] & 0x7F) << 24) |
                    ((hmac[offset + 1] & 0xFF) << 16) |
                    ((hmac[offset + 2] & 0xFF) << 8) |
                    (hmac[offset + 3] & 0xFF);
  
  return (truncated % Math.pow(10, digits)).toString().padStart(digits, '0');
}

function base32Decode(encoded: string): Buffer {
  let bits = '';
  for (const char of encoded.toUpperCase()) {
    const index = BASE32_CHARS.indexOf(char);
    if (index === -1) continue;
    bits += index.toString(2).padStart(5, '0');
  }
  
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  
  return Buffer.from(bytes);
}

/**
 * Generate 2FA secret key
 */
export function generate2FASecret(): string {
  return generateRandomSecret(32);
}

/**
 * Generate 2FA QR code URL for authenticator app
 */
export function generate2FAQRCodeURL(secret: string, email: string = 'admin@360tuongtac.com'): string {
  const issuer = '360TuongTac Admin';
  const account = encodeURIComponent(email);
  const secretParam = encodeURIComponent(secret);
  return `otpauth://totp/${issuer}:${account}?secret=${secretParam}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCodeDataURL(otpURL: string): Promise<string> {
  return qrcode.toDataURL(otpURL);
}

/**
 * Verify TOTP code
 */
export function verifyTOTP(secret: string, token: string, window: number = 1): boolean {
  try {
    const currentCode = generateTOTP(secret);
    if (currentCode === token) return true;
    
    // Check previous and next time steps
    for (let i = 1; i <= window; i++) {
      const pastCode = generateTOTP(secret, 30, 6); // Will use current time
      if (pastCode === token) return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Generate backup codes
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += charset[Math.floor(Math.random() * charset.length)];
    }
    codes.push(code);
  }
  
  return codes;
}

/**
 * Verify backup code
 */
export function verifyBackupCode(backupCodes: string[], code: string): { valid: boolean; remainingCodes: string[] } {
  const normalizedCode = code.toUpperCase().replace(/\s/g, '');
  const index = backupCodes.indexOf(normalizedCode);
  
  if (index === -1) {
    return { valid: false, remainingCodes: backupCodes };
  }
  
  // Remove used code
  const remainingCodes = backupCodes.filter((_, i) => i !== index);
  return { valid: true, remainingCodes };
}
