#  Fix Production 2FA - GitHub Secrets Setup

## 🔴 Vấn Đề Phát Hiện

Khi check trên production VPS:

### 1. Password Hash SAI
```bash
# Trên production (SAI):
NEXT_ADMIN_PASSWORD_HASH=$2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq

# Phải là (ĐÚNG):
NEXT_ADMIN_PASSWORD_HASH=\$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
```

**Nguyên nhân:** GitHub Secrets không tự động escape `$` → phải escape MANUAL

### 2. 2FA Secret SAI
```bash
# Trên production (SAI - 31 chars):
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL36D7PYG2XAUQGH54

# Phải là (ĐÚNG - 32 chars):
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
```

**Nguyên nhân:** Thiếu `7L` ở giữa

---

##  Fix: Update GitHub Secrets

### Bước 1: Truy cập GitHub Secrets

```
https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/settings/secrets/actions
```

### Bước 2: Update Secret `NEXT_ADMIN_PASSWORD_HASH`

**Delete secret cũ và tạo lại:**

1. Click "Edit" bên phải `NEXT_ADMIN_PASSWORD_HASH`
2. **Paste giá trị này (COPY-PASTE CHÍNH XÁC):**

```
\$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
```

**️ QUAN TRỌNG:**
- PHẢI có `\$` ở đầu
- PHẢI có `\$` trước mỗi `$` trong hash
- **KHÔNG** có khoảng trắng ở đầu/cuối
- Total length: **60 characters**

### Bước 3: Update Secret `NEXT_ADMIN_2FA_SECRET`

1. Click "Edit" bên phải `NEXT_ADMIN_2FA_SECRET`
2. **Paste giá trị này:**

```
MBISKKLH57XMJL36D7PYG2XAUQGH54
```

**⚠️ QUAN TRỌNG:**
- PHẢI đúng 32 ký tự
- Chỉ chứa A-Z, 2-7
- **KHÔNG** có khoảng trắng
- Có `7L` ở giữa

### Bước 4: Verify trên GitHub

Sau khi update, secrets phải hiển thị:

```
NEXT_ADMIN_PASSWORD_HASH = \$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq (60 chars)
NEXT_ADMIN_2FA_SECRET    = MBISKKLH57XMJL36D7PYG2XAUQGH54 (32 chars)
```

---

##  Bước 5: Redeploy

### Cách 1: Manual Deploy (Nhanh nhất)

1. Mở: https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/actions
2. Click "Build & Deploy to VPS"
3. Click "Run workflow"
4. Type `deploy` để confirm
5. Click "Run workflow"

### Cách 2: Empty Commit

```bash
cd 360tuongtac-website-enhancement
git commit --allow-empty -m "ci: redeploy with fixed 2FA secrets"
git push origin main
```

---

##  Bước 6: Verify trên VPS

Sau khi deploy xong (~3-5 phút):

```bash
ssh -p 2277 -i "C:\temp\geminivideo_deploy.pem" deploy@14.225.224.130

# Check environment variables
docker exec 360tuongtac-app env | grep NEXT_ADMIN

# Expected output:
# NEXT_ADMIN_PASSWORD_HASH=\$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
# NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
# NEXT_ADMIN_SESSION_TIMEOUT=3600000
```

**️ Kiểm tra:**
- Password hash phải bắt đầu bằng `\$2b\$`
- 2FA secret phải đúng 32 ký tự

---

##  Bước 7: Test Login

Mở: https://grow.360tuongtac.com/admin

1. **Password:** `wd!*dY4^4HPg:}nV`
2. **2FA Code:** 6 số từ Google Authenticator
3. **→ Phải login thành công!** ✅

---

##  Checklist Before Redeploy

- [ ] `NEXT_ADMIN_PASSWORD_HASH` có `\$` escape (60 chars)
- [ ] `NEXT_ADMIN_2FA_SECRET` đúng 32 chars (có `7L`)
- [ ] Không có khoảng trắng thừa trong secrets
- [ ] Secrets đã saved trên GitHub
- [ ] Workflow ready to run

---

##  Troubleshooting

### Lỗi: Vẫn 401 sau khi redeploy

**Check 1: Verify secrets đúng format**
```bash
docker exec 360tuongtac-app env | grep NEXT_ADMIN_PASSWORD_HASH
# Phải có: \$2b\$12\$...
```

**Check 2: Check container logs**
```bash
docker logs 360tuongtac-app --tail 100
# Tìm: "Environment variables loaded" hoặc error messages
```

**Check 3: Restart container**
```bash
docker restart 360tuongtac-app
sleep 5
docker logs 360tuongtac-app --tail 20
```

### Lỗi: Secrets không được update

**Nguyên nhân:** GitHub Actions cache hoặc workflow không chạy

**Fix:**
1. Delete workflow run cũ
2. Trigger manual deploy mới
3. Check logs xem secrets có được inject không

---

##  Summary

### Root Cause:
1. GitHub Secrets không tự động escape `$` → password hash sai format
2. 2FA secret bị thiếu ký tự `7L`

### Solution:
1. Update GitHub Secrets với giá trị đúng (có escape `\$`)
2. Redeploy container
3. Verify env vars trên VPS
4. Test login

### Files Changed:
- GitHub Secrets (2 secrets updated)
- `.github/workflows/deploy.yml` (removed backup codes)

---

**Bây giờ anh update GitHub Secrets rồi redeploy nhé!** 

**Secret values để copy-paste:**

```
Password Hash:  \$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
2FA Secret:     MBISKKLH57XMJL36D7PYG2XAUQGH54
```

---

**Document Version:** 2.0  
**Last Updated:** 2026-05-08  
**Status:**  Ready to fix production
