# 🔍 BÁO CÁO ĐÁNH GIÁ HỆ THỐNG: VẤN ĐỀ DARK MODE SAU LIGHT MODE MIGRATION

**Ngày tạo:** 07/05/2026  
**Phiên bản:** 1.0  
**Trạng thái:** ⚠️ CẦN KHẮC PHỤC  
**Nhánh:** `feature/light-mode-migration`

---

## 📋 MỤC LỤC

1. [Tổng Quan Vấn Đề](#1-tổng-quan-vấn-đề)
2. [Phân Tích Nguyên Nhân Gốc Rễ](#2-phân-tích-nguyên-nhân-gốc-rễ)
3. [Chi Tiết Các Component Bị Ảnh Hưởng](#3-chi-tiết-các-component-bị-ảnh-hưởng)
4. [So Sánh Light Mode vs Dark Mode](#4-so-sánh-light-mode-vs-dark-mode)
5. [Giải Pháp Hệ Thống](#5-giải-pháp-hệ-thống)
6. [Kế Hoạch Thực Thi](#6-kế-hoạch-thực-thi)
7. [Chiến Lược Testing](#7-chiến-lược-testing)

---

## 1. TỔNG QUAN VẤN ĐỀ

### 1.1 Mô Tả Vấn Đề

Sau khi thực hiện Light Mode Migration và thêm Theme Toggle Button, **Dark Mode không hoạt động đúng như thiết kế ban đầu**. Khi user chuyển sang Dark Mode:

- ❌ **Nhiều component vẫn giữ màu sáng** (white backgrounds, gray text)
- ❌ **Không có sự đồng nhất** - một số phần tối, một số phần sáng
- ❌ **Mất tính thẩm mỹ** - giao diện trông "rách nát", không chuyên nghiệp
- ❌ **Không revert về thiết kế dark mode gốc**

### 1.2 Phạm Vi Ảnh Hưởng

| Hạng Mục | Số File | Mức Độ Nghiêm Trọng |
|----------|---------|---------------------|
| Layout Components | 4 files | 🔴 CRITICAL |
| Landing Components | 14 files | 🔴 CRITICAL |
| Service Components | 5 files | 🟠 HIGH |
| Blog Components | 6 files | 🟠 HIGH |
| Page Files | 6 files | 🟡 MEDIUM |
| UI Components | 4 files | 🟡 MEDIUM |
| **TOTAL** | **39 files** | 🔴 **SYSTEMIC** |

---

## 2. PHÂN TÍCH NGUYÊN NHÂN GỐC RỄ

### 2.1 Nguyên Nhân Chính: Hardcoded Colors thay vì CSS Variables

**Vấn đề cốt lõi:** Trong quá trình migration, chúng ta đã thay thế dark mode colors bằng **hardcoded Tailwind utility classes** thay vì sử dụng CSS variables đã được định nghĩa trong `globals.css`.

#### Ví dụ điển hình:

```css
/* ✅ ĐÚNG - Sử dụng CSS Variables (mode-aware) */
<div className="bg-[var(--surface)] text-[var(--text-primary)]">

/* ❌ SAI - Hardcoded values (không respect dark mode) */
<div className="bg-white text-gray-900">
```

### 2.2 Các Pattern Lỗi Thường Gặp

#### Pattern 1: Background Colors
```tsx
// ❌ SAI - Luôn trắng, không đổi trong dark mode
<div className="bg-white">
<div className="bg-gray-50">
<div className="bg-gray-100">

// ✅ ĐÚNG - Sử dụng CSS variables
<div className="bg-[var(--surface)]">
<div className="bg-[var(--bg-secondary)]">
```

#### Pattern 2: Text Colors
```tsx
// ❌ SAI - Luôn tối, không readable trong dark mode
<h1 className="text-gray-900">
<p className="text-gray-600">
<span className="text-gray-500">

// ✅ ĐÚNG - Sử dụng CSS variables
<h1 className="text-[var(--text-primary)]">
<p className="text-[var(--text-secondary)]">
<span className="text-[var(--text-muted)]">
```

#### Pattern 3: Border Colors
```tsx
// ❌ SAI - Border không visible trong dark mode
<div className="border border-gray-200">

// ✅ ĐÚNG - Border tự động adapt
<div className="border border-[var(--border)]">
```

### 2.3 Lý Do Tại Sao CSS Variables Không Được Sử Dụng

1. **Thiếu awareness:** Developer không nhận thức đầy đủ về CSS variable system
2. **Tailwind utility habit:** Quen dùng utility classes (`bg-white`, `text-gray-900`)
3. **Migration strategy flaw:** Strategy document không enforce việc sử dụng CSS variables
4. **No automated checks:** Không có tool để detect hardcoded colors

---

## 3. CHI TIẾT CÁC COMPONENT BỊ ẢNH HƯỞNG

### 3.1 Layout Components (CRITICAL)

#### ❌ **Header.tsx**
**Vấn đề:**
```tsx
// Line 33: Hardcoded light mode
'bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm'

// Line 54: Hardcoded text colors
'text-gray-600 hover:text-gray-900'
```

**Impact khi Dark Mode:**
- Header background vẫn trắng trong suốt → không đồng nhất với dark body
- Nav links text quá tối → contrast issues

**Sửa:**
```tsx
// Sử dụng glass-panel utility (đã mode-aware)
className={`${isAtTop 
  ? 'bg-transparent border-transparent' 
  : 'glass-panel'
}`}

// Nav links
className={`${isActive 
  ? 'text-[var(--text-primary)]' 
  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
}`}
```

---

#### ❌ **Footer.tsx**
**Vấn đề:**
```tsx
// Line 31: Hardcoded bg
'bg-gray-50 pt-16 border-t border-gray-200'

// Line 42-50: Social icons
'bg-gray-100 border border-gray-200 hover:bg-gray-200'

// Line 58-106: Multiple text colors
'text-gray-900', 'text-gray-600', 'hover:text-gray-900'
```

**Impact khi Dark Mode:**
- Footer background trắng sáng chói trên dark body
- Social icons không visible
- All text quá tối, không readable

**Sửa:**
```tsx
// Footer container
className='bg-[var(--bg-secondary)] pt-16 border-t border-[var(--border)]'

// Social icons
className='bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)]'

// Text
className='text-[var(--text-primary)]'
className='text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
```

---

#### ❌ **BottomNav.tsx**
**Vấn đề:**
```tsx
// Line 30: Hardcoded
'bg-white/95 backdrop-blur-2xl border border-gray-200'
```

**Impact khi Dark Mode:**
- Bottom navigation trắng sáng, nổi bật trên dark body
- Icons không readable

**Sửa:**
```tsx
'bg-[var(--glass-bg)] backdrop-blur-2xl border border-[var(--glass-border)]'
```

---

#### ❌ **Navbar.tsx**
**Vấn đề:**
```tsx
// Line 18: Hardcoded
'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm'
```

**Sửa:**
```tsx
'glass-panel border-b shadow-sm'
```

---

### 3.2 Landing Components (CRITICAL)

#### ❌ **HeroSection.tsx**
**Vấn đề:** Grid pattern, text colors, backgrounds all hardcoded

#### ❌ **StatsSection.tsx**
**Vấn đề:** 
```tsx
'bg-gray-50'  // Should be bg-[var(--bg-secondary)]
'bg-white border border-gray-200'  // Should use CSS vars
```

#### ❌ **ProcessSection.tsx**
**Vấn đề:** Panel và step cards sử dụng hardcoded colors

#### ❌ **PricingTable.tsx**
**Vấn đề:** Tất cả pricing cards sử dụng `bg-white`, `text-gray-900`

#### ❌ **FAQAccordion.tsx**
**Vấn đề:** FAQ items sử dụng hardcoded colors

**... và 9 components landing khác có cùng vấn đề**

---

### 3.3 Service Components (HIGH)

#### ❌ **ServiceCardGrid.tsx**
```tsx
// Cards sử dụng 'card' utility - ✅ ĐÚNG
// NHƯNG text bên trong hardcoded:
'text-gray-900', 'text-gray-600', 'bg-gray-50'
```

#### ❌ **WhyChooseUs.tsx**
```tsx
// Feature cards: 'card' utility ✅
// Text: hardcoded ❌
```

---

### 3.4 Blog Components (HIGH)

#### ❌ **BlogGrid.tsx**
```tsx
// Cards: 'bg-white border border-gray-200' ❌
// Text: 'text-gray-900', 'text-gray-600' ❌
```

#### ❌ **FeaturedPost.tsx**
```tsx
// Container: 'card' utility ✅
// Text: hardcoded ❌
```

---

### 3.5 Page Files (MEDIUM)

#### ❌ **ContactForm.tsx** (lien-he)
**Vấn đề nghiêm trọng nhất:**
```tsx
// Line 85: Form container
'bg-white backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-12 border border-gray-200 shadow-lg'

// Line 86: Heading
'text-gray-900'

// Line 107-135: All inputs
'bg-white border border-gray-200 text-gray-900'

// Labels
'text-gray-500'
```

**Impact:** Form hoàn toàn không usable trong dark mode - white form trên dark background, text không readable.

---

### 3.6 UI Components (MEDIUM)

#### ❌ **Breadcrumbs.tsx**
```tsx
// Line 12: 'text-gray-500' ❌
// Line 18: 'hover:text-gray-900' ❌
// Line 22: 'text-gray-700' ❌
// Line 26: 'text-gray-400' ❌
```

#### ❌ **TableOfContents.tsx**
```tsx
// Line 52: 'border-gray-200' ❌
// Line 53: 'text-gray-500' ❌
// Line 67: 'text-gray-600 hover:text-gray-900' ❌
```

#### ✅ **ThemeToggle.tsx** (ĐÚNG)
Component này đã được implement đúng với dark mode variants:
```tsx
'bg-gray-100 border border-gray-200 dark:bg-white/10 dark:border-white/20'
```

---

## 4. SO SÁNH LIGHT MODE vs DARK MODE

### 4.1 Thiết Kế Dark Mode Gốc (Before Migration)

**Design Language:**
- Background: `#13121b` (deep dark)
- Surface: `rgba(255,255,255,0.04)` (glass effect)
- Text: `#FFFFFF` (white)
- Secondary text: `#9CA3AF` (light gray)
- Borders: `rgba(255,255,255,0.1)` (subtle white)
- Shadows: None (flat design)

**Visual Identity:**
- Glassmorphism heavy
- Neon glows và gradients
- High contrast, futuristic feel
- Dark, premium aesthetic

### 4.2 Light Mode (Current Implementation)

**Design Language:**
- Background: `#FFFFFF` (white)
- Surface: `#FFFFFF` (white cards)
- Text: `#111827` (near black)
- Secondary text: `#4B5563` (medium gray)
- Borders: `#E5E7EB` (light gray)
- Shadows: Subtle drop shadows

**Visual Identity:**
- Clean, modern
- Card-based layout
- Professional, corporate feel
- High readability

### 4.3 Dark Mode Hiện Tại (Broken)

**Thực tế khi toggle sang Dark Mode:**
- Body background: ✅ `#13121b` (đúng)
- Header: ❌ `bg-white/90` (sai - vẫn trắng)
- Nav links: ❌ `text-gray-600` (sai - quá tối)
- Footer: ❌ `bg-gray-50` (sai - trắng sáng)
- Cards: ❌ `bg-white` (sai - trắng trên nền tối)
- Text: ❌ `text-gray-900` (sai - đen trên nền tối = invisible)

**Kết quả:** Giao diện "half-dark, half-light" - không đồng nhất, không professional.

---

## 5. GIẢI PHÁP HỆ THỐNG

### 5.1 Triết Lý Tiếp Cận: "Systematic Replacement, Not Patching"

**KHÔNG nên:**
- ❌ Fix từng component một cách riêng lẻ
- ❌ Thêm `dark:` variants cho mỗi class
- ❌ Hardcode dark mode colors

**NÊN:**
- ✅ Sử dụng CSS variables cho TẤT CẢ colors
- ✅ Refactor thành CSS variable-based utilities
- ✅ Tạo automated tooling để detect hardcoded colors

### 5.2 Giải Pháp 1: Refactor Toàn Bộ sang CSS Variables (RECOMMENDED)

#### Bước 1: Tạo Tailwind Config với CSS Variables

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-secondary': 'var(--bg-secondary)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
      }
    }
  }
}
```

#### Bước 2: Refactor Pattern

**Trước:**
```tsx
<div className="bg-white text-gray-900 border border-gray-200">
```

**Sau:**
```tsx
<div className="bg-surface text-text-primary border border-border">
```

#### Bước 3: Áp Dụng Cho Tất Cả 39 Files

**Priority Order:**
1. 🔴 Layout Components (Header, Footer, BottomNav, Navbar) - 4 files
2. 🔴 High-visibility Landing (Hero, Stats, FinalCTA) - 3 files
3. 🟠 Remaining Landing Components - 11 files
4. 🟠 Service Components - 5 files
5. 🟡 Blog Components - 6 files
6. 🟡 Page Files - 6 files
7. 🟢 UI Components - 4 files

### 5.3 Giải Pháp 2: Hybrid Approach (Fallback)

Nếu không thể refactor toàn bộ ngay, sử dụng `dark:` variants:

```tsx
<div className="
  bg-white dark:bg-[#13121b]
  text-gray-900 dark:text-white
  border-gray-200 dark:border-white/10
">
```

**Nhược điểm:**
- Code dài hơn, khó maintain
- Không scalable
- Không tận dụng được CSS variable system

### 5.4 Giải Pháp 3: Automated Tooling

Tạo script để tự động detect và replace hardcoded colors:

```javascript
// scripts/fix-hardcoded-colors.js
const HARDCODED_PATTERNS = [
  { find: /bg-white/g, replace: 'bg-surface' },
  { find: /bg-gray-50/g, replace: 'bg-[var(--bg-secondary)]' },
  { find: /text-gray-900/g, replace: 'text-[var(--text-primary)]' },
  { find: /text-gray-600/g, replace: 'text-[var(--text-secondary)]' },
  { find: /border-gray-200/g, replace: 'border-[var(--border)]' },
  // ... more patterns
];
```

---

## 6. KẾ HOẠCH THỰC THI

### Phase 1: Foundation (1-2 hours)

**Tasks:**
1. ✅ Update `tailwind.config.js` với CSS variable colors
2. ✅ Create comprehensive color mapping document
3. ✅ Setup automated detection script
4. ✅ Test CSS variables working correctly

**Deliverables:**
- Config file updated
- Detection script ready
- Testing framework in place

---

### Phase 2: Layout Components (2-3 hours)

**Files:**
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/layout/BottomNav.tsx`
- `components/layout/Navbar.tsx`

**Changes:**
- Replace all hardcoded colors with CSS variables
- Use `glass-panel` utility where appropriate
- Test dark/light toggle

**Verification:**
- Header scrolls correctly in both modes
- Footer displays properly in both modes
- BottomNav readable in both modes

---

### Phase 3: Landing Components (4-5 hours)

**Files (14 total):**
- HeroSection, StatsSection, PainPointSection
- SolutionSection, ProcessSection, ServicesGrid
- PricingTable, FAQAccordion, CaseStudyGrid
- FinalCTA, EducationSection, DynamicBadges
- PromoBadge, ServiceHero

**Strategy:**
- Batch similar components together
- Use find-replace with patterns
- Manual review for edge cases

---

### Phase 4: Service & Blog Components (3-4 hours)

**Service Components (5 files):**
- ServiceCardGrid, WhyChooseUs, ServicesIndexHero
- FinalCTA (services), PlatformFilterTabs

**Blog Components (6 files):**
- BlogGrid, FeaturedPost, BlogHero
- SocialShare, BlogSearch, RelatedPosts

---

### Phase 5: Page Files & UI Components (2-3 hours)

**Page Files (6 files):**
- blog/page.tsx, blog/[slug]/page.tsx
- dich-vu/page.tsx, dich-vu/[slug]/page.tsx
- lien-he/page.tsx, bang-gia/page.tsx

**UI Components (4 files):**
- Breadcrumbs, NavigationBack, TableOfContents
- ThemeToggle (already done ✅)

**Critical:** ContactForm needs immediate attention

---

### Phase 6: QA & Testing (2-3 hours)

**Automated Checks:**
```bash
# Verify no hardcoded colors remain
grep -r "bg-white" components/ app/ --exclude-dir=node_modules
grep -r "text-gray-900" components/ app/ --exclude-dir=node_modules
grep -r "border-gray-200" components/ app/ --exclude-dir=node_modules

# Verify CSS variables used
grep -r "var(--bg)" components/ app/ --exclude-dir=node_modules
grep -r "var(--text-primary)" components/ app/ --exclude-dir=node_modules
```

**Manual Testing:**
- Test every page in light mode
- Toggle to dark mode
- Verify every component
- Check mobile responsiveness
- Test on multiple browsers

---

## 7. CHIẾN LƯỢC TESTING

### 7.1 Automated Testing

#### A. ESLint Rule - Hardcoded Colors Detection

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-hardcoded-colors': ['error', {
      forbiddenColors: [
        'bg-white', 'bg-gray-50', 'bg-gray-100',
        'text-gray-900', 'text-gray-600', 'text-gray-500',
        'border-gray-200', 'border-gray-100'
      ],
      allowedPatterns: ['from-', 'to-', 'via-'] // Allow gradients
    }]
  }
}
```

#### B. Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Checking for hardcoded colors..."

HARDCODED=$(grep -r "bg-white\|text-gray-900\|border-gray-200" \
  components/ app/ --include="*.tsx" --exclude-dir=node_modules | \
  grep -v "from-\|to-\|via-" | wc -l)

if [ "$HARDCODED" -gt 0 ]; then
  echo "❌ Found $HARDCODED hardcoded color instances"
  echo "Please use CSS variables instead"
  exit 1
fi

echo "✅ No hardcoded colors found"
```

