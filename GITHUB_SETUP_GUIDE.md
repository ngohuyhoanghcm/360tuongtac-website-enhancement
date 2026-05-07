# 🚀 GitHub Setup Guide - Admin Security Configuration

##  Mục Đích

Hướng dẫn chi tiết cách cấu hình GitHub Repository Secrets để deploy admin panel security lên production thông qua CI/CD.

---

##  Bước 1: Cấu Hình GitHub Repository Secrets

### Truy cập GitHub Repository Settings

1. **Mở GitHub** → Đăng nhập
2. **Vào repository**: `ngohuyhoanghcm/360tuongtac-website-enhancement`
3. **Click tab**: `Settings` (ở thanh menu trên cùng)
4. **Sidebar trái**: Chọn `Secrets and variables` → `Actions`
5. **Click button**: `New repository secret`

### Thêm 4 Secrets Sau:

#### Secret #1: Admin Password Hash

```
Name:  NEXT_ADMIN_PASSWORD_HASH
Value: $2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
```

**Click**: `Add secret`

---

#### Secret #2: 2FA Secret

```
Name:  NEXT_ADMIN_2FA_SECRET
Value: MBISKKLH57XMJL7L36D7PYG2XAUQGH54
```

**Click**: `Add secret`

---

#### Secret #3: Backup Codes

```
Name:  NEXT_ADMIN_2FA_BACKUP_CODES
Value: CCBME2WI,MDEFV14R,IZKC1HLU,AYJCLWF1,9XU8XW5I,KCRWG2OO,WMRE7LJE,NUGUHAG8,ZJTQQSFD,H4NJK9FZ
```

**Click**: `Add secret`

> **⚠️ Lưu ý**: Không có khoảng trắng giữa các codes, chỉ dùng dấu phẩy (`,`)

---

#### Secret #4: Session Timeout

```
Name:  NEXT_ADMIN_SESSION_TIMEOUT
Value: 3600000
```

**Click**: `Add secret`

> **️ Info**: 3600000 milliseconds = 1 hour

---

### Screenshot Reference

```
GitHub Repository
└── Settings
    └── Secrets and variables
        └── Actions
            └── Repository secrets
                ├── NEXT_ADMIN_PASSWORD_HASH      ✅
                ├── NEXT_ADMIN_2FA_SECRET         ✅
                ├── NEXT_ADMIN_2FA_BACKUP_CODES   ✅
                └── NEXT_ADMIN_SESSION_TIMEOUT    ✅
```

---

##  Bước 2: Verify Secrets Đã Thêm

Sau khi thêm xong, bạn sẽ thấy danh sách secrets:

| Secret Name | Last Updated |
|-------------|--------------|
| `NEXT_ADMIN_PASSWORD_HASH` | Just now |
| `NEXT_ADMIN_2FA_SECRET` | Just now |
| `NEXT_ADMIN_2FA_BACKUP_CODES` | Just now |
| `NEXT_ADMIN_SESSION_TIMEOUT` | Just now |

**✅ Nếu thấy 4 secrets này → Proceed to Step 3**

---

##  Bước 3: Commit Code Lên GitHub Main

### Trên Local Machine (PowerShell)

```powershell
# 1. Di chuyển đến thư mục project
cd "D:\Project-Nâng cấp website 360TuongTac\360tuongtac-website-enhancement"

# 2. Kiểm tra status
git status

# 3. Add tất cả files mới
git add .

# 4. Commit với message
git commit -m "feat: implement admin panel security with 2FA, rate limiting, and session management

- Add bcrypt password hashing (12 rounds)
- Implement TOTP-based 2FA with QR code support
- Add rate limiting (5 attempts/15min)
- Implement session management (1hr timeout)
- Add security headers middleware
- Create API endpoints for login/logout/2fa
- Update Dockerfile and GitHub Actions workflow
- Add comprehensive documentation"

# 5. Push lên GitHub main
git push origin main
```

---

##  Bước 4: Theo Dõi GitHub Actions

### Truy cập GitHub Actions

1. **Mở repository** trên GitHub
2. **Click tab**: `Actions`
3. **Chọn workflow**: `Build & Deploy to VPS`
4. **Click vào run** mới nhất (đang running)

### Workflow Progress

