# 🚀 KẾ HOẠCH CHI TIẾT: NEXT STEPS RECOMMENDED

> **Ngày lập kế hoạch:** 30/04/2026  
> **Phiên bản:** 1.0  
> **Dựa trên phân tích:** `PHAN_TICH_CA_TRUC_DU_AN.md`  
> **Tài liệu tham chiếu:**
> - `360TuongTac_Website_System_Architecture_v4.md`
> - `360TuongTac_Growth_Blueprint_v1.md`
> - `360TuongTac_Product_Definition.md`
> - `DATA_MODEL_API_DESIGN.md`
> - `NEXTJS_PROJECT_DESIGN.md`

---

## MỤC LỤC

1. [Tổng quan chiến lược](#1-tổng-quan-chiến-lược)
2. [Phase 1: Hoàn thiện & Launch (Tuần 1-2)](#2-phase-1-hoàn-thiện--launch-tuần-1-2)
3. [Phase 2: Analytics & Optimization (Tuần 3-4)](#3-phase-2-analytics--optimization-tuần-3-4)
4. [Phase 3: Content Velocity & Growth (Tháng 2)](#4-phase-3-content-velocity--growth-tháng-2)
5. [Phase 4: CMS & Database (Tháng 3)](#5-phase-4-cms--database-tháng-3)
6. [Phase 5: Advanced Features (Tháng 4-6)](#6-phase-5-advanced-features-tháng-4-6)
7. [KPIs & Success Metrics](#7-kpis--success-metrics)
8. [Risk Management](#8-risk-management)
9. [Resource Requirements](#9-resource-requirements)
10. [Checklist hành động ngay](#10-checklist-hành-động-ngay)

---

## 1. TỔNG QUAN CHIẾN LƯỢC

### 1.1 Hiện trạng dự án

```
┌──────────────────────────────────────────────────────────────┐
│  PHASE 1 (STATIC SITE) - 80% HOÀN THÀNH                      │
│                                                              │
│  ✅ ĐÃ XONG:                                                 │
│     - 12 service landing pages (100%)                        │
│     - 15 blog posts (100%)                                   │
│     - 41 components (100%)                                   │
│     - SEO metadata + JSON-LD schemas (100%)                  │
│     - Internal linking matrix (100%)                         │
│                                                              │
│  🔴 CẦN LÀM NGAY:                                            │
│     - Analytics & Tracking APIs (0%)                         │
│     - 3 missing core pages (62.5%)                           │
│     - Zalo Chat Widget (0%)                                  │
│     - Contact form testing (0%)                              │
│                                                              │
│  ⚪ PHASE 2 (FUTURE):                                        │
│     - Payload CMS integration                                │
│     - PostgreSQL database                                    │
│     - Admin dashboard                                        │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Nguyên tắc thực hiện

Theo **Growth Blueprint v1** và **Architecture v4**:

1. **SEO-First, Zero Paid Ads** - Không dùng Google Ads, rank organic
2. **Education before Selling** - Giáo dục khách hàng trước khi bán
3. **Measure Everything** - Tracking conversion từ ngày 1
4. **AI-Powered Content** - Scale content velocity bằng AI
5. **Trust Building** - Social proof thật, case study thật

### 1.3 Timeline tổng quan

```
THÁNG 1 (Tuần 1-4): PHASE 1 + 2 - "BUILD FOUNDATION"
├── Tuần 1-2: Hoàn thiện core features + Launch
└── Tuần 3-4: Analytics + Optimization

THÁNG 2 (Tuần 5-8): PHASE 3 - "AMPLIFY & TEST"
├── Content velocity (5 blogs/tuần)
├── Social media activation
└── Conversion optimization

THÁNG 3 (Tuần 9-12): PHASE 4 - "SYSTEMATIZE"
├── CMS integration (Payload CMS)
├── PostgreSQL database
└── Admin dashboard

THÁNG 4-6: PHASE 5 - "SCALE"
├── Advanced analytics
├── YouTube channel
├── Community building
└── Retention engine
```

---

## 2. PHASE 1: HOÀN THIỆN & LAUNCH (TUẦN 1-2)

> **Mục tiêu:** Launch website với đầy đủ core features, sẵn sàng nhận traffic

### 2.1 Sprint 1.1: Missing Core Pages (2-3 ngày)

#### Task 1.1.1: Build `/quy-trinh` Page

**File cần tạo:** `app/quy-trinh/page.tsx`

**Nội dung theo Architecture v4 Section 5.4:**

```
H1: "Quy Trình Đặt Hàng – Bắt Đầu Trong 5 Phút"

Step 1: Chọn gói & Đặt hàng (30 giây)
  → Chọn gói phù hợp
  → Thanh toán qua MoMo/ZaloPay/VietQR
  
Step 2: Cung cấp link livestream (1 phút)
  → Không cần mật khẩu
  → Không cần quyền truy cập tài khoản
  
Step 3: Viewer vào trong 5 phút (Tự động)
  → Hệ thống auto điều phối
  → Viewer ổn định suốt buổi live
  
Step 4: Nhận kết quả & Tái đặt hàng
  → TikTok nhận tín hiệu tốt
  → Phân phối tự nhiên tăng
  → Liên hệ gia hạn/nâng cấp
```

**Components cần dùng:**
- `ProcessSection` (tái sử dụng từ landing pages)
- `FAQAccordion` (5-8 FAQs về quy trình)
- `FinalCTA` (CTA cuối trang)

**SEO Requirements:**
- Meta title: "Quy Trình Đặt Hàng Tăng Viewer TikTok | 360TuongTac"
- Meta description: "Chỉ 4 bước đơn giản để kích hoạt thuật toán TikTok..."
- FAQPage JSON-LD schema
- BreadcrumbList schema

**Estimated time:** 3-4 giờ

---

#### Task 1.1.2: Build `/ve-chung-toi` Page

**File cần tạo:** `app/ve-chung-toi/page.tsx`

**Nội dung theo Architecture v4 Section 2.2:**

```
H1: "Về 360TuongTac – Chuyên Gia Tăng Trưởng TikTok"

Section 1: Mission & Vision
  → Sứ mệnh: Giúp chủ shop TikTok tăng trưởng bền vững
  → Tầm nhìn: Trở thành nền tảng TikTok Growth #1 Việt Nam

Section 2: Timeline & Milestones
  → 2023: Thành lập
  → 4,200+ buổi livestream đã kích hoạt
  → 8,000+ đơn hàng đã xử lý
  → 3,200+ khách hàng hài lòng

Section 3: Why Choose Us (5 USPs)
  ✅ TikTok-First Positioning
  ✅ Education-First Approach
  ✅ Transparent & Trust
  ✅ SEO-Native Strategy
  ✅ AI-Powered Content

Section 4: Team (nếu có)
  → Founder photo + bio
  → CSKH team

Section 5: Trust Signals
  → Certifications (nếu có)
  → Partners (mualike.pro)
  → Media mentions (nếu có)
```

**Components cần tạo mới:**
- `MissionVisionSection` (hoặc dùng existing)
- `TimelineSection`
- `TeamSection` (optional)

**SEO Requirements:**
- Meta title: "Về 360TuongTac | Chuyên Gia Tăng Trưởng TikTok"
- Organization JSON-LD schema
- BreadcrumbList schema

**Estimated time:** 4-5 giờ

---

#### Task 1.1.3: Build `/faq` Page

**File cần tạo:** `app/faq/page.tsx`

**Nội dung theo Architecture v4 Section 8:**

```
H1: "Câu Hỏi Thường Gặp – 360TuongTac"

Category 1: Dịch vụ TikTok
  Q1-Q10: FAQs về tăng mắt, seeding, follow

Category 2: Thanh toán & Bảo mật
  Q11-Q15: FAQs về payment, refund, security

Category 3: Thuật toán & Kỹ thuật
  Q16-Q20: FAQs về TikTok algorithm

Category 4: Hỗ trợ khách hàng
  Q21-Q25: FAQs về support, contact
```

**Data source:** Tổng hợp FAQs từ tất cả 12 service landing pages

**Components cần dùng:**
- `FAQAccordion` (tái sử dụng, nhóm theo category)

**SEO Requirements:**
- Meta title: "FAQ – Câu Hỏi Thường Gặp | 360TuongTac"
- FAQPage JSON-LD schema (TẤT CẢ FAQs trên 1 page)
- BreadcrumbList schema
- AEO optimized (viết dạng câu trả lời hoàn chỉnh)

**Estimated time:** 3-4 giờ

---

### 2.2 Sprint 1.2: Zalo Chat Widget (1 ngày)

#### Task 1.2.1: Integrate Zalo OA Widget

**Architecture v4 yêu cầu:**
> "Zalo Chat Widget nổi bật ở bottom-right của website"

**Implementation:**

1. **Lấy Zalo OA code:**
   - Đăng nhập: https://oa.zalo.me
   - Vào Settings → Chat Widget
   - Copy embed code

2. **Tạo component:** `components/layout/ZaloChatWidget.tsx`

```tsx
'use client'

import { useEffect } from 'react'

export default function ZaloChatWidget() {
  useEffect(() => {
    // Inject Zalo widget script
    const script = document.createElement('script')
    script.src = 'https://sp.zalo.me/plugins/sdk.js'
    script.async = true
    document.body.appendChild(script)
    
    // Initialize widget
    window.zaloInit?.({
      appId: 'YOUR_ZALO_APP_ID',
      selector: '#zalo-chat-widget'
    })
  }, [])

  return <div id="zalo-chat-widget" />
}
```

3. **Add to layout:** `app/layout.tsx`

```tsx
import ZaloChatWidget from '@/components/layout/ZaloChatWidget'

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Header />
        {children}
        <Footer />
        <BottomNav />
        <ZaloChatWidget />  {/* ← Add here */}
      </body>
    </html>
  )
}
```

**SEO Impact:**
- ✅ Giảm bounce rate (khách có thể hỏi ngay)
- ✅ Tăng conversion rate (reduce friction)
- ✅ Trust signal (professional support)

**Estimated time:** 2-3 giờ

---

### 2.3 Sprint 1.3: Contact Form Testing (1 ngày)

#### Task 1.3.1: Test `/api/contact/route.ts`

**Kiểm tra:**
1. Form submission có hoạt động?
2. Validation có đúng?
3. Error handling có tốt?
4. Success message có hiển thị?

**Architecture v4 yêu cầu:**
> "Contact form → Telegram bot notification → CSKH follow-up trong 5 phút"

**Implementation (nếu chưa có):**

```typescript
// app/api/contact/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, message, service } = body

    // Validate
    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Phone và message là bắt buộc' },
        { status: 400 }
      )
    }

    // Save to database (Phase 2) hoặc send email
    // For Phase 1: Send to Telegram bot
    
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID
    
    const telegramMessage = `
🔔 LEAD MỚI từ ${name}
📞 Phone: ${phone}
📧 Email: ${email || 'N/A'}
💬 Service: ${service || 'N/A'}
📝 Message: ${message}
    `.trim()

    await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramMessage,
          parse_mode: 'HTML'
        })
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Đã gửi yêu cầu thành công!'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
```

**Test checklist:**
- [ ] Submit form với đầy đủ data → Success
- [ ] Submit form thiếu phone → Error validation
- [ ] Submit form thiếu message → Error validation
- [ ] Telegram bot nhận được notification
- [ ] Success message hiển thị cho user
- [ ] Error message hiển thị khi fail

**Estimated time:** 3-4 giờ

---

### 2.4 Sprint 1.4: Final Testing & Launch (1-2 ngày)

#### Task 1.4.1: Cross-Browser Testing

**Test trên:**
- [ ] Chrome (Desktop + Mobile)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop + iOS)
- [ ] Edge (Desktop)

**Test items:**
- [ ] Layout responsive (mobile, tablet, desktop)
- [ ] All links work (internal + external)
- [ ] Forms submit correctly
- [ ] Images load properly
- [ ] Animations smooth
- [ ] SEO metadata correct (view page source)
- [ ] JSON-LD schemas validate (Google Rich Results Test)

---

#### Task 1.4.2: Performance Testing

**Tools:**
- Google PageSpeed Insights: https://pagespeed.web.dev
- Lighthouse (Chrome DevTools)
- WebPageTest: https://www.webpagetest.org

**Target scores:**
- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 95

**Optimization nếu cần:**
- Image compression
- Code splitting
- Lazy loading
- Font optimization

---

#### Task 1.4.3: SEO Validation

**Tools:**
- Google Search Console: https://search.google.com/search-console
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org

**Checklist:**
- [ ] Submit sitemap.xml to GSC
- [ ] Test robots.txt
- [ ] Validate JSON-LD schemas
- [ ] Check canonical URLs
- [ ] Verify meta titles/descriptions
- [ ] Test internal links
- [ ] Check for broken links

---

#### Task 1.4.4: Launch!

**Deployment steps:**

1. **Build production:**
```bash
npm run build
npm start
```

2. **Deploy to VPS:**
```bash
# Push to GitHub
git add .
git commit -m "Phase 1 complete - Ready for launch"
git push origin main

# Dokploy auto-deploy từ GitHub
# Hoặc manual deploy:
docker compose up -d --build
```

3. **Configure Cloudflare:**
- DNS: A record → VPS IP (14.225.224.130)
- SSL/TLS: Full (strict)
- CDN: Cache static assets
- DDoS protection: Enable

4. **Verify live site:**
- https://grow.360tuongtac.com
- All pages accessible
- HTTPS working
- Performance acceptable

**Estimated time:** 4-6 giờ

---

## 3. PHASE 2: ANALYTICS & OPTIMIZATION (TUẦN 3-4)

> **Mục tiêu:** Implement tracking để đo lường performance, optimize conversion rate

### 3.1 Sprint 2.1: Google Analytics 4 (GA4) Integration (2 ngày)

#### Task 2.1.1: Setup GA4 Property

**Steps:**
1. Tạo GA4 property: https://analytics.google.com
2. Lấy Measurement ID: `G-XXXXXXXXXX`
3. Add to `.env.local`:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

#### Task 2.1.2: Create GA4 Component

**File:** `components/layout/GoogleAnalytics.tsx`

```tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Script from 'next/script'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      // Send pageview on route change
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pathname + searchParams.toString(),
      })
    }
  }, [pathname, searchParams])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  )
}
```

**Add to layout:** `app/layout.tsx`

```tsx
import GoogleAnalytics from '@/components/layout/GoogleAnalytics'

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <GoogleAnalytics />  {/* ← Add here */}
        <Header />
        {children}
        <Footer />
        <ZaloChatWidget />
      </body>
    </html>
  )
}
```

---

#### Task 2.1.3: Setup Custom Events

**Events cần track (theo Architecture v4 Section 11):**

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `click_order_cta` | User clicks "Đặt hàng" | `service_name`, `cta_location` |
| `click_zalo_cta` | User clicks "Tư vấn Zalo" | `service_name`, `cta_location` |
| `view_pricing_table` | User scrolls to pricing | `service_name` |
| `expand_faq` | User expands FAQ | `question`, `service_name` |
| `submit_contact_form` | User submits contact form | `source`, `service` |
| `scroll_depth_75` | User scrolls 75% page | `page_path` |

**Implementation:**

```typescript
// lib/analytics.ts
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Usage in components:
import { trackEvent } from '@/lib/analytics'

