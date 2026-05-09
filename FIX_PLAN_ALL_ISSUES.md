# 🔧 KẾ HOẠCH FIX TOÀN DIỆN - ADMIN PANEL ISSUES
## 360TuongTac Admin CMS - Phase 4

**Ngày tạo:** 2026-05-09  
**Priority:** P0 (Critical) → P1 (Medium) → P2 (Low)  
**Estimated Time:** 3-4 giờ  

---

## 📊 TỔNG QUAN ISSUES

| # | Issue | Severity | Status | Time |
|---|-------|----------|--------|------|
| 1 | Gemini API model deprecated | 🔴 CRITICAL | ❌ Chưa fix | 30 phút |
| 2 | Login API missing env vars | 🔴 CRITICAL | ⚠️ Clarified | 15 phút |
| 3 | Dashboard stats show zeros | 🟡 MEDIUM | ❌ Chưa fix | 1-2 giờ |
| 4 | Drafts = 0 (symptom of #1) | 🟡 MEDIUM | ❌ Chưa fix | 30 phút |
| 5 | Page title mismatch | 🟢 LOW | ❌ Chưa fix | 15 phút |

---

## 🔴 P0 - CRITICAL FIXES

### Fix #1: Update Gemini API Model

**Vấn đề:**
- Model `gemini-2.0-flash` đã deprecated cho new users
- API trả về 404 NOT_FOUND
- Tất cả AI content generation fail

**Giải pháp:** Update sang `gemini-2.5-flash` (mới nhất, free tier available)

**Files cần sửa:**

#### 1. `.env.local`
```env
# Line 37: Change from
AI_MODEL_GEMINI=gemini-2.0-flash

# To
AI_MODEL_GEMINI=gemini-2.5-flash
```

#### 2. `lib/admin/ai-content-generator.ts`
Check hardcoded model references và update:
```typescript
// Search for: gemini-2.0-flash
// Replace with: process.env.AI_MODEL_GEMINI || 'gemini-2.5-flash'
```

#### 3. `lib/admin/image-generator.ts`
Nếu có Google Imagen, check model version

**Steps:**
1. Update `.env.local`
2. Search all files for `gemini-2.0-flash`
3. Replace with dynamic env variable
4. Test AI generation
5. Update documentation

**Verification:**
```bash
# Test API
curl -X POST http://localhost:3000/api/admin/content/generate \
  -H "Content-Type: application/json" \
  -d '{"inputType":"topic","input":"Test Gemini 2.5"}'

# Expected: success=true, content generated
```

---

### Fix #2: Login API Environment Variables

**Vấn đề:**
- `.env.local` thiếu `NEXT_ADMIN_PASSWORD_HASH` và `NEXT_ADMIN_2FA_SECRET`
- Login API trả về 500 error
- Production có thể bị ảnh hưởng nếu env vars không được set

**Giải pháp:** Tạo admin credentials an toàn

**Option A: Run Setup Script (Recommended)**
```bash
cd 360tuongtac-website-enhancement
npm run setup-admin
```

Script sẽ:
1. Generate bcrypt password hash
2. Generate 2FA secret (Base32, 32 chars)
3. Generate backup codes
4. Update `.env.local` automatically

**Option B: Manual Setup**
```bash
# 1. Install bcrypt if needed
npm install bcryptjs

# 2. Generate password hash (Node.js)
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourSecurePassword123!', 12))"

# 3. Generate 2FA secret
node -e "const crypto = require('crypto'); console.log(crypto.randomBytes(20).toString('base32').slice(0,32))"

# 4. Add to .env.local
NEXT_ADMIN_PASSWORD_HASH=\$2b\$12\$...  # From step 2
NEXT_ADMIN_2FA_SECRET=...  # From step 3 (32 chars)
```

**Important Notes:**
- ⚠️ Password phải ≥ 12 characters, có uppercase, lowercase, number, special char
- ⚠️ 2FA secret phải exactly 32 characters (Base32: A-Z, 2-7)
- ⚠️ Trong PowerShell, escape `$` thành `\$` hoặc dùng single quotes

**Verification:**
```bash
# 1. Tắt dev bypass
# Edit .env.local: DEV_AUTH_BYPASS=false

# 2. Reload page
http://localhost:3000/admin

# 3. Should see login form (not bypassed)

# 4. Enter password + 2FA code
# Should login successfully
```

**Production Checklist:**
```bash
# Verify on VPS
ssh deploy@14.225.224.130 -p 2277
cat /opt/360tuongtac/.env.prod | grep -E 'PASSWORD_HASH|2FA_SECRET'

# Should show:
# NEXT_ADMIN_PASSWORD_HASH=\$2b\$12\$...
# NEXT_ADMIN_2FA_SECRET=...
```

---

## 🟡 P1 - MEDIUM FIXES

### Fix #3: Dashboard Stats Aggregation

**Vấn đề:**
- Blog Posts: 0 (should be 15)
- SEO Score: 0/100 (should be ~80)
- Published This Month: 0

**Root Cause Analysis:**
Cần debug `/api/admin/dashboard` endpoint để xem:
1. Data source là gì? (file system, database?)
2. Aggregation logic có đúng không?
3. Date filtering có vấn đề gì không?

**Steps:**

#### Step 1: Check Current Implementation
```bash
# Read dashboard route
cat app/api/admin/dashboard/route.ts

# Read monitoring/generation logic
cat lib/admin/monitoring.ts
# or wherever generateDashboardData() is defined
```

#### Step 2: Identify Data Source
```typescript
// Expected pattern:
import { getAllBlogPosts } from '@/lib/admin/file-writer';
import { getAllServices } from '@/lib/admin/file-writer';

export function generateDashboardData() {
  const blogPosts = getAllBlogPosts();  // Should return array
  const services = getAllServices();    // Should return array
  
  // Debug: Log counts
  console.log('[Dashboard] Blog posts:', blogPosts.length);
  console.log('[Dashboard] Services:', services.length);
  
  // Calculate stats
  const totalBlogPosts = blogPosts.length;
  const totalServices = services.length;
  
  // SEO Score average
  const seoScores = blogPosts
    .map(post => post.seoScore || 0)
    .filter(score => score > 0);
  
  const avgSEOScore = seoScores.length > 0
    ? Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length)
    : 0;
  
  // Published this month
  const now = new Date();
  const thisMonth = blogPosts.filter(post => {
    const postDate = new Date(post.date);
    return postDate.getMonth() === now.getMonth() &&
           postDate.getFullYear() === now.getFullYear();
  }).length;
  
  return {
    totalBlogPosts,
    totalServices,
    avgSEOScore,
    publishedThisMonth: thisMonth,
  };
}
```

#### Step 3: Fix File Reader (nếu cần)
```bash
# Check if file-writer.ts has getAllBlogPosts()
cat lib/admin/file-writer.ts | grep -A 20 'export function getAllBlogPosts'

# Verify data directory
ls -la data/blog/
ls -la data/services/
```

#### Step 4: Test
```bash
# Test API directly
curl http://localhost:3000/api/admin/dashboard

# Expected response:
{
  "success": true,
  "data": {
    "overview": {
      "totalBlogPosts": 15,
      "totalServices": 11,
      "avgSEOScore": 80,
      "publishedThisMonth": 5
    }
  }
}
```

---

### Fix #4: Draft Workflow Verification

**Vấn đề:**
- Drafts = 0 (có thể do AI generation fail - Issue #1)

**Steps:**

#### Step 1: Fix Issue #1 First
- Sau khi fix Gemini API, test AI generation

#### Step 2: Test Draft Creation
```bash
# Via API
curl -X POST http://localhost:3000/api/admin/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "inputType": "topic",
    "input": "Test draft creation",
    "autoSave": true
  }'

# Check if draft created
ls -la data/drafts/
```

#### Step 3: Verify Draft API
```bash
# Get drafts
curl http://localhost:3000/api/admin/drafts?status=review

# Expected: Array with at least 1 draft
```

#### Step 4: Check Publishing Workflow
```typescript
// Verify saveBlogPostWorkflow() in lib/admin/publishing-workflow.ts
// Should:
// 1. Save to data/drafts/[slug].json
// 2. Set status = 'review'
// 3. Return success
```

---

## 🟢 P2 - LOW PRIORITY

### Fix #5: Update Admin Page Titles

**Vấn đề:**
- Browser tab shows public website title instead of "Admin Panel"

**Solution:**

#### Option 1: Update Admin Layout Metadata
```typescript
// app/admin/layout.tsx (add at top)
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - 360TuongTac',
  description: 'Content management system admin dashboard',
};
```

#### Option 2: Update Each Page
```typescript
// app/admin/page.tsx (add at top)
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Admin | 360TuongTac',
};

// app/admin/blog/page.tsx
export const metadata: Metadata = {
  title: 'Blog Management - Admin | 360TuongTac',
};

// ... repeat for other pages
```

**Verification:**
- Reload each admin page
- Check browser tab title
- Should show "Admin Panel" or page-specific title

---

## 📋 IMPLEMENTATION ORDER

### Phase 1: Critical Fixes (1-2 hours)
1. ✅ Fix #1: Update Gemini API model (30 min)
2. ✅ Fix #2: Setup login credentials (15 min)
3. 🧪 Test both fixes (30 min)

### Phase 2: Medium Fixes (2-3 hours)
4. 🔍 Debug dashboard stats (1 hour)
5. 🔧 Fix aggregation logic (1 hour)
6. 🧪 Test draft workflow (30 min)

### Phase 3: Polish (30 min)
7. 🎨 Fix page titles (15 min)
8. 📝 Update documentation (15 min)

---

## ✅ VERIFICATION CHECKLIST

### After Phase 1:
- [ ] AI content generation works (Topic, URL, Text)
- [ ] Login works with dev bypass disabled
- [ ] 2FA code validates correctly
- [ ] No 500 errors in terminal

### After Phase 2:
- [ ] Dashboard shows correct stats (15 posts, 11 services, ~80 SEO)
- [ ] Published This Month > 0
- [ ] Can create drafts via AI generation
- [ ] Drafts page shows created drafts
- [ ] Can approve/reject drafts

### After Phase 3:
- [ ] All admin pages have correct titles
- [ ] Documentation updated
- [ ] No console errors
- [ ] No network errors

---

## 🚀 NEXT STEPS

1. **BẮT ĐẦU NGAY:** Fix #1 (Gemini model) - 30 phút
2. **TIẾP THEO:** Fix #2 (Login credentials) - 15 phút
3. **TEST:** Verify both fixes work
4. **CONTINUE:** Fix #3, #4, #5
5. **FINAL:** Full regression test

---

## 📝 NOTES

- Tất cả fixes đều backwards compatible
- Không ảnh hưởng production code
- Dev auth bypass vẫn hoạt động trong development
- Production sẽ require login (no bypass)
- Gemini API key mới có quota (Tier 1 Prepay)

---

**Created by:** QA/QC Engineer  
**Date:** 2026-05-09  
**Status:** Ready for Implementation  
