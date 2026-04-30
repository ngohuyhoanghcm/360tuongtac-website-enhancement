export interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  authorImage?: string;
  featuredImage: string;
  alt: string;
  slug: string;
  featured?: boolean;
  readTime?: string;
  tags?: string[];
  relatedServices?: string[];
  relatedPosts?: string[];
  chart?: {
    type: 'Bar' | 'Area' | 'Pie';
    data: any[];
    xAxisKey?: string;
    dataKey: string;
    nameKey?: string;
    title?: string;
    description?: string;
  };
}

import { thuatToanTiktok2025 } from '@/data/blog/thuat-toan-tiktok-2025';
import { taiSaoLivestreamTiktokItNguoiXem } from '@/data/blog/tai-sao-livestream-tiktok-it-nguoi-xem';
import { cachTangTuongTacTiktokHieuQua } from '@/data/blog/cach-tang-tuong-tac-tiktok-hieu-qua';
import { seedingLaGi } from '@/data/blog/seeding-la-gi';
import { seedingCommentTiktokHieuQua } from '@/data/blog/seeding-comment-tiktok-hieu-qua';
import { chonDichVuSmmUyTinKhongBiLua } from '@/data/blog/chon-dich-vu-smm-uy-tin-khong-bi-lua';
import { tinHieuTiktokLaGi } from '@/data/blog/tin-hieu-tiktok-la-gi';
import { tiktokShopMoiKhongCoDon } from '@/data/blog/tiktok-shop-moi-khong-co-don';
import { capNhatThuatToanTiktokThang4DieuChinh } from '@/data/blog/cap-nhat-thuat-toan-tiktok-thang-4-2026';
import { viewerThatVsViewerAo } from '@/data/blog/viewer-that-vs-viewer-ao';
import { huongDanSeedingTiktokShopTuAZ } from '@/data/blog/huong-dan-seeding-tiktok-shop-tu-a-z';
import { caseStudyTangViewerTiktok } from '@/data/blog/case-study-tang-viewer-tiktok';
import { caseStudyTiktokShopThanhCong } from '@/data/blog/case-study-tiktok-shop-thanh-cong';
import { soSanhDichVuTangViewerTiktok } from '@/data/blog/so-sanh-dich-vu-tang-viewer-tiktok';
import { dichVuSmmNenChonLoaiNao } from '@/data/blog/dich-vu-smm-nen-chon-loai-nao';

export const BLOG_POSTS: BlogPost[] = [
  thuatToanTiktok2025,
  taiSaoLivestreamTiktokItNguoiXem,
  seedingLaGi,
  cachTangTuongTacTiktokHieuQua,
  seedingCommentTiktokHieuQua,
  chonDichVuSmmUyTinKhongBiLua,
  tinHieuTiktokLaGi,
  tiktokShopMoiKhongCoDon,
  capNhatThuatToanTiktokThang4DieuChinh,
  viewerThatVsViewerAo,
  huongDanSeedingTiktokShopTuAZ,
  caseStudyTangViewerTiktok,
  caseStudyTiktokShopThanhCong,
  soSanhDichVuTangViewerTiktok,
  dichVuSmmNenChonLoaiNao,
];
