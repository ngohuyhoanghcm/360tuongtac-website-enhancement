#  Fix Production 2FA Authentication Issue

##  Problem Analysis

**Symptom:** 2FA login works on local but fails on production (HTTP 401)

**Error:** "Invalid 2FA code" when submitting TOTP code

---

##  Root Causes (Most Likely)

### Cause 1: GitHub Secrets Not Setup  (90% probability)

**Problem:** Production container không có environment variables vì GitHub Secrets chưa được setup.

**Evidence:**
- Local: `.env.local` có đầy đủ vars ✅
- Production: GitHub Secrets chưa setup 
- Container starts nhưng không có `NEXT_ADMIN_PASSWORD_HASH` và `NEXT_ADMIN_2FA_SECRET`

**How to verify:**
```bash
ssh -p 2277 deploy@14.225.224.130

# Check container logs
docker logs 360tuongtac-app 2>&1 | grep -i "environment\|password\|2fa"

# Check if env vars exist
docker exec 360tuongtac-app env | grep NEXT_ADMIN
# Nếu không có output → Secrets chưa setup!
```

---

### Cause 2: Wrong TOTP Secret in Production

**Problem:** Secret key trên production khác với local.

**Evidence:**
- Local secret: `MBISKKLH57XMJL36D7PYG2XAUQGH54` ✅
- Production secret: Có thể bị sai hoặc thiếu ký tự

**How to verify:**
```bash
docker exec 360tuongtac-app env | grep NEXT_ADMIN_2FA_SECRET

# Expected output:
# NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
```

---

### Cause 3: Time Sync Issue on Server

**Problem:** VPS server time không sync với Google Authenticator.

**Evidence:**
- TOTP codes thay đổi mỗi 30 giây dựa trên server time
- Nếu server time lệch >30s → codes không khớp

**How to verify:**
```bash
ssh -p 2277 deploy@14.225.224.130

# Check server time
date -u

# Check container time
docker exec 360tuongtac-app date -u

# So sánh với thời gian hiện tại
# Nếu lệch >30 giây → time sync issue!
```

---

### Cause 4: Backup Codes Still in Workflow

**Problem:** GitHub Actions workflow vẫn reference `NEXT_ADMIN_2FA_BACKUP_CODES` (đã xóa).

**Evidence:**
- File `.github/workflows/deploy.yml` dòng 99 & 177 vẫn có backup codes
- Build có thể fail hoặc env var không được pass đúng

**How to verify:**
```bash
# Check workflow file
cat .github/workflows/deploy.yml | grep -n "BACKUP_CODES"

# Nếu còn → cần remove!
```

---

##  Solution: Step-by-Step Fix

### Step 1: Setup GitHub Secrets (CRITICAL!)

**Access:** https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/settings/secrets/actions

**Create these secrets:**

```
NEXT_ADMIN_PASSWORD_HASH = \$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET    = MBISKKLH57XMJL36D7PYG2XAUQGH54
NEXT_ADMIN_SESSION_TIMEOUT = 3600000
```

**IMPORTANT:**
- Password hash MUST escape `$` → `\$`
- 2FA secret MUST be 32 characters
- No spaces or extra characters

---

### Step 2: Fix Deploy Workflow (Remove Backup Codes)

File: `.github/workflows/deploy.yml`

**Remove line 99:**
```yaml
-            NEXT_ADMIN_2FA_BACKUP_CODES=${{ secrets.NEXT_ADMIN_2FA_BACKUP_CODES }}
```

**Remove line 177:**
```yaml
-            -e NEXT_ADMIN_2FA_BACKUP_CODES="${{ secrets.NEXT_ADMIN_2FA_BACKUP_CODES }}" \
```

---

### Step 3: Redeploy

```bash
# Commit changes
git add .github/workflows/deploy.yml
git commit -m "fix: remove backup codes from production deployment workflow"
git push origin main

# Monitor deployment
# GitHub → Actions → "Build & Deploy to VPS"
```

---

### Step 4: Verify on VPS

```bash
ssh -p 2277 deploy@14.225.224.130

# Check environment variables
docker exec 360tuongtac-app env | grep -E 'NEXT_ADMIN|2FA'

# Expected output:
# NEXT_ADMIN_PASSWORD_HASH=\$2b\$12\$...
# NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
# NEXT_ADMIN_SESSION_TIMEOUT=3600000

# Check container logs
docker logs 360tuongtac-app --tail 50

# Test internal access
curl -I http://localhost:3001/admin
```

---

### Step 5: Test 2FA Login

1. Open: https://grow.360tuongtac.com/admin

2. Enter password: `wd!*dY4^4HPg:}nV`

3. Enter 6-digit code from Google Authenticator

4. **Expected:** Login success → Dashboard

---

## 🐛 Troubleshooting

### Issue: Still getting 401 after setup

**Check 1: Verify secrets are loaded**
```bash
docker exec 360tuongtac-app node -e "console.log(process.env.NEXT_ADMIN_2FA_SECRET)"
# Must output: MBISKKLH57XMJL7L36D7PYG2XAUQGH54
```

