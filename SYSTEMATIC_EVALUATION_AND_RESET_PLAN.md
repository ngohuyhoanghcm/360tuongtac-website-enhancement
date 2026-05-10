# 📊 360TuongTac - SYSTEMATIC PROJECT EVALUATION & RESET PLAN

**Date:** 2026-05-09  
**Status:** Local ✅ Working | Production  Issues  
**Purpose:** Comprehensive evaluation for fresh deployment strategy

---

## 🎯 EXECUTIVE SUMMARY

### Current State:
- **Local Development:** ✅ 100% Working
- **Production:** ❌ Multiple issues (login, routing, data display)
- **Root Cause:** Iterative fixes created technical debt and configuration drift

### Recommendation:
**NUKE & REBUILD** - Clean deployment from scratch to avoid infinite fix loops

---

## ✅ WHAT'S WORKING (Local Environment)

### 1. **Next.js Application**
```
✅ Next.js 15.5.15 running on localhost:3000
✅ Hot reload functional
✅ All pages rendering correctly
✅ No build errors or warnings
✅ Environment variables loaded from .env.local
```

### 2. **Admin Authentication (Local)**
```
✅ Password: wd!*dY4^4HPg:}nV
✅ 2FA: Disabled (for dev)
✅ Login flow working
✅ Session management working
✅ Dashboard accessible
```

### 3. **AI Content Generation (Local)**
```
✅ Google Gemini API integration (gemini-2.5-flash)
✅ JSON parsing from AI responses (100% working)
✅ BlogPostSchema validation passing
✅ SEO score: 95/100
✅ Auto-generate ID, title truncation, excerpt generation
✅ All 3 input methods working:
   - Topic-based generation
   - Keyword-based generation
   - Custom prompt generation
```

### 4. **Browser Testing Results (Local)**
```
✅ 6/6 pages tested - 98% PASS
✅ Dashboard: Blog Posts (15), Services (12), SEO (69/100)
✅ AI Content Hub: All features visible and functional
✅ Console: 0 errors, 0 warnings
✅ Minor issue: Services count discrepancy (12 vs 11) - not critical
```

### 5. **Database & Content**
```
✅ JSON-based storage working locally
✅ Blog posts: 15 articles
✅ Services: 12 services
✅ SEO audit: 69/100 score
✅ Data persistence working
```

---

## ❌ PRODUCTION ISSUES (Current State)

### Issue 1: **Traefik Routing Problems** 🔴 CRITICAL

**Symptoms:**
- Domain `grow.360tuongtac.com` returning 404/401/502 intermittently
- Admin panel inaccessible
- Dashboard showing all zeros (Blog Posts: 0, Services: 0, SEO: 0/100)

**Root Cause:**
```
Docker Compose YAML cannot handle backticks in Traefik labels
- Backticks (`) escaped to \x60 by Docker
- Traefik parse errors: "illegal character U+005C"
- Multiple fix attempts failed:
  ❌ Double quotes: YAML syntax error
  ❌ No quotes: "missing ',' in argument list"
  ❌ Single quotes with backticks: Still escaped
  ❌ Container recreation: Labels still escaped from image cache
