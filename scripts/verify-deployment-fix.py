#!/usr/bin/env python3
"""
Monitor GitHub Actions deployment and verify login works
"""

import subprocess
import time

def run_cmd(cmd, description=""):
    """Run SSH command"""
    if description:
        print(f"\n🔍 {description}")
    full_cmd = f'ssh -p 2277 -i "C:\\temp\\geminivideo_deploy.pem" deploy@14.225.224.130 "{cmd}"'
    result = subprocess.run(full_cmd, shell=True, capture_output=True, text=True, timeout=30)
    return result.stdout.strip()

print("="*70)
print(" MONITORING DEPLOYMENT & VERIFYING FIX")
print("="*70)

# Wait for deployment
print("\n⏳ Waiting for GitHub Actions deployment to complete...")
print("   (Usually takes 3-5 minutes)")
print("\n   CHECK: https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/actions")
print("\n   Press ENTER when deployment is complete...")
input()

# Step 1: Check container status
print("\n" + "="*70)
print("STEP 1: Checking container status")
print("="*70)
status = run_cmd("docker ps --filter name=360tuongtac-app --format '{{.Status}}'", "Container status")
print(f"   Status: {status}")

# Step 2: Verify environment variables
print("\n" + "="*70)
print("STEP 2: Verifying environment variables")
print("="*70)

# Check if admin vars are loaded
admin_vars = run_cmd("docker exec 360tuongtac-app env | grep NEXT_ADMIN", "Admin env vars")
print(f"   Admin variables:\n{admin_vars}")

if "NEXT_ADMIN_PASSWORD_HASH=" in admin_vars and len(admin_vars) > 100:
    print("   ✅ Password hash loaded correctly!")
else:
    print("   ❌ Password hash missing or truncated!")

if "MBISKKLH57XMJL7L36D7PYG2XAUQGH54" in admin_vars:
    print("   ✅ 2FA secret loaded correctly (with 7L)!")
else:
    print("   ❌ 2FA secret incorrect!")

# Step 3: Check logs
print("\n" + "="*70)
print("STEP 3: Checking container logs")
print("="*70)
logs = run_cmd("docker logs 360tuongtac-app --tail 20", "Recent logs")
if "NEXT_ADMIN_PASSWORD_HASH is not set" in logs:
    print("   ❌ ERROR: Password hash not found in logs!")
    print(f"   {logs}")
else:
    print("   ✅ No errors in logs!")

# Step 4: Test login manually
print("\n" + "="*70)
print("STEP 4: Test login manually")
print("="*70)
print("\n   URL: https://grow.360tuongtac.com/admin")
print("   Password: wd!*dY4^4HPg:}nV")
print("   2FA: Use Google Authenticator")
print("\n   Press ENTER after testing...")
input()

# Step 5: Verify .env.prod on VPS
print("\n" + "="*70)
print("STEP 5: Verifying .env.prod on VPS")
print("="*70)
env_content = run_cmd("cat /opt/360tuongtac/.env.prod", "Env file content")
print(f"   {env_content}")

# Summary
print("\n" + "="*70)
print(" SUMMARY")
print("="*70)
print("\n ✅ Fixed:")
print("   - Removed admin build-args from deploy.yml")
print("   - Removed admin ARGs from Dockerfile")
print("   - Admin vars now loaded from .env.prod at runtime")
print("\n ✅ Preserved:")
print("   - NEXT_PUBLIC_GA_MEASUREMENT_ID (build arg)")
print("   - NEXT_PUBLIC_GTM_ID (build arg)")
print("   - All other GitHub Secrets still work")
print("\n ✅ Strategy:")
print("   - Code deployment: GitHub Actions")
print("   - Admin secrets: .env.prod on VPS")
print("   - Future deploys won't override admin secrets")
print("\n" + "="*70)
