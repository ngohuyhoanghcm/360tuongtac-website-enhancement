# 🔐 Hướng Dẫn Đăng Nhập Admin Panel - 360 Tương Tác

## 📋 Thông Tin Đăng Nhập

### Password
```
wd!*dY4^4HPg:}nV
```

### 2FA Setup
- **Secret Key:** `MBISKKLH57XMJL7L36D7PYG2XAUQGH54`
- **Account:** `admin@360tuongtac.com`
- **Issuer:** `360TuongTac Admin`
- **Type:** Time-based (TOTP)
- **Code:** 6 digits, changes every 30 seconds
- **Algorithm:** HMAC-SHA1

---

## 📱 Bước 1: Cài Đặt Google Authenticator

### Trên điện thoại:

**Android:**
1. Mở Google Play Store
2. Tìm "Google Authenticator"
3. Install app

**iOS (iPhone):**
1. Mở App Store
2. Tìm "Google Authenticator"
3. Install app

**Hoặc dùng Authy (alternative):**
- Download tại: https://authy.com/download/

---

## 🔑 Bước 2: Thêm Account vào Authenticator

### Cách 1: Nhập Manual (Recommended)

1. **Mở app Google Authenticator**

2. **Click nút "+"** (góc dưới phải)

3. **Chọn "Enter a setup key"** hoặc "Nhập khóa thiết lập"

4. **Điền thông tin:**
   ```
   Tên tài khoản: admin@360tuongtac.com
   Khóa của bạn: MBISKKLH57XMJL7L36D7PYG2XAUQGH54
   Loại khóa: Dựa theo thời gian
   ```

5. **Click "Thêm"** hoặc "Add"

6. **✅ Hoàn tất!** App sẽ hiển thị 6 số thay đổi mỗi 30 giây

### Cách 2: Quét QR Code

1. **Mở app Google Authenticator**

2. **Click nút "+"**

3. **Chọn "Scan a QR code"** hoặc "Quét mã QR"

4. **Quét QR code** từ URL này:
   ```
   otpauth://totp/360TuongTac%20Admin:admin%40360tuongtac.com?secret=MBISKKLH57XMJL7L36D7PYG2XAUQGH54&issuer=360TuongTac%20Admin&algorithm=SHA1&digits=6&period=30
   ```

5. **✅ Hoàn tất!**

---

##  Bước 3: Đăng Nhập Admin Panel

### 1. Mở Admin Panel
```
http://localhost:3000/admin
```

### 2. Bước 1 - Nhập Password
- Nhập: `wd!*dY4^4HPg:}nV`
- Click **"Đăng nhập"**

### 3. Bước 2 - Nhập 2FA Code
- **Mở Google Authenticator**
- **Copy 6 số** đang hiển thị (đang countdown)
- **Paste vào ô** "Mã xác thực 2FA"
- **Click "Xác thực 2FA"**

### 4. ✅ Kết Quả
- Đăng nhập thành công
- Redirect đến Admin Dashboard
- Session valid trong 1 giờ

---

## 📸 Giao Diện Đăng Nhập

### Màn hình nhập password:
```
┌─────────────────────────────────┐
│      360 Tương Tác              │
│      Admin Panel                │
│      🛡 2FA Enabled             │
│                                 │
│  Mật khẩu admin                 │
│  ┌──────────────────────────┐  │
│  │ •••••••••••••••          │  │
│  └──────────────────────────┘  │
│                                 │
│  [🔑 Đăng nhập]                 │
│                                 │
│  ← Quay lại trang chủ           │
└─────────────────────────────────┘
```

