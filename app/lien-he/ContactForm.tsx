'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const validateVietnamPhone = (phone: string) => {
    const rawPhone = phone.replace(/[\s\-\.]/g, '');
    const phoneRegex = /^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[1-5|6|8|9]|9[0-4|6-9])([0-9]{7})$/;
    return phoneRegex.test(rawPhone);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      service: formData.get('service') as string,
      message: formData.get('message') as string,
    };

    // Client-side Validation (Tăng trải nghiệm người dùng)
    let newErrors: Record<string, string> = {};
    if (!data.name?.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên.';
    }
    
    if (!data.phone?.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!validateVietnamPhone(data.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.';
    }

    if (!data.message?.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung yêu cầu.';
    } else if (data.message.trim().length < 10) {
      newErrors.message = 'Mô tả cần chi tiết hơn (ít nhất 10 ký tự).';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setStatus({ type: 'error', message: 'Vui lòng kiểm tra lại các thông tin đã nhập.' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Gửi thành công! Chuyên gia 360TuongTac sẽ liên hệ bạn ngay.' });
        (e.target as HTMLFormElement).reset();
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        setStatus({ type: 'error', message: result.message || 'Hệ thống đang bận, vui lòng gửi lại sau ít phút hoặc liên hệ Hotline.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Máy chủ không phản hồi. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col justify-center">
      <div className="bg-[#13121b]/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="font-h1 text-3xl font-bold text-white mb-3">Sẵn sàng cất cánh?</h2>
        <p className="font-body text-slate-400 mb-8 font-medium">Để lại thông tin, chuyên gia của chúng tôi sẽ phân tích và đưa ra chiến lược phù hợp nhất cho bạn.</p>
        
        {status.type === 'success' && (
          <div className="mb-8 p-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <CheckCircle className="shrink-0 w-6 h-6" />
            <p className="font-body text-sm font-semibold">{status.message}</p>
          </div>
        )}
        
        {status.type === 'error' && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <AlertCircle className="shrink-0 w-6 h-6" />
            <p className="font-body text-sm font-semibold">{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group space-y-2">
              <label className="font-stat text-xs font-bold text-slate-400 tracking-widest uppercase transition-colors group-focus-within:text-[#FF2E63]">HỌ VÀ TÊN *</label>
              <input name="name" type="text" placeholder="Nguyễn Văn A" className={`w-full bg-white/[0.03] border ${fieldErrors.name ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#FF2E63] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(255,46,99,0.2)] transition-all font-body placeholder:text-slate-600`} />
              {fieldErrors.name && <p className="text-red-500 text-sm mt-1 mx-2">{fieldErrors.name}</p>}
            </div>
            <div className="group space-y-2">
              <label className="font-stat text-xs font-bold text-slate-400 tracking-widest uppercase transition-colors group-focus-within:text-[#FF2E63]">SỐ ĐIỆN THOẠI *</label>
              <input name="phone" type="tel" placeholder="09xx xxx xxx" className={`w-full bg-white/[0.03] border ${fieldErrors.phone ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#FF2E63] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(255,46,99,0.2)] transition-all font-body placeholder:text-slate-600`} />
              {fieldErrors.phone && <p className="text-red-500 text-sm mt-1 mx-2">{fieldErrors.phone}</p>}
            </div>
          </div>
          <div className="group space-y-2">
            <label className="font-stat text-xs font-bold text-slate-400 tracking-widest uppercase transition-colors group-focus-within:text-[#FF2E63]">DỊCH VỤ QUAN TÂM</label>
            <div className="relative">
              <select name="service" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#FF2E63] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(255,46,99,0.2)] transition-all font-body appearance-none relative z-10 cursor-pointer">
                <option value="Tăng Tương Tác TikTok" className="bg-[#13121b]">Tăng Tương Tác TikTok</option>
                <option value="Seeding Comment" className="bg-[#13121b]">Seeding Comment</option>
                <option value="Dịch vụ Facebook" className="bg-[#13121b]">Dịch vụ Facebook</option>
                <option value="Traffic Website" className="bg-[#13121b]">Traffic Website</option>
                <option value="Khác" className="bg-[#13121b]">Khác</option>
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none z-20">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="group space-y-2">
            <label className="font-stat text-xs font-bold text-slate-400 tracking-widest uppercase transition-colors group-focus-within:text-[#FF2E63]">NỘI DUNG YÊU CẦU *</label>
            <textarea name="message" rows={4} placeholder="Mô tả ngắn gọn về tình trạng kênh hoặc website của bạn..." className={`w-full bg-white/[0.03] border ${fieldErrors.message ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#FF2E63] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(255,46,99,0.2)] transition-all font-body placeholder:text-slate-600 resize-none`}></textarea>
            {fieldErrors.message && <p className="text-red-500 text-sm mt-1 mx-2">{fieldErrors.message}</p>}
          </div>
          <button disabled={loading} type="submit" className="relative w-full overflow-hidden rounded-2xl p-px group disabled:opacity-70 disabled:cursor-not-allowed mt-4">
            <span className="absolute inset-0 bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] transition-transform duration-500"></span>
            <div className="relative flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] rounded-2xl text-white font-h1 font-black text-lg uppercase tracking-wider shadow-[0_10px_30px_rgba(255,46,99,0.4)] hover:brightness-110 transition-all">
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span className="group-hover:-translate-y-px transition-transform">Gửi Yêu Cầu</span>
                  <Send className="transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" size={20} />
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
