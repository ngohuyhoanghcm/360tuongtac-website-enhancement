# 🚀 CLEAN DEPLOYMENT SESSION PROMPT

Copy và paste toàn bộ nội dung dưới đây vào session mới để bắt đầu clean deployment:

---

## PROMPT CHO SESSION MỚI:

```
# 360TuongTac - CLEAN DEPLOYMENT STRATEGY

## CONTEXT:
- Previous session: Iterative fixes created technical debt and configuration drift
- Local: Working perfectly ✅
- Production: Multiple issues (routing, login, data display)
- Decision: Nuke & rebuild with clean deployment strategy

## REFERENCE DOCUMENT:
Read: SYSTEMATIC_EVALUATION_AND_RESET_PLAN.md (already committed to main)

## CURRENT STATE:
- Local dev server: Running on localhost:3000
- Password: wd!*dY4^4HPg:}nV
- AI Generation: 100% working (fixed in previous session)
- All features tested and working locally

## VPS INFORMATION:
- IP: 14.225.224.130
- SSH Port: 2277
- User: deploy
- SSH Key: C:\temp\geminivideo_deploy.pem
- Domain: grow.360tuongtac.com
- Traefik: Managed by Dokploy
- Network: dokploy-network

## DEPLOYMENT STRATEGY:

### Phase 1: Backup Existing Data
1. SSH to VPS
2. Backup all JSON data (blog posts, services, SEO audit)
3. Backup .env.prod
4. Export to local for safe keeping

### Phase 2: Clean VPS
1. Stop and remove old container
2. Remove old docker-compose.yml
3. Remove old .env.prod
4. Remove old Traefik config
5. Verify clean state (no 360tuongtac artifacts)

### Phase 3: Prepare Clean Deployment Files
1. Create docker-compose.production.yml
2. Create .env.production (with NEW password hash and 2FA setup)
3. Create Traefik config with Docker DNS (NOT hardcoded IP)
4. Create deployment scripts

### Phase 4: Fresh Deployment
1. Deploy via GitHub Actions OR manual SSH
2. Use Docker DNS: http://360tuongtac-app:3000 (NOT IP)
3. Deploy Traefik dynamic config
4. Wait for SSL cert provisioning

### Phase 5: Verification
1. Test domain: https://grow.360tuongtac.com (should return 200)
2. Test admin login with new credentials
3. Test dashboard data display
4. Test AI content generation
5. Import backed-up data

## KEY IMPROVEMENTS FROM PREVIOUS DEPLOYMENT:

### 1. Traefik Routing
❌ OLD: Docker Compose labels with backticks (escaping issues)
✅ NEW: Traefik dynamic config file with Docker DNS

### 2. Container IP Management
❌ OLD: Hardcoded IP (changes on restart)
✅ NEW: Docker DNS (360tuongtac-app:3000) - stable

### 3. Environment Variables
 OLD: Inconsistent across environments
✅ NEW: Single source of truth (.env.production.template)

### 4. 2FA Setup
❌ OLD: Enabled on prod but no QR code provided
✅ NEW: Generate 2FA secret + QR code for authenticator app

### 5. Deployment Process
❌ OLD: Manual, error-prone
✅ NEW: Automated with GitHub Actions + deployment scripts

## FILES TO CREATE:
1. docker-compose.production.yml - Clean Docker config
2. .env.production.template - Environment template
3. traefik-360tuongtac.yml - Traefik config (Docker DNS)
4. scripts/deploy-clean.sh - Automated deployment script
5. scripts/backup-data.sh - Data backup script
6. scripts/verify-deployment.sh - Health check script
7. PRODUCTION_DEPLOYMENT_GUIDE.md - Complete documentation

## SUCCESS CRITERIA:
✅ Container runs stable (no restarts)
✅ Domain accessible via HTTPS (200 OK)
✅ SSL certificate valid (Let's Encrypt)
✅ Admin login works (password + 2FA)
✅ Dashboard displays data correctly
✅ AI content generation works
✅ Traefik routing stable (no 502/404)
✅ Container IP changes don't break routing (Docker DNS)

## CONSTRAINTS:
- MUST use systematic approach (no guessing)
- MUST document every step
- MUST create rollback plan
- MUST NOT affect other services on VPS
- MUST use Docker DNS (not hardcoded IP)
- MUST provide complete verification checklist

## START WITH:
1. Read SYSTEMATIC_EVALUATION_AND_RESET_PLAN.md
2. Create backup of existing production data
3. Proceed with clean deployment following the plan

## IMPORTANT NOTES:
- Previous session fixed AI generation (100% working)
- Previous session fixed password hash issue
- Previous session implemented Traefik dynamic config (temporary fix)
- Current task: Clean deployment to eliminate all technical debt
- DO NOT repeat iterative fix approach
- Follow the systematic plan in reference document

Ready to proceed? Start by reading the reference document and creating backup plan.
```

---

##  CHECKLIST CHO ANH TRƯỚC KHI BẮT ĐẦU SESSION MỚI:

### ✅ Data đã backup chưa?
- [ ] Blog posts JSON
- [ ] Services JSON  
- [ ] SEO audit data
- [ ] .env.prod file

### ✅ GitHub Secrets đã sẵn sàng?
- [ ] VPS_SSH_KEY
- [ ] GHCR_TOKEN
- [ ] PRODUCTION_ENV (nếu dùng GitHub Actions)

### ✅ Credentials mới đã chuẩn bị?
- [ ] Password mới (hoặc giữ nguyên: wd!*dY4^4HPg:}nV)
- [ ] 2FA secret sẽ được generate trong session mới
- [ ] QR code cho authenticator app

### ✅ Time allocation?
- [ ] 3-4 hours dedicated time
- [ ] No interruptions
- [ ] VPS access stable

---

## 🎯 KHI BẮT ĐẦU SESSION MỚI:

1. **Copy toàn bộ prompt ở trên**
2. **Paste vào chat mới**
3. **Agent sẽ:**
   - Đọc reference document
   - Tạo backup plan
   - Execute clean deployment
   - Verify tất cả functionality
   - Provide complete documentation

---

## ️ QUICK REFERENCE:

### VPS Access:
```bash
ssh -p 2277 -i 'C:\temp\geminivideo_deploy.pem' deploy@14.225.224.130
```

### Local Dev:
```bash
cd "d:\Project-Nâng cấp website 360TuongTac\360tuongtac-website-enhancement"
npm run dev
```

### Admin Login:
- URL: http://localhost:3000/admin (local)
- URL: https://grow.360tuongtac.com/admin (prod)
- Password: wd!*dY4^4HPg:}nV

### Key Files:
- Reference: `SYSTEMATIC_EVALUATION_AND_RESET_PLAN.md`
- Deployment: `scripts/deploy-traefik-config.sh`
- Hash Generator: `scripts/generate-hash.js`

---

## ️ REMEMBER:

**Local = ✅ Perfect**
**Production =  Issues**
**Solution = Clean deployment (not more fixes)**

---

**GOOD LUCK WITH CLEAN DEPLOYMENT! 🚀**
