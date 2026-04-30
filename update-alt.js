const fs = require('fs');
const path = require('path');

const altMap = {
  'thuat-toan-tiktok-2025': 'Hình ảnh 3D Isometric Cyber-Clean não bộ AI phát sáng minh họa thuật toán TikTok 2025 từ 360TuongTac',
  'tai-sao-livestream-tiktok-it-nguoi-xem': 'Hình ảnh 3D Isometric sân khấu livestream phòng kính trống vắng minh họa nguyên nhân livestream TikTok ít người xem từ 360TuongTac',
  'seeding-la-gi': 'Hình ảnh 3D Isometric khu vườn kỹ thuật số neon minh họa khái niệm seeding là gì từ 360TuongTac',
  'cach-tang-tuong-tac-tiktok-hieu-qua': 'Hình ảnh 3D Isometric tên lửa cất cánh từ biểu đồ tăng trưởng minh họa cách tăng tương tác TikTok hiệu quả từ 360TuongTac',
  'tiktok-shop-moi-khong-co-don': 'Hình ảnh 3D Isometric giỏ hàng phát sáng neon minh họa giải pháp cho TikTok shop mới không có đơn từ 360TuongTac',
  'tin-hieu-tiktok-la-gi': 'Hình ảnh 3D Isometric sóng mã code nhị phân minh họa tín hiệu TikTok là gì từ 360TuongTac',
  'viewer-that-vs-viewer-ao': 'Hình ảnh 3D Isometric kính lúp soi xét người dùng thật và robot minh họa viewer thật vs viewer ảo từ 360TuongTac',
  'huong-dan-seeding-tiktok-shop-tu-a-z': 'Hình ảnh 3D Isometric bản đồ đường đi đến cúp vàng minh họa hướng dẫn seeding TikTok Shop từ A-Z từ 360TuongTac',
  'chon-dich-vu-smm-uy-tin-khong-bi-lua': 'Hình ảnh 3D Isometric khiên bảo vệ phản quang minh họa cách chọn dịch vụ SMM uy tín không bị lừa từ 360TuongTac',
  'case-study-tang-viewer-tiktok': 'Hình ảnh 3D Isometric màn hình dashboard số 25x neon minh họa case study tăng viewer TikTok từ 360TuongTac',
  'case-study-tiktok-shop-thanh-cong': 'Hình ảnh 3D Isometric hộp không gian với tag sold out minh họa case study TikTok Shop thành công từ 360TuongTac',
  'so-sanh-dich-vu-tang-viewer-tiktok': 'Hình ảnh 3D Isometric chiếc cân thăng bằng viên kim cương và robot minh họa so sánh dịch vụ tăng viewer TikTok từ 360TuongTac',
  'dich-vu-smm-nen-chon-loai-nao': 'Hình ảnh 3D Isometric hộp công cụ chứa biểu tượng mạng xã hội phát sáng minh họa dịch vụ SMM nên chọn loại nào từ 360TuongTac',
  'cap-nhat-thuat-toan-tiktok-thang-4-2026': 'Hình ảnh 3D Isometric lịch tương lai kính cường lực minh họa cập nhật thuật toán TikTok tháng 4 2026 từ 360TuongTac',
  'seeding-comment-tiktok-hieu-qua': 'Hình ảnh 3D Isometric màn hình gõ phím ảo minh họa cách seeding comment TikTok hiệu quả từ 360TuongTac'
};

const dir = path.join(process.cwd(), 'data', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const f of files) {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  
  const slug = f.replace('.ts', '');
  if (altMap[slug]) {
    content = content.replace(/alt:\s*['"][^'"]+['"]/, `alt: '${altMap[slug]}'`);
    content = content.replace(/featuredImage:\s*['"][^'"]+['"]/, `featuredImage: '/images/blog/${slug}.webp'`);
    fs.writeFileSync(p, content);
  }
}
console.log('Update complete');