```

**Temporary Fix Applied:**
- ✅ Created Traefik dynamic config file
- ✅ Location: `/etc/dokploy/traefik/dynamic/360tuongtac-traefik-config.yml`
- ✅ Disabled Docker labels (`traefik.enable=false`)
- ⚠️ Container IP changes on restart (currently: 10.0.1.219)

**Ongoing Problem:**
- IP volatility requires manual config updates after each restart
- Not production-stable

### Issue 2: **Admin Login Failure** 🔴 CRITICAL

**Symptoms:**
- 401 Unauthorized errors on login attempts
- "Invalid password" error message
- API calls to `/api/admin/login` failing

**Root Cause:**
```
Password hash mismatch between .env.prod and actual password
- Old hash: $2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
- New hash generated: $2b$12$fCOmK3BJvTH5LuH.VytCh.2qj3zqp8FfxRVNOARl2RRypd8r8qBPK
- 2FA enabled on production but not on local
```

**Temporary Fix Applied:**
- ✅ Updated password hash in .env.prod
- ✅ Container restarted
- ⚠️ 2FA still enabled on production (requires authenticator app)
- ✅ Login now requires password + 2FA code

### Issue 3: **Dashboard Data Not Displaying** 🟡 MEDIUM

**Symptoms:**
- Dashboard shows all zeros on production
- API returning 401 (auth required but failing)
- Console errors: 404 on api/admin/blog, 401 on api/admin/dashboard

**Root Cause:**
```
Cascading failure from Issues 1 & 2:
- Login failing → No auth token → API calls rejected → Dashboard empty
- Data exists but inaccessible due to auth/routing issues
```

### Issue 4: **Container IP Volatility** 🟡 MEDIUM

**Symptoms:**
- Container IP changes on every restart
- 10.0.1.214 → 10.0.1.216 → 10.0.1.219 (observed changes)
- Traefik config uses hardcoded IP

**Impact:**
- Requires manual re-deployment after each container restart
- Not sustainable for production

**Workaround:**
- Script: `deploy-traefik-config.sh` auto-detects IP and updates config
- Still manual process

---

## 🔍 SYSTEMATIC ANALYSIS

### Why We're in a Fix Loop:

1. **Configuration Drift**
   - Multiple iterations of fixes created inconsistent state
   - Docker labels vs dynamic config conflict
   - Environment variables changed across deployments
   - Container images rebuilt with different configurations

2. **Lack of Single Source of Truth**
   - .env.local ≠ .env.production ≠ .env.prod (on VPS)
   - Docker Compose labels vs Traefik dynamic config
   - Password hashes regenerated but not synchronized

3. **Container Volatility**
   - Dynamic IP assignment by Docker
   - Each restart = new IP = broken routing
   - Manual intervention required

4. **Technical Debt Accumulation**
   - Each fix added complexity
   - Multiple workarounds stacked on top of each other
   - Hard to trace root causes

### The Infinite Loop Pattern:
```
1. Identify issue
2. Apply quick fix
3. Create new side effect
4. Fix side effect
5. Create another side effect
6. Repeat...
```

---

## 🎯 RECOMMENDED STRATEGY: CLEAN DEPLOYMENT

### Why Nuke & Rebuild?

1. **Eliminate Configuration Drift**
   - Start with clean slate
   - Single source of truth
   - No legacy workarounds

2. **Solve Root Causes, Not Symptoms**
   - Proper Traefik routing from the start
   - Consistent environment variables
   - Stable container networking

3. **Production-Grade Setup**
   - Docker DNS instead of hardcoded IPs
   - Proper 2FA setup with QR code
   - Automated deployment workflow

---

## 📋 CLEAN DEPLOYMENT PLAN

### Phase 1: **Preparation** (Local)

#### 1.1 Environment Variables Setup
```bash
# Create clean .env.production file
NEXT_ADMIN_PASSWORD_HASH=<generate_new_hash>
NEXT_ADMIN_2FA_ENABLED=true
NEXT_ADMIN_2FA_SECRET=<generate_new_secret>
GOOGLE_GEMINI_API_KEY=<valid_key>
NEXT_PUBLIC_ADMIN_API_SECRET=<secure_random_string>
```

#### 1.2 Docker Configuration
```yaml
# docker-compose.production.yml
version: '3.8'
services:
  app:
    build: .
    container_name: 360tuongtac-app
    networks:
      - dokploy-network
    ports:
      - "127.0.0.1:3001:3000"
    env_file:
      - .env.production
    labels:
      - "traefik.enable=false"  # Disabled - use dynamic config
    restart: unless-stopped
```

#### 1.3 Traefik Dynamic Config
```yaml
# traefik-360tuongtac.yml
http:
  routers:
    360tuongtac-router:
      rule: "Host(`grow.360tuongtac.com`)"
      entryPoints:
        - websecure
      service: 360tuongtac-service
      tls:
        certResolver: letsencrypt
  
  services:
    360tuongtac-service:
      loadBalancer:
        servers:
          - url: "http://360tuongtac-app:3000"  # Docker DNS!
        passHostHeader: true
