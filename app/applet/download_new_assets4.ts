import * as fs from 'fs';
import * as path from 'path';

const outDir = path.join(process.cwd(), 'public', 'images', 'blog');

const tasks = [
  { slug: 'tin-hieu-tiktok-la-gi', desc: 'Abstract 3D waves of binary code morphing into icons' },
  { slug: 'viewer-that-vs-viewer-ao', desc: 'Magnifying glass inspecting silhouettes vs robots' },
  { slug: 'chon-dich-vu-smm-uy-tin-khong-bi-lua', desc: '3D shield protecting logos from glitches' },
  { slug: 'case-study-tiktok-shop-thanh-cong', desc: '3D store interior with Sold Out tags' },
  { slug: 'so-sanh-dich-vu-tang-viewer-tiktok', desc: '3D scale balancing diamond vs cheap bots' },
];

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  for (const task of tasks) {
    const dest = path.join(outDir, `${task.slug}.webp`);
    
    // Check if it's the fallback image (Unsplash image is exactly 43048 bytes or similar? Let's just overwrite them to be sure)
    const prompt = encodeURIComponent(`${task.desc}, 3D Isometric, Deep Navy background, Neon Gradients, high-end tech textures`);
    const seed = Math.floor(Math.random() * 100000);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&nologo=true&seed=${seed}`;
    
    let success = false;
    let retries = 5;
    while (!success && retries > 0) {
      console.log(`Fetching ${task.slug}... (Retries left: ${retries - 1})`);
      try {
        const res = await fetch(url);
        if (res.status === 429) {
          console.log(`Rate limited! Sleeping for 10s...`);
          await sleep(10000);
          retries--;
          continue;
        }
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log(`Saved ${task.slug} from Pollinations`);
        success = true;
      } catch (e) {
        console.error(`Failed ${task.slug}`, e);
        retries--;
        await sleep(5000);
      }
    }
  }
}

run().catch(console.error);