<button onClick={() => {
  trackEvent('click_order_cta', {
    service_name: 'tang-mat-livestream-tiktok',
    cta_location: 'hero'
  })
  // ... redirect to order page
}}>
  Đặt hàng ngay
</button>
```

**Estimated time:** 6-8 giờ

---

### 3.2 Sprint 2.2: Custom Tracking APIs (2-3 ngày)

**Theo DATA_MODEL_API_DESIGN.md Section 3.2**

#### Task 2.2.1: Page View Tracking API

**File:** `app/api/track/page-view/route.ts`

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { path, referrer, device, browser } = body

    // Phase 1: Log to console hoặc send to external analytics
    // Phase 2: Save to PostgreSQL
    
    console.log('[PageView]', {
      path,
      referrer,
      device,
      browser,
      timestamp: new Date().toISOString()
    })

    // Fire and forget to GA4 (optional)
    // trackEvent('page_view', { page_path: path })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    )
  }
}
```

---

#### Task 2.2.2: CTA Click Tracking API

**File:** `app/api/track/cta/route.ts`

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { path, ctaType, ctaLocation, serviceName } = body

    // Phase 1: Log to console
    // Phase 2: Save to PostgreSQL

    console.log('[CTAClick]', {
      path,
      ctaType,      // primary | secondary | tertiary
      ctaLocation,  // hero | pricing | final_cta | inline
      serviceName,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track CTA click' },
      { status: 500 }
    )
  }
}
```

---

#### Task 2.2.3: Create Tracking Hooks

**File:** `lib/hooks/useTracking.ts`

```typescript
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function usePageViewTracking() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    fetch('/api/track/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer,
        device: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: navigator.userAgent
      })
    }).catch(() => {
      // Silently fail - tracking shouldn't break UX
    })
  }, [pathname])
}
```

**Usage:** Add to `app/layout.tsx` hoặc client components

**Estimated time:** 6-8 giờ

---

### 3.3 Sprint 2.3: Google Search Console & Bing Webmaster (1 ngày)

#### Task 2.3.1: Submit to Google Search Console

**Steps:**
1. Go to: https://search.google.com/search-console
2. Add property: `grow.360tuongtac.com`
3. Verify ownership (DNS record hoặc HTML file)
4. Submit sitemap: `https://grow.360tuongtac.com/sitemap.xml`
5. Request indexing for priority pages:
   - Homepage
   - 12 service landing pages
   - 15 blog posts