#### C. CI/CD Pipeline Check

```yaml
# .github/workflows/color-check.yml
name: Color System Check

on: [push, pull_request]

jobs:
  check-colors:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for hardcoded colors
        run: |
          HARD_CODED=$(grep -r "bg-white" components/ app/ --include="*.tsx" | wc -l)
          if [ "$HARD_CODED" -gt 0 ]; then
            echo "::error::Found hardcoded colors"
            exit 1
          fi
```

---

### 7.2 Manual Testing Checklist

#### Desktop (1440px)
- [ ] Homepage - Light mode
- [ ] Homepage - Dark mode
- [ ] Services page - Light mode
- [ ] Services page - Dark mode
- [ ] Blog listing - Light mode
- [ ] Blog listing - Dark mode
- [ ] Blog post - Light mode
- [ ] Blog post - Dark mode
- [ ] Contact page - Light mode
- [ ] Contact page - Dark mode
- [ ] Pricing page - Light mode
- [ ] Pricing page - Dark mode

#### Tablet (768px)
- [ ] All above pages in both modes
- [ ] Header compact view
- [ ] No horizontal overflow

#### Mobile (375px)
- [ ] BottomNav visible in both modes
- [ ] Forms usable in both modes
- [ ] No clipping or overflow

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

### 7.3 Visual Regression Testing