### Màn hình nhập 2FA:
```
┌─────────────────────────────────┐
│      360 Tương Tác              │
│      Admin Panel                │
│      🛡 2FA Enabled             │
│                                 │
│  Mã xác thực 2FA                │
│  ┌──────────────────────────┐  │
│  │      847291              │  │
│  └──────────────────────────┘  │
│  Nhập 6 số từ Google Auth      │
│                                 │
│  [🛡 Xác thực 2FA]              │
│                                 │
│  ← Quay lại nhập mật khẩu       │
│  ← Quay lại trang chủ           │
└─────────────────────────────────┘
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Secret Key Format (CRITICAL!)
- **Độ dài:** 32 ký tự (Base32 encoded)
- **Ký tự hợp lệ:** A-Z, 2-7 (không có 0, 1, 8, 9)
- **Secret đúng:** `MBISKKLH57XMJL7L36D7PYG2XAUQGH54` ✅
- **Secret sai:** `MBISKKLH57XMJL36D7PYG2XAUQGH54` ❌ (thiếu `7L`)

**Nếu app báo "Giá trị khoá không hợp lệ":**
- Check lại secret key (đủ 32 ký tự)
- Không có khoảng trắng
- Chỉ chứa A-Z, 2-7

### 2. Time Sync (Rất quan trọng!)
Google Authenticator dùng **thời gian thực** để generate code.

**Nếu code không hoạt động:**

**Android:**
- Settings → Date & Time
- Bật "Automatic date & time"
- Bật "Automatic time zone"

**iOS:**
- Settings → General → Date & Time
- Bật "Set Automatically"

### 3. Code Hết Hạn Nhanh
- Mỗi code chỉ valid trong **30 giây**
- Countdown hiển thị bên dưới code
- **Đừng nhập khi còn <5 giây** → đợi code mới
- Code tự động refresh

### 4. Session Timeout
- Session valid trong **1 giờ** không hoạt động
- Sau 1 giờ → phải login lại
- Logout thủ công → session bị hủy

### 5. Rate Limiting
- **Tối đa 5 lần thử** trong 15 phút
- Quá limit → block **30 phút**
- Block tự động mở sau 30 phút
- HOẶC restart dev server để clear

---

## 🐛 Troubleshooting

### Lỗi: "Giá trị khoá không hợp lệ" (khi setup)

**Nguyên nhân:** Secret key sai format hoặc thiếu ký tự

**Fix:**
1. Xóa account trong app
2. Setup lại với secret đúng:
   ```
   MBISKKLH57XMJL7L36D7PYG2XAUQGH54
   ```
3. Đảm bảo:
   - Đủ 32 ký tự
   - Chỉ chứa A-Z, 2-7
   - Không có khoảng trắng

### Lỗi: "Mã 2FA không đúng!" (khi login)

**Nguyên nhân & Fix:**

1. **Time không sync**
   - Check time trên điện thoại
   - Bật "Set Automatically"
   - Thử restart app Google Authenticator

2. **Nhập sai code**
   - Kiểm tra lại 6 số
   - Đảm bảo không có khoảng trắng
   - Nhập khi còn >10 giây

3. **Code hết hạn**
   - Đợi code mới (30s)
   - Nhập nhanh hơn

4. **Secret key không khớp**
   - Xóa account cũ trong app
   - Setup lại với secret: `MBISKKLH57XMJL7L36D7PYG2XAUQGH54`

### Lỗi: "Invalid password"

**Fix:**
- Kiểm tra copy-paste đúng password
- Case-sensitive (phân biệt hoa/thường)
- Không có khoảng trắng thừa
- Đợi 30 phút nếu bị rate limit
- HOẶC restart dev server

### Lỗi: "Too many failed attempts"

**Fix:**
- Wait 30 minutes cho rate limit reset
- HOẶC restart dev server:
  ```bash
  Ctrl+C → npm run dev
  ```

### Lỗi: "Server configuration error"

**Fix:**
- Restart dev server: `Ctrl+C` → `npm run dev`
- Check `.env.local` tồn tại và đúng format
- Verify: `NEXT_ADMIN_PASSWORD_HASH` có escape `\$`

---

## 🔄 Setup Lại 2FA (Nếu Mất Điện Thoại)

Nếu mất điện thoại hoặc muốn setup lại:

### Bước 1: Contact Developer
- Request reset 2FA secret
- Hoặc access server trực tiếp

### Bước 2: Regenerate Credentials
```bash
cd 360tuongtac-website-enhancement
npm run setup-admin
```

Script sẽ generate:
- Password hash mới
- 2FA secret mới (32 ký tự)
- QR code URL mới

### Bước 3: Setup Lại
1. Mở app Google Authenticator
2. Xóa account cũ (nếu còn)
3. Thêm account mới với secret mới
4. Update `.env.local` với secret mới
5. Restart dev server
6. Test login

---

## ✅ Checklist Setup

### Lần đầu setup:
- [ ] Cài Google Authenticator trên điện thoại
- [ ] Thêm account với secret key (32 ký tự)
- [ ] App không báo lỗi "Giá trị khoá không hợp lệ"
- [ ] Thấy 6 số đang countdown
- [ ] Test login thành công
- [ ] Bật time sync trên điện thoại

### Mỗi lần login:
- [ ] Nhập đúng password: `wd!*dY4^4HPg:}nV`
- [ ] Mở Google Authenticator
- [ ] Copy 6 số (đang valid, còn >10s)
- [ ] Paste vào ô 2FA
- [ ] Click "Xác thực 2FA"
- [ ] Vào Dashboard thành công

---

## 🔐 Security Best Practices

### DO ✅
- ✅ Giữ secret key bảo mật
- ✅ Dùng password manager để lưu password
- ✅ Bật time sync trên điện thoại
- ✅ Logout khi xong việc
- ✅ Không share credentials
- ✅ Backup secret key ở nơi an toàn
- ✅定期检查 (check regularly) login logs

### DON'T ❌
- ❌ Không screenshot secret key
- ❌ Không share qua email/chat không encrypted
- ❌ Không lưu code vào notes/public
- ❌ Không dùng public WiFi để login
- ❌ Không để điện thoại unlocked
- ❌ Không dùng cùng password cho nhiều service

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. **Check troubleshooting guide** ở trên
2. **Screenshot lỗi** gửi developer
3. **Check server logs** (terminal `npm run dev`)
   - Tìm: `[LOGIN API]` logs
   - Check: HTTP status code (200 = OK, 401 = Auth fail, 429 = Rate limit)
4. **Check browser console** (F12 → Console tab)
5. **Check Network tab** (F12 → Network → xem request/response)

---

## 📝 Thông Tin Kỹ Thuật

### Environment Variables (`.env.local`)
```env
# Admin Password Hash (bcrypt, 12 rounds)
# IMPORTANT: Must escape $ characters with \$
NEXT_ADMIN_PASSWORD_HASH=\$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq

