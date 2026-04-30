import { NextResponse } from 'next/server';

// Regex for Vietnamese phone numbers
const PHONE_REGEX = /^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[1-5|6|8|9]|9[0-4|6-9])([0-9]{7})$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { name, phone, service, message } = body;

    // 1. Sanitize and validate inputs
    name = name?.trim() || '';
    phone = phone?.trim().replace(/[\s\-\.]/g, '') || ''; // Remove spaces, dashes, dots
    service = service?.trim() || 'Không xác định';
    message = message?.trim() || '';

    // Required fields check
    if (!name || !phone || !message) {
      return NextResponse.json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ các thông tin bắt buộc (Họ tên, Số điện thoại, Nội dung).' 
      }, { status: 400 });
    }

    // Name length check
    if (name.length > 100) {
      return NextResponse.json({ 
        success: false, 
        message: 'Họ tên quá dài. Vui lòng nhập dưới 100 ký tự.' 
      }, { status: 400 });
    }

    // Phone format check
    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng số điện thoại Việt Nam.' 
      }, { status: 400 });
    }

    // Message length check
    if (message.length < 10) {
      return NextResponse.json({ 
        success: false, 
        message: 'Nội dung quá ngắn. Vui lòng mô tả chi tiết hơn (ít nhất 10 ký tự).' 
      }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ 
        success: false, 
        message: 'Nội dung quá dài. Vui lòng tóm tắt dưới 2000 ký tự.' 
      }, { status: 400 });
    }

    // 2. Prepare Telegram Data
    const token = process.env.TELEGRAM_BOT_TOKEN || '8329752735:AAEQ9VwcII0fJHkrMMNopDeJuAkDPAXB9fA';
    let chatId = process.env.TELEGRAM_CHAT_ID;

    // Auto-discover chat ID if not set
    if (!chatId) {
      try {
        const updateRes = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
        const updateData = await updateRes.json();
        if (updateData.ok && updateData.result.length > 0) {
          chatId = updateData.result[updateData.result.length - 1].message?.chat?.id;
        }
      } catch (e) {
        console.error("Failed to fetch updates for chat id auto-discovery");
      }
    }

    if (!chatId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Chưa cấu hình Telegram Chat ID. Quản trị viên cần nhắn tin cho Bot ít nhất 1 lần để hệ thống tự nhận diện.'
      }, { status: 400 });
    }

    // 3. Escape HTML special characters to prevent injection/formatting breaks in Telegram
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    };

    const text = `🔥 <b>Có khách hàng mới liên hệ!</b>
    
<b>Họ và tên:</b> ${escapeHtml(name)}
<b>Số điện thoại:</b> ${escapeHtml(phone)}
<b>Dịch vụ quan tâm:</b> ${escapeHtml(service)}
<b>Nội dung:</b> 
${escapeHtml(message)}`;

    // 4. Send to Telegram
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API Error:', data);
      return NextResponse.json({ 
        success: false, 
        message: 'Lỗi hệ thống khi gửi thông báo. Vui lòng liên hệ trực tiếp qua Zalo.' 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Đã gửi liên hệ thành công!' });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Đã xảy ra lỗi hệ thống không mong muốn. Vui lòng thử lại sau.' 
    }, { status: 500 });
  }
}
