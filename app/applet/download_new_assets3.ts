import * as fs from 'fs';
import * as path from 'path';

const outDir = path.join(process.cwd(), 'public', 'images', 'blog');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const tasks = [
  { slug: 'thuat-toan-tiktok-2025', desc: 'Glowing 3D AI brain with TikTok nodes' },
  { slug: 'tai-sao-livestream-tiktok-it-nguoi-xem', desc: 'Minimalist 3D stage with empty glass chairs' },
  { slug: 'seeding-la-gi', desc: 'Digital garden with watering social icons' },
  { slug: 'cach-tang-tuong-tac-tiktok-hieu-qua', desc: 'Rocket lifting off neon bar charts' },
  { slug: 'tiktok-shop-moi-khong-co-don', desc: 'Glowing 3D shopping cart with floating orders' },
  { slug: 'tin-hieu-tiktok-la-gi', desc: 'Abstract 3D waves of binary code morphing into icons' },
  { slug: 'viewer-that-vs-viewer-ao', desc: 'Magnifying glass inspecting silhouettes vs robots' },
  { slug: 'huong-dan-seeding-tiktok-shop-tu-a-z', desc: '3D blueprint path to a trophy' },
  { slug: 'chon-dich-vu-smm-uy-tin-khong-bi-lua', desc: '3D shield protecting logos from glitches' },
  { slug: 'case-study-tang-viewer-tiktok', desc: '3D 25x glowing typography on dashboard' },
  { slug: 'case-study-tiktok-shop-thanh-cong', desc: '3D store interior with Sold Out tags' },
  { slug: 'so-sanh-dich-vu-tang-viewer-tiktok', desc: '3D scale balancing diamond vs cheap bots' },
  { slug: 'dich-vu-smm-nen-chon-loai-nao', desc: '3D toolbox filled with social icons' },
  { slug: 'cap-nhat-thuat-toan-tiktok-thang-4-2026', desc: 'Futuristic 3D calendar with update nodes' },
  { slug: 'seeding-comment-tiktok-hieu-qua', desc: '3D floating digital books with comments' }
];

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  for (const task of tasks) {
    const dest = path.join(outDir, `${task.slug}.webp`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`Skipping ${task.slug}, already exists.`);
      continue;
    }

    const prompt = encodeURIComponent(`${task.desc}, 3D Isometric, Deep Navy background, Neon Gradients, high-end tech textures`);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&nologo=true`;
    
    let success = false;
    let retries = 3;
    while (!success && retries > 0) {
      console.log(`Fetching ${task.slug}... (Retries left: ${retries - 1})`);
      try {
        const res = await fetch(url);
        if (res.status === 429) {
          console.log(`Rate limited! Sleeping for 5s...`);
          await sleep(5000);
          retries--;
          continue;
        }
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log(`Saved ${task.slug}`);
        success = true;
      } catch (e) {
        console.error(`Failed ${task.slug}`, e);
        retries--;
        await sleep(2000);
      }
    }
    
    if (!success) {
      // Fallback to a placeholder image from Unsplash
      console.log(`Using fallback image for ${task.slug}`);
      try {
        const fall = await fetch('https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=1200&h=630&fit=crop');
        const buffer = await fall.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
      } catch(err) {
        console.error("Fallback failed too");
      }
    }
  }
}

run().catch(console.error);
