const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'data', 'services');

const officialUrls = {
  'tang-mat-livestream-tiktok.ts': 'https://360tuongtac.com/service/tiktok/livestream-views',
  'seeding-comment-tiktok.ts': 'https://360tuongtac.com/service/tiktok/custom-comment',
  'tang-follow-tiktok.ts': 'https://360tuongtac.com/service/tiktok/tiktok-followers',
  'tang-view-video-tiktok.ts': 'https://360tuongtac.com/service/tiktok/tiktok-views',
  'seeding-danh-gia-tiktok-shop.ts': 'https://360tuongtac.com/service/tiktok/tiktok-likes',
  'tang-like-facebook.ts': 'https://360tuongtac.com/service/facebook/tang-like',
  'tang-mat-livestream-facebook.ts': 'https://360tuongtac.com/service/facebook/tang-mat-livestream',
  'tang-member-group-facebook.ts': 'https://360tuongtac.com/service/facebook/tang-member',
  'tang-follow-instagram.ts': 'https://360tuongtac.com/service/instagram/instagram-followers',
  'tang-sub-youtube.ts': 'https://360tuongtac.com/service/youtube/youtube-subscribes',
  'traffic-website.ts': 'https://360tuongtac.com/service/website/traffic'
}

fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts')).forEach(f => {
  const p = path.join(servicesDir, f);
  let content = fs.readFileSync(p, 'utf8');
  
  const targetUrl = officialUrls[f];
  if(targetUrl) {
     content = content.replace(/productUrl:\s*['"][^'"]+['"]/g, `productUrl: '${targetUrl}'`);
     fs.writeFileSync(p, content);
     console.log(`Updated ${f} with ${targetUrl}`);
  }
});
