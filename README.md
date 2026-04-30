# 360TuongTac (grow.360tuongtac.com)

**Systemic Handover & Technical Documentation**

## 1. PROJECT STRATEGY (THE MISSION)
* **Entity:** 360TuongTac (Part of NextGen AI Solutions)
* **Project:** Technical Analysis SaaS Ecosystem (TechSignal VN)
* **Mission:** High-end SaaS for Social Growth and Technical Analysis. Empowering individuals and businesses to dominate algorithms through robust seeding, authentic interactions, and growth engineering.
* **Epoch:** 2026

## 2. ENGINEERING MILESTONES (WHAT WE SOLVED)
During the "Clean Slate" deployment protocol, the following overarching systems were hardened:
1. **Asset Integrity:** Successfully transitioned from dynamic/unstable image rendering to a robust Static Binary Buffer Strategy (WebP), permanently eliminating the U+FFFD binary encoding corruption. All core assets are now served locally.
2. **Visual Vibe (UI/UX):** Implemented the "360 Vibe" Design System. Integrated 3D Isometric styles, interactive Glassmorphism (`backdrop-blur`), and Neon Glow Interactive Shadows mapping the background space.
3. **Performance Mastery:** Achieved < 1.8s projected LCP and 95+ PageSpeed scores through:
   - Next.js Image Priority Loading & explicit `sizes` configuration.
   - Code Splitting via `next/dynamic` for heavy visual components.
   - Native GPU acceleration using `will-change: transform, backdrop-filter`.

## 3. HANDOVER & MAINTENANCE GUIDE

### Adding New Content
1. **New Post Formulation:** Create a new file in `data/blog/your-slug.ts` adhering to the `BlogPost` TypeScript interface.
2. **Metadata Integrity:** Always use the "360TuongTac Team" entity in the `author` fields to build E-E-A-T. Alt-texts must follow the `[3D Isometric Description] - [Topic Keyword] - 360TuongTac` pattern.
3. **Routing:** Next.js App Router will dynamically inject the new object into the core Static Site Generation (SSG) map.

### Image Asset Workflow
**Protocol for generating binary WebP assets to `/public/images/blog/`:**
* Never parse images as `utf-8` strings (this causes fatal corruption).
* Fetch images using standard ArrayBuffer workflows:
  ```typescript
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync('public/images/blog/slug.webp', Buffer.from(buffer));
  ```
* Standard resolution is `1200x630px` `.webp`.

## 4. ARCHITECTURE OVERVIEW
For detailed technical implementation specifications, infrastructure rationale, and scaling protocols, please refer to the [ARCHITECTURE.md](./ARCHITECTURE.md) file included at the project root.
