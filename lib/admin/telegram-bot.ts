/**
 * Telegram Bot Integration
 * Handles all Telegram bot commands and notifications
 * 
 * Commands:
 * - /new URL <url> → Generate blog from URL
 * - /new TOPIC <topic> → Generate blog from topic
 * - /new TEXT <text> → Generate blog from text
 * - /status → Check generation status
 * - /drafts → List recent drafts
 * - /approve <slug> → Approve draft
 * - /reject <slug> → Reject draft
 * - /help → Show help
 */

import { aiContentGenerator } from './ai-content-generator';
import { getContentByStatus, changeContentStatus } from './publishing-workflow';
import { getAllBlogPosts } from './file-writer';

// ============================================
// Types
// ============================================

export interface TelegramMessage {
  chat_id: number;
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
  reply_markup?: any;
}

export interface TelegramUpdate {
  update_id: number;
  message?: {
    chat: {
      id: number;
      type: string;
    };
    text?: string;
    from: {
      id: number;
      username?: string;
      first_name: string;
    };
    message_id: number;
  };
}

// ============================================
// Telegram Bot Class
// ============================================

export class TelegramBot {
  private botToken: string;
  private adminChatId: number;
  private enabled: boolean;
  private baseUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.adminChatId = parseInt(process.env.TELEGRAM_ADMIN_CHAT_ID || '0');
    this.enabled = process.env.TELEGRAM_BOT_ENABLED === 'true';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Send message to Telegram
   */
  async sendMessage(chatId: number, text: string, options: { parseMode?: 'Markdown' | 'HTML', replyMarkup?: any } = {}): Promise<boolean> {
    if (!this.enabled || !this.botToken) {
      console.log('[Telegram] Bot disabled or not configured');
      return false;
    }

    try {
      const message: TelegramMessage = {
        chat_id: chatId,
        text,
        parse_mode: options.parseMode || 'Markdown',
      };

      if (options.replyMarkup) {
        message.reply_markup = options.replyMarkup;
      }

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      const data = await response.json();

      if (!data.ok) {
        console.error('[Telegram] Failed to send message:', data);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[Telegram] Error sending message:', error);
      return false;
    }
  }

  /**
   * Send message to admin
   */
  async sendToAdmin(text: string, options: { parseMode?: 'Markdown' | 'HTML', replyMarkup?: any } = {}): Promise<boolean> {
    return this.sendMessage(this.adminChatId, text, options);
  }

  /**
   * Process incoming message
   */
  async processMessage(update: TelegramUpdate): Promise<void> {
    if (!update.message || !update.message.text) {
      return;
    }

    const chatId = update.message.chat.id;
    const text = update.message.text.trim();
    const userId = update.message.from?.id;

    // Verify sender is admin
    if (chatId !== this.adminChatId && userId !== this.adminChatId) {
      await this.sendMessage(chatId, '❌ Bạn không có quyền sử dụng bot này.');
      return;
    }

    // Parse command
    const command = text.split(' ')[0].toLowerCase();
    const args = text.substring(command.length).trim();

    try {
      switch (command) {
        case '/new':
          await this.handleNewCommand(chatId, args);
          break;
        
        case '/status':
          await this.handleStatusCommand(chatId);
          break;
        
        case '/drafts':
          await this.handleDraftsCommand(chatId);
          break;
        
        case '/approve':
          await this.handleApproveCommand(chatId, args);
          break;
        
        case '/reject':
          await this.handleRejectCommand(chatId, args);
          break;
        
        case '/help':
          await this.handleHelpCommand(chatId);
          break;
        
        case '/start':
          await this.handleHelpCommand(chatId);
          break;
        
        default:
          await this.sendMessage(chatId, '❌ Command không hợp lệ. Gõ /help để xem danh sách commands.');
      }
    } catch (error) {
      console.error('[Telegram] Error processing command:', error);
      await this.sendMessage(chatId, `❌ Có lỗi xảy ra: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle /new command
   */
  private async handleNewCommand(chatId: number, args: string): Promise<void> {
    if (!args) {
      await this.sendMessage(chatId, 
        `❌ Thiếu tham số!\n\n` +
        `📝 Cách sử dụng:\n` +
        `\`/new URL <url>\` - Tạo bài từ URL\n` +
        `\`/new TOPIC <chủ đề>\` - Tạo bài từ topic\n` +
        `\`/new TEXT <nội dung>\` - Tạo bài từ text`
      );
      return;
    }

    const parts = args.split(' ');
    const type = parts[0].toUpperCase();
    const content = parts.slice(1).join(' ');

    if (!content) {
      await this.sendMessage(chatId, `❌ Thiếu nội dung! Ví dụ: \`/new URL https://example.com\``);
      return;
    }

    // Send processing message
    await this.sendMessage(chatId, `⏳ Đang tạo nội dung từ ${type}...\n\nVui lòng chờ 30-60 giây.`);

    try {
      let result;

      switch (type) {
        case 'URL':
          result = await aiContentGenerator.generateFromURL(content);
          break;
        
        case 'TOPIC':
          result = await aiContentGenerator.generateFromTopic(content);
          break;
        
        case 'TEXT':
          result = await aiContentGenerator.generateFromText(content);
          break;
        
        default:
          await this.sendMessage(chatId, `❌ Type không hợp lệ! Sử dụng: URL, TOPIC, hoặc TEXT`);
          return;
      }

      if (result.success && result.blogPost) {
        const blogPost = result.blogPost;
        
        // Auto-save draft
        const { saveBlogPostWorkflow } = await import('./publishing-workflow');
        
        const draft = {
          id: String(Date.now()),
          slug: blogPost.slug || '',
          title: blogPost.title || '',
          excerpt: blogPost.excerpt || '',
          content: blogPost.content || '',
          category: blogPost.category || 'General',
          tags: blogPost.tags || [],
          author: 'Telegram Bot',
          date: new Date().toISOString().split('T')[0],
          readTime: `${Math.ceil((blogPost.content?.length || 0) / 1000)} phút`,
          imageUrl: '',
          imageAlt: '',
          metaTitle: blogPost.metaTitle || `${blogPost.title} | Blog - 360TuongTac`,
          metaDescription: blogPost.metaDescription || blogPost.excerpt || '',
          seoScore: result.seoScore || 0,
          status: 'review' as const,
          versionHistory: [],
          currentVersion: 1,
        };

        const saveResult = saveBlogPostWorkflow(draft);

        if (saveResult.success) {
          // Send success message
          const message = 
            `✅ **Đã tạo bài viết thành công!**\n\n` +
            `📝 **Title:** ${draft.title}\n` +
            `🔗 **Slug:** \`${draft.slug}\`\n` +
            `📂 **Category:** ${draft.category}\n` +
            `⭐ **SEO Score:** ${result.seoScore}/100\n\n` +
            `📋 **Tags:** ${(draft.tags || []).slice(0, 5).join(', ')}\n\n` +
            `⏳ **Status:** Chờ duyệt\n\n` +
            `💡 **Commands:**\n` +
            `\`/approve ${draft.slug}\` - Duyệt bài\n` +
            `\`/reject ${draft.slug}\` - Từ chối\n` +
            `\`/drafts\` - Xem danh sách drafts`;

          await this.sendMessage(chatId, message);

          // Also send to admin if different chat
          if (chatId !== this.adminChatId) {
            await this.sendToAdmin(`🔔 **Draft mới được tạo từ Telegram**\n\n` +
              `📝 **Title:** ${draft.title}\n` +
              `👤 **By:** Telegram User\n` +
              `⭐ **SEO:** ${result.seoScore}/100`
            );
          }
        } else {
          await this.sendMessage(chatId, `❌ Lỗi khi lưu draft: ${saveResult.message}`);
        }
      } else {
        const errorMsg = result.errors?.[0] || 'Không thể tạo nội dung';
        await this.sendMessage(chatId, `❌ ${errorMsg}`);
      }
    } catch (error) {
      await this.sendMessage(chatId, `❌ Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle /status command
   */
  private async handleStatusCommand(chatId: number): Promise<void> {
    const drafts = getContentByStatus('blog', 'review');
    const published = getAllBlogPosts();

    const message = 
      `📊 **Thống kê hệ thống**\n\n` +
      `📝 **Drafts chờ duyệt:** ${drafts.length}\n` +
      `✅ **Bài đã xuất bản:** ${published.length}\n` +
      `🤖 **Bot status:** ${this.enabled ? '✅ Active' : '❌ Disabled'}\n\n` +
      `💡 Gõ \`/drafts\` để xem danh sách drafts`;

    await this.sendMessage(chatId, message);
  }

  /**
   * Handle /drafts command
   */
  private async handleDraftsCommand(chatId: number): Promise<void> {
    const drafts = getContentByStatus('blog', 'review');

    if (drafts.length === 0) {
      await this.sendMessage(chatId, '📭 Không có drafts nào chờ duyệt.');
      return;
    }

    let message = `📋 **Drafts chờ duyệt (${drafts.length})**\n\n`;

    drafts.slice(0, 10).forEach((draft, index) => {
      message += 
        `${index + 1}. **${draft.title}**\n` +
        `   🔗 Slug: \`${draft.slug}\`\n` +
        `   ⭐ SEO: ${draft.seoScore || 'N/A'}/100\n` +
        `   📅 ${draft.date}\n\n`;
    });

    message += `💡 Gõ \`/approve <slug>\` hoặc \`/reject <slug>\``;

    await this.sendMessage(chatId, message);
  }

  /**
   * Handle /approve command
   */
  private async handleApproveCommand(chatId: number, slug: string): Promise<void> {
    if (!slug) {
      await this.sendMessage(chatId, '❌ Thiếu slug! Ví dụ: `/approve cach-tang-like-tiktok`');
      return;
    }

    const result = changeContentStatus('blog', slug, 'published', 'Telegram Bot', 'Admin');

    if (result.success) {
      await this.sendMessage(chatId, 
        `✅ **Đã duyệt bài viết!**\n\n` +
        `🔗 **Slug:** \`${slug}\`\n` +
        `📝 **Status:** Published\n\n` +
        `Bài viết sẽ xuất hiện trên website sau lần build tiếp theo.`
      );

      // Notify admin
      await this.sendToAdmin(`✅ **Draft đã được duyệt qua Telegram**\n\n🔗 Slug: \`${slug}\``);
    } else {
      await this.sendMessage(chatId, `❌ Lỗi: ${result.message}`);
    }
  }

  /**
   * Handle /reject command
   */
  private async handleRejectCommand(chatId: number, slug: string): Promise<void> {
    if (!slug) {
      await this.sendMessage(chatId, '❌ Thiếu slug! Ví dụ: `/reject cach-tang-like-tiktok`');
      return;
    }

    const result = changeContentStatus('blog', slug, 'draft', 'Telegram Bot');

    if (result.success) {
      await this.sendMessage(chatId, 
        `❌ **Đã từ chối bài viết!**\n\n` +
        `🔗 **Slug:** \`${slug}\`\n` +
        `📝 **Status:** Draft\n\n` +
        `Bài viết đã được chuyển về trạng thái draft.`
      );
    } else {
      await this.sendMessage(chatId, `❌ Lỗi: ${result.message}`);
    }
  }

  /**
   * Handle /help command
   */
  private async handleHelpCommand(chatId: number): Promise<void> {
    const helpMessage = 
      `🤖 **360TuongTac AI Content Bot**\n\n` +
      `📝 **Tạo nội dung:**\n` +
      `\`/new URL <url>\` - Tạo bài từ URL\n` +
      `\`/new TOPIC <chủ đề>\` - Tạo bài từ topic\n` +
      `\`/new TEXT <nội dung>\` - Tạo bài từ text\n\n` +
      `📋 **Quản lý drafts:**\n` +
      `\`/drafts\` - Xem danh sách drafts\n` +
      `\`/status\` - Xem thống kê\n` +
      `\`/approve <slug>\` - Duyệt bài\n` +
      `\`/reject <slug>\` - Từ chối bài\n\n` +
      `💡 **Ví dụ:**\n` +
      `\`/new TOPIC Cách tăng like TikTok 2024\`\n` +
      `\`/new URL https://example.com/article\`\n` +
      `\`/approve cach-tang-like-tiktok\`\n\n` +
      `⚙️ **Bot Version:** 1.0.0`;

    await this.sendMessage(chatId, helpMessage);
  }

  /**
   * Setup webhook
   */
  async setupWebhook(webhookUrl: string): Promise<boolean> {
    if (!this.enabled || !this.botToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message'],
        }),
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('[Telegram] Error setting webhook:', error);
      return false;
    }
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(): Promise<boolean> {
    if (!this.enabled || !this.botToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/deleteWebhook`, {
        method: 'POST',
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('[Telegram] Error deleting webhook:', error);
      return false;
    }
  }

  /**
   * Get bot info
   */
  async getBotInfo(): Promise<any> {
    if (!this.enabled || !this.botToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/getMe`);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('[Telegram] Error getting bot info:', error);
      return null;
    }
  }
}

// ============================================
// Singleton Instance
// ============================================

export const telegramBot = new TelegramBot();
