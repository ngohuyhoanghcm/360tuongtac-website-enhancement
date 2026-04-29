'use client';

import { motion } from 'motion/react';
import { ShieldCheck, Zap, Users, RefreshCw } from 'lucide-react';

const TRUST_PILLARS = [
  {
    icon: Users,
    title: '10,000+ Khách hàng',
    desc: 'Hơn 10 nghìn cá nhân & đơn vị kinh doanh tin tưởng sử dụng dịch vụ mỗi tháng.',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    icon: Zap,
    title: 'Giao hàng tự động 24/7',
    desc: 'Hệ thống vận hành 100% tự động, bắt đầu triển khai ngay khi nhận đơn hàng.',
    color: 'from-amber-400 to-orange-500'
  },
  {
    icon: ShieldCheck,
    title: 'Bảo mật tuyệt đối',
    desc: 'Chúng tôi cam kết không lộ danh tính và bảo mật thông tin tài khoản của bạn.',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    icon: RefreshCw,
    title: 'Hoàn tiền 100%',
    desc: 'Cam kết hoàn tiền tự động nếu hệ thống không hoàn thành nhiệm vụ đúng cam kết.',
    color: 'from-[#FF2E63] to-[#FF8C00]'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container-max px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-h1 text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight antialiased">
              Tại sao chọn <span className="text-gradient">360TuongTac?</span>
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] mx-auto rounded-full mb-8"></div>
            <p className="font-body text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
              Chúng tôi không chỉ cung cấp dịch vụ, chúng tôi cung cấp giải pháp bứt phá an toàn và bền vững.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all duration-500 text-center"
            >
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-8 mx-auto shadow-2xl group-hover:-translate-y-2 transition-transform duration-500`}>
                <pillar.icon size={40} className="text-white" />
              </div>
              
              <h3 className="font-h1 text-xl font-bold text-white mb-4 tracking-tight group-hover:text-[#FF8C00] transition-colors antialiased">
                {pillar.title}
              </h3>
              
              <p className="font-body text-slate-400 text-sm leading-relaxed font-medium">
                {pillar.desc}
              </p>
              
              {/* Bottom Line Glow */}
              <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${pillar.color} group-hover:w-full transition-all duration-700`}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
