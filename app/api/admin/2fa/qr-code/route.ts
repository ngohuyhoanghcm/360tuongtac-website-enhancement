import { NextResponse } from 'next/server';
import { generate2FAQRCodeURL, generateQRCodeDataURL } from '@/lib/admin/two-factor-auth';

export async function GET() {
  try {
    const twoFASecret = process.env.NEXT_ADMIN_2FA_SECRET;

    if (!twoFASecret) {
      return NextResponse.json(
        { error: '2FA not configured' },
        { status: 500 }
      );
    }

    const qrCodeURL = generate2FAQRCodeURL(twoFASecret);
    const qrCodeData = await generateQRCodeDataURL(qrCodeURL);

    return NextResponse.json({
      success: true,
      qrCodeData,
      qrCodeURL,
      secret: twoFASecret
    });
  } catch (error) {
    console.error('Get QR code error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
