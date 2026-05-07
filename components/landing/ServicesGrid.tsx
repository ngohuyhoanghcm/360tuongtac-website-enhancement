'use client';

import { ThumbsUp, Play, Camera } from 'lucide-react';
import { motion } from 'motion/react';

const SERVICES = [
  {
    title: "Facebook Boost",
    desc: "Tăng Like, Follow, Share thật. Mở rộng độ phủ thương hiệu an toàn và bền vững.",
    icon: ThumbsUp,
    color: "#1877F2",
    bg: "from-[#1877F2]/10",
  },
  {
    title: "TikTok Viral",
    desc: "Đẩy View, Tim, Follow nhanh chóng. Giúp video dễ dàng lên xu hướng (Trending).",
    icon: Play,
    color: "#00f2fe",
    bg: "from-[#00f2fe]/10",
  },
  {
    title: "Instagram Growth",
    desc: "Xây dựng cộng đồng tương tác thật, tăng mức độ uy tín cho Profile/Shop.",
    icon: Camera,
    color: "#E1306C",
    bg: "from-[#E1306C]/10",
  }
];

export default function ServicesGrid() {
  return (
    <section className="section-padding" id="services">
      <div className="container-max">
        <h2 className="font-h text-3xl md:text-5xl font-black mb-16 text-center text-gray-900">Dịch vụ nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-10 hover:bg-gray-50 transition-colors relative overflow-hidden group cursor-pointer border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative z-10">
                 <service.icon size={48} color={service.color} className="mb-8 drop-shadow-sm" strokeWidth={1.5} />
                 <h3 className="font-h text-2xl md:text-3xl text-gray-900 font-bold mb-4 tracking-tight">{service.title}</h3>
                 <p className="font-body text-gray-600 font-medium leading-relaxed">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
