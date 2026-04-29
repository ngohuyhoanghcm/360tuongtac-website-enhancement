import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <div className="mb-16 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
          <span className="font-stat text-xs font-semibold text-[#00E5FF] tracking-wider uppercase">Sẵn sàng hỗ trợ 24/7</span>
        </div>
        <h1 className="font-h1 text-4xl md:text-5xl font-extrabold text-white mb-6">Liên hệ với <span className="text-gradient">chúng tôi</span></h1>
        <p className="font-body text-lg text-slate-400 max-w-2xl md:mx-0 mx-auto">
          Đội ngũ chuyên gia của 360 Tương Tác luôn sẵn sàng giải đáp mọi thắc mắc và đồng hành cùng chiến dịch tăng trưởng của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-2xl group hover:bg-white/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/20 flex items-center justify-center mb-4">
                <Phone className="text-[#c4c0ff]" />
              </div>
              <h3 className="font-h1 text-xl font-bold text-white mb-1">Hotline</h3>
              <p className="font-body text-slate-400 text-sm">0900-123-456</p>
            </div>
            <div className="glass-card p-6 rounded-2xl group hover:bg-white/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center mb-4">
                <Mail className="text-[#00daf3]" />
              </div>
              <h3 className="font-h1 text-xl font-bold text-white mb-1">Email</h3>
              <p className="font-body text-slate-400 text-sm">support@360tuongtac.com</p>
            </div>
            <div className="glass-card p-6 rounded-2xl col-span-1 sm:col-span-2 group hover:bg-white/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B6B]/20 flex items-center justify-center mb-4">
                <MapPin className="text-[#FF6B6B]" />
              </div>
              <h3 className="font-h1 text-xl font-bold text-white mb-1">Văn phòng</h3>
              <p className="font-body text-slate-400 text-sm">Tầng 25, Keangnam Landmark Tower, Phạm Hùng, Hà Nội</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#" className="flex-1 flex items-center justify-center gap-3 py-4 glass-card rounded-2xl hover:bg-white/10 transition-all border-[#6C63FF]/30">
              <span className="font-h1 font-bold text-white">Zalo Chat</span>
            </a>
            <a href="#" className="flex-1 flex items-center justify-center gap-3 py-4 glass-card rounded-2xl hover:bg-white/10 transition-all border-[#00E5FF]/30">
              <span className="font-h1 font-bold text-white">Telegram Support</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="glass-card p-8 lg:p-12 rounded-3xl h-full border-t border-l border-[#6C63FF]/20 flex flex-col justify-center bg-[#13121b]/60">
            <h2 className="font-h1 text-3xl font-bold text-white mb-8">Gửi tin nhắn cho chúng tôi</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-stat text-xs font-semibold text-slate-400 tracking-wider">HỌ VÀ TÊN</label>
                  <input type="text" placeholder="Nguyễn Văn A" className="w-full bg-[#0e0d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all font-body" />
                </div>
                <div className="space-y-2">
                  <label className="font-stat text-xs font-semibold text-slate-400 tracking-wider">SỐ ĐIỆN THOẠI</label>
                  <input type="tel" placeholder="09xx xxx xxx" className="w-full bg-[#0e0d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all font-body" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-stat text-xs font-semibold text-slate-400 tracking-wider">DỊCH VỤ QUAN TÂM</label>
                <select className="w-full bg-[#0e0d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all font-body appearance-none">
                  <option>Dịch vụ TikTok</option>
                  <option>Dịch vụ Facebook</option>
                  <option>Khác</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-stat text-xs font-semibold text-slate-400 tracking-wider">NỘI DUNG TIN NHẮN</label>
                <textarea rows={4} placeholder="Bạn cần chúng tôi hỗ trợ gì?" className="w-full bg-[#0e0d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all font-body"></textarea>
              </div>
              <button type="button" className="w-full bg-[#6C63FF] text-white py-4 rounded-xl font-h1 font-bold text-lg neon-glow transition-all flex items-center justify-center gap-2 group hover:bg-[#5a52d3]">
                Gửi yêu cầu ngay
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
