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

async function run() {
  const chunks = [];
  for (let i = 0; i < tasks.length; i += 3) {
    chunks.push(tasks.slice(i, i + 3));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(async (task) => {
      const dest = path.join(outDir, `${task.slug}.webp`);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
        console.log(`Skipping ${task.slug}, already exists.`);
        return;
      }
      const prompt = encodeURIComponent(`${task.desc}, 3D Isometric, Deep Navy background, Neon Gradients, high-end tech textures`);
      const url = `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&nologo=true`;
      
      console.log(`Fetching ${task.slug}...`);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log(`Saved ${task.slug}`);
      } catch (e) {
        console.error(`Failed ${task.slug}`, e);
      }
    }));
  }

  const dataDir = path.join(process.cwd(), 'data', 'blog');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));

  let updatedCount = 0;
  for (const filename of files) {
    const filePath = path.join(dataDir, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
    if (!slugMatch) continue;
    const slug = slugMatch[1];

    const featuredMatch = content.match(/featuredImage:\s*['"]([^'"]+)['"]/);
    if (featuredMatch) {
      if (featuredMatch[1] !== `/images/blog/${slug}.webp`) {
        content = content.replace(featuredMatch[0], `featuredImage: '/images/blog/${slug}.webp'`);
      }
    }

    const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
    if (titleMatch) {
        const title = titleMatch[1];
        const altMatch = content.match(/alt:\s*['"]([^'"]+)['"]/);
        if (altMatch) {
            content = content.replace(altMatch[0], `alt: 'Minh họa 3D cho bài viết: ${title}'`);
        } else {
            content = content.replace(/featuredImage:/, `alt: 'Minh họa 3D cho bài viết: ${title}',\n  featuredImage:`);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
  console.log(`Updated ${updatedCount} data files.`);
}

run().catch(console.error);