---

#### Task 2.3.2: Submit to Bing Webmaster Tools

**Steps:**
1. Go to: https://www.bing.com/webmasters
2. Add site: `grow.360tuongtac.com`
3. Verify ownership
4. Submit sitemap

**Estimated time:** 2-3 giờ

---

### 3.4 Sprint 2.4: Conversion Rate Optimization (2-3 ngày)

#### Task 2.4.1: Setup Microsoft Clarity (Heatmaps)

**Steps:**
1. Create project: https://clarity.microsoft.com
2. Get Project ID
3. Add to `.env.local`:
```env
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
```

4. Create component: `components/layout/MicrosoftClarity.tsx`

```tsx
'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function MicrosoftClarity() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).clarity?.('init', process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID)
    }
  }, [])

  return (
    <Script
      id="clarity-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
        `,
      }}
    />
  )
}
```

**Benefits:**
- Heatmaps (click, scroll, move)
- Session recordings
- Rage clicks detection
- Dead clicks detection

---

#### Task 2.4.2: A/B Testing Setup (Optional)

**Tools:**
- Google Optimize (discontinued) → Use **VWO** hoặc **Optimizely**
- Hoặc: Simple A/B test với cookie-based routing

**Test ideas:**
- CTA button color (primary vs accent)
- CTA text ("Đặt hàng ngay" vs "Bắt đầu trong 5 phút")
- Pricing table layout (3 columns vs 4 columns)
- Hero image (illustration vs photo)

**Estimated time:** 4-6 giờ

---

## 4. PHASE 3: CONTENT VELOCITY & GROWTH (THÁNG 2)

> **Mục tiêu:** Scale content production, activate social channels, optimize conversion

### 4.1 Content Acceleration (AI-Powered)

#### Task 3.1.1: Scale Blog to 5 Articles/Week

**Workflow theo Growth Blueprint v1 Section 5.5:**

```
BƯỚC 1: Research (AI, 2h/tuần)
  → Google AI Studio research long-tail keywords
  → Export to spreadsheet
  → Prioritize: Volume × (1/Competition) × Buyer Intent

