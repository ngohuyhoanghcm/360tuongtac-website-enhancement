#  Hướng Dẫn Setup GitHub Secrets & Deploy Production

##  Tổng Quan

Workflow: GitHub Actions → Build Docker → Deploy VPS (14.225.224.130)

**Trigger:** Push to `main` branch

---

##  Bước 1: Chuẩn Bị GitHub Secrets

### Truy cập GitHub Repository Settings

1. **Mở repository trên GitHub**
   ```
   https://github.com/[YOUR_USERNAME]/360tuongtac-website-enhancement
   ```

2. **Vào Settings → Secrets and variables → Actions**
   ```
   Settings tab → Security section → Secrets and variables → Actions
   ```

3. **Click "New repository secret"**

---

## 🔑 Bước 2: Setup Tất Cả Secrets

### **A. VPS SSH Connection**

| Secret Name | Value | Description |
|------------|-------|-------------|
| `VPS_HOST` | `14.225.224.130` | VPS IP address |
| `VPS_PORT` | `2277` | SSH port |
| `VPS_USER` | `deploy` | SSH username |
| `VPS_SSH_KEY` | *(Private key)* | SSH private key for VPS access |

**Cách lấy SSH Key:**
```bash
# Trên máy local, tạo SSH key nếu chưa có
ssh-keygen -t ed25519 -C "github-actions@360tuongtac.com"

# Copy private key (toàn bộ nội dung file)
cat ~/.ssh/id_ed25519
```

**Hoặc nếu đã có key:**
```bash
# Xem private key
cat ~/.ssh/id_rsa
# hoặc
cat ~/.ssh/id_ed25519
```

**Dán toàn bộ nội dung** (bao gồm `-----BEGIN OPENSSH PRIVATE KEY-----`) vào secret `VPS_SSH_KEY`

---

### **B. Admin Security Credentials**

| Secret Name | Value | Description |
|------------|-------|-------------|
| `NEXT_ADMIN_PASSWORD_HASH` | `\$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq` | Bcrypt hash (12 rounds) |
| `NEXT_ADMIN_2FA_SECRET` | `MBISKKLH57XMJL7L36D7PYG2XAUQGH54` | TOTP 2FA secret (32 chars) |
| `NEXT_ADMIN_SESSION_TIMEOUT` | `3600000` | 1 hour (milliseconds) |

**⚠️ QUAN TRỌNG:**
- Password hash **PHẢI** escape `$` thành `\$`
- 2FA secret **PHẢI** đúng 32 ký tự Base32 (A-Z, 2-7)

---

### **C. Analytics & Telemetry**

| Secret Name | Value | Description |
|------------|-------|-------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-F64TRZN75M` | Google Analytics ID |
| `NEXT_PUBLIC_GTM_ID` | *(empty)* | Google Tag Manager (optional) |

---

### **D. Telegram Notifications**

| Secret Name | Value | Description |
|------------|-------|-------------|
| `TELEGRAM_BOT_TOKEN` | `8329752735:AAEQ9VwcII0fJHkrMMNopDeJuAkDPAXB9fA` | Telegram bot token |
| `TELEGRAM_CHAT_ID` | `138948131` | Chat ID nhận notification |

---

### **E. Site Configuration**

| Secret Name | Value | Description |
|------------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://grow.360tuongtac.com` | Production site URL |

---

### **F. Docker Registry (Auto-generated)**

| Secret Name | Value | Description |
|------------|-------|-------------|
| `GITHUB_TOKEN` | *(Auto)* | GitHub token (đã có sẵn) |

**Không cần setup** - GitHub tự động cung cấp token này

---

##  Bước 3: Tạo Production Environment File

### Trên VPS: `/opt/360tuongtac/.env.production`

SSH vào VPS:
```bash
ssh -p 2277 deploy@14.225.224.130
```

Tạo/thay file:
```bash
sudo mkdir -p /opt/360tuongtac
sudo nano /opt/360tuongtac/.env.production
```

