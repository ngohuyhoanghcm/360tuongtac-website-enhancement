# 🧪 HƯỚNG DẪN TEST ADMIN SYSTEM

**Environment:** Local Development  
**URL:** http://localhost:3000/admin  
**Date:** 2026-05-10  

---

## ✅ TÍNH NĂNG ĐÃ CẬP NHẬT

### 1. SEO Audit
- ✅ **Đã thêm:** Link "SEO Audit" trong sidebar
- ✅ **Đã thêm:** Nút "Chạy SEO Audit cho toàn bộ site" với loading state
- ✅ **Chức năng:** Audit tất cả blog posts và services
- ⚠️ **Lưu ý:** Chưa có chức năng audit URL tùy chỉnh (cần phát triển thêm)

### 2. Sidebar Navigation
- ✅ Dashboard
- ✅ Blog Posts
- ✅ Services
- ✅ AI Content Hub (AI Tools)
- ✅ Draft Approval (AI Tools)
- ✅ **SEO Audit (MỚI)**

---

## 📋 TEST CHECKLIST

### 🔐 Authentication (DEV MODE - Auto Bypass)

Trong development mode, authentication được bypass tự động.

**Test URL:** http://localhost:3000/admin

**Expected:**
- ✅ Không cần nhập password/2FA
- ✅ Redirect thẳng vào dashboard
- ✅ Console log: `[DEV AUTH] Admin UI bypass enabled - skipping login`

---

### 📊 Dashboard

**Test URL:** http://localhost:3000/admin

**Steps:**
1. Truy cập URL trên
2. Kiểm tra các thành phần

**Expected:**
- ✅ Welcome message "Xin chào, Admin"
- ✅ Thống kê hiển thị (blog posts, services, etc.)
- ✅ Sidebar với đầy đủ menu items
- ✅ SEO Audit link xuất hiện trong sidebar

---

###  Blog Posts Management

**Test URL:** http://localhost:3000/admin/blog

**Test Cases:**

#### 4.1 View Blog List
- [ ] Danh sách blog posts hiển thị
- [ ] Mỗi post có: Title, Slug, Status, Date
- [ ] Pagination hoạt động

#### 4.2 Create New Blog Post
- [ ] Click "Tạo bài viết mới"
- [ ] Form hiển thị đầy đủ fields
- [ ] Có thể nhập title, content, category
- [ ] Nút "Lưu nháp" hoạt động

#### 4.3 Edit Blog Post
- [ ] Click "Sửa" trên một post
- [ ] Form pre-filled với dữ liệu hiện tại
- [ ] Có thể chỉnh sửa và lưu

#### 4.4 Delete Blog Post
- [ ] Click "Xóa"
- [ ] Confirm dialog hiển thị
- [ ] Post bị xóa sau khi confirm

---

### 🛠️ Services Management

**Test URL:** http://localhost:3000/admin/services

**Test Cases:**

#### 5.1 View Services List
- [ ] Danh sách services hiển thị
- [ ] Mỗi service có: Name, Category, Status, Price
- [ ] Filter by category hoạt động

#### 5.2 Create New Service
- [ ] Click "Tạo dịch vụ mới"
- [ ] Form hiển thị đầy đủ
- [ ] Có thể nhập service details
- [ ] Nút "Lưu" hoạt động

#### 5.3 Edit Service
- [ ] Click "Sửa" trên service
- [ ] Chỉnh sửa và lưu thành công

#### 5.4 Delete Service
- [ ] Click "Xóa" → Confirm
- [ ] Service bị xóa

---

### 🤖 AI Content Hub

**Test URL:** http://localhost:3000/admin/ai-content

**⚠️ EXPECTED ERROR:**
AI Content Hub sẽ hiển thị lỗi do API key không hợp lệ:
```
Google Gemini API error: API key not valid
```

**Đây là BÌNH THƯỜNG** vì:
- Google Gemini API key cần được config trong `.env.local`
- Hiện tại chưa có API key hợp lệ

**Test Cases:**

#### 6.1 AI Content Hub UI
- [ ] Page loads (có thể có lỗi API)
- [ ] Form inputs hiển thị:
  - Chủ đề bài viết
  - Danh mục
  - Target Keywords
  - Tone giọng
  - Checkboxes: "Tự động lưu", "Tạo ảnh minh họa"
- [ ] Nút "Tạo nội dung với AI" hiển thị

#### 6.2 Generate Content (Expected to Fail)
- [ ] Nhập topic: "Hướng dẫn tăng tương tác TikTok"
- [ ] Click "Tạo nội dung với AI"
- [ ] **Expected:** Lỗi "API key not valid"
- [ ] **This is OK** - API key cần được config

**Để fix (Optional):**
```env
# Trong .env.local
GOOGLE_GEMINI_API_KEY=your-actual-api-key-here
```

---

### 📄 Draft Approval

**Test URL:** http://localhost:3000/admin/drafts

**Test Cases:**

#### 7.1 View Drafts
- [ ] Danh sách drafts hiển thị
- [ ] Phân loại: Blog drafts, AI drafts
- [ ] Mỗi draft có: Title, Type, Created Date

#### 7.2 Review & Publish
- [ ] Click "Xem" trên draft
- [ ] Preview content
- [ ] Click "Xuất bản"
- [ ] Draft chuyển sang published

#### 7.3 Delete Draft
- [ ] Click "Xóa" → Confirm
- [ ] Draft bị xóa

---

### 🔍 SEO Audit (NEW!)

**Test URL:** http://localhost:3000/admin/seo-audit

**Test Cases:**

#### 8.1 SEO Audit Dashboard
- [ ] Page loads successfully
- [ ] Overall SEO score hiển thị (số từ 0-100)
- [ ] Thống kê:
  - Điểm SEO trung bình
  - Lỗi nghiêm trọng (Critical Issues)
  - Cảnh báo (Warnings)
  - Số bài viết đã kiểm tra
