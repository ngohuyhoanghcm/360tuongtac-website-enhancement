import { CheckCircle, ShieldCheck, Zap, Calculator, ShoppingCart, Rocket, Headphones } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="pb-24 hero-glow">
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-h1 text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
              Bảng giá Dịch vụ <br/><span className="text-[#c4c0ff]">Tối ưu & Minh bạch</span>
            </h1>
            <p className="font-body text-lg text-slate-400 max-w-xl mb-10">
              Khám phá các giải pháp tăng trưởng mạng xã hội được thiết kế riêng cho nhu cầu của bạn. 
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 glass-card px-4 py-3 rounded-xl border-[#00E5FF]/20">
                <ShieldCheck className="text-[#00E5FF]" size={20} />
                <span className="font-body text-sm font-medium text-slate-300">Chất lượng thật 100%</span>
              </div>
              <div className="flex items-center gap-3 glass-card px-4 py-3 rounded-xl border-[#00E5FF]/20">
                <Zap className="text-[#00E5FF]" size={20} />
                <span className="font-body text-sm font-medium text-slate-300">Tốc độ siêu nhanh</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl glass-border-gradient shadow-2xl bg-[#13121b]/90">
            <h3 className="font-h1 text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <Calculator className="text-[#6C63FF]" /> Công cụ tính giá
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block font-stat text-xs font-semibold text-slate-400 tracking-wider mb-2">CHỌN DỊCH VỤ</label>
                <select className="w-full bg-[#0e0d16] border border-white/10 text-white rounded-xl px-4 py-4 focus:ring-1 focus:ring-[#00E5FF] outline-none appearance-none font-body">
                  <option>TikTok - Tăng lượt xem (Views)</option>
                  <option>TikTok - Tăng người theo dõi</option>
                  <option>Facebook - Tăng like bài viết</option>
                </select>
              </div>
              <div>
                <label className="block font-stat text-xs font-semibold text-slate-400 tracking-wider mb-2">SỐ LƯỢNG CẦN TĂNG</label>
                <input type="range" className="w-full accent-[#6C63FF] h-2 bg-white/10 rounded-full appearance-none cursor-pointer mb-2" defaultValue="1000" min="100" max="10000" />
                <div className="flex justify-between text-xs text-slate-500 font-stat"><span>100</span><span>10,000+</span></div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="font-stat text-xs font-semibold text-slate-400 tracking-wider mb-1">GIÁ DỰ KIẾN</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-stat text-4xl font-bold text-white tracking-tighter">45.000</span>
                      <span className="font-body text-[#6C63FF] font-bold text-sm">VNĐ</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-stat text-xs font-semibold text-[#00E5FF] tracking-wider">ƯU ĐÃI KHÁCH MỚI</p>
                  </div>
                </div>
                <Link href="https://360tuongtac.com/service/tiktok/tiktok-views" className="w-full bg-[#6C63FF] hover:bg-[#5a52d3] text-white py-4 rounded-xl font-h1 font-bold flex items-center justify-center gap-2 transition-all neon-glow">
                  <ShoppingCart size={20} /> Đặt hàng ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-24">
        <div className="text-center mb-16">
          <h2 className="font-h1 text-3xl md:text-4xl font-bold text-white mb-4">Mức giá cạnh tranh nhất thị trường</h2>
          <p className="font-body text-slate-400">Tham khảo các gói dịch vụ phổ biến nhất hiện nay.</p>
        </div>
        
        <div className="glass-card rounded-3xl overflow-hidden border border-white/5 bg-[#13121b]/60">
          <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-h1 text-2xl font-bold text-white">Dịch vụ TikTok</h3>
            <div className="flex gap-2 bg-[#0e0d16] p-1 rounded-xl">
              <button className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">TikTok</button>
              <button className="text-slate-400 px-4 py-2 rounded-lg text-sm font-medium hover:text-white transition-colors">Facebook</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 md:px-8 py-5 font-stat text-xs font-semibold text-slate-400 tracking-wider">TÊN DỊCH VỤ</th>
                  <th className="px-6 md:px-8 py-5 font-stat text-xs font-semibold text-slate-400 tracking-wider">GIÁ (Đ/1000 LƯỢT)</th>
                  <th className="px-6 md:px-8 py-5 font-stat text-xs font-semibold text-slate-400 tracking-wider">THỜI GIAN</th>
                  <th className="px-6 md:px-8 py-5 font-stat text-xs font-semibold text-slate-400 tracking-wider">MÔ TẢ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: 'Views - Khởi động kép', price: '45.000', time: 'Cấp tốc', desc: 'Thích hợp buff view cho video mới.' },
                  { name: 'Followers - Việt Nam thật', price: '95.000', time: '30-60 phút', desc: 'Tài khoản người dùng thật, avatar đầy đủ.' },
                  { name: 'Likes - Chất lượng cao', price: '35.000', time: '5-10 phút', desc: 'Lên ổn định, không tụt.' },
                  { name: 'Comments - Theo kịch bản', price: '250.000', time: 'Tự nhiên', desc: 'Kịch bản do bạn cung cấp, seeding tự nhiên.' },
                ].map((srv, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 md:px-8 py-5 font-medium text-white flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#00daf3] shadow-[0_0_8px_rgba(0,218,243,0.8)]"></div>
                      {srv.name}
                    </td>
                    <td className="px-6 md:px-8 py-5 font-stat text-lg font-bold text-[#00E5FF]">{srv.price} đ</td>
                    <td className="px-6 md:px-8 py-5 text-slate-400 text-sm">{srv.time}</td>
                    <td className="px-6 md:px-8 py-5 text-slate-400 text-sm">{srv.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6 md:p-8 rounded-3xl flex items-center gap-6 border-white/5 hover:border-[#6C63FF]/30 transition-colors">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF]">
              <Rocket size={32} />
            </div>
            <div>
              <h4 className="font-h1 text-xl font-bold text-white mb-2">Giải pháp Đại lý (Reseller)</h4>
              <p className="font-body text-sm text-slate-400">Bạn là Agency hoặc Freelancer? Nhận mức chiết khấu lên đến 30% khi đăng ký cấp bậc Đại lý với hệ thống API của chúng tôi.</p>
            </div>
          </div>
          <div className="glass-card p-6 md:p-8 rounded-3xl flex items-center gap-6 border-white/5 hover:border-[#00E5FF]/30 transition-colors">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
              <Headphones size={32} />
            </div>
            <div>
              <h4 className="font-h1 text-xl font-bold text-white mb-2">Hỗ trợ riêng tư 1:1</h4>
              <p className="font-body text-sm text-slate-400">Có đội ngũ CSKH theo sát từng đơn đặt hàng. Đảm bảo hỗ trợ hoàn tiền nhanh chóng nếu gói dịch vụ tạm bảo trì.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
