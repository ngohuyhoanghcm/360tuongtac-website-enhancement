'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Standardized data Extraction - Expanded to 30 profiles, 47 services
const CUSTOMER_PROFILES = [
  { name: "Hoàng Minh Tuấn", type: "Cá nhân", avatar: "👤" },
  { name: "Nguyễn Thị Mai", type: "Cá nhân", avatar: "👤" },
  { name: "Shop Thời Trang Hà Nội", type: "Shop Online", avatar: "🏪" },
  { name: "Reviewer Công Nghệ", type: "Influencer", avatar: "🎥" },
  { name: "Đại Lý Minh Khoa", type: "Đại lý", avatar: "🏆" },
  { name: "Fashion Store VN", type: "Shop Online", avatar: "🛍️" },
  { name: "Beauty Blogger Linh", type: "Influencer", avatar: "💅" },
  { name: "Startup Công Nghệ", type: "Doanh nghiệp", avatar: "🚀" },
  { name: "Shop Mẹ Và Bé", type: "Shop Online", avatar: "👶" },
  { name: "Fitness Coach Hùng", type: "Influencer", avatar: "💪" },
  { name: "Restaurant Sài Gòn", type: "Doanh nghiệp", avatar: "🍽️" },
  { name: "Travel Blogger An", type: "Influencer", avatar: "✈️" },
  { name: "Shop Mỹ Phẩm Hàn", type: "Shop Online", avatar: "💄" },
  { name: "Gym Center HN", type: "Doanh nghiệp", avatar: "🏋️" },
  { name: "Fashionista Linh", type: "Influencer", avatar: "👗" },
  { name: "Shop Đồ Chơi", type: "Shop Online", avatar: "🎮" },
  { name: "Marketing Agency", type: "Doanh nghiệp", avatar: "📊" },
  { name: "Food Reviewer Nam", type: "Influencer", avatar: "🍜" },
  { name: "Shop Giày Dép", type: "Shop Online", avatar: "👟" },
  { name: "Yoga Instructor", type: "Influencer", avatar: "🧘" },
  { name: "Shop Điện Thoại", type: "Shop Online", avatar: "📱" },
  { name: "Coffee Shop HN", type: "Doanh nghiệp", avatar: "☕" },
  { name: "Music Producer", type: "Influencer", avatar: "🎵" },
  { name: "Shop Nội Thất", type: "Shop Online", avatar: "🛋️" },
  { name: "Photographer Pro", type: "Influencer", avatar: "📸" },
  { name: "Shop Phụ Kiện", type: "Shop Online", avatar: "💎" },
  { name: "Dance Studio", type: "Doanh nghiệp", avatar: "💃" },
  { name: "Gaming Streamer", type: "Influencer", avatar: "🎮" },
];

