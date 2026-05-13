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
  published?: boolean;     // Publish status - true = published, false = unpublished/draft
  readTime?: string;
  tags?: string[];
  relatedServices?: string[];
  relatedPosts?: string[];
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  seoScore?: number;
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

// Auto-generated from data/blog/ directory
// DO NOT EDIT MANUALLY - Run: npx tsx scripts/rebuild-blog-index.ts

































import { cachTangTuongTacTiktokHieuQua } from './cach-tang-tuong-tac-tiktok-hieu-qua';
import { capNhatThuatToanTiktokThang42026 } from './cap-nhat-thuat-toan-tiktok-thang-4-2026';
import { caseStudyTangViewerTiktok } from './case-study-tang-viewer-tiktok';
import { caseStudyTiktokShopThanhCong } from './case-study-tiktok-shop-thanh-cong';
import { chonDichVuSmmUyTinKhongBiLua } from './chon-dich-vu-smm-uy-tin-khong-bi-lua';
import { dichVuSmmNenChonLoaiNao } from './dich-vu-smm-nen-chon-loai-nao';
import { huongDanSeedingTiktokShopTuAZ } from './huong-dan-seeding-tiktok-shop-tu-a-z';
import { seedingCommentTiktokHieuQua } from './seeding-comment-tiktok-hieu-qua';
import { seedingLaGi } from './seeding-la-gi';
import { soSanhDichVuTangViewerTiktok } from './so-sanh-dich-vu-tang-viewer-tiktok';
import { taiSaoLivestreamTiktokItNguoiXem } from './tai-sao-livestream-tiktok-it-nguoi-xem';
import { thuatToanTiktok2025 } from './thuat-toan-tiktok-2025';
import { tiktokShopMoiKhongCoDon } from './tiktok-shop-moi-khong-co-don';
import { tinHieuTiktokLaGi } from './tin-hieu-tiktok-la-gi';
import { viewerThatVsViewerAo } from './viewer-that-vs-viewer-ao';

export const allBlogPosts: BlogPost[] = [
  cachTangTuongTacTiktokHieuQua,
  capNhatThuatToanTiktokThang42026,
  caseStudyTangViewerTiktok,
  caseStudyTiktokShopThanhCong,
  chonDichVuSmmUyTinKhongBiLua,
  dichVuSmmNenChonLoaiNao,
  huongDanSeedingTiktokShopTuAZ,
  seedingCommentTiktokHieuQua,
  seedingLaGi,
  soSanhDichVuTangViewerTiktok,
  taiSaoLivestreamTiktokItNguoiXem,
  thuatToanTiktok2025,
  tiktokShopMoiKhongCoDon,
  tinHieuTiktokLaGi,
  viewerThatVsViewerAo
];

// Alias for backwards compatibility
export const BLOG_POSTS: typeof allBlogPosts = allBlogPosts;

export default allBlogPosts;
