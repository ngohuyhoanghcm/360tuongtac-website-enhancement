# 🔧 MANUAL FIX: Password Hash Escaping on VPS

**Issue:** Docker env-file parser interprets `$` in bcrypt hash as variable interpolation, causing hash truncation and login failures.

**Root Cause:** 
- Password hash: `$2b$12$u1n0lxpM5Lpp0f8Rt9KrY.taOsIdmltzU4xcCRRRI6TwgN3ssRZIW`
- Docker reads `$12$u1n0lxpM5Lpp0f8Rt9KrY` as variable → Hash truncated to `$2b$12.taOsIdmltzU4xcCRRRI6TwgN3ssRZIW`
- Login fails with "Invalid password"

---

##  OPTION 1: Manual SSH Fix (QUICK - 2 minutes)

### Step 1: SSH vào VPS
```bash
ssh -p 2277 -i C:\temp\geminivideo_deploy.pem deploy@14.225.224.130
```

### Step 2: Chạy fix script
```bash
cd /opt/360tuongtac

# Backup
cp .env.production .env.production.backup.$(date +%Y%m%d_%H%M%S)

# Fix: Escape $ signs và wrap trong quotes
python3 << 'EOF'
import sys

env_file = '.env.production'
with open(env_file, 'r') as f:
    lines = f.readlines()

fixed_lines = []
for i, line in enumerate(lines, 1):
    if line.startswith('NEXT_ADMIN_PASSWORD_HASH=') and "'" not in line:
        hash_value = line.split('=', 1)[1].strip().strip("'\"")
        if hash_value.startswith('$2b$'):
            escaped_value = hash_value.replace('$', '$$')
            fixed_lines.append(f"NEXT_ADMIN_PASSWORD_HASH='{escaped_value}'\n")
            print(f'Line {i}: Fixed hash escaping')
        else:
            fixed_lines.append(line)
    else:
        fixed_lines.append(line)

with open(env_file, 'w') as f:
    f.writelines(fixed_lines)

print('✅ Password hash escaping fixed!')
EOF

# Verify
echo ""
echo "Before fix (original backup):"
grep PASSWORD_HASH .env.production.backup.* 2>/dev/null | tail -1 | head -c 60
echo "..."

echo ""
echo "After fix (current):"
grep PASSWORD_HASH .env.production | head -c 80
echo "..."
```

### Step 3: Restart container
```bash
docker restart 360tuongtac-app
sleep 10

# Verify hash loaded correctly
echo "Container environment variable:"
docker exec 360tuongtac-app env | grep PASSWORD_HASH | head -c 80
echo "..."

HASH=$(docker exec 360tuongtac-app env | grep PASSWORD_HASH | cut -d'=' -f2-)
echo ""
echo "Hash length: ${#HASH}"
if [ ${#HASH} -gt 50 ]; then
    echo "✅ SUCCESS: Hash is complete!"
else
    echo "❌ ERROR: Hash is still truncated!"
fi
```

### Step 4: Test login
```bash
curl -s -X POST http://localhost:3001/api/admin/login \
  -H 'Content-Type: application/json' \
  -d '{"password":"wd!*dY4^4HPg:}nV"}' \
  | python3 -m json.tool
```

Expected response:
```json
{
    "success": true,
    "message": "Login successful",
    "sessionId": "...",
    "csrfToken": "..."
}
```

---

## 📋 OPTION 2: GitHub Actions Auto-Deploy (AUTOMATIC - 10 minutes)

### Step 1: Push code đã fix workflow
Code đã được commit với fix trong `.github/workflows/deploy.yml`:
- Thêm step 5/8: Auto-escape `$` signs trong password hash
- Sử dụng `sed` để replace `$` → `$$` trước khi start container
- Tự động backup file gốc

### Step 2: Trigger deployment
```bash
cd "d:\Project-Nâng cấp website 360TuongTac\360tuongtac-website-enhancement"
git push
```

### Step 3: Monitor deployment
1. Mở: https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/actions
2. Click vào workflow chạy gần nhất
3. Watch logs cho step "Fixing password hash escaping"
4. Đợi deployment hoàn tất (~10 phút)

