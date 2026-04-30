const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data', 'blog');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));

// 1. Map to descriptions for alt text
const descriptions = {
  'thuat-toan-tiktok-2025': 'Hình ảnh 3D Isometric bộ não AI phát sáng với các node mạng lưới TikTok',
  'tai-sao-livestream-tiktok-it-nguoi-xem': 'Hình ảnh 3D Isometric sân khấu tối giản với những chiếc ghế thủy tinh trống rỗng',
  'seeding-la-gi': 'Hình ảnh 3D Isometric khu vườn kỹ thuật số đang được tưới bởi các biểu tượng mạng xã hội',
  'cach-tang-tuong-tac-tiktok-hieu-qua': 'Hình ảnh 3D Isometric tên lửa cất cánh trên nền biểu đồ cột neon',
  'tiktok-shop-moi-khong-co-don': 'Hình ảnh 3D Isometric giỏ hàng phát sáng cùng các đơn hàng bay lơ lửng',
  'tin-hieu-tiktok-la-gi': 'Hình ảnh 3D Isometric sóng mã nhị phân trừu tượng biến đổi thành biểu tượng',
  'viewer-that-vs-viewer-ao': 'Hình ảnh 3D Isometric kính lúp kiểm tra bóng người thật và robot',
  'huong-dan-seeding-tiktok-shop-tu-a-z': 'Hình ảnh 3D Isometric bản thiết kế con đường dẫn đến chiếc cúp vàng',
  'chon-dich-vu-smm-uy-tin-khong-bi-lua': 'Hình ảnh 3D Isometric chiếc khiên bảo vệ các logo khỏi hiện tượng nhiễu sóng',
  'case-study-tang-viewer-tiktok': 'Hình ảnh 3D Isometric chữ 25x phát sáng rực rỡ trên bảng điều khiển',
  'case-study-tiktok-shop-thanh-cong': 'Hình ảnh 3D Isometric bên trong cửa hàng với các nhãn Sold Out',
  'so-sanh-dich-vu-tang-viewer-tiktok': 'Hình ảnh 3D Isometric chiếc cân thăng bằng giữa viên kim cương đá quý và bot',
  'dich-vu-smm-nen-chon-loai-nao': 'Hình ảnh 3D Isometric hộp công cụ chứa các biểu tượng mạng xã hội phát sáng',
  'cap-nhat-thuat-toan-tiktok-thang-4-2026': 'Hình ảnh 3D Isometric tờ lịch tương lai với các điểm cập nhật',
  'seeding-comment-tiktok-hieu-qua': 'Hình ảnh 3D Isometric những cuốn sách kỹ thuật số bay lơ lửng kèm bình luận'
};

for (const file of files) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // get slug
  const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];

  // get title
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
  const title = titleMatch ? titleMatch[1] : slug;

  // fix authors
  // replace author: '...' with author: '360TuongTac Team'
  content = content.replace(/author:\s*['"][^'"]+['"]/, `author: '360TuongTac Team'`);

  // replace authorImage with 360TuongTac logo or a standard image
  // Let's use the local logo or standard avatar
  content = content.replace(/authorImage:\s*['"][^'"]+['"]/, `authorImage: '/logo.png'`);

  const desc = descriptions[slug] || 'Hình ảnh 3D Isometric minh họa';
  const altText = `${desc} - ${title} - 360TuongTac`;

  // Fix alt
  content = content.replace(/alt:\s*['"][^'"]+['"](.*)/, `alt: '${altText}'$1`);

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Fixed authors and alt texts.');