```

**KEY IMPROVEMENT:** Use Docker DNS (`360tuongtac-app:3000`) instead of hardcoded IP!

---

### Phase 2: **VPS Cleanup**

#### 2.1 Remove Old Deployment
```bash
ssh deploy@14.225.224.130 -p 2277

# Stop and remove old container
cd /opt/360tuongtac
docker-compose down -v

# Remove old data (backup first!)
mkdir -p /tmp/360tuongtac-backup-$(date +%Y%m%d)
cp -r data /tmp/360tuongtac-backup-$(date +%Y%m%d)/
rm -rf data docker-compose.yml .env.prod

# Remove old Traefik config
sudo rm /etc/dokploy/traefik/dynamic/360tuongtac-traefik-config.yml

# Cleanup Docker
docker system prune -f
docker network prune -f
```

#### 2.2 Verify Clean State
```bash
# Should show no 360tuongtac containers
docker ps | grep 360tuongtac

# Should show no 360tuongtac files
ls /opt/360tuongtac/

# Traefik should show no 360tuongtac routes
docker logs dokploy-proxy --tail 50 | grep 360tuongtac
```

---

### Phase 3: **Fresh Deployment**

#### 3.1 Deploy via GitHub Actions (Recommended)
```yaml
# .github/workflows/deploy.yml
name: Production Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and Push Docker Image
        run: |
          docker build -t ghcr.io/ngohuyhoanghcm/360tuongtac-marketing:latest .
          echo "${{ secrets.GHCR_TOKEN }}" | docker login ghcr.io -u ngohuyhoanghcm --password-stdin
          docker push ghcr.io/ngohuyhoanghcm/360tuongtac-marketing:latest
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: 14.225.224.130
          port: 2277
          username: deploy
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/360tuongtac
            
            # Pull latest image
            docker pull ghcr.io/ngohuyhoanghcm/360tuongtac-marketing:latest
            
            # Create/update docker-compose.yml
            cat > docker-compose.yml << 'EOF'
            version: '3.8'
            services:
              app:
                image: ghcr.io/ngohuyhoanghcm/360tuongtac-marketing:latest
                container_name: 360tuongtac-app
                networks:
                  - dokploy-network
                ports:
                  - "127.0.0.1:3001:3000"
                env_file:
                  - .env.production
                restart: unless-stopped
            EOF
            
            # Deploy
            docker-compose up -d
            
            # Wait for container to start
            sleep 10
            
            # Update Traefik config with Docker DNS
            sudo bash /opt/360tuongtac/update-traefik-config.sh
```

#### 3.2 Deploy Traefik Config
```bash
#!/bin/bash
# update-traefik-config.sh

CONFIG_FILE="/etc/dokploy/traefik/dynamic/360tuongtac-traefik-config.yml"

cat > "$CONFIG_FILE" << 'EOF'
http:
  routers:
    360tuongtac-router:
      rule: "Host(`grow.360tuongtac.com`)"
      entryPoints:
        - websecure
      service: 360tuongtac-service
      tls:
        certResolver: letsencrypt
  
  services:
    360tuongtac-service:
      loadBalancer:
        servers:
          - url: "http://360tuongtac-app:3000"
        passHostHeader: true
EOF

chmod 644 "$CONFIG_FILE"
echo "✅ Traefik config updated (using Docker DNS)"
```

---

### Phase 4: **Verification**

#### 4.1 Automated Health Checks
```bash
#!/bin/bash
# verify-deployment.sh

echo "🔍 Verifying deployment..."

# Check container status
docker ps | grep 360tuongtac-app || { echo "❌ Container not running"; exit 1; }

# Check environment variables
docker exec 360tuongtac-app env | grep NEXT_ADMIN_PASSWORD_HASH || { echo "❌ Missing password hash"; exit 1; }

