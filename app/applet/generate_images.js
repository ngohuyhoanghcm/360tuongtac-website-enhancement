const fs = require('fs');
const path = require('path');

const prompts = {
  'thuat-toan-tiktok-2025': 'Glowing 3D AI brain with TikTok nodes, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'tai-sao-livestream-tiktok-it-nguoi-xem': 'Minimalist 3D stage with empty glass chairs, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'seeding-la-gi': 'Digital garden with watering social icons, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'cach-tang-tuong-tac-tiktok-hieu-qua': 'Rocket lifting off neon bar charts, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'tiktok-shop-moi-khong-co-don': 'Glowing 3D shopping cart with floating orders, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'tin-hieu-tiktok-la-gi': 'Abstract 3D waves of binary code morphing into social media icons, 3D Isometric, Deep Navy background, Neon Gradients, tech, octane render',
  'viewer-that-vs-viewer-ao': 'Magnifying glass inspecting silhouettes vs robots, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'huong-dan-seeding-tiktok-shop-tu-a-z': '3D blueprint path to a trophy, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'chon-dich-vu-smm-uy-tin-khong-bi-lua': '3D shield protecting social media logos from glitches, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech',
  'case-study-tang-viewer-tiktok': '3D 25x glowing typography on dashboard, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'case-study-tiktok-shop-thanh-cong': '3D store interior with Sold Out tags, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'so-sanh-dich-vu-tang-viewer-tiktok': '3D scale balancing diamond vs cheap robots, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech',
  'dich-vu-smm-nen-chon-loai-nao': '3D toolbox filled with social icons, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech',
  'cap-nhat-thuat-toan-tiktok-thang-4-2026': 'Futuristic 3D calendar with update nodes, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech',
  'seeding-comment-tiktok-hieu-qua': '3D floating digital books with comments, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech'
};

async function generateImages() {
  const dir = path.join(process.cwd(), 'public', 'images', 'blog');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const [slug, prompt] of Object.entries(prompts)) {
    const encodedPrompt = encodeURIComponent(prompt);
    // Request WebP format explicitly
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&format=webp`;
    console.log(`Downloading ${slug}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const buffer = await res.arrayBuffer();
      const filePath = path.join(dir, `${slug}.webp`);
      fs.writeFileSync(filePath, Buffer.from(buffer));
      
      // Verify it's actually WebP
      const header = Buffer.from(buffer).slice(0, 4).toString('hex');
      if (header === '52494646') {
        console.log(`✅ Saved ${slug}.webp (${buffer.byteLength} bytes) - Valid WebP`);
      } else {
        console.log(`⚠️  Saved ${slug}.webp but header is ${header} (not WebP)`);
      }
    } catch (err) {
      console.error(`Failed to download ${slug}:`, err.message);
    }
  }
}

generateImages();
