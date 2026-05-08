#!/usr/bin/env python3
"""
Fix .env.prod - Add ALL required runtime variables including TELEGRAM
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
print(" FIXING .env.prod - ADDING ALL RUNTIME VARIABLES")
print("="*70)

# Complete .env.prod with ALL vars needed at runtime
env_content = """NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://grow.360tuongtac.com
NEXT_ADMIN_PASSWORD_HASH=$2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
NEXT_ADMIN_SESSION_TIMEOUT=3600000
DATABASE_URL=postgresql://360tuongtac_user:placeholder@360tuongtac-postgres:5432/360tuongtac_production
ORDER_PANEL_URL=https://360tuongtac.com
NEXT_TELEMETRY_DISABLED=1
TELEGRAM_BOT_TOKEN=8329752735:AAEQ9VwcII0fJHkrMMNopDeJuAkDPAXB9fA
TELEGRAM_CHAT_ID=138948131
"""

print("\n1. Writing complete .env.prod...")

# Use base64 to avoid shell escaping issues
env_b64 = base64.b64encode(env_content.encode()).decode()
ssh_cmd(f"echo {env_b64} | base64 -d > /opt/360tuongtac/.env.prod")

print("\n2. Verifying .env.prod...")
result = ssh_cmd("cat /opt/360tuongtac/.env.prod")
print(f"   Content:\n{result}")

print("\n3. Checking file size...")
result = ssh_cmd("wc -c /opt/360tuongtac/.env.prod")
print(f"   {result}")

print("\n4. Restarting container...")
ssh_cmd("docker restart 360tuongtac-app")

print("\n5. Waiting 10 seconds for container to start...")
import time
time.sleep(10)

print("\n6. Checking environment variables in container...")
result = ssh_cmd("docker exec 360tuongtac-app env | grep -E 'TELEGRAM|NEXT_PUBLIC|DATABASE|NEXT_ADMIN|ORDER'")
print(f"   Variables found:\n{result}")

# Check specific vars
vars_to_check = [
    ("TELEGRAM_BOT_TOKEN", "8329752735"),
    ("TELEGRAM_CHAT_ID", "138948131"),
    ("NEXT_ADMIN_2FA_SECRET", "MBISKKLH57XMJL7L36D7PYG2XAUQGH54"),
    ("DATABASE_URL", "postgresql"),
]

print("\n7. Verifying critical variables:")
all_ok = True
for var_name, expected in vars_to_check:
    result = ssh_cmd(f"docker exec 360tuongtac-app env | grep {var_name}")
    if expected in result:
        print(f"   ✅ {var_name} - OK")
    else:
        print(f"   ❌ {var_name} - MISSING or WRONG!")
        all_ok = False

print("\n" + "="*70)
if all_ok:
    print("✅ ALL VARIABLES LOADED CORRECTLY!")
else:
    print("❌ SOME VARIABLES ARE MISSING!")
print("="*70)

print("\n NEXT STEPS:")
print("   1. Test contact form at: https://grow.360tuongtac.com/lien-he")
print("   2. Submit form and check if Telegram notification is received")
print("   3. If still failing, check logs: docker logs 360tuongtac-app --tail 50")
print("="*70)
