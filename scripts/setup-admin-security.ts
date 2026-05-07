import { hashPassword, generateSecurePassword } from '@/lib/admin/password-utils';
import { generate2FASecret, generate2FAQRCodeURL, generateBackupCodes } from '@/lib/admin/two-factor-auth';

async function setupSecureAdmin() {
  console.log('🔐 Setting up secure admin credentials...\n');

  // Generate secure password
  const password = generateSecurePassword(16);
  console.log('📝 Generated Secure Password:');
  console.log(`   ${password}\n`);

  // Hash password
  const hashedPassword = await hashPassword(password);
  console.log('🔒 Hashed Password (for .env file):');
  console.log(`   ${hashedPassword}\n`);

  // Generate 2FA secret
  const twoFASecret = generate2FASecret();
  console.log('📱 2FA Secret:');
  console.log(`   ${twoFASecret}\n`);

  // Generate QR code URL
  const qrCodeURL = generate2FAQRCodeURL(twoFASecret);
  console.log('📷 QR Code URL (scan with Google Authenticator):');
  console.log(`   ${qrCodeURL}\n`);

  // Generate backup codes
  const backupCodes = generateBackupCodes(10);
  console.log('🔑 Backup Codes (save these securely!):');
  backupCodes.forEach((code, index) => {
    console.log(`   ${index + 1}. ${code}`);
  });
  console.log('');

  // Generate .env content
  console.log(' Add these to your .env.production file:\n');
  console.log(`NEXT_ADMIN_PASSWORD_HASH=${hashedPassword}`);
  console.log(`NEXT_ADMIN_2FA_SECRET=${twoFASecret}`);
  console.log(`NEXT_ADMIN_2FA_BACKUP_CODES=${backupCodes.join(',')}\n`);

  console.log('✅ Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Save the password and backup codes securely');
  console.log('2. Scan QR code with Google Authenticator or Authy');
  console.log('3. Add environment variables to .env.production');
  console.log('4. Test login with new credentials\n');
}

setupSecureAdmin().catch(console.error);