**Tool Recommendation:** Playwright + Percy

```javascript
// tests/visual/theme.spec.js
import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test('should render correctly in light mode', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-light.png');
  });

  test('should render correctly in dark mode', async ({ page }) => {
    await page.goto('/');
    await page.click('[aria-label="Switch to dark mode"]');
    await expect(page).toHaveScreenshot('homepage-dark.png');
  });
});
```

---

## 8. RECOMMENDATIONS & BEST PRACTICES

### 8.1 Development Workflow

1. **Always use CSS variables** for colors that change with theme
2. **Never hardcode** `bg-white`, `text-gray-900`, etc.
3. **Use semantic naming**: `bg-surface`, `text-primary`
4. **Test both modes** before committing
5. **Run automated checks** in CI/CD

### 8.2 Code Review Checklist

- [ ] Are there any hardcoded colors?
- [ ] Does it look good in light mode?
- [ ] Does it look good in dark mode?
- [ ] Are CSS variables used correctly?
- [ ] Is contrast ratio acceptable in both modes?

### 8.3 Future-Proofing

1. **Document the color system** in DESIGN.md
2. **Create a component library** with theme-aware examples
3. **Add Storybook** for visual testing
4. **Implement design tokens** for consistency
5. **Regular audits** every sprint

---

## 9. ESTIMATED EFFORT

