# Phase 2 Implementation - File Writer & Validation System

## 📋 Overview

Phase 2 implements the core HYBRID content management system with file-based storage, validation, auto-SEO generation, and build triggers. This system allows non-technical staff to create and manage blog posts and services without database or complex infrastructure.

## 🏗️ Architecture

```
Admin UI (Forms)
    ↓
API Routes (Validation & Processing)
    ↓
File Writer (Save to TypeScript files)
    ↓
Auto SEO Generation (Metadata & Schemas)
    ↓
Build Trigger (Regenerate static pages)
```

## 📁 File Structure

```
360tuongtac-website-enhancement/
├── lib/admin/
│   ├── file-writer.ts          # File I/O operations
│   ├── validation.ts           # Zod schemas & validation
│   ├── seo-generator.ts        # SEO metadata generation
│   └── build-trigger.ts        # Build & sitemap automation
├── app/api/admin/
│   ├── blog/save/route.ts      # Blog post save API
│   └── service/save/route.ts   # Service save API
└── app/admin/
    ├── layout.tsx              # Admin panel layout
    ├── page.tsx                # Dashboard
    ├── blog/
    │   ├── page.tsx            # Blog list
    │   ├── new/page.tsx        # New blog form
    │   └── edit/[slug]/page.tsx # Edit blog form
    └── services/
        ├── page.tsx            # Services list
        └── edit/[slug]/page.tsx # Edit service form
```

## 🔧 Core Components

### 1. File Writer (`lib/admin/file-writer.ts`)

Handles reading/writing blog posts and services as TypeScript files.

**Key Functions:**
- `saveBlogPost(post)` - Save blog post to `lib/constants/{slug}.ts`
- `saveService(service)` - Save service to `data/services/{slug}.ts`
- `deleteBlogPost(slug)` - Delete blog post file
- `deleteService(slug)` - Delete service file
- `updateBlogIndex()` - Auto-update `lib/constants/blog.ts`
- `updateServicesIndex()` - Auto-update `data/services/index.ts`

**File Format:**
```typescript
// lib/constants/my-blog-post.ts
import { BlogPost } from './blog';

export const myBlogPost: BlogPost = {
  id: "blog_1234567890",
  slug: "my-blog-post",
  title: "My Blog Post Title",
  excerpt: "Short description...",
  content: "Full content...",
  author: "360TuongTac Team",
  date: "2025-05-07",
  readTime: "5 phút",
  category: "Marketing",
  tags: ["tiktok", "livestream"],
  imageUrl: "/images/blog/my-post.jpg",
  imageAlt: "Blog post image",
  metaTitle: "My Blog Post Title | Blog - 360TuongTac",
  metaDescription: "SEO optimized description...",
  featured: false,
  seoScore: 85
};
```

### 2. Validation System (`lib/admin/validation.ts`)

Validates content against Zod schemas and SEO requirements.

**Key Functions:**
- `validateBlogPost(post)` - Validate blog post (returns ValidationResult)
- `validateService(service)` - Validate service
- `checkSlugUniqueness(slug, type, existingSlugs)` - Check slug uniqueness
- `generateSlug(text)` - Convert Vietnamese text to slug
- `estimateReadTime(content)` - Calculate read time
- `validateContentQuality(content)` - Check content structure
- `autoGenerateMetaTitle(title, category)` - Generate meta title
- `autoGenerateMetaDescription(content)` - Generate meta description

**Validation Rules:**

| Field | Min | Max | Notes |
|-------|-----|-----|-------|
| Title | 10 chars | 70 chars | SEO: 50-70 recommended |
| Excerpt | 50 chars | 160 chars | SEO: 120-160 recommended |
| Content | 500 chars | 50,000 chars | SEO: 1500+ recommended |
| Tags | 3 items | 10 items | Minimum 3 required |
| Image Alt | 15 chars | 125 chars | Required for accessibility |

**SEO Score Calculation:**
- Title length (weight: 25%)
- Meta description length (weight: 25%)
- Content length (weight: 30%)
- Tags count (weight: 10%)
- Image alt text (weight: 5%)
- Featured image (weight: 5%)

### 3. SEO Generator (`lib/admin/seo-generator.ts`)

Automatically generates SEO metadata, JSON-LD schemas, and social tags.

**Key Functions:**
- `generateBlogSEO(post)` - Generate complete SEO data for blog
- `generateServiceSEO(service)` - Generate complete SEO data for service
- `generateSitemapEntry(url, lastmod, changefreq, priority)` - Sitemap XML
- `generateRobotsTxt()` - Robots.txt content
- `suggestInternalLinks(currentPost, allPosts)` - Related posts
- `generateBreadcrumbSchema(items)` - Breadcrumb JSON-LD
- `generateFAQSchema(faqs)` - FAQ JSON-LD
- `generateOGTagsHTML(seo)` - Open Graph HTML tags

**Generated SEO Data:**
```typescript
{
  metaTitle: "Blog Title | Blog - 360TuongTac",
  metaDescription: "Optimized description...",
  canonicalUrl: "https://360tuongtac.com/blog/slug",
  ogTags: {
    title: "...",
    description: "...",
    image: "...",
    type: "article",
    locale: "vi_VN",
    siteName: "360TuongTac"
  },
  twitterCard: {
    card: "summary_large_image",
    title: "...",
    description: "...",
    image: "..."
  },
  jsonLd: "{...}", // Article or Service schema
  hreflang: [
    { lang: "vi", url: "..." },
    { lang: "x-default", url: "..." }
  ]
}
```

### 4. Build Trigger (`lib/admin/build-trigger.ts`)

Automatically rebuilds static pages and updates sitemap.