BƯỚC 2: Content Brief (AI, 30 phút/bài)
  → Generate H1, H2, H3 structure
  → Key points to cover
  → Internal link suggestions
  → CTA recommendations

BƯỚC 3: Content Generation (AI draft 70%, Human edit 30%)
  → AI generate full draft
  → Human edit: Add real case studies, real data, brand voice
  → SEO check: Keyword density, meta tags, internal links

BƯỚC 4: Repurpose (1 bài blog → 5-7 pieces)
  → 3 TikTok scripts (different angles)
  → 2 Facebook posts (long + short)
  → 1 YouTube video outline
  → 1 Zalo OA newsletter snippet

BƯỚC 5: Distribution (Automate with Stitch/n8n)
  → Blog published → Auto create social posts
  → Alert team to shoot TikTok videos
```

**Content Calendar (Tháng 2):**

| Tuần | Blog Posts (5/tuần) | Social Posts |
|------|---------------------|--------------|
| Tuần 5 | 2 TikTok algorithm + 2 Seeding guides + 1 Case study | 10 Facebook + 7 TikTok |
| Tuần 6 | 2 Troubleshooting + 2 Platform comparisons + 1 News | 10 Facebook + 7 TikTok |
| Tuần 7 | 2 Education + 2 How-to + 1 Case study | 10 Facebook + 7 TikTok |
| Tuần 8 | 2 Buying guides + 2 Tips + 1 Review | 10 Facebook + 7 TikTok |

**Total Tháng 2:** 20 blog posts + 40 Facebook posts + 28 TikTok videos

---

#### Task 3.1.2: TikTok Content Series

**Series 1: "Bóc mẽ thuật toán TikTok"** (Hook mạnh nhất)

```
Hook: "Tại sao livestream của bạn chỉ có 2 người xem?
       Đây là thứ TikTok không nói cho bạn biết 👇"