const SERVICES = [
  // TikTok Services (15)
  { text: "5K View Livestream TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa tăng" },
  { text: "10K Tim Video TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa tăng" },
  { text: "2K Follow TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa mua" },
  { text: "1K Comment TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa seeding" },
  { text: "50K View Video TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa tăng" },
  { text: "100 Like TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa tăng" },
  { text: "Share Video TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa chia sẻ" },
  { text: "Save Video TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa lưu" },
  { text: "Tăng Mắt Live TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa tăng" },
  { text: "Follow TikTok Việt", platform: "tiktok", color: "#25F4EE", action: "vừa tăng" },
  { text: "Like Comment TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa tăng" },
  { text: "View Story TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa xem" },
  { text: "Tương Tác TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa tăng" },
  { text: "Booking KOC TikTok", platform: "tiktok", color: "#25F4EE", action: "vừa đặt" },
  { text: "Seeding TikTok Shop", platform: "tiktok", color: "#25F4EE", action: "vừa seeding" },
  
  // Facebook Services (12)
  { text: "2K Like Page Facebook", platform: "facebook", color: "#1877F2", action: "vừa mua" },
  { text: "5K Follow Facebook", platform: "facebook", color: "#1877F2", action: "vừa tăng" },
  { text: "1K Comment Facebook", platform: "facebook", color: "#1877F2", action: "vừa seeding" },
  { text: "10K View Reels Facebook", platform: "facebook", color: "#1877F2", action: "vừa tăng" },
  { text: "Like Bài Viết FB", platform: "facebook", color: "#1877F2", action: "vừa thích" },
  { text: "Share Bài Viết FB", platform: "facebook", color: "#1877F2", action: "vừa chia sẻ" },
  { text: "Member Group Facebook", platform: "facebook", color: "#1877F2", action: "vừa tham gia" },
  { text: "Follow Profile FB", platform: "facebook", color: "#1877F2", action: "vừa theo dõi" },
  { text: "View Video Facebook", platform: "facebook", color: "#1877F2", action: "vừa xem" },
  { text: "Reaction Facebook", platform: "facebook", color: "#1877F2", action: "vừa thả tim" },
  { text: "Check-in Facebook", platform: "facebook", color: "#1877F2", action: "vừa check-in" },
  { text: "Event Facebook", platform: "facebook", color: "#1877F2", action: "vừa tham gia" },
  
  // Instagram Services (8)
  { text: "5K Follower Instagram", platform: "instagram", color: "#E1306C", action: "vừa tăng" },
  { text: "10K Like Instagram", platform: "instagram", color: "#E1306C", action: "vừa tăng" },
  { text: "1K Comment Instagram", platform: "instagram", color: "#E1306C", action: "vừa seeding" },
  { text: "View Story Instagram", platform: "instagram", color: "#E1306C", action: "vừa xem" },
  { text: "View Reels Instagram", platform: "instagram", color: "#E1306C", action: "vừa tăng" },
  { text: "Save Post Instagram", platform: "instagram", color: "#E1306C", action: "vừa lưu" },
  { text: "Share Instagram", platform: "instagram", color: "#E1306C", action: "vừa chia sẻ" },
  { text: "Instagram Impressions", platform: "instagram", color: "#E1306C", action: "vừa tăng" },
  
  // YouTube Services (7)
  { text: "1K Subscribe YouTube", platform: "youtube", color: "#FF0000", action: "vừa tăng" },
  { text: "10K View Video YouTube", platform: "youtube", color: "#FF0000", action: "vừa tăng" },
  { text: "1K Like YouTube", platform: "youtube", color: "#FF0000", action: "vừa thích" },
  { text: "Comment YouTube", platform: "youtube", color: "#FF0000", action: "vừa bình luận" },
  { text: "Share Video YouTube", platform: "youtube", color: "#FF0000", action: "vừa chia sẻ" },
  { text: "Watch Time YouTube", platform: "youtube", color: "#FF0000", action: "vừa tăng" },
  { text: "Live View YouTube", platform: "youtube", color: "#FF0000", action: "vừa xem" },
  
  // Other Services (5)
  { text: "Tài khoản ChatGPT Plus", platform: "chatgpt", color: "#10A37F", action: "vừa mua" },
  { text: "Netflix Premium", platform: "chatgpt", color: "#10A37F", action: "vừa mua" },
  { text: "Spotify Premium", platform: "chatgpt", color: "#10A37F", action: "vừa mua" },
  { text: "Canva Pro", platform: "chatgpt", color: "#10A37F", action: "vừa mua" },
  { text: "Proxy Cao Cấp", platform: "chatgpt", color: "#10A37F", action: "vừa mua" },
];

const TIME_OPTIONS = ["Vừa xong", "1 phút trước", "2 phút trước", "5 phút trước"];

const PLATFORM_ICONS: Record<string, string> = {
  tiktok: "T",
  facebook: "F",
  instagram: "I",
  youtube: "Y",
  chatgpt: "C",
};

