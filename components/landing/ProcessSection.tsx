'use client';

import { motion } from 'motion/react';
import { ShieldCheck, Wallet, Layers, Rocket, LineChart } from 'lucide-react';

const STEPS = [
  { 
    step: '01', 
    icon: ShieldCheck,
    title: 'Đăng ký & Đăng nhập', 
    desc: 'Bắt đầu hành trình tăng trưởng của bạn chỉ với vài thao tác đơn giản và bảo mật tuyệt đối.',
    color: "#00E5FF",
    glow: "shadow-[0_0_30px_rgba(0,229,255,0.4)]",
    grad: "from-[#6C63FF] to-[#00E5FF]"
  },
  { 
    step: '02', 
    icon: Wallet,
    title: 'Nạp tiền thông minh', 
    desc: 'Chủ động ngân sách với hệ thống nạp tiền tự động 24/7, hỗ trợ đa phương thức tiện lợi.',
    color: "#00E5FF",
    glow: "shadow-[0_0_30px_rgba(0,229,255,0.4)]",
    grad: "from-[#6C63FF] to-[#00E5FF]"
  },
  { 
    step: '03', 
    icon: Layers,
    title: 'Khám phá dịch vụ', 
    desc: 'Lựa chọn những giải pháp tăng trưởng được thiết kế riêng để tối ưu cho kênh của bạn.',
    color: "#00E5FF",
    glow: "shadow-[0_0_30px_rgba(0,229,255,0.4)]",
    grad: "from-[#6C63FF] to-[#00E5FF]"
  },
  { 
    step: '04', 
    icon: Rocket,
    title: 'Kích hoạt chạy dịch vụ', 
    desc: 'Chỉ với một chạm, hệ thống thông minh sẽ thay bạn triển khai chiến dịch bùng nổ tức thì.',
    color: "#00E5FF",
    glow: "shadow-[0_0_30px_rgba(0,229,255,0.4)]",
    grad: "from-[#6C63FF] to-[#00E5FF]"
  },
  { 
    step: '05', 
    icon: LineChart,
    title: 'Đo lường thành công', 
    desc: 'Theo dõi kết quả thực tế qua bảng điều khiển minh bạch, giúp bạn hoàn toàn an tâm về hiệu quả.',
    color: "#00E5FF",
    glow: "shadow-[0_0_30px_rgba(0,229,255,0.4)]",
    grad: "from-[#6C63FF] to-[#00E5FF]"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8 }
  },
};

interface ProcessSectionProps {
  data?: {
    title: string;
    steps: Array<{
      step: string;
      title: string;
      desc: string;
      icon: string;
    }>;
  };
}

