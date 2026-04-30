# 360TuongTac (grow.360tuongtac.com)
**Systemic Handover & Architectural Documentation**

---

## 1. PROJECT OVERVIEW & MISSION
* **Name:** 360TuongTac (grow.360tuongtac.com)
* **Parent Organization:** NextGen AI Solutions
* **Mission:** High-end SaaS for Technical Analysis and Social Growth (TechSignal VN). Empowering individuals and businesses to dominate social commerce algorithms through robust seeding, authentic interactions, and growth engineering.
* **Epoch:** 2026

## 2. TECH STACK & ARCHITECTURE
* **Frontend Core:** Next.js 15 (App Router), React 19, TypeScript (Strict Mode).
* **Styling & Motion:** Tailwind CSS v4, Framer Motion for highly kinetic and fluid transitions.
* **Architecture Strategy:** **Option A — "Modular Monolith + Queue"** (Startup Optimized). The frontend acts as an aggressive static-first edge cache, designed to scale limitlessly during traffic spikes while delegating background jobs to asynchronous queues.
* **Asset Strategy:** **Static Binary Asset Protocol**. Images are served locally from `/public/images/blog/` in `.webp` format to guarantee integrity without relying on external CDNs for core structural media.

## 3. THE "360 VIBE" DESIGN SYSTEM (UI/UX)
* **Visual Identity:** 3D Isometric / Cyber-Clean Minimalism. Bypassing flat design to create a tactile, high-tech, futuristic interface reminiscent of elite SaaS tools.
* **Color Palette:**
  * **Background:** Deep Navy (`#0a0a0f`) extending into pitch black (`#13121b`) for maximum contrast.
  * **Gradients (Signature):** Igniting from Electric Orange (`#FF8C00`) to Neon Pink (`#FF2E63`) to Deep Violet (`#8B5CF6`).
* **Core Components:**
  * **Glassmorphism:** Frost-glass containers (`bg-white/[0.03] backdrop-blur-xl border border-white/10`) to separate content without breaking spatial depth.
  * **Interactive Neon Glow:** Shadows (`shadow-[0_0_20px_rgba(255,140,0,0.15)]`) that react and scale to hover interactions.
  * **High-End Tech Textures:** Subtle mesh patterns and glowing topological lines mapping the background space.

## 4. DATA ENGINE (BLOG SYSTEM)
* **Data Structure:** Serverless and portable. Content lives natively inside the repository as statically typed TypeScript objects inside `data/blog/*.ts`.
* **Content Pipeline:** The build process natively weaves SEO, GEO (Generative Engine Optimization), and AEO (Answer Engine Optimization) into the HTML via JSON-LD schemas (`Article`, `BreadcrumbList`, `Organization`).
* **Image Logic:** Hero and featured images are rigidly standardized.
  * **Format/Size:** `1200x630px` `.webp` binary files. 
  * **Naming Convention:** Slugs directly map to binaries (e.g. `slug.webp`).
  * **Alt-Text Pattern:** Entity-First. Strict format: `"[3D Isometric Description] - [Topic Keyword] - 360TuongTac"`.

## 5. SUMMARY OF IMPLEMENTED WORK (AUDIT TRAIL)
During the "Clean Slate" deployment protocol, the following overarching systems were implemented:
1. **Static Binary Fix:** Refactored the broken dynamic image rendering (which caused UTF-8 corruption during fetching) into a robust, pre-downloaded static binary `.webp` system.
2. **Design Harmonization:** Hard-coded the "360 Vibe" (Glass panels, absolute neon orbs, deep UI contrast) across the Blog Index, Blog Detail, and Contact interfaces.
3. **SEO/AEO Masterclass:** Standardized `<Image>` rendering, structured JSON-LD schemas, and injected high-context, brand-authoritative Alt-texts for all 15 core articles to ensure immediate trust signaling to AI crawlers.
4. **Validation/Sanitization Check:** Re-wired Contact forms with robust server-side and client-side protection against XSS and spam.
5. **System Readiness:** Purged redundant scripts, validated Next.js `referrerPolicy` constraints, and ensured 0 zero build errors.

## 6. MAINTENANCE & SCALING GUIDE

### Adding New Blog Posts
1. Create a new file in `data/blog/new-slug.ts`.
2. Follow the established `BlogPost` interface pattern (Title, Slug, Category, Date, etc).
3. Set the `author` strictly to `360TuongTac Team` and `authorImage` to `/logo.png`.
4. Run the development server. Next.js will auto-index the new entry in the statically generated routes.

### Regenerating/Adding Binary Assets
**CRITICAL:** Never write images as `utf-8` strings, which corrupts WebP/JPEG binaries natively in Node.js.
When fetching new generation images (e.g., from Pollinations.ai):
```ts
// Always extract the ArrayBuffer and write cleanly
const res = await fetch(url);
const buffer = await res.arrayBuffer();
fs.writeFileSync('public/images/blog/new-slug.webp', Buffer.from(buffer));
```

### Performance Optimization Notes
* **Image Optimization:** We stripped out `unoptimized={true}`. The Next.js default built-in Image Optimization is deliberately active. Do not bypass it unless rendering external URLs that explicitly ban proxy loading.
* **Component Fetching:** To maximize TTFB (Time to First Byte), the landing page and blog details are natively SSR (Server-Side Rendered) or SSG (Static Site Generation). Keep hooks and `use client` isolated solely to the interactive islands (Forms, Sliders, Filters).
* **Caching:** Cache headers are controlled naturally via Next 15's default aggressive page-level caching. Upon structural deployment, Vercel/Cloud Run will invalidate the CDN edges automatically.