**Nội dung file:**
```env
# Site URL
NEXT_PUBLIC_SITE_URL=https://grow.360tuongtac.com

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-F64TRZN75M
NEXT_PUBLIC_GTM_ID=

# Telegram Notifications
TELEGRAM_BOT_TOKEN=8329752735:AAEQ9VwcII0fJHkrMMNopDeJuAkDPAXB9fA
TELEGRAM_CHAT_ID=138948131

# Light Mode Feature Flag
NEXT_PUBLIC_LIGHT_MODE=true

# Admin Security (sẽ được override bởi GitHub Secrets)
NEXT_ADMIN_PASSWORD_HASH=\$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL36D7PYG2XAUQGH54
NEXT_ADMIN_SESSION_TIMEOUT=3600000
```

**Lưu ý:**
- GitHub Secrets sẽ **override** các giá trị trong file này
- File `.env.production` chỉ là fallback
- Luôn đảm bảo file có permissions đúng:
  ```bash
  sudo chmod 600 /opt/360tuongtac/.env.production
  sudo chown deploy:deploy /opt/360tuongtac/.env.production
  ```

---

## 🐳 Bước 4: Kiểm Tra Docker Network

Đảm bảo Docker networks tồn tại:

```bash
# SSH vào VPS
ssh -p 2277 deploy@14.225.224.130

# Check networks
docker network ls

# Tạo nếu chưa có
docker network create 360tuongtac-network 2>/dev/null || true
docker network create dokploy-network 2>/dev/null || true
```

---

## 🚀 Bước 5: Trigger Deployment

### Cách 1: Push to main (Automatic)

```bash
cd 360tuongtac-website-enhancement

# Commit & push
git add .
git commit -m "feat: admin 2FA setup and production deployment config"
git push origin main
```

**→ GitHub Actions tự động chạy!**

### Cách 2: Manual Dispatch

1. Vào GitHub repository
2. Actions tab → "Build & Deploy to VPS" workflow
3. Click "Run workflow"
4. Type `deploy` để confirm
5. Click "Run workflow"

---

## 📊 Bước 6: Monitor Deployment

### Theo dõi progress:

1. **GitHub Actions:**
   ```
   Actions tab → Click vào workflow đang chạy
   ```

2. **Jobs sẽ chạy theo thứ tự:**
   ```
   ✅ quality-gate (Lint + TypeCheck + Build)
   ↓
   ✅ build-and-push (Docker image)
   ↓
   ✅ deploy (SSH to VPS)
   ↓
   ✅ verify (Health check)
   ```

3. **Logs chi tiết:**
   - Click vào từng job để xem logs
   - Tìm các marker: `[1/7]`, `[2/7]`, etc.

---

## ✅ Bước 7: Verify Production

### 1. Check Container Status

```bash
ssh -p 2277 deploy@14.225.224.130

# Check running containers
docker ps --filter "name=360tuongtac-app"

# Expected output:
# NAMES                STATUS         PORTS
# 360tuongtac-app      Up X minutes   127.0.0.1:3001->3000/tcp
```

### 2. Check Port Binding (SECURITY)

```bash
# Phải bind localhost ONLY
docker ps --filter "name=360tuongtac-app" --format '{{.Ports}}'

# ✅ GOOD: 127.0.0.1:3001->3000/tcp
# ❌ BAD:  0.0.0.0:3001->3000/tcp (public exposure!)
```

### 3. Test Internal Access

```bash
curl -I http://localhost:3001/

# Expected: HTTP 200 or 308
```

### 4. Test Public Access (via Traefik)

```bash
# Từ máy local
curl -I https://grow.360tuongtac.com

# Expected: HTTP 200
```

### 5. Test Admin Login

```
https://grow.360tuongtac.com/admin

1. Password: wd!*dY4^4HPg:}nV
2. 2FA Code: Từ Google Authenticator
```

---

## 🐛 Troubleshooting

### Lỗi: "Failed to connect to VPS"

**Nguyên nhân:** SSH key sai hoặc port sai