| Phase | Hours | Complexity | Risk |
|-------|-------|------------|------|
| Phase 1: Foundation | 2h | Low | Low |
| Phase 2: Layout Components | 3h | Medium | Medium |
| Phase 3: Landing Components | 5h | High | High |
| Phase 4: Service & Blog | 4h | Medium | Medium |
| Phase 5: Pages & UI | 3h | Medium | Medium |
| Phase 6: QA & Testing | 3h | Low | Low |
| **TOTAL** | **20h** | - | - |

**Timeline:** 2-3 working days with dedicated focus

---

## 10. CONCLUSION

### Vấn Đề Chính
Dark Mode không hoạt động vì **39 files đã được migration sang hardcoded light mode colors** thay vì sử dụng CSS variables. Đây là **vấn đề hệ thống**, không phải bug cá biệt.

### Giải Pháp Tối Ưu
**Refactor toàn bộ sang CSS variables** với systematic approach:
1. Setup proper tooling (Tailwind config, ESLint rules, pre-commit hooks)
2. Refactor components theo priority (Layout → Landing → Service → Blog → Pages)
3. Implement automated testing và visual regression
4. Enforce best practices qua code review và CI/CD

### Lợi Ích
- ✅ Dark mode hoạt động hoàn hảo
- ✅ Light mode vẫn giữ nguyên
- ✅ Dễ maintain, scalable
- ✅ Prevents future issues
- ✅ Professional, consistent UI