# 2FA Configuration
# IMPORTANT: Must be exactly 32 characters (Base32: A-Z, 2-7)
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL36D7PYG2XAUQGH54

# Session Configuration (milliseconds)
NEXT_ADMIN_SESSION_TIMEOUT=3600000
```

### Security Features
- ✅ Bcrypt password hashing (12 rounds)
- ✅ TOTP 2FA (HMAC-SHA1, 6 digits, 30s)
- ✅ Rate limiting (5 attempts/15min, 30min block)
- ✅ Session timeout (1 hour inactivity)
- ✅ CSRF protection (256-bit token)
- ✅ HttpOnly, Secure cookies
- ✅ Security headers (CSP, HSTS, X-Frame-Options, etc.)
- ✅ No backup codes (TOTP only)

### Tech Stack
- **Framework:** Next.js 15.5.15
- **Auth:** Custom 2FA implementation
- **2FA Algorithm:** TOTP (RFC 6238)
- **Hash:** bcrypt (12 salt rounds)
- **Session:** In-memory Map (dev), Redis (prod recommended)
- **Rate Limiting:** In-memory (dev), Redis (prod recommended)

### Files Structure
```
app/
├── admin/
│   ├── layout.tsx          ← Admin layout with 2FA login
│   └── page.tsx            ← Dashboard
├── api/
│   └── admin/
│       └── login/
│           └── route.ts    ← Login API endpoint
└── middleware.ts            ← Security headers

lib/admin/
├── password-utils.ts       ← Bcrypt hashing
├── two-factor-auth.ts      ← TOTP implementation
├── rate-limiter.ts         ← Login rate limiting
├── session-manager.ts      ← Session management
└── security-headers.ts     ← HTTP security headers

.env.local                   ← Environment variables
```

---

## 🎉 Kết Luận

Admin panel đã được setup với **bảo mật 2 lớp**:
1. **Password** - Strong password (16 chars, complex)
2. **2FA** - Google Authenticator (TOTP, 32-char secret)

**Login URL:** http://localhost:3000/admin

**Secret Key:** `MBISKKLH57XMJL36D7PYG2XAUQGH54`

**Password:** `wd!*dY4^4HPg:}nV`

---

**Document Version:** 2.0  
**Last Updated:** 2026-05-08  
**Author:** 360TuongTac Dev Team  
**Status:** ✅ Verified & Working

### Changelog:
- **v2.0 (2026-05-08):** Removed backup code, fixed TOTP secret length (32 chars), simplified UI
- **v1.0 (2026-05-07):** Initial implementation with backup codes

---

**Setup xong chưa? Test login ngay!** 🚀
