/**
 * Telegram Bot Webhook
 * POST /api/admin/telegram/webhook
 * 
 * Receives updates from Telegram Bot API
 */

import { NextRequest, NextResponse } from 'next/server';
import { telegramBot } from '@/lib/admin/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    // Verify bot is enabled
    if (process.env.TELEGRAM_BOT_ENABLED !== 'true') {
      return NextResponse.json(
        { success: false, message: 'Telegram bot is disabled' },
        { status: 403 }
      );
    }

    // Parse update from Telegram
    const update = await request.json();

    console.log('[Telegram Webhook] Received update:', update.update_id);

    // Process message
    await telegramBot.processMessage(update);

    // Return success immediately (Telegram expects 200)
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Telegram Webhook] Error:', error);
    
    // Still return 200 to prevent Telegram from retrying
    return NextResponse.json({ success: false });
  }
}

// GET /api/admin/telegram/webhook - Setup webhook
export async function GET(request: NextRequest) {
  try {
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'TELEGRAM_WEBHOOK_URL not configured',
          hint: 'Set webhook URL in .env.local'
        },
        { status: 400 }
      );
    }

    const success = await telegramBot.setupWebhook(webhookUrl);

    if (success) {
      const botInfo = await telegramBot.getBotInfo();
      
      return NextResponse.json({
        success: true,
        message: 'Webhook setup successfully',
        webhookUrl,
        bot: botInfo
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to setup webhook' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Telegram Webhook Setup] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to setup webhook' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/telegram/webhook - Delete webhook
export async function DELETE(request: NextRequest) {
  try {
    const success = await telegramBot.deleteWebhook();

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Webhook deleted successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to delete webhook' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Telegram Webhook Delete] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}
