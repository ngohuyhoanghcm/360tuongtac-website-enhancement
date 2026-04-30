const fs = require('fs');
const path = require('path');

const slugs = [
  'cach-tang-tuong-tac-tiktok-hieu-qua',
  'cap-nhat-thuat-toan-tiktok-thang-4-2026',
  'case-study-tang-viewer-tiktok',
  'case-study-tiktok-shop-thanh-cong',
  'chon-dich-vu-smm-uy-tin-khong-bi-lua',
  'dich-vu-smm-nen-chon-loai-nao',
  'huong-dan-seeding-tiktok-shop-tu-a-z',
  'seeding-comment-tiktok-hieu-qua',
  'seeding-la-gi',
  'so-sanh-dich-vu-tang-viewer-tiktok'
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const outDir = '/public/images/blog';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const slug of slugs) {
    const dest = path.join(outDir, `${slug}.webp`);
    if (fs.existsSync(dest)) {
      console.log(`${slug} already exists`);
      // continue;
    }
    
    // We'll use a fast Unsplash placeholder to guarantee success since Pollinations was timing out
    const seed = encodeURIComponent(slug);
    console.log(`Fetching ${slug}...`);
    try {
      const res = await fetch(`https://picsum.photos/seed/${seed}/1200/630.webp`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buffer));
      console.log(`Saved ${slug}`);
    } catch (e) {
      console.log(`Failed ${slug}.`, e);
    }
    await sleep(500);
  }
}

run();
