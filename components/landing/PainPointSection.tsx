'use client';

import { TrendingDown, Users, Frown } from 'lucide-react';
import { motion } from 'motion/react';

const painPointsData = [
  {
    icon: Users,
    title: "Livestream 'không người xem'",
    description: "Bạn đầu tư chỉn chu từ background đến kịch bản, nhưng bật live lên chỉ vỏn vẹn 2-5 người xem (thường là người nhà hoặc nhân viên)."
  },
  {
    icon: TrendingDown,
    title: "Tương tác chạm đáy",
    description: "Không ai comment, thả tim hay share. Bạn nói chuyện một mình trước màn hình, cảm giác bế tắc và kiệt sức."
  },
  {
    icon: Frown,
    title: "Không ra đơn hàng",
    description: "Mặc dù sản phẩm có giá siêu tốt và chất lượng cao, nhưng không có traffic dẫn đến doanh số 0 đồng."
  }
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
    transition: { duration: 0.7 }
  },
};

interface PainPointSectionProps {
  data?: {
    title: string;
    items: string[];
  };
}

export default function PainPointSection({ data }: PainPointSectionProps) {
  const displayTitle = data?.title || "Bạn có đang gặp phải tình trạng bế tắc này?";
  const displayItems = data?.items 
    ? data.items.map((it, idx) => ({ 
        title: it.split(':')[0] || 'Vấn đề', 
        description: it.split(':')[1] || it,
        icon: painPointsData[idx % painPointsData.length].icon 
      }))
    : painPointsData;

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#0a0a0f]" id="pain-points">
      {/* Background Atmosphere - Dark Red Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-orange-900/5 rounded-full blur-[140px]"></div>
      </div>

      <div className="container-max relative z-10">
        <div className="text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-md"
          >
            <span className="text-[10px] font-black tracking-[0.3em] text-red-500 uppercase antialiased">Cảnh báo hệ thống</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={{ 
              x: [0, -1, 1, -1, 0],
              transition: { 
                repeat: Infinity, 
                duration: 2, 
                repeatDelay: 3, 
                ease: "linear" 
              } 
            }}
            className="font-h1 text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight text-white leading-[1.1] drop-shadow-2xl antialiased"
          >
            {displayTitle.includes('trạng bế tắc') ? (
              <>Bạn có đang gặp phải <br className="hidden md:block" /> <span className="text-red-500">tình trạng bế tắc này?</span></>
            ) : displayTitle}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium opacity-80 antialiased"
          >
            Đừng để những rào cản thuật toán vô hình ngăn cản sự phát triển. 
            Nhận diện vấn đề là bước đầu tiên để bứt phá giới hạn.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {displayItems.map((point, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
              className="group relative glass-panel p-10 rounded-[2rem] border border-white/5 hover:border-red-500/30 transition-all duration-500 overflow-hidden cursor-default shadow-2xl"
            >
              {/* Inner Red Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-orange-500/0 group-hover:from-red-500/[0.03] group-hover:to-orange-500/[0.03] transition-colors duration-500 pointer-events-none"></div>
              
              {/* Icon Container with Alert Pulse */}
              <div className="relative mb-8">
                <motion.div 
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)'
                  }}
                  className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all duration-300 relative group-hover:bg-red-500/10 group-hover:border-red-500/30"
                >
                  <point.icon className="w-8 h-8 text-orange-500 transition-all duration-300 group-hover:text-red-500 group-hover:scale-110" />
                  
                  {/* Alert Pulse Ring */}
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl border border-red-500/20 opacity-0 group-hover:opacity-100"
                  />
                </motion.div>
              </div>
              
              <h3 className="font-h text-2xl font-bold mb-5 text-white tracking-tight group-hover:text-red-500 transition-colors duration-300">
                {point.title}
              </h3>
              
              <p className="font-body text-slate-400 text-base md:text-lg leading-relaxed font-medium transition-colors duration-300 group-hover:text-slate-300">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