### Step 4: Verify
Sau khi deployment xong:
```bash
# Test login từ browser
https://grow.360tuongtac.com/admin

# Hoặc test API từ SSH
ssh -p 2277 -i C:\temp\geminivideo_deploy.pem deploy@14.225.224.130
curl -s -X POST http://localhost:3001/api/admin/login \
  -H 'Content-Type: application/json' \
  -d '{"password":"wd!*dY4^4HPg:}nV"}'
```

---

## 🔍 VERIFICATION CHECKLIST

Sau khi fix, verify các điểm sau:

### ✅ 1. Environment Variable trong Container
```bash
docker exec 360tuongtac-app env | grep PASSWORD_HASH
```
**Expected:** Hash đầy đủ (length ~60 characters), không bị truncate

### ✅ 2. Login API Response
```bash
curl -s -X POST http://localhost:3001/api/admin/login \
  -H 'Content-Type: application/json' \
  -d '{"password":"wd!*dY4^4HPg:}nV"}'
```
**Expected:** `{"success": true, ...}` thay vì `{"error": "Invalid password"}`

### ✅ 3. Browser Login
```
URL: https://grow.360tuongtac.com/admin
Password: wd!*dY4^4HPg:}nV
2FA: Use Google Authenticator with secret CJSTAM4QEUGDMP3Y2SZD44HDCYQPRQUV
```
**Expected:** Login thành công, dashboard load data (không còn số 0)

### ✅ 4. Container Logs
```bash
docker logs 360tuongtac-app --tail 50 | grep -i "auth\|login"
```
**Expected:** 
- `[AUTH] Session validated successfully`
- Không còn `[AUTH] Invalid authentication attempt`

---

## 🎯 ROOT CAUSE SUMMARY

| Component | Problem | Solution |
|-----------|---------|----------|
| **Docker env-file parser** | Interpret `$` as variable interpolation | Escape `$` → `$$` |
| **bcrypt hash** | `$2b$12$u1n0lxp...` gets truncated | Wrap in quotes: `'$$2b$$12$$u1n0lxp...'` |
| **Login API** | Hash mismatch → "Invalid password" | Correct hash → successful validation |
| **CI/CD** | Manual fix needed every deploy | Auto-fix in deployment workflow |

---

## 📞 TROUBLESHOOTING

### Issue: Hash vẫn bị truncate sau fix
```bash
# Check file content
cat /opt/360tuongtac/.env.production | grep PASSWORD_HASH

# Should show:
# NEXT_ADMIN_PASSWORD_HASH='$$2b$$12$$u1n0lxpM5Lpp0f8Rt9KrY.taOsIdmltzU4xcCRRRI6TwgN3ssRZIW'

# If still wrong, manually edit:
nano /opt/360tuongtac/.env.production
# Paste: NEXT_ADMIN_PASSWORD_HASH='$$2b$$12$$u1n0lxpM5Lpp0f8Rt9KrY.taOsIdmltzU4xcCRRRI6TwgN3ssRZIW'
```

### Issue: Container không start
```bash
# Check logs
docker logs 360tuongtac-app --tail 100

# Common issues:
# 1. Port conflict: docker ps | grep 3001
# 2. Network issue: docker network inspect dokploy-network
# 3. Env file error: docker exec 360tuongtac-app env | grep NEXT_ADMIN
```

### Issue: Login vẫn fail
```bash
# Verify hash match
docker exec 360tuongtac-app node -e "
const bcrypt = require('bcryptjs');
const hash = process.env.NEXT_ADMIN_PASSWORD_HASH;
console.log('Hash loaded:', hash ? 'YES' : 'NO');
console.log('Hash length:', hash ? hash.length : 0);
console.log('Hash starts with:', hash ? hash.substring(0, 20) : 'N/A');
"
```

---

## 🚀 PERMANENT FIX

Workflow deployment đã được update tại commit mới nhất:
- File: `.github/workflows/deploy.yml`
- Step: `[5/8] Fixing password hash escaping in .env.production`
- Action: Tự động escape `$` signs mỗi lần deploy

**Mọi deployment sau này sẽ tự động fix vấn đề này!**

---

**Date:** 2026-05-10  
**Status:** Fix ready - Apply Option 1 (manual) hoặc Option 2 (auto via GitHub Actions)
