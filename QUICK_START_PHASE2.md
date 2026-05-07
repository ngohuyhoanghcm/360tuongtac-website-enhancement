# Quick Start Guide - Phase 2 Admin System

## 🚀 Getting Started in 5 Minutes

### 1. Access Admin Panel

```
URL: http://localhost:3000/admin
Password: admin123
```

### 2. Create Your First Blog Post

1. Click **"Bài viết mới"** on dashboard
2. Fill in the form:
   - Title: "Hướng dẫn tăng view TikTok 2025"
   - Category: "Marketing"
   - Excerpt: "Khám phá bí quyết tăng view TikTok..." (120-160 chars)
   - Content: Write at least 1500 characters
   - Tags: Add 3+ tags (tiktok, marketing, video)
   - Image URL: "/images/blog/tiktok.jpg"
   - Image Alt: "Hướng dẫn tăng view TikTok 2025"
3. Check SEO Score (aim for 80+)
4. Click **"Lưu bài viết"**

### 3. Rebuild Site

```bash
npm run build
```

Your new post will be live at: `/blog/huong-dan-tang-view-tiktok-2025`

## 📋 Content Templates

### Blog Post Template

```markdown
Title: [50-70 characters, include keyword]
Excerpt: [120-160 characters, compelling summary]
Content: [1500+ characters, structured with headings]

Structure:
# Heading 1 (H1)
Introduction paragraph...

## Heading 2 (H2)
Content with bullet points:
- Point 1
- Point 2
- Point 3

## Heading 2 (H2)
More content...

### Heading 3 (H3)
Detailed explanation...

## Kết luận
Summary and CTA...
```

### Service Template

```markdown
Name: [20-60 characters, clear service name]
Short Description: [100-160 characters, value proposition]
Description: [1000+ characters, detailed explanation]

Features (5+):
- Feature 1
- Feature 2
- Feature 3
- Feature 4
- Feature 5

Benefits (5+):
- Benefit 1
- Benefit 2
- Benefit 3
- Benefit 4
- Benefit 5

Suitable For (3+):
- Target audience 1
- Target audience 2
- Target audience 3
```

## ✅ SEO Checklist

Before publishing, ensure:

- [ ] Title: 50-70 characters
- [ ] Meta Description: 120-155 characters
- [ ] Content: 1500+ characters
- [ ] Tags: 3-10 relevant tags
- [ ] Image Alt: 15+ characters
- [ ] Featured image included
- [ ] SEO Score: 80+
- [ ] No validation errors

## 🎯 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint

# View admin panel
Open: http://localhost:3000/admin
```

## 📊 SEO Score Guide

| Score | Meaning | Action |
|-------|---------|--------|
| 90-100 | Excellent ✅ | Publish immediately |
| 80-89 | Good ✅ | Ready to publish |
| 70-79 | Fair ⚠️ | Consider improving |
| <70 | Poor ❌ | Fix before publishing |

## 🔧 Common Tasks

### Update Existing Post

1. Go to `/admin/blog`
2. Find the post
3. Click **"Sửa"**
4. Make changes
5. Click **"Cập nhật"**
6. Run `npm run build`

### Delete Post

1. Go to `/admin/blog`
2. Find the post
3. Click **"Xóa"**
4. Confirm deletion
5. Run `npm run build`

### Check Build Status

```typescript
import { getBuildQueueStatus } from '@/lib/admin/build-trigger';

const status = getBuildQueueStatus();
console.log(status.lastBuild);
```

## 🆘 Troubleshooting

**Q: Can't login to admin?**
A: Default password is `admin123`. Change in `.env.local`:
```
NEXT_PUBLIC_ADMIN_PASSWORD=your_password
```

**Q: SEO score is low?**
A: Check:
- Title length (50-70 chars)
- Content length (1500+ chars)
- Tags count (3+ tags)
- Image alt text (15+ chars)

**Q: Build fails?**
A: Run validation first:
```bash
# Check for TypeScript errors
npm run build

# Review validation warnings in admin UI
```

**Q: Post not showing?**
A: After saving, you must run:
```bash
npm run build
```

## 📞 Support

For issues or questions:
1. Check `PHASE2_IMPLEMENTATION.md` for detailed docs
2. Review validation errors in admin UI
3. Check console for build errors
4. Review `CONTENT_MANAGEMENT_SYSTEM_STRATEGY.md` for architecture

---

**Ready to create content?** → [Go to Admin Panel](http://localhost:3000/admin)