```
Build & Deploy to VPS #XXX
├── ✅ Job 1: Lint + TypeCheck + Build
├──  Job 2: Build & Push Docker Image
│   └── Building with secrets...
├── ⏳ Job 3: Deploy to VPS
│   └── SSH to VPS...
└── ⏳ Job 4: Verify Deployment
```

**Thời gian ước tính**: 6-12 phút

---

##  Bước 5: Deploy Thành Công → Test Trên Production

### Truy cập Admin Panel Production

**URL**: https://grow.360tuongtac.com/admin

### Login Steps:

1. **Mở trình duyệt** → Truy cập: `https://grow.360tuongtac.com/admin`
2. **Nhập password**: `wd!*dY4^4HPg:}nV`
3. **Nhập 2FA code**: Mở Google Authenticator → Nhập code 6 số
4. **Click Login** → Verify successful

---

##  Bước 6: Setup 2FA App (Nếu Chưa Có)

### Cài Đặt Google Authenticator

#### Option 1: Scan QR Code

1. **Cài app**: Google Authenticator hoặc Authy trên điện thoại
2. **Mở app** → Tap `+` → `Scan QR code`
3. **Sử dụng QR code URL** này:

```
otpauth://totp/360TuongTac%20Admin:admin%40360tuongtac.com?secret=MBISKKLH57XMJL7L36D7PYG2XAUQGH54&issuer=360TuongTac%20Admin&algorithm=SHA1&digits=6&period=30
```

> **Cách tạo QR**: Copy URL trên → Dán vào QR code generator online → Scan

#### Option 2: Manual Entry

1. **Mở app** → Tap `+` → `Enter a setup key`
2. **Account name**: `admin@360tuongtac.com`
3. **Secret key**: `MBISKKLH57XMJL7L36D7PYG2XAUQGH54`
4. **Type of key**: `Time based`
5. **Click**: `Add`

---

##  Bước 7: Lưu Backup Codes

### ⚠️ QUAN TRỌNG

**Lưu 10 backup codes này ở nơi an toàn** (password manager, encrypted file):

```
1. CCBME2WI
2. MDEFV14R
3. IZKC1HLU
4. AYJCLWF1
5. 9XU8XW5I
6. KCRWG2OO
7. WMRE7LJE
8. NUGUHAG8
9. ZJTQQSFD
10. H4NJK9FZ
```

### Sử Dụng Backup Codes

- Mỗi code chỉ dùng **MỘT LẦN**
- Sau khi dùng, code bị **XÓA** khỏi danh sách valid
- Dùng khi **MẤT ACCESS** vào 2FA app

---

## 🧪 Bước 8: Test Toàn Bộ Tính Năng

### Test 1: Login Với Password Đúng

```
URL: https://grow.360tuongtac.com/admin
Password: wd!*dY4^4HPg:}nV
2FA Code: <từ Google Authenticator>
Expected: ✅ Login thành công → Dashboard
```

### Test 2: Login Với Password Sai

```
URL: https://grow.360tuongtac.com/admin
Password: wrongpassword
Expected:  Error: "Invalid password"
```

### Test 3: Login Với 2FA Sai

```
URL: https://grow.360tuongtac.com/admin
Password: wd!*dY4^4HPg:}nV
2FA Code: 123456 (sai)
Expected: ❌ Error: "Invalid 2FA code"
```

### Test 4: Rate Limiting

```
Lỗi 5 lần liên tiếp trong 15 phút
Expected: ❌ Blocked 30 phút
```

### Test 5: Backup Code

```
URL: https://grow.360tuongtac.com/admin
Password: wd!*dY4^4HPg:}nV
Backup Code: CCBME2WI
Expected: ✅ Login thành công
         ⚠️ Code CCBME2WI bị xóa khỏi list
```

### Test 6: Session Timeout

```
Login thành công
Đợi 1 giờ không activity
Expected: ⏰ Session expired → Redirect to login
```

---

## 🔍 Troubleshooting

### Issue 1: Workflow Failed - Secrets Not Found

**Error**: `secret NEXT_ADMIN_PASSWORD_HASH not found`

**Solution**:
1. Verify secret name **EXACTLY** matches (case-sensitive)
2. Check Secrets list trong Settings → Actions
3. Re-add secret nếu missing

---

### Issue 2: Build Failed - TypeScript Errors

**Error**: `Type error: Cannot find module`