# Check network connectivity
CONTAINER_IP=$(docker inspect 360tuongtac-app --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')
echo "✅ Container IP: $CONTAINER_IP"

# Test domain
sleep 15
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' https://grow.360tuongtac.com)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Domain accessible (200 OK)"
else
    echo " Domain not accessible ($HTTP_CODE)"
    exit 1
fi

# Test login API
LOGIN_RESPONSE=$(curl -s -X POST https://grow.360tuongtac.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "test"}')

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    echo "✅ Login API responding"
else
    echo "❌ Login API not responding"
    exit 1
fi

echo ""
echo "✅ ALL CHECKS PASSED!"
```

---

## 📊 MIGRATION CHECKLIST

### Pre-Deployment:
- [ ] Backup all data from VPS
- [ ] Export existing blog posts (JSON)
- [ ] Export existing services (JSON)
- [ ] Backup .env.production
- [ ] Verify GitHub Actions secrets
- [ ] Test Docker image build locally

### Deployment:
- [ ] Stop old container
- [ ] Remove old files
- [ ] Deploy new docker-compose.yml
- [ ] Deploy new .env.production
- [ ] Deploy Traefik config (Docker DNS)
- [ ] Start container
- [ ] Wait for SSL cert provisioning

### Post-Deployment:
- [ ] Verify container running
- [ ] Verify domain accessible (200 OK)
- [ ] Test admin login
- [ ] Test dashboard data display
- [ ] Test AI content generation
- [ ] Import backed-up data
- [ ] Monitor for 24 hours

---

## 🔐 SECURITY CHECKLIST

### Environment Variables:
- [ ] NEXT_ADMIN_PASSWORD_HASH: Strong bcrypt hash
- [ ] NEXT_ADMIN_2FA_ENABLED: true
- [ ] NEXT_ADMIN_2FA_SECRET: Generated via QR code
- [ ] GOOGLE_GEMINI_API_KEY: Valid and restricted
- [ ] NEXT_PUBLIC_ADMIN_API_SECRET: Secure random string
- [ ] NEXT_TELEGRAM_BOT_TOKEN: (if applicable)
- [ ] NEXT_TELEGRAM_CHAT_ID: (if applicable)

### Docker Security:
- [ ] Container runs as non-root user
- [ ] No unnecessary ports exposed
- [ ] Volumes properly mounted
- [ ] Network isolated (dokploy-network)

### Traefik Security:
- [ ] HTTPS enforced (TLS)
- [ ] Let's Encrypt auto-renewal configured
- [ ] No HTTP entry point for admin routes
- [ ] Security headers configured

---

##  FILES TO CREATE/UPDATE

### New Files:
1. `docker-compose.production.yml` - Clean Docker config
2. `traefik-360tuongtac.yml` - Traefik dynamic config (Docker DNS)
3. `update-traefik-config.sh` - Traefik config updater
4. `verify-deployment.sh` - Automated health checks
5. `backup-data.sh` - Data backup script
6. `.env.production.template` - Environment template

### Updated Files:
1. `.github/workflows/deploy.yml` - GitHub Actions workflow
2. `Dockerfile` - Ensure non-root user
3. `.env.example` - Update with all required variables
4. `PRODUCTION_DEPLOYMENT_GUIDE.md` - Complete deployment guide

---

## 🎯 SUCCESS CRITERIA

### Local Environment:
- ✅ Dev server runs without errors
- ✅ Admin login works
- ✅ AI content generation 100% working
- ✅ Dashboard displays data correctly
- ✅ No console errors or warnings

### Production Environment:
- ✅ Container runs stable (no restarts)
- ✅ Domain accessible via HTTPS (200 OK)
- ✅ SSL certificate valid
- ✅ Admin login works (password + 2FA)
- ✅ Dashboard displays data correctly
- ✅ AI content generation works
- ✅ Traefik routing stable (no 502/404)
- ✅ Container IP changes don't break routing (Docker DNS)

---

## ️ KNOWN LIMITATIONS & FUTURE IMPROVEMENTS

### Current Limitations:
1. **Traefik Dynamic Config:** Manual deployment still required
2. **Dokploy Integration:** Not using Dokploy UI for deployment
3. **Container Networking:** Relying on Docker DNS (not tested extensively)
4. **Data Persistence:** JSON files (no database)

### Future Improvements:
1. **Migrate to PostgreSQL:** For better data management
2. **Use Dokploy UI:** For automated deployment and management
3. **Implement Monitoring:** Container health checks, uptime monitoring
4. **Automated Backups:** Scheduled backups to cloud storage
5. **CI/CD Pipeline:** Automated testing before deployment
6. **Multi-environment Setup:** Staging environment for testing

---

## 📞 EMERGENCY ROLLOUT PLAN

### If Production Deployment Fails:

1. **Immediate Actions:**
   ```bash
   # Stop new deployment
   docker-compose down
   
   # Restore from backup
   cp -r /tmp/360tuongtac-backup-*/data /opt/360tuongtac/
   
   # Deploy old version
   git checkout <previous-stable-commit>
   docker-compose up -d
   ```

2. **Rollback Script:**
   ```bash
   # rollback.sh
   docker pull ghcr.io/ngohuyhoanghcm/360tuongtac-marketing:<previous-version>
   sed -i 's/latest/<previous-version>/' docker-compose.yml
   docker-compose down && docker-compose up -d
   ```

3. **Contact:**
   - Monitor Traefik logs: `docker logs dokploy-proxy --tail 100`
   - Check container logs: `docker logs 360tuongtac-app --tail 100`
   - Test domain: `curl -I https://grow.360tuongtac.com`

---

## 📚 REFERENCE DOCUMENTS

### Created During This Session:
- `PRODUCTION_FIX_SUMMARY.md` - Traefik dynamic config fix
- `PRODUCTION_ISSUE_ANALYSIS.md` - Root cause analysis
- `scripts/deploy-traefik-config.sh` - Traefik deployment script
- `scripts/generate-hash.js` - Password hash generator
- `scripts/test-login.sh` - Login testing script

### Key Learnings:
1. Docker Compose + backticks =  (Traefik routing fails)
2. Use Traefik dynamic config files instead of Docker labels
3. Container IPs are dynamic - use Docker DNS
4. Password hashes must be synchronized across environments
5. 2FA should be disabled for local dev, enabled for production

---

## 🚀 NEXT SESSION ACTION ITEMS

1. **Prepare clean deployment files**
   - docker-compose.production.yml
   - Traefik config with Docker DNS
   - Environment variable template

2. **Backup existing production data**
   - Blog posts JSON
   - Services JSON
   - SEO audit data

3. **Execute clean deployment**
   - Remove old container
   - Deploy fresh instance
   - Verify all functionality

4. **Import backed-up data**
   - Restore blog posts
   - Restore services
   - Verify data integrity

5. **Monitor and test**
   - 24-hour monitoring period
   - Test all admin features
   - Verify AI generation

---

**DOCUMENT VERSION:** 1.0  
**LAST UPDATED:** 2026-05-09  
**PREPARED BY:** QA/QC Engineer  
**NEXT REVIEW:** After clean deployment  

---

## 💡 FINAL RECOMMENDATION

**DO NOT continue with iterative fixes.** The technical debt has accumulated to a point where:

1. Each fix creates new side effects
2. Configuration drift makes debugging difficult
3. Container volatility (IP changes) requires manual intervention
4. Multiple workarounds stacked on top of each other

**A clean deployment will:**
- ✅ Eliminate all configuration drift
- ✅ Solve root causes, not symptoms
- ✅ Provide stable, production-ready setup
- ✅ Save time in the long run
- ✅ Be easier to maintain and debug

**Estimated Time:**
- Preparation: 1-2 hours
- Backup: 30 minutes
- Clean deployment: 1 hour
- Verification: 1 hour
- **Total: 3-4 hours** vs. continuing infinite fix loop

---

**RECOMMENDATION: PROCEED WITH CLEAN DEPLOYMENT** 🚀
