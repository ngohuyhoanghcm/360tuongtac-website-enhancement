import * as crypto from 'crypto';
import * as qrcode from 'qrcode';

// Generate new 2FA secret (32 character Base32)
function generateSecret(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    secret += chars[bytes[i] % chars.length];
  }
  return secret;
}

const secret = generateSecret();
console.log('');
console.log('🔐 2FA Setup Information:');
console.log('=====================');
console.log('Secret:', secret);
console.log('');

// Generate QR code URL
const otpauth = `otpauth://totp/360TuongTac%20Admin:admin@360tuongtac.com?secret=${secret}&issuer=360TuongTac%20Admin`;
console.log('OTPAuth URL:', otpauth);
console.log('');

// Generate QR code as data URL
qrcode.toDataURL(otpauth, (err, url) => {
  if (err) {
    console.error('❌ Error generating QR code:', err);
    return;
  }
  console.log('📱 QR Code Data URL (save to file or display):');
  console.log(url.substring(0, 100) + '...');
  console.log('');
  console.log('📝 Add this to .env.production:');
  console.log('NEXT_ADMIN_2FA_ENABLED=true');
  console.log(`NEXT_ADMIN_2FA_SECRET=${secret}`);
  console.log('');
  console.log('📲 Scan QR code with Google Authenticator or Authy app');
});