**Fix:**
```bash
# Test SSH connection
ssh -p 2277 deploy@14.225.224.130

# Nếu fail, check:
# 1. SSH key đúng?
# 2. Port 2277 mở?
# 3. User 'deploy' tồn tại?
```

### Lỗi: "Build failed - Environment variables missing"

**Nguyên nhân:** Secrets chưa setup

**Fix:**
- Check tất cả secrets đã tạo chưa
- Tên secret **PHẢI** match chính xác (case-sensitive)
- Không có khoảng trắng thừa

### Lỗi: "Container exits immediately"

**Nguyên nhân:** Environment variables sai format

**Fix:**
```bash
# SSH vào VPS
ssh -p 2277 deploy@14.225.224.130

# Check logs
docker logs 360tuongtac-app

# Tìm lỗi:
# - "Environment variable not set"
# - "Invalid password hash"
# - "Failed to start server"
```

### Lỗi: "Health check failed"

**Nguyên nhân:** Container không start trong 50 giây

**Fix:**
```bash
# Check container logs
docker logs 360tuongtac-app --tail 50

# Check if port 3001 bị chiếm
sudo lsof -i :3001

# Kill process nếu cần
sudo kill -9 <PID>
```

### Lỗi: "Traefik route not working"

**Nguyên nhân:** Traefik config conflict

**Fix:**
```bash
# Check Traefik routes
docker exec dokploy-proxy wget -qO- http://localhost:8080/api/http/routers

# Restart Traefik
docker restart dokploy-proxy
```

---

## 🔐 Security Checklist

### ✅ Trước khi deploy:

- [ ] Tất cả secrets đã setup trên GitHub
- [ ] Password hash escape `$` đúng cách
- [ ] 2FA secret đúng 32 ký tự
- [ ] SSH key valid và có quyền truy cập VPS
- [ ] `/opt/360tuongtac/.env.production` permissions: `600`
- [ ] Docker networks tồn tại

### ✅ Sau khi deploy:

- [ ] Container bind localhost ONLY (127.0.0.1:3001)
- [ ] Không có port 3001 public (0.0.0.0)
- [ ] Traefik routing hoạt động
- [ ] HTTPS enabled (Let's Encrypt)
- [ ] Admin login hoạt động
- [ ] 2FA verification hoạt động
- [ ] Telegram notifications hoạt động

---

## 📋 Quick Reference

### Secrets Summary:

```
VPS_HOST                  = 14.225.224.130
VPS_PORT                  = 2277
VPS_USER                  = deploy
VPS_SSH_KEY               = [Private SSH Key]

NEXT_ADMIN_PASSWORD_HASH  = \$2b\$12\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET     = MBISKKLH57XMJL36D7PYG2XAUQGH54
NEXT_ADMIN_SESSION_TIMEOUT= 3600000

NEXT_PUBLIC_GA_MEASUREMENT_ID = G-F64TRZN75M
NEXT_PUBLIC_GTM_ID           = (empty)

TELEGRAM_BOT_TOKEN    = 8329752735:AAEQ9VwcII0fJHkrMMNopDeJuAkDPAXB9fA
TELEGRAM_CHAT_ID      = 138948131

NEXT_PUBLIC_SITE_URL  = https://grow.360tuongtac.com
```

### Commands:

```bash
# Deploy
git push origin main

# Check status
ssh -p 2277 deploy@14.225.224.130
docker ps --filter "name=360tuongtac-app"
docker logs 360tuongtac-app

# Restart if needed
docker restart 360tuongtac-app
```

---

##  Kết Luận

**Workflow hoàn chỉnh:**
1. ✅ Commit code → GitHub
2. ✅ Setup Secrets trên GitHub
3. ✅ Tạo `.env.production` trên VPS
4. ✅ Push to main → Auto deploy
5. ✅ Monitor & verify

**Production URL:** https://grow.360tuongtac.com  
**Admin URL:** https://grow.360tuongtac.com/admin

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-08  
**Status:** ✅ Ready for Production

**Bây giờ push lên GitHub và deploy thôi!** 🚀