Nội dung: Giải thích 1 cơ chế thuật toán cụ thể
CTA: "Link bio để xem giải pháp đầy đủ"
```

**Series 2: "Trước – Sau"** (Trust builder mạnh nhất)

```
Hook: "Shop này từ 0 viewer → 500 viewer livestream trong 3 ngày"
Nội dung: Show số liệu thật, giải thích tại sao
CTA: "Bình luận 'TƯ VẤN' để nhận hỗ trợ"
```

**Series 3: "Hỏi đáp chủ shop TikTok"** (Authority builder)

```
Hook: "Câu hỏi hay nhất tuần này từ chủ shop của chúng tôi:"
Nội dung: Trả lời 1 câu hỏi thực tế về TikTok/livestream
CTA: "Bình luận câu hỏi của bạn 👇"
```

**Tần suất:** 1 video/ngày (tối thiểu), 3-5 video/ngày (lý tưởng)

---

### 4.2 Facebook Activation

#### Task 3.2.1: Content Calendar Implementation

**Theo Growth Blueprint v1 Section 1.2:**

| Ngày | Loại Content | Ví dụ |
|------|-------------|-------|
| Thứ 2 | Education (60%) | "3 lý do TikTok không đẩy livestream của bạn" |
| Thứ 3 | Education (60%) | "Thuật toán TikTok hoạt động thế này (2025)" |
| Thứ 4 | Social Proof (25%) | Case study khách hàng + số liệu trước/sau |
| Thứ 5 | Education (60%) | Tips seeding comment hiệu quả |
| Thứ 6 | Offer (15%) | Ưu đãi cuối tuần / gói combo |
| Thứ 7 | Social Proof (25%) | Testimonial + screenshot kết quả |
| CN | Community | Hỏi đáp, poll, tương tác |

**Budget:** Boost 50-100k/post cho 3-5 post tốt nhất/tuần

---

### 4.3 YouTube Channel Launch

#### Task 3.3.1: Create YouTube Channel

**Setup:**
1. Create channel: "360TuongTac"
2. Branding: Logo, banner, description
3. Link to website: https://grow.360tuongtac.com
4. Link to socials: Facebook, TikTok, Zalo

---

#### Task 3.3.2: Upload First Videos

**Video 1 (Tuần 5-6):** "Hướng dẫn tăng viewer TikTok 2025 từ A-Z"
- Format: Tutorial 10-15 phút
- SEO: Title = keyword chính + benefit
- Description: 300+ từ với keywords
- Transcript: Upload để Google index

**Video 2 (Tuần 7-8):** "Case study thật: Shop từ 0 đến [X] đơn"
- Format: Documentary 8-12 phút
- Show real screenshots
- Interview customer (nếu có)

**Video 3 (Tuần 8):** "So sánh dịch vụ SMM TikTok uy tín"
- Format: Review 10 phút
- Compare 3-5 providers
- Honest pros/cons

---

## 5. PHASE 4: CMS & DATABASE (THÁNG 3)

> **Mục tiêu:** Transition từ static data sang CMS để non-technical user quản lý content

### 5.1 Payload CMS Integration

#### Task 4.1.1: Setup Payload CMS

**Theo DATA_MODEL_API_DESIGN.md Section 2:**

```bash
# Install Payload CMS
npm install payload @payloadcms/db-postgresql @payloadcms/next