- [ ] Filter tabs: "Tất cả", "Nghiêm trọng", "Cảnh báo"

#### 8.2 Blog Posts SEO Scores
- [ ] Danh sách blog posts với SEO scores
- [ ] Mỗi post hiển thị:
  - Title
  - Slug URL
  - SEO Score (số màu)
  - Progress bar (xanh/vàng/đỏ)
- [ ] Score colors:
  - >= 80: Green ✅
  - 70-79: Yellow ⚠️
  - < 70: Red ❌

#### 8.3 **Run SEO Audit Button (NEW!)**
- [ ] Nút "Chạy SEO Audit cho toàn bộ site" hiển thị
- [ ] Icon Search hiển thị trên nút
- [ ] Click nút → Loading spinner xuất hiện
- [ ] Text thay đổi: "Đang chạy audit..."
- [ ] Sau khi xong: Alert "✅ SEO Audit đã được chạy lại thành công!"
- [ ] Dữ liệu được refresh

#### 8.4 Filter Functionality
- [ ] Click "Tất cả" → Hiển thị tất cả posts
- [ ] Click "Nghiêm trọng" → Chỉ posts với critical issues
- [ ] Click "Cảnh báo" → Chỉ posts với warnings

#### 8.5 Export Report Button
- [ ] Nút "Xuất báo cáo" hiển thị
- [ ] (Chức năng chưa implement - chỉ là UI placeholder)

---

##  PRIORITY TESTS (Quan trọng nhất)

### MUST TEST:
1. ✅ **SEO Audit link trong sidebar** - Đã thêm thành công
2. ✅ **Nút "Chạy SEO Audit cho toàn bộ site"** - Đã thêm với loading state
3. ✅ **SEO Audit page loads** - Kiểm tra hiển thị scores
4. ⚠️ **AI Content Hub error** - Expected (API key missing)

### OPTIONAL TESTS:
5. Blog CRUD operations
6. Services CRUD operations
7. Drafts management
8. Export report functionality (chưa implement)

---

## 🐛 KNOWN ISSUES

### 1. AI Content Hub - API Key Error
**Status:** Expected / Not a bug  
**Reason:** Google Gemini API key not configured  
**Fix:** Add `GOOGLE_GEMINI_API_KEY` to `.env.local`

### 2. Export Report Button
**Status:** UI placeholder only  
**Reason:** Functionality not yet implemented  
**Priority:** Low

### 3. SEO Audit URL Custom Input
**Status:** Not implemented  
**Reason:** Feature request from user  
**Priority:** Medium (can add later)

---

## 📸 SCREENSHOTS NEEDED

Chụp screenshots cho:
1. ✅ SEO Audit page với scores
2. ✅ Nút "Chạy SEO Audit cho toàn bộ site"
3. ✅ Loading state khi click nút
4. ✅ Sidebar với SEO Audit link
5. ⚠️ AI Content Hub error (để document)

---

## 🎬 TESTING WORKFLOW

### Step 1: Start Dev Server
```bash
cd "d:\Project-Nâng cấp website 360TuongTac\360tuongtac-website-enhancement"
npm run dev
```
**Expected:** Server chạy ở http://localhost:3000

### Step 2: Test SEO Audit
1. Mở http://localhost:3000/admin/seo-audit
2. Kiểm tra:
   - Overall score hiển thị
   - Blog posts list với scores
   - Nút "Chạy SEO Audit cho toàn bộ site"
3. Click nút → Check loading state
4. Check filter tabs hoạt động

### Step 3: Test Sidebar
1. Mở http://localhost:3000/admin
2. Kiểm tra sidebar có SEO Audit link
3. Click SEO Audit → Navigate thành công

### Step 4: Test AI Content Hub
1. Mở http://localhost:3000/admin/ai-content
2. Expected: Lỗi API key (BÌNH THƯỜNG)
3. Check UI elements hiển thị đúng

### Step 5: Test Blog & Services
1. Test CRUD operations
2. Check forms, validations
3. Check delete confirmations

---

## 📊 TEST RESULTS TEMPLATE

```
Test Date: 2026-05-10
Tester: [Your Name]

✅ PASSED:
- [ ] SEO Audit link in sidebar
- [ ] SEO Audit page loads
- [ ] Run SEO Audit button works
- [ ] Filter tabs work
- [ ] Blog CRUD operations
- [ ] Services CRUD operations

⚠️ EXPECTED ISSUES:
- [ ] AI Content Hub API key error

❌ FAILED:
- [ ] (List any unexpected failures)

📝 NOTES:
- (Any observations or suggestions)
```

---

## 🔧 TROUBLESHOOTING

### Issue: Page không load
**Fix:** 
```bash
# Check dev server đang chạy
# Restart nếu cần:
Ctrl+C (trong terminal dev)
npm run dev
```

### Issue: SEO Audit không hiển thị scores
**Fix:**
- Check console log (F12)
- Verify API route `/api/admin/seo-audit` hoạt động
- Check auth bypass đang enabled

### Issue: AI Content Hub lỗi
**Status:** Expected - cần API key
**Fix (Optional):**
```env
# .env.local
GOOGLE_GEMINI_API_KEY=your-key-here
```

---

## ✅ SUCCESS CRITERIA

All tests pass khi:
- ✅ SEO Audit link xuất hiện trong sidebar
- ✅ SEO Audit page loads và hiển thị scores
- ✅ Nút "Chạy SEO Audit" hoạt động với loading state
- ✅ Blog & Services CRUD operations hoạt động
- ✅ AI Content Hub hiển thị (lỗi API key là expected)

---

**Good luck with testing! 🚀**
