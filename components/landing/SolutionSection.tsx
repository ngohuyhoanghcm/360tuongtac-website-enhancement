'use client';

import { ShieldCheck, Rocket, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

const solutionsData = [
  {
    icon: Zap,
    title: "Mồi View Thông Minh",
    desc: "Tạo ngay 100-500 mắt xem ổn định khi vừa bật live. Kích thích hiệu ứng đám đông, giữ chân người dùng thật ở lại xem bạn.",
    color: "#FF8C00",
    glow: "shadow-[0_0_40px_rgba(255,140,0,0.4)]",
    grad: "from-[#FF8C00] to-[#FF6B35]"
  },
  {
    icon: Rocket,
    title: "Phá Vỡ Thuật Toán",
    desc: "Việc liên tục có người thả tim, comment điều hướng giúp đánh lừa thuật toán, giúp hệ thống đẩy mạnh phân phối tới người dùng thật.",
    color: "#FF2E63",
    glow: "shadow-[0_0_40px_rgba(255,46,99,0.4)]",
    grad: "from-[#FF2E63] to-[#FF6B9D]"
  },
  {
    icon: ShieldCheck,
    title: "100% An Toàn & Bảo Mật",
    desc: "Công nghệ độc quyền mô phỏng thiết bị thật và kết nối qua Proxy sạch, đảm bảo an toàn tuyệt đối cho kênh và tài khoản của bạn.",
    color: "#10B981",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.4)]",
    grad: "from-[#10B981] to-[#059669]"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

interface SolutionSectionProps {
  data?: {
    title: string;
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  productUrl?: string;
  serviceSlug?: string;
}

export default function SolutionSection({ data, productUrl, serviceSlug }: SolutionSectionProps) {
  const displayTitle = data?.title || "Bệ phóng tăng trưởng từ 360TuongTac";
  const displaySolutions = data?.features 
    ? data.features.map((f, idx) => ({
        ...f,
        desc: f.description,
        icon: (idx === 0 ? Zap : idx === 1 ? Rocket : ShieldCheck) as any,
        color: solutionsData[idx % solutionsData.length].color,
        glow: solutionsData[idx % solutionsData.length].glow,
        grad: solutionsData[idx % solutionsData.length].grad,
      }))
    : solutionsData;

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#0D0D1A]" id="giai-phap">
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-900/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="container-max relative z-10">
        <div className="text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur-md"
          >
            <span className="text-[10px] font-black tracking-[0.3em] text-green-400 uppercase antialiased">Giải pháp bứt phá</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-h1 text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight text-white leading-[1.1] drop-shadow-2xl antialiased"
          >
            {displayTitle === "Bệ phóng tăng trưởng từ 360TuongTac" ? (
              <>Bệ phóng tăng trưởng <br className="hidden md:block" /> <span className="bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent">từ 360TuongTac</span></>
            ) : displayTitle}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium opacity-80 antialiased"
          >
            Chúng tôi cung cấp hệ sinh thái mồi tương tác thông minh giúp bạn bẻ khóa thuật toán 
            và xây dựng cộng đồng khách hàng trung thành.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {displaySolutions.slice(0, 3).map((sol, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="glass-panel p-10 h-full rounded-[2.5rem] border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-500 relative overflow-hidden text-center flex flex-col items-center">
                {/* Icon with Neon Glow */}
                <div className="relative mb-10 w-20 h-20 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${sol.grad} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`}></div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={`w-full h-full rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center relative z-10 transition-all duration-300 group-hover:bg-white/[0.08] ${sol.glow}`}
                  >
                    <sol.icon className="w-10 h-10" style={{ color: sol.color }} />
                  </motion.div>
                </div>

                <h3 className="font-h text-2xl font-bold mb-5 text-white tracking-tight">
                  {sol.title}
                </h3>
                <p className="font-body text-slate-400 text-base md:text-lg leading-relaxed">
                  {sol.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block relative group"
          >
            {/* Shadow Pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
            
            <Link 
              href={productUrl ? `${productUrl}?utm_source=grow&utm_medium=cta&utm_campaign=${serviceSlug}&utm_content=solution_section_cta` : "https://360tuongtac.com/home?utm_source=grow&utm_medium=cta&utm_campaign=solution_section&utm_content=su_dung_giai_phap"}
              className="relative block px-12 py-6 rounded-2xl bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black text-xl shadow-[0_0_30px_rgba(255,140,0,0.5)] overflow-hidden antialiased"
            >
              {/* Shimmer Sweep Effect */}
              <motion.div 
                animate={{ 
                  left: ['-100%', '200%']
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
                className="absolute inset-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] pointer-events-none"
              />
              Sử Dụng Giải Pháp Ngay
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
