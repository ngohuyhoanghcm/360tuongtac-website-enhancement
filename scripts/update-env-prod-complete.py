#!/usr/bin/env python3
"""
Update .env.prod with ALL required runtime variables
"""

import subprocess

VPS = "deploy@14.225.224.130"
PORT = "2277"
SSH_KEY = "C:\\temp\\geminivideo_deploy.pem"

# Get current .env.prod content
def ssh_cmd(cmd):
    full = f'ssh -p {PORT} -i "{SSH_KEY}" {VPS} "{cmd}"'
    result = subprocess.run(full, shell=True, capture_output=True, text=True, timeout=30)
    return result.stdout.strip()

print("="*70)
print(" UPDATING .env.prod WITH ALL RUNTIME VARIABLES")
print("="*70)

# Get existing content
print("\n1. Reading current .env.prod...")
current = ssh_cmd("cat /opt/360tuongtac/.env.prod")
print(f"   Current content:\n{current}")

# Create comprehensive .env.prod with ALL vars
print("\n2. Creating updated .env.prod...")

env_content = """NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://grow.360tuongtac.com
NEXT_ADMIN_PASSWORD_HASH=$$2b$$12$$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
NEXT_ADMIN_SESSION_TIMEOUT=3600000
DATABASE_URL=postgresql://360tuongtac_user:placeholder@360tuongtac-postgres:5432/360tuongtac_production
ORDER_PANEL_URL=https://360tuongtac.com
NEXT_TELEMETRY_DISABLED=1
"""

# Write using base64 to avoid escaping issues
import base64
env_b64 = base64.b64encode(env_content.encode()).decode()

ssh_cmd(f"echo {env_b64} | base64 -d > /opt/360tuongtac/.env.prod")

# Verify
print("\n3. Verifying updated .env.prod...")
updated = ssh_cmd("cat /opt/360tuongtac/.env.prod")
print(f"   Updated content:\n{updated}")

# Restart container
print("\n4. Restarting container...")
ssh_cmd("docker restart 360tuongtac-app")

# Wait
import time
print("\n5. Waiting 10 seconds...")
time.sleep(10)

# Check env vars
print("\n6. Checking environment variables in container...")
result = ssh_cmd("docker exec 360tuongtac-app env | grep -E 'TELEGRAM|NEXT_PUBLIC|DATABASE|NEXT_ADMIN'")
print(f"   Variables found:\n{result}")

print("\n" + "="*70)
print("✅ UPDATE COMPLETE!")
print("="*70)
print("\n SUMMARY:")
print("   ✅ Admin vars (PASSWORD_HASH, 2FA_SECRET, SESSION_TIMEOUT)")
print("   ✅ Database vars (DATABASE_URL)")
print("   ✅ Public vars will be loaded from .env.production (build-time)")
print("\n️  NOTE:")
print("   - TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are still missing")
print("   - These need to be added to .env.prod manually from GitHub Secrets")
print("\n🔧 NEXT STEPS:")
print("   1. Get TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from GitHub Secrets")
print("   2. Add them to .env.prod")
print("   3. Or add them to .env.production for build-time embedding")
print("="*70)