export default function ProcessSection({ data }: ProcessSectionProps) {
  const displayTitle = data?.title || "Quy trình làm việc tối ưu";
  const displaySteps = data?.steps 
    ? data.steps.map((s, i) => ({
        ...s,
        icon: (i === 0 ? ShieldCheck : i === 1 ? Wallet : i === 2 ? Layers : i === 3 ? Rocket : LineChart) as any,
        color: STEPS[i % STEPS.length].color,
        glow: STEPS[i % STEPS.length].glow,
        grad: STEPS[i % STEPS.length].grad,
      }))
    : STEPS;

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#0a0a0f]" id="quy-trinh">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="container-max relative z-10">
        <div className="text-center mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full glass-panel border border-white/10 mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#00E5FF] animate-pulse mr-2"></span>
            <span className="font-stat text-[10px] font-black tracking-[0.2em] uppercase text-[#00E5FF]">Hệ thống tự động 24/7</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-h1 text-4xl md:text-5xl lg:text-7xl font-black mb-8 leading-tight tracking-tight text-white antialiased"
          >
            {displayTitle === "Quy trình làm việc tối ưu" ? (
              <>Quy trình làm việc <span className="text-gradient">tối ưu</span></>
            ) : displayTitle}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium opacity-80 antialiased"
          >
            Trải nghiệm sự đột phá với hệ thống vận hành 100% tự động, đảm bảo tốc độ tăng trưởng thần tốc và an toàn tuyệt đối cho tài khoản của bạn.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className={`grid grid-cols-1 ${displaySteps.length === 3 ? 'md:grid-cols-3 max-w-6xl mx-auto' : 'md:grid-cols-5 max-w-7xl mx-auto'} gap-6 lg:gap-8 relative`}
        >
          {displaySteps.slice(0, 5).map((s, i, arr) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Connector line for desktop - hidden on mobile */}
              {i < arr.length - 1 && (
                <div className="hidden md:block absolute top-[2.5rem] left-[50%] w-full h-[2px] bg-gradient-to-r from-[#6C63FF] to-[#00E5FF] opacity-10 -z-0"></div>
              )}
              
              <div className="glass-panel w-full max-w-sm md:max-w-none mx-auto p-8 h-full rounded-[2.5rem] border border-white/5 hover:border-[#00E5FF]/30 transition-all duration-500 relative overflow-hidden bg-[#13121b]/40 backdrop-blur-2xl flex flex-col items-center text-center">
                
                {/* Step Number Badge */}
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.grad} flex items-center justify-center mb-8 ${s.glow} transition-all duration-500 relative z-10 shadow-2xl`}
                >
                  <span className="text-2xl font-black text-white">{s.step}</span>
                </motion.div>

                {/* Icon Container */}
                <div className="mb-6 p-4 rounded-full bg-white/[0.03] border border-white/5 group-hover:bg-[#00E5FF]/10 group-hover:border-[#00E5FF]/20 transition-all duration-500">
                  <s.icon size={32} className="text-[#00E5FF] group-hover:scale-110 transition-transform duration-500" />
                </div>

                <h3 className="font-h1 text-xl font-bold text-white mb-4 tracking-tight group-hover:text-[#00E5FF] transition-colors">
                  {s.title}
                </h3>
                <p className="font-body text-slate-400 text-sm leading-relaxed font-medium">
                  {s.desc}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF]/0 to-[#00E5FF]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Commitment Section Integrated */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.8 }}
           className="mt-24"
        >
          <div className="glass-panel p-10 md:p-16 rounded-[3rem] border border-white/5 relative overflow-hidden bg-[#13121b]/60 backdrop-blur-3xl shadow-2xl">
            <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#00E5FF]/5 blur-[120px] rounded-full pointer-events-none opacity-50"></div>
            
            <div className="text-center mb-16 max-w-2xl mx-auto relative z-10">
              <h2 className="font-h1 text-3xl md:text-4xl font-black text-white mb-4 antialiased uppercase tracking-wide">Cam kết chất lượng</h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-[#6C63FF] to-[#00E5FF] mx-auto rounded-full mb-6"></div>
              <p className="font-body text-slate-400 font-medium">Uy tín và sự thành công của khách hàng là kim chỉ nam cho mọi hoạt động của hệ thống.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-3xl bg-[#00E5FF]/5 border border-[#00E5FF]/10 flex items-center justify-center mb-6 text-[#00E5FF] group-hover:bg-[#00E5FF]/10 group-hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] group-hover:-translate-y-2 transition-all duration-500">
                  <ShieldCheck size={40} />
                </div>
                <h4 className="font-h1 text-xl font-bold text-white mb-3 tracking-tight">100% Secure</h4>
                <p className="font-body text-slate-400 text-sm leading-relaxed">Hệ thống bảo mật đa tầng, cam kết không lộ danh tính khách hàng.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-3xl bg-[#6C63FF]/5 border border-[#6C63FF]/10 flex items-center justify-center mb-6 text-[#6C63FF] group-hover:bg-[#6C63FF]/10 group-hover:shadow-[0_0_30px_rgba(108,99,255,0.3)] group-hover:-translate-y-2 transition-all duration-500">
                  <LineChart size={40} />
                </div>
                <h4 className="font-h1 text-xl font-bold text-white mb-3 tracking-tight">Real Growth</h4>
                <p className="font-body text-slate-400 text-sm leading-relaxed">Tương tác từ tài khoản thật và chất lượng cao, giúp kênh phát triển bền vững.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-3xl bg-[#FF2E63]/5 border border-[#FF2E63]/10 flex items-center justify-center mb-6 text-[#FF2E63] group-hover:bg-[#FF2E63]/10 group-hover:shadow-[0_0_30px_rgba(255,46,99,0.3)] group-hover:-translate-y-2 transition-all duration-500">
                  <Wallet size={40} />
                </div>
                <h4 className="font-h1 text-xl font-bold text-white mb-3 tracking-tight">Tối ưu Chi phí</h4>
                <p className="font-body text-slate-400 text-sm leading-relaxed">Bảng giá cạnh tranh cùng nhiều ưu đãi đặc quyền cho đại lý và KOC.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