**Solution**:
```powershell
# Install dependencies
npm install

# Check TypeScript
npx tsc --noEmit

# Fix errors trước khi push
```

---

### Issue 3: Deploy Failed - SSH Connection

**Error**: `SSH connection failed`

**Solution**:
1. Verify GitHub Secrets:
   - `VPS_HOST` = `14.225.224.130`
   - `VPS_PORT` = `2277`
   - `VPS_USER` = `deploy`
   - `VPS_SSH_KEY` = đúng nội dung file .pem

2. Test SSH manually:
```powershell
ssh -p 2277 -i C:\temp\geminivideo_deploy.pem deploy@14.225.224.130
```

---

### Issue 4: Login Không Hoạt Động

**Symptom**: Login form không accept password

**Debug**:
```bash
# SSH vào VPS kiểm tra logs
ssh -p 2277 -i C:\temp\geminivideo_deploy.pem deploy@14.225.224.130

# Xem container logs
docker logs 360tuongtac-app --tail 100

# Kiểm tra env vars trong container
docker exec 360tuongtac-app env | grep NEXT_ADMIN
```

**Expected output**:
```
NEXT_ADMIN_PASSWORD_HASH=$2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
NEXT_ADMIN_2FA_BACKUP_CODES=CCBME2WI,MDEFV14R,IZKC1HLU,AYJCLWF1,9XU8XW5I,KCRWG2OO,WMRE7LJE,NUGUHAG8,ZJTQQSFD,H4NJK9FZ
NEXT_ADMIN_SESSION_TIMEOUT=3600000
```

---

##  Checklist Final

### Before Push:
- [ ] Đã thêm 4 secrets vào GitHub Repository
- [ ] Verify secrets names chính xác (case-sensitive)
- [ ] Test local build thành công (`npm run build`)
- [ ] Test local dev server (`npm run dev`)

### After Push:
- [ ] GitHub Actions workflow chạy thành công
- [ ] Docker image build và push lên GHCR
- [ ] Deploy lên VPS thành công
- [ ] Health check pass
- [ ] Website accessible tại https://grow.360tuongtac.com

### After Deploy:
- [ ] Admin panel accessible tại https://grow.360tuongtac.com/admin
- [ ] Login với password thành công
- [ ] 2FA verification hoạt động
- [ ] Dashboard hiển thị đúng
- [ ] Session management hoạt động
- [ ] Logout hoạt động

---

##  Security Reminders

### DO:
✅ Lưu password và backup codes trong password manager  
✅ Bật 2FA trên điện thoại  
✅ Monitor login attempts  
✅ Rotate credentials định kỳ  

### DON'T:
❌ Share credentials qua email/chat  
 Commit .env files lên Git  
❌ Disable security features  
❌ Ignore failed login alerts  

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check logs**: GitHub Actions → Workflow run → Logs
2. **Check container**: SSH vào VPS → `docker logs 360tuongtac-app`
3. **Check docs**: 
   - [ADMIN_SECURITY_GUIDE.md](./ADMIN_SECURITY_GUIDE.md)
   - [SECURITY_IMPLEMENTATION_SUMMARY.md](./SECURITY_IMPLEMENTATION_SUMMARY.md)

---

## ✅ Summary

### Credentials Summary:

| Type | Value |
|------|-------|
| **Password** | `wd!*dY4^4HPg:}nV` |
| **Password Hash** | `$2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq` |
| **2FA Secret** | `MBISKKLH57XMJL7L36D7PYG2XAUQGH54` |
| **Backup Codes** | `CCBME2WI,MDEFV14R,IZKC1HLU,AYJCLWF1,9XU8XW5I,KCRWG2OO,WMRE7LJE,NUGUHAG8,ZJTQQSFD,H4NJK9FZ` |
| **Session Timeout** | 1 hour (3600000ms) |

### GitHub Secrets Required:

| Secret Name | Required |
|-------------|----------|
| `NEXT_ADMIN_PASSWORD_HASH` | ✅ YES |
| `NEXT_ADMIN_2FA_SECRET` | ✅ YES |
| `NEXT_ADMIN_2FA_BACKUP_CODES` | ✅ YES |
| `NEXT_ADMIN_SESSION_TIMEOUT` | ✅ YES |

---

** Chúc anh deploy thành công!**

Nếu có bất kỳ issue nào, em sẽ hỗ trợ debug ngay! 🚀