# Setup database
docker run -d \
  --name 360tuongtac-postgres \
  -e POSTGRES_DB=360tuongtac_production \
  -e POSTGRES_USER=360tuongtac_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:16-alpine
```

---

#### Task 4.1.2: Define Collections

**Collections theo Data Model:**

```typescript
// payload.config.ts
export default buildConfig({
  collections: [
    LandingPages,    // 12 transactional landing pages
    BlogPosts,       // Blog content hub
    CaseStudies,     // Trust signals
    FAQItems,        // FAQ sections
    Leads,           // Lead capture
    PageViews,       // Traffic tracking
    CTAClicks,       // Conversion tracking
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
```

---

#### Task 4.1.3: Migrate Static Data to CMS

**Migration script:**

```typescript
// scripts/migrate-data.ts
import { SERVICES_LIST } from '@/data/services'
import { BLOG_LIST } from '@/data/blog'

async function migrateServices() {
  for (const [slug, service] of Object.entries(SERVICES_LIST)) {
    await payload.create({
      collection: 'landing-pages',
      data: {
        slug: service.slug,
        title: service.title,
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,
        content: service.content,
        status: 'published',
        publishedAt: new Date(),
      },
    })
  }
}

async function migrateBlogs() {
  for (const [slug, post] of Object.entries(BLOG_LIST)) {
    await payload.create({
      collection: 'blog-posts',
      data: {
        slug: post.slug,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        status: 'published',
        publishedAt: new Date(),
      },
    })
  }
}
```

---

### 5.2 API Integration

#### Task 4.2.1: Update Data Fetching

**Before (Phase 1 - Static):**
```typescript
import { SERVICES_LIST } from '@/data/services'

const service = SERVICES_LIST[slug]
```

**After (Phase 2 - CMS):**
```typescript
import { getLandingPage } from '@/lib/api'

const service = await getLandingPage(slug)
```

**API client:** `lib/api.ts` (theo NEXTJS_PROJECT_DESIGN.md Section 3)

---

## 6. PHASE 5: ADVANCED FEATURES (THÁNG 4-6)

> **Mục tiêu:** Scale, automate, build retention engine

### 6.1 Advanced Analytics

#### Task 5.1.1: Custom Dashboard

**Build admin dashboard với:**
- Traffic overview (GA4 integration)
- Conversion funnel
- Top landing pages
- Top blog posts
- CTA click rates
- Lead tracking
- Revenue tracking (từ mualike.pro API)

**Tech stack:**
- Recharts (đã có trong dependencies)
- Next.js API routes
- PostgreSQL queries

---

### 6.2 Retention Engine

#### Task 5.2.1: Zalo OA Newsletter

**Automation workflow:**

```
Day 1 after purchase:
  → Auto-send: "Cảm ơn anh/chị đã dùng dịch vụ!"
  
Day 3:
  → Auto-send: "Livestream hôm qua có nhiều viewer hơn không ạ?"
  
Day 7:
  → Auto-send: "Anh/chị có cần gia hạn gói không ạ? Tặng 10%!"
  
Day 14 (if no reorder):
  → Auto-send: Case study mới + offer ưu đãi
  
Day 30 (if no reorder):
  → CSKH manual outreach
```

**Tools:**
- Zalo OA API
- n8n/Stitch automation
- Webhook integration

---

### 6.3 Community Building

#### Task 5.3.1: Facebook Group

**Setup:**
- Group name: "Cộng Đồng Chủ Shop TikTok"
- Description: Nơi chia sẻ tips tăng trưởng TikTok
- Rules: No spam, helpful only
- Admin: Founder + CSKH team

**Content strategy:**
- Founder trả lời 5-10 câu hỏi/ngày
- Weekly live Q&A sessions
- Share case studies
- Exclusive offers for group members

---

### 6.4 Referral Program

#### Task 5.4.1: Implement Referral System

**Logic:**
```
Customer leaves 4-5 star review
  → Auto-send: "Bạn nhận 50k khi giới thiệu bạn bè đặt hàng đầu tiên"
  
Friend uses referral code
  → Both get 50k credit
  
Track in database:
  - Referral code
  - Referred customers
  - Credit balance
```

---

## 7. KPIS & SUCCESS METRICS

### 7.1 Phase 1-2 KPIs (Tháng 1)

| Metric | Target | Tracking Method |
|--------|--------|-----------------|
| **Launch website** | ✅ Live | Manual check |
| **Organic sessions** | 300-500/month | GA4 |
| **Keywords Top 20** | 5-10 keywords | Google Search Console |
| **Conversion rate** | 0.5-1% | GA4 events |
| **Zalo conversations** | 20-50/month | Zalo OA dashboard |
| **New customers** | 3-8 | mualike.pro + UTM |

### 7.2 Phase 3 KPIs (Tháng 2)

| Metric | Target | Tracking Method |
|--------|--------|-----------------|
| **Organic sessions** | 1,000-1,500/month | GA4 |
| **Blog posts published** | 20 posts | CMS |
| **TikTok followers** | 2,000-3,000 | TikTok analytics |
| **Keywords Top 10** | 5-10 keywords | GSC |
| **Conversion rate** | 1.5-2% | GA4 events |
| **New customers** | 10-20/week | mualike.pro + UTM |

### 7.3 Phase 4 KPIs (Tháng 3)

| Metric | Target | Tracking Method |
|--------|--------|-----------------|
| **Organic sessions** | 3,000-5,000/month | GA4 |
| **CMS admin users** | 2-3 users | Payload CMS |
| **Content update frequency** | 5 blogs/week | CMS |
| **Keywords Top 5** | 5+ keywords | GSC |
| **Conversion rate** | 2.5-3.5% | GA4 events |
| **Repeat purchase rate** | 30-40% | mualike.pro |

### 7.4 Long-term KPIs (Tháng 6)

| Metric | Target |
|--------|--------|
| **Total monthly visitors** | 11,000-15,000 |
| **Keywords Top 10** | 40-60 |
| **Monthly revenue** | 18M-30M VNĐ |
| **Customer LTV** | 800K VNĐ |
| **Re-order rate** | 50% |

---

## 8. RISK MANAGEMENT

### 8.1 Risk Matrix

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Subdomain mới, SEO authority thấp** | Cao | 100% | Cross-linking từ 360tuongtac.com, submit GSC ngay |
| **Không có analytics → blind decisions** | Cao | 100% (hiện tại) | **Implement GA4 trong Phase 2** |
| **Content không update thường xuyên** | Cao | Trung bình | Phase 2: CMS, AI content generation |
| **Competitor copy education approach** | Cao | Thấp | First-mover advantage, AEO/GEO, community |
| **TikTok policy changes** | Trung bình | Thấp | Diversify services across platforms |
| **mualike.pro shutdown** | Cao | Rất thấp | Have backup SMM provider ready |
| **Team burnout (3 người)** | Trung bình | Trung bình | AI automation, content templates |

### 8.2 Contingency Plans

**Plan A (Preferred):** SEO-First, Organic Growth
- Follow kế hoạch trên
- Timeline: 3-6 months to profitability

**Plan B (If SEO too slow):** Hybrid Approach
- Keep SEO foundation
- Add Facebook Ads retargeting (50-100k/ngày)
- Focus on high-intent keywords
- Timeline: 1-2 months to first revenue

**Plan C (If conversion low):** Optimize Funnel
- A/B test landing pages
- Add more social proof
- Improve CTA placement
- Timeline: 2-4 weeks to see improvement

---

## 9. RESOURCE REQUIREMENTS

### 9.1 Team

| Role | Current | Needed | Responsibilities |
|------|---------|--------|------------------|
| **Founder/Developer** | ✅ 1 | 1 | Development, deployment, automation |
| **CSKH** | ✅ 1-2 | 2 | Zalo support, lead follow-up, testimonials |
| **Content/Marketing** | ❌ 0 | 1 (part-time) | Blog writing, social media, TikTok videos |

### 9.2 Tools & Infrastructure

| Tool | Cost | Purpose |
|------|------|---------|
| **VPS (NexOS)** | ~$40/tháng | Hosting Next.js app |
| **Cloudflare** | Free | CDN, DNS, DDoS protection |
| **Google Analytics 4** | Free | Web analytics |
| **Google Search Console** | Free | SEO monitoring |
| **Microsoft Clarity** | Free | Heatmaps, session recordings |
| **Zalo OA** | Free | Customer support |
| **Payload CMS (self-hosted)** | Free | Content management (Phase 2) |
| **PostgreSQL (Docker)** | Free | Database (Phase 2) |
| **Google AI Studio** | Free tier | AI content generation |
| **Stitch/n8n** | Free tier | Automation workflows |
| **Total monthly cost** | **~$40** | |

### 9.3 Budget Allocation (Tháng 1-3)

| Category | Month 1 | Month 2 | Month 3 | Total |
|----------|---------|---------|---------|-------|
| **Infrastructure** | $40 | $40 | $40 | $120 |
| **Facebook Ads (testing)** | $0 | $100 | $200 | $300 |
| **Content production** | $0 | $50 | $100 | $150 |
| **Tools & Software** | $0 | $20 | $50 | $70 |
| **Total** | **$40** | **$210** | **$390** | **$640** |

---

## 10. CHECKLIST HÀNH ĐỘNG NGAY

### ✅ Tuần 1 (Ngày 1-7): Foundation

- [ ] **Day 1:** Read this plan completely
- [ ] **Day 1-2:** Build `/quy-trinh` page
- [ ] **Day 2-3:** Build `/ve-chung-toi` page
- [ ] **Day 3-4:** Build `/faq` page
- [ ] **Day 4:** Setup Zalo OA widget
- [ ] **Day 5:** Test contact form + Telegram integration
- [ ] **Day 5-6:** Cross-browser testing
- [ ] **Day 6-7:** Performance optimization
- [ ] **Day 7:** **LAUNCH WEBSITE!** 🚀

### ✅ Tuần 2 (Ngày 8-14): Analytics

- [ ] **Day 8-9:** Setup GA4 property + integrate
- [ ] **Day 9-10:** Implement custom events tracking
- [ ] **Day 10-11:** Build page view + CTA tracking APIs
- [ ] **Day 11:** Setup Microsoft Clarity
- [ ] **Day 12:** Submit to Google Search Console
- [ ] **Day 12:** Submit to Bing Webmaster Tools
- [ ] **Day 13-14:** Monitor analytics, fix issues

### ✅ Tuần 3-4: Content & Optimization

- [ ] **Week 3:** Publish 5 blog posts
- [ ] **Week 3:** Create 7 TikTok videos
- [ ] **Week 3:** Post 10 Facebook posts
- [ ] **Week 4:** Publish 5 more blog posts
- [ ] **Week 4:** Create 7 more TikTok videos
- [ ] **Week 4:** Review analytics, optimize CRO
- [ ] **Week 4:** Plan Phase 3 (Month 2)

---

## PHÊ DUYỆT KẾ HOẠCH

**Kế hoạch này cần được review và phê duyệt trước khi triển khai.**

### Review Checklist:

- [ ] Đã đọc toàn bộ kế hoạch?
- [ ] Đồng ý với priority của các tasks?
- [ ] Timeline có realistic không?
- [ ] Resource allocation có đủ không?
- [ ] Có tasks nào cần thêm/bớt không?
- [ ] KPIs có phù hợp không?

### Approval:

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Project Owner** | | | |
| **Developer** | | | |
| **Marketing Lead** | | | |

---

**📝 Tài liệu này được tạo tự động từ phân tích codebase + 5 tài liệu architecture.**  
**🔄 Cập nhật lần cuối:** 30/04/2026  
**📌 Status:** Chờ review & phê duyệt