const PLATFORM_GRADIENTS: Record<string, string> = {
  tiktok: "from-[#FE2C55] to-[#25F4EE]",
  facebook: "from-[#1877F2] to-[#42A5F5]",
  instagram: "from-[#E1306C] to-[#F77737]",
  youtube: "from-[#FF0000] to-[#FF6B6B]",
  chatgpt: "from-[#10A37F] to-[#0E8F6E]",
};

interface Badge {
  id: string;
  customer: typeof CUSTOMER_PROFILES[0];
  service: typeof SERVICES[0];
  time: string;
}

export default function DynamicBadges() {
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);
  const lastCustomerRef = useRef<string>("");
  const lastServiceRef = useRef<string>("");
  const lastSideRef = useRef<'left' | 'right'>('right');

  const generateBadge = useCallback((): Badge => {
    let customer;
    let service;
    
    // Avoid showing exact same customer or service twice in a row
    do {
      customer = CUSTOMER_PROFILES[Math.floor(Math.random() * CUSTOMER_PROFILES.length)];
    } while (customer.name === lastCustomerRef.current);
    
    do {
      service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
    } while (service.text === lastServiceRef.current);

    lastCustomerRef.current = customer.name;
    lastServiceRef.current = service.text;

    const time = TIME_OPTIONS[Math.floor(Math.random() * TIME_OPTIONS.length)];
    return { id: Math.random().toString(36).substring(2, 11), customer, service, time };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const cycleNotification = () => {
      // Determine next side (alternate)
      const nextSide = lastSideRef.current === 'left' ? 'right' : 'left';
      lastSideRef.current = nextSide;

      // Show notification
      const badge = generateBadge();
      setCurrentBadge(badge);
      setActiveSide(nextSide);

      // Visible for 6-8 seconds
      const lifespan = 6000 + Math.random() * 2000;
      
      timeoutId = setTimeout(() => {
        // Hide notification
        setActiveSide(null);
        
        // Wait 12-20 seconds before next one
        const delay = 12000 + Math.random() * 8000;
        timeoutId = setTimeout(cycleNotification, delay);
      }, lifespan);
    };

    // Initial delay before first badge
    timeoutId = setTimeout(cycleNotification, 3000);

    return () => clearTimeout(timeoutId);
  }, [generateBadge]);

  return (
    <>
      {/* Left Side Container */}
      <div className="absolute left-4 lg:left-8 top-1/4 z-20 hidden lg:block pointer-events-none">
        <AnimatePresence mode="wait">
          {activeSide === 'left' && currentBadge && (
            <BadgeComponent key={currentBadge.id} badge={currentBadge} side="left" />
          )}
        </AnimatePresence>
      </div>

      {/* Right Side Container */}
      <div className="absolute right-4 lg:right-8 top-1/3 z-20 hidden lg:block pointer-events-none">
        <AnimatePresence mode="wait">
          {activeSide === 'right' && currentBadge && (
            <BadgeComponent key={currentBadge.id} badge={currentBadge} side="right" />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function BadgeComponent({ badge, side }: { badge: Badge, side: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ 
        type: "spring",
        damping: 20,
        stiffness: 100,
        opacity: { duration: 0.6 }
      }}
      className="bg-[var(--surface)] rounded-2xl p-4 w-[260px] shadow-lg border border-[var(--border)]"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${PLATFORM_GRADIENTS[badge.service.platform]} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md border border-white/30`}>
          <span className="text-white text-xs font-black drop-shadow-sm">{PLATFORM_ICONS[badge.service.platform]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold text-[var(--text-primary)] truncate mb-0.5 uppercase tracking-wide">
            {badge.customer.name}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] leading-[1.4]">
            {badge.service.action} <span className="font-bold underline decoration-2 underline-offset-2" style={{ color: badge.service.color, textUnderlineOffset: '3px', textDecorationColor: `${badge.service.color}40` }}>{badge.service.text}</span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-2 font-medium flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[var(--border)]"></span>
            {badge.time}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
