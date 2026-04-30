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
  const outDir = path.join('/', 'public', 'images', 'blog');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const slug of slugs) {
    const dest = path.join(outDir, `${slug}.webp`);
    if (fs.existsSync(dest)) {
      console.log(`${slug} already exists`);
      // continue;
    }
    
    const prompt = encodeURIComponent(`${slug}, 3D Isometric, Cyber-Clean Minimalism, Deep Navy background, signature gradients orange to pink`);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&nologo=true`;
    
    console.log(`Fetching ${slug}...`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buffer));
      console.log(`Saved ${slug}`);
    } catch (e) {
      console.log(`Failed ${slug}. Falling back to Unsplash.`);
      try {
        const fall = await fetch('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=630&fit=crop');
        const buffer = await fall.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log(`Saved Unsplash for ${slug}`);
      } catch(err) {
        console.log(`Even Unsplash failed for ${slug}`);
      }
    }
    await sleep(2000); // 2 second delay
  }
}

run();