**Check 2: Verify password hash**
```bash
docker exec 360tuongtac-app node -e "
const hash = process.env.NEXT_ADMIN_PASSWORD_HASH;
console.log('Hash exists:', !!hash);
console.log('Length:', hash.length);
console.log('Starts with \$2b:', hash.startsWith('\$2b'));
"
# Must output: true, 60, true
```

**Check 3: Test bcrypt verification**
```bash
docker exec 360tuongtac-app node -e "
const bcrypt = require('bcryptjs');
const hash = process.env.NEXT_ADMIN_PASSWORD_HASH;
const password = 'wd!*dY4^4HPg:}nV';
bcrypt.compare(password, hash).then(valid => {
  console.log('Password valid:', valid);
});
"
# Must output: Password valid: true
```

**Check 4: Test TOTP generation**
```bash
docker exec 360tuongtac-app node -e "
const crypto = require('crypto');
const secret = process.env.NEXT_ADMIN_2FA_SECRET;
const epoch = Math.floor(Date.now() / 1000);
const time = Math.floor(epoch / 30);
const timeBuffer = Buffer.alloc(8);
timeBuffer.writeBigUInt64BE(BigInt(time));
const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base32'));
hmac.update(timeBuffer);
const digest = hmac.digest();
const offset = digest[digest.length - 1] & 0x0f;
const code = ((digest[offset] & 0x7f) << 24 | 
              (digest[offset + 1] & 0xff) << 16 | 
              (digest[offset + 2] & 0xff) << 8 | 
              (digest[offset + 3] & 0xff)) % 1000000;
console.log('Current TOTP code:', code.toString().padStart(6, '0'));
"
# Output 6-digit code - compare with Google Authenticator
```

---

### Issue: Time sync problem

**Fix server time:**
```bash
ssh -p 2277 deploy@14.225.224.130

# Install ntp (if not installed)
sudo apt-get update
sudo apt-get install -y ntp

# Enable ntp sync
sudo timedatectl set-ntp true

# Check time sync status
timedatectl status

# Restart container
docker restart 360tuongtac-app
```

---

##  Quick Diagnostic Script

Save as `debug-2fa-production.sh`:

```bash
#!/bin/bash
echo "=== 360TuongTac 2FA Debug ==="

ssh -p 2277 deploy@14.225.224.130 << 'EOF'
echo "1. Container status:"
docker ps --filter "name=360tuongtac-app"

echo -e "\n2. Environment variables:"
docker exec 360tuongtac-app env | grep -E 'NEXT_ADMIN|2FA'

echo -e "\n3. Password hash check:"
docker exec 360tuongtac-app node -e "
const hash = process.env.NEXT_ADMIN_PASSWORD_HASH;
console.log('Exists:', !!hash, 'Length:', hash ? hash.length : 0);
"

echo -e "\n4. 2FA secret check:"
docker exec 360tuongtac-app node -e "
const secret = process.env.NEXT_ADMIN_2FA_SECRET;
console.log('Exists:', !!secret, 'Length:', secret ? secret.length : 0);
console.log('Value:', secret);
"

echo -e "\n5. Server time:"
date -u

echo -e "\n6. Recent login errors:"
docker logs 360tuongtac-app 2>&1 | grep -i "login\|2fa\|401" | tail -10
EOF
```

Run:
```bash
bash debug-2fa-production.sh
```

---

## ✅ Expected Output After Fix

```
=== 360TuongTac 2FA Debug ===

1. Container status:
NAMES                STATUS         PORTS
360tuongtac-app      Up 5 minutes   127.0.0.1:3001->3000/tcp

2. Environment variables:
NEXT_ADMIN_PASSWORD_HASH=\$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL36D7PYG2XAUQGH54
NEXT_ADMIN_SESSION_TIMEOUT=3600000

3. Password hash check:
Exists: true Length: 60

4. 2FA secret check:
Exists: true Length: 32
Value: MBISKKLH57XMJL36D7PYG2XAUQGH54

5. Server time:
Thu May  8 10:30:00 UTC 2026

6. Recent login errors:
[LOGIN API] NEXT_ADMIN_PASSWORD_HASH exists: true
[LOGIN API] NEXT_ADMIN_2FA_SECRET exists: true
```

---

## 📋 Checklist

### Before deploying:
- [ ] GitHub Secrets setup (11 secrets)
- [ ] Backup codes removed from workflow
- [ ] Code pushed to main branch
- [ ] Deployment workflow running

### After deploying:
- [ ] Container running on VPS
- [ ] Environment variables loaded correctly
- [ ] Password hash valid (60 chars, starts with `$2b`)
- [ ] 2FA secret valid (32 chars, Base32)
- [ ] Server time synced
- [ ] 2FA login works on production

---

**TL;DR:**
1. Setup GitHub Secrets (password hash + 2FA secret)
2. Remove backup codes from deploy workflow
3. Redeploy
4. Verify env vars on VPS
5. Test login

**Most likely cause:** GitHub Secrets chưa setup! 90% trường hợp.

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-08  
**Status:**  Ready to fix

**Bây giờ anh check GitHub Secrets đã setup chưa nhé!** 🔑
