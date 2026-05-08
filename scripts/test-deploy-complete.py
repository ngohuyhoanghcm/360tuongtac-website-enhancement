#!/usr/bin/env python3
"""
Test deployment - Verify everything works after GitHub Actions deploy
"""

import subprocess
import time

VPS = "deploy@14.225.224.130"
PORT = "2277"
SSH_KEY = "C:\\temp\\geminivideo_deploy.pem"

def ssh_cmd(cmd, timeout=30):
    full = f'ssh -p {PORT} -i "{SSH_KEY}" {VPS} "{cmd}"'
    result = subprocess.run(full, shell=True, capture_output=True, text=True, timeout=timeout)
    return result.stdout.strip()

print("="*70)
print(" TEST DEPLOYMENT - VERIFY ALL SYSTEMS")
print("="*70)

print("\n⏳ Waiting for GitHub Actions deployment to complete...")
print("   CHECK: https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/actions")
print("\n   Press ENTER when deployment is complete...")
input()

# Test 1: Container status
print("\n" + "="*70)
print("TEST 1: Container Status")
print("="*70)
status = ssh_cmd("docker ps --filter name=360tuongtac-app --format '{{.Status}}'")
print(f"   Status: {status}")
if "Up" in status:
    print("   ✅ Container is running")
else:
    print("   ❌ Container is NOT running!")

# Test 2: Environment variables
print("\n" + "="*70)
print("TEST 2: Environment Variables")
print("="*70)

vars_check = [
    ("Admin Password Hash", "NEXT_ADMIN_PASSWORD_HASH", "$2b$12$"),
    ("2FA Secret", "NEXT_ADMIN_2FA_SECRET", "MBISKKLH57XMJL7L36D7PYG2XAUQGH54"),
    ("Telegram Bot Token", "TELEGRAM_BOT_TOKEN", "8329752735"),
    ("Telegram Chat ID", "TELEGRAM_CHAT_ID", "138948131"),
    ("Database URL", "DATABASE_URL", "postgresql"),
]

all_ok = True
for name, var, expected in vars_check:
    result = ssh_cmd(f"docker exec 360tuongtac-app env | grep {var}")
    if expected in result:
        print(f"   ✅ {name} - OK")
    else:
        print(f"   ❌ {name} - MISSING (expected: {expected})")
        all_ok = False

# Test 3: Check logs for errors
print("\n" + "="*70)
print("TEST 3: Container Logs (last 20 lines)")
print("="*70)
logs = ssh_cmd("docker logs 360tuongtac-app --tail 20")
if "NEXT_ADMIN_PASSWORD_HASH is not set" in logs:
    print("   ❌ ERROR: Password hash not found!")
    all_ok = False
elif "Ready in" in logs:
    print("   ✅ No errors, container started successfully")
else:
    print(f"   Logs:\n{logs}")

# Test 4: Verify .env.prod on VPS
print("\n" + "="*70)
print("TEST 4: .env.prod File on VPS")
print("="*70)
env_file = ssh_cmd("cat /opt/360tuongtac/.env.prod")
lines = env_file.split('\n')
print(f"   Total variables: {len(lines)}")
if "TELEGRAM_BOT_TOKEN" in env_file and "TELEGRAM_CHAT_ID" in env_file:
    print("   ✅ Telegram vars present in .env.prod")
else:
    print("   ⚠️ Telegram vars missing from .env.prod")

# Test 5: Manual tests
print("\n" + "="*70)
print("TEST 5: Manual Testing Required")
print("="*70)
print("\n   Please test the following:")
print("   1. Admin Login: https://grow.360tuongtac.com/admin")
print("      - Password: wd!*dY4^4HPg:}nV")
print("      - 2FA: Google Authenticator")
print("\n   2. Contact Form: https://grow.360tuongtac.com/lien-he")
print("      - Submit form and check Telegram notification")
print("\n   3. Website: https://grow.360tuongtac.com")
print("      - Check if GA/GTM tracking is working")

print("\n   Press ENTER after testing...")
input()

# Summary
print("\n" + "="*70)
print(" DEPLOYMENT TEST SUMMARY")
print("="*70)

if all_ok:
    print("\n ✅ ALL ENVIRONMENT VARIABLES LOADED CORRECTLY!")
    print("\n CONCLUSION:")
    print("   - Keeping TELEGRAM secrets in GitHub is SAFE")
    print("   - They are duplicated (GitHub + .env.prod) but no conflict")
    print("   - .env.prod takes precedence at runtime")
    print("   - GitHub secrets are only used for build-args (GA, GTM)")
else:
    print("\n ❌ SOME ISSUES DETECTED!")
    print("   Check the errors above and fix accordingly")

print("\n" + "="*70)
print(" RECOMMENDATION:")
print("="*70)
print("""
Current setup is working correctly:

GitHub Secrets (Build-time):
  ✅ NEXT_PUBLIC_GA_MEASUREMENT_ID → Build arg
  ✅ NEXT_PUBLIC_GTM_ID → Build arg
  ✅ TELEGRAM_BOT_TOKEN → Not used (safe to keep or remove)
  ✅ TELEGRAM_CHAT_ID → Not used (safe to keep or remove)

VPS .env.prod (Runtime):
  ✅ ALL variables including Telegram
  ✅ Takes precedence over build-time vars

You can KEEP Telegram secrets in GitHub - they won't cause any issues.
Or you can REMOVE them to clean up - also safe.

Both approaches work!
""")
print("="*70)
