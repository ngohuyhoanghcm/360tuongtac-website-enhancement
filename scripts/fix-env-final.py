#!/usr/bin/env python3
"""
Fix .env.prod with proper $$ escaping for Docker Compose
"""

import subprocess
import base64

VPS = "deploy@14.225.224.130"
PORT = "2277"
SSH_KEY = "C:\\temp\\geminivideo_deploy.pem"

def ssh_cmd(cmd):
    full = f'ssh -p {PORT} -i "{SSH_KEY}" {VPS} "{cmd}"'
    result = subprocess.run(full, shell=True, capture_output=True, text=True, timeout=30)
    return result.stdout.strip()

print("="*70)
print(" FIXING .env.prod WITH PROPER $$ ESCAPING")
print("="*70)

# Note: Use $$ for Docker Compose to escape $ properly
env_content = """NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://grow.360tuongtac.com
NEXT_ADMIN_PASSWORD_HASH=$$2b$$12$$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
NEXT_ADMIN_SESSION_TIMEOUT=3600000
DATABASE_URL=postgresql://360tuongtac_user:placeholder@360tuongtac-postgres:5432/360tuongtac_production
ORDER_PANEL_URL=https://360tuongtac.com
NEXT_TELEMETRY_DISABLED=1
TELEGRAM_BOT_TOKEN=8329752735:AAEQ9VwcII0fJHkrMMNopDeJuAkDPAXB9fA
TELEGRAM_CHAT_ID=138948131
"""

print("\n1. Writing .env.prod with $$ escaping...")

# Use base64 to avoid shell escaping issues
env_b64 = base64.b64encode(env_content.encode()).decode()
ssh_cmd(f"echo {env_b64} | base64 -d > /opt/360tuongtac/.env.prod")

print("\n2. Verifying .env.prod...")
result = ssh_cmd("cat /opt/360tuongtac/.env.prod")
print(f"   Content:\n{result}")

print("\n3. Restarting with docker compose...")
ssh_cmd("cd /opt/360tuongtac && docker compose down && docker compose up -d")

print("\n4. Waiting 10 seconds...")
import time
time.sleep(10)

print("\n5. Checking ALL environment variables...")
result = ssh_cmd("docker exec 360tuongtac-app env | grep -E 'TELEGRAM|DATABASE|NEXT_ADMIN|ORDER|NEXT_PUBLIC'")
print(f"   Variables:\n{result}")

# Verify each critical var
print("\n6. Verification:")
checks = [
    ("NEXT_ADMIN_PASSWORD_HASH", "$2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq"),
    ("NEXT_ADMIN_2FA_SECRET", "MBISKKLH57XMJL7L36D7PYG2XAUQGH54"),
    ("TELEGRAM_BOT_TOKEN", "8329752735"),
    ("TELEGRAM_CHAT_ID", "138948131"),
    ("DATABASE_URL", "postgresql"),
]

all_ok = True
for var, expected in checks:
    result = ssh_cmd(f"docker exec 360tuongtac-app env | grep {var}")
    if expected in result and len(result) > 20:
        print(f"   ✅ {var} - OK")
    else:
        print(f"   ❌ {var} - FAIL (got: {result[:50]}...)")
        all_ok = False

print("\n" + "="*70)
if all_ok:
    print("✅ ALL VARIABLES LOADED CORRECTLY!")
    print("\n🎉 READY TO TEST:")
    print("   - Contact form: https://grow.360tuongtac.com/lien-he")
    print("   - Admin login: https://grow.360tuongtac.com/admin")
else:
    print("❌ SOME VARIABLES STILL FAILING!")
print("="*70)