---

**Người phân tích:** AI Assistant  
**Ngày:** 07/05/2026  
**Trạng thái:** Chờ phê duyệt để thực thi  

---

## APPENDIX A: Color Mapping Reference

### Light Mode → CSS Variable Mapping

| Hardcoded | CSS Variable | Usage |
|-----------|--------------|-------|
| `bg-white` | `var(--surface)` | Cards, containers |
| `bg-gray-50` | `var(--bg-secondary)` | Section backgrounds |
| `bg-gray-100` | `var(--surface-hover)` | Hover states |
| `text-gray-900` | `var(--text-primary)` | Headings, primary text |
| `text-gray-600` | `var(--text-secondary)` | Body text |
| `text-gray-500` | `var(--text-muted)` | Muted text |
| `border-gray-200` | `var(--border)` | Borders |

### Dark Mode Values (via `.dark` class)

| CSS Variable | Dark Value |
|--------------|------------|
| `--bg` | `#13121b` |
| `--bg-secondary` | `#0a0a0f` |
| `--surface` | `#13121b` |
| `--text-primary` | `#FFFFFF` |
| `--text-secondary` | `#9CA3AF` |
| `--border` | `rgba(255,255,255,0.1)` |

---

## APPENDIX B: Quick Fix Commands

### Find All Hardcoded Colors

```bash
# In project root
grep -rn "bg-white" components/ app/ --include="*.tsx" --exclude-dir=node_modules | wc -l
grep -rn "text-gray-900" components/ app/ --include="*.tsx" --exclude-dir=node_modules | wc -l
grep -rn "border-gray-200" components/ app/ --include="*.tsx" --exclude-dir=node_modules | wc -l
```

### Verify CSS Variables Usage

```bash
grep -rn "var(--bg)" components/ app/ --include="*.tsx" --exclude-dir=node_modules | wc -l
grep -rn "var(--text-primary)" components/ app/ --include="*.tsx" --exclude-dir=node_modules | wc -l
```

---

**END OF REPORT**
