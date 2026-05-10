@echo off
cd /d "d:\Project-Nâng cấp website 360TuongTac\360tuongtac-website-enhancement"

echo ========================================
echo   COMMITTING AND PUSHING TO GITHUB
echo ========================================
echo.

echo Step 1: Adding all changes...
git add -A

echo.
echo Step 2: Checking status...
git status --short

echo.
echo Step 3: Creating commit...
git commit -m "feat: Migrate to file-based authentication system

ROOT CAUSE FIX: Docker env-file parser truncates bcrypt hash ($ sign issue)

SOLUTION: Move auth config from .env.production to TypeScript constants
- Create lib/admin/auth-config.ts for secure file-based credentials
- Update login API to use ADMIN_AUTH_CONFIG constants
- Update dev-auth-bypass.ts to use TypeScript config
- Remove Docker env-file escaping workaround (no longer needed!)
- Simplify deployment workflow (7 steps instead of 8)

BENEFITS:
- No Docker env-file parsing issues
- Build-time optimization (faster than runtime env vars)
- TypeScript type safety
- Simpler, more reliable deployment
- Aligns with Phase 1-2 Hybrid Architecture strategy

References:
- 2. CONTENT_MANAGEMENT_SYSTEM_STRATEGY.md (Hybrid Approach)
- Root cause: Docker interprets $ in bcrypt hash as variable"

echo.
echo Step 4: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   DEPLOYMENT TRIGGERED!
echo ========================================
echo.
echo Monitor at:
echo https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/actions
echo.
echo After deployment (~10 minutes), test login at:
echo https://grow.360tuongtac.com/admin
echo.
pause
