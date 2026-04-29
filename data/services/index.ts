import { tangMatLivestreamTiktok } from './tang-mat-livestream-tiktok';
import { tangFollowTiktok } from './tang-follow-tiktok';
import { tangLikeTiktok } from './tang-like-tiktok';
import { tangViewVideoTiktok } from './tang-view-video-tiktok';
import { seedingCommentTiktok } from './seeding-comment-tiktok';
import { seedingDanhGiaTiktokShop } from './seeding-danh-gia-tiktok-shop';
import { tangLikeFacebook } from './tang-like-facebook';
import { tangSubYoutube } from './tang-sub-youtube';
import { tangMatLivestreamFacebook } from './tang-mat-livestream-facebook';
import { tangMemberGroupFacebook } from './tang-member-group-facebook';
import { tangFollowInstagram } from './tang-follow-instagram';
import { trafficWebsite } from './traffic-website';

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  platform: 'TikTok' | 'Facebook' | 'Instagram' | 'YouTube' | 'Website' | 'Khác';
  startingPrice: string;
  popular?: boolean;
  icon: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: '1',
    slug: 'tang-mat-livestream-tiktok',
    title: 'Tăng Mát Livestream TikTok',
    description: 'Duy trì số lượng người xem ổn định suốt buổi live, kích hoạt thuật toán đề xuất tự nhiên và tạo hiệu ứng đám đông.',
    category: 'Livestream',
    platform: 'TikTok',
    startingPrice: '50.000đ',
    popular: true,
    icon: 'Rocket'
  },
  {
    id: '2',
    slug: 'seeding-comment-tiktok',
    title: 'Seeding Comment TikTok',
    description: 'Điều hướng dư luận, tăng uy tín cho video và sản phẩm thông qua hệ thống bình luận mồi chuyên nghiệp.',
    category: 'Tương tác',
    platform: 'TikTok',
    startingPrice: '20.000đ',
    popular: true,
    icon: 'MessageSquare'
  },
  {
    id: '3',
    slug: 'tang-follow-tiktok',
    title: 'Tăng Follow TikTok',
    description: 'Xây dựng profile uy tín với hàng nghìn lượt theo dõi từ tài khoản thật, giúp tăng tỉ lệ chuyển đổi đơn hàng.',
    category: 'Follow',
    platform: 'TikTok',
    startingPrice: '100.000đ',
    icon: 'UserPlus'
  },
  {
    id: '4',
    slug: 'tang-view-video-tiktok',
    title: 'Tăng View Video TikTok',
    description: 'Kích hoạt thuật toán xu hướng, giúp video đạt triệu view nhanh chóng và tăng độ phủ thương hiệu.',
    category: 'Tương tác',
    platform: 'TikTok',
    startingPrice: '15.000đ',
    icon: 'Zap'
  },
  {
    id: '5',
    slug: 'seeding-danh-gia-tiktok-shop',
    title: 'Seeding Đánh Giá TikTok Shop',
    description: 'Tăng 5 sao kèm hình ảnh/video thật, xóa bỏ rào cản nghi ngờ và bùng nổ doanh số bán hàng.',
    category: 'Shop',
    platform: 'TikTok',
    startingPrice: '150.000đ',
    popular: true,
    icon: 'Star'
  },
  {
    id: '6',
    slug: 'tang-like-facebook',
    title: 'Tăng Like Fanpage/Post',
    description: 'Tăng lượt yêu thích cho bài viết và trang bán hàng, tạo niềm tin cho khách hàng mới khi ghé thăm cửa hàng.',
    category: 'Tương tác',
    platform: 'Facebook',
    startingPrice: '15.000đ',
    icon: 'ThumbsUp'
  },
  {
    id: '7',
    slug: 'tang-mat-livestream-facebook',
    title: 'Tăng Mắt Live Facebook',
    description: 'Giúp buổi livestream của bạn trông chuyên nghiệp và thu hút hơn với lượng mắt xem ổn định, không tụt.',
    category: 'Livestream',
    platform: 'Facebook',
    startingPrice: '40.000đ',
    icon: 'Play'
  },
  {
    id: '8',
    slug: 'tang-member-group-facebook',
    title: 'Tăng Member Group FB',
    description: 'Xây dựng cộng đồng lớn mạnh nhanh chóng, phù hợp cho việc seeding và bán hàng trong hội nhóm.',
    category: 'Cộng đồng',
    platform: 'Facebook',
    startingPrice: '200.000đ',
    icon: 'Users'
  },
  {
    id: '9',
    slug: 'tang-follow-instagram',
    title: 'Tăng Follow Instagram',
    description: 'Nâng tầm thương hiệu cá nhân hoặc shop thời trang trên Instagram với lượng fan hùng hậu.',
    category: 'Follow',
    platform: 'Instagram',
    startingPrice: '80.000đ',
    icon: 'Instagram'
  },
  {
    id: '10',
    slug: 'tang-sub-youtube',
    title: 'Tăng Subscribe YouTube',
    description: 'Đạt điều kiện bật kiếm tiền và tăng độ phủ cho kênh YouTube của bạn một cách an toàn.',
    category: 'Follow',
    platform: 'YouTube',
    startingPrice: '300.000đ',
    icon: 'Youtube'
  },
  {
    id: '11',
    slug: 'traffic-website',
    title: 'Tăng Traffic Website',
    description: 'Đẩy thứ hạng SEO và tăng uy tín website với nguồn traffic đa dạng, thời gian on-site cao.',
    category: 'Website',
    platform: 'Website',
    startingPrice: '500.000đ',
    icon: 'Globe'
  }
];

export const SERVICES_LIST = {
  'tang-mat-livestream-tiktok': tangMatLivestreamTiktok,
  'tang-follow-tiktok': tangFollowTiktok,
  'tang-like-tiktok': tangLikeTiktok,
  'tang-view-video-tiktok': tangViewVideoTiktok,
  'seeding-comment-tiktok': seedingCommentTiktok,
  'seeding-danh-gia-tiktok-shop': seedingDanhGiaTiktokShop,
  'tang-like-facebook': tangLikeFacebook,
  'tang-sub-youtube': tangSubYoutube,
  'tang-mat-livestream-facebook': tangMatLivestreamFacebook,
  'tang-member-group-facebook': tangMemberGroupFacebook,
  'tang-follow-instagram': tangFollowInstagram,
  'traffic-website': trafficWebsite,
};

export const ALL_SLUGS = Object.keys(SERVICES_LIST);