**Key Functions:**
- `triggerBuild(type, slug, action)` - Trigger rebuild
- `updateSitemap()` - Regenerate sitemap.xml
- `regenerateRobotsTxt()` - Update robots.txt
- `invalidateCache(type, slug)` - Clear cache
- `getBuildQueueStatus()` - Check build queue
- `preBuildValidation()` - Run validation before build

**Build Process:**
1. Content saved via API
2. Validation passes
3. File written to disk
4. Index files updated
5. Sitemap regenerated
6. Cache invalidated
7. Static pages rebuilt on next `npm run build`

### 5. API Routes

#### POST `/api/admin/blog/save`

Save a new blog post.

**Request:**
```json
{
  "title": "Hướng dẫn Livestream TikTok 2025",
  "excerpt": "Khám phá cách livestream TikTok hiệu quả...",
  "content": "Full content here...",
  "category": "Marketing",
  "tags": ["tiktok", "livestream", "marketing"],
  "imageUrl": "/images/blog/tiktok-live.jpg",
  "imageAlt": "Hướng dẫn livestream TikTok",
  "featured": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog post saved successfully",
  "slug": "huong-dan-livestream-tiktok-2025",
  "seoScore": 85,
  "seoData": { ... },
  "validation": {
    "warnings": ["Content nên có ít nhất 3000 ký tự"]
  }
}
```

#### POST `/api/admin/service/save`

Save a new service.

**Request:**
```json
{
  "name": "Tăng Follow TikTok",
  "shortDescription": "Dịch vụ tăng follow TikTok uy tín...",
  "description": "Full description...",
  "features": ["Follow thật 100%", "Tăng nhanh 24h", "Bảo hành 30 ngày"],
  "benefits": ["Tăng uy tín", "Tương tác tốt hơn", "Dễ bán hàng"],
  "suitableFor": ["Seller TikTok", "KOLs", "Brands"],
  "price": "50,000đ/1000 follow"
}
```

## 🚀 Usage

### 1. Create Blog Post via Admin UI

1. Login to `/admin` (password: admin123)
2. Click "Bài viết mới"
3. Fill in the form
4. Check SEO score (target: 80+)
5. Click "Lưu bài viết"

### 2. Create Blog Post via API

```bash
curl -X POST http://localhost:3000/api/admin/blog/save \
  -H "Authorization: Bearer secret123" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog Post",
    "excerpt": "This is a test post...",
    "content": "Full content here...",
    "category": "Marketing",
    "tags": ["test", "blog"],
    "imageUrl": "/images/blog/test.jpg",
    "imageAlt": "Test blog post"
  }'
```

### 3. Rebuild Static Pages

After saving content, rebuild the site:

```bash
npm run build
```

This will:
- Regenerate all static pages
- Update sitemap.xml
- Update robots.txt
- Deploy to production (if connected to CI/CD)

## ✅ Validation Checks

### Pre-Build Validation

Run before deployment:

```typescript
import { preBuildValidation } from '@/lib/admin/build-trigger';

const result = await preBuildValidation();
console.log(result);
// {
//   success: true,
//   errors: [],
//   warnings: ["Blog post content too short: some-slug"]
// }
```

### SEO Score Requirements

| Score | Status | Action |
|-------|--------|--------|
| 90-100 | ✅ Excellent | Ready to publish |
| 80-89 | ✅ Good | Ready to publish |
| 70-79 | ⚠️ Fair | Consider improving |
| <70 | ❌ Poor | Must fix before publish |

## 🔐 Security

### API Authentication

All API routes require Bearer token:

```typescript
Authorization: Bearer ${process.env.ADMIN_API_SECRET}
```

Default: `secret123` (change in production!)

### Admin Panel Authentication

Session-based authentication with password:

```typescript
// .env.local
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

## 📊 Monitoring

### Build Queue Status

```typescript
import { getBuildQueueStatus } from '@/lib/admin/build-trigger';

const status = getBuildQueueStatus();
console.log(status);
// {
//   isBuilding: false,
//   queue: [],
//   lastBuild: {
//     success: true,
//     message: "Content updated successfully",
//     duration: 2500,
//     timestamp: "2025-05-07T10:30:00.000Z"
//   }
// }
```

## 🛠️ Troubleshooting

### Issue: File not saved

**Check:**
1. File permissions (should be writable)
2. Directory exists (`lib/constants/`, `data/services/`)
3. Slug is unique
4. Validation passed

### Issue: Build fails

**Check:**
1. Run `preBuildValidation()` first
2. Check TypeScript errors: `npm run build`
3. Verify index files are valid TypeScript
4. Check for duplicate exports

### Issue: SEO score too low

**Fix:**
1. Increase title length (50-70 chars)
2. Expand excerpt (120-160 chars)
3. Add more content (1500+ chars)
4. Add more tags (minimum 3)
5. Improve image alt text (15+ chars)

## 📈 Next Steps (Phase 3)

Phase 3 will add:
- Markdown editor integration
- Image upload & optimization
- Content scheduling
- Version control & history
- Multi-user support with roles
- Advanced analytics integration
- Automated internal linking
- AI-powered content suggestions

## 📝 Notes

- All content is stored as TypeScript files (no database)
- Changes require `npm run build` to go live
- Git version control provides backup & history
- System scales to ~100 blog posts + 20 services efficiently
- For larger scale, consider upgrading to database-backed CMS

## 🎯 Success Metrics

- [x] File writer operational
- [x] Validation system complete
- [x] Auto SEO generation working
- [x] Build triggers functional
- [x] API routes created
- [x] Admin UI integrated
- [ ] Production testing
- [ ] Staff training
- [ ] Performance benchmarking

---

**Implementation Date:** May 7, 2025  
**Status:** ✅ Complete - Ready for Testing  
**Next Phase:** Phase 3 (Advanced Features)
