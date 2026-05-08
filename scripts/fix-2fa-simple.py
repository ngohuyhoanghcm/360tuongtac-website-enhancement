#!/usr/bin/env python3
"""
Fix 2FA login - Direct SSH commands
"""

import subprocess
import time

VPS = "root@14.225.224.130"
PORT = "2277"

def ssh(cmd):
    """Run SSH command"""
    full = f'ssh -o StrictHostKeyChecking=no -p {PORT} {VPS} "{cmd}"'
    result = subprocess.run(full, shell=True, capture_output=True, text=True, timeout=30)
    return result.stdout.strip()

print("="*60)
print("🔧 FIXING 2FA LOGIN")
print("="*60)

# 1. Write env file using base64 to avoid escaping
print("\n1. Creating .env.prod...")
env_lines = [
    "NODE_ENV=production",
    "NEXT_PUBLIC_SITE_URL=https://grow.360tuongtac.com", 
    "NEXT_ADMIN_PASSWORD_HASH=$2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq",
    "NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54",
    "NEXT_ADMIN_SESSION_TIMEOUT=3600000"
]

# Create base64 encoded content
import base64
env_content = "\n".join(env_lines) + "\n"
env_b64 = base64.b64encode(env_content.encode()).decode()

# Decode and write on VPS
ssh(f"echo {env_b64} | base64 -d > /opt/360tuongtac/.env.prod")

# 2. Verify
print("\n2. Verifying file...")
result = ssh("cat /opt/360tuongtac/.env.prod")
print(result)

# 3. Check password hash length
print("\n3. Checking password hash...")
result = ssh("grep PASSWORD_HASH /opt/360tuongtac/.env.prod | wc -c")
print(f"   Password hash line length: {result} chars (should be ~75)")

# 4. Restart
print("\n4. Restarting container...")
ssh("docker restart 360tuongtac-app")

# 5. Wait
print("\n5. Waiting 10s...")
time.sleep(10)

# 6. Check status
print("\n6. Container status:")
result = ssh("docker ps --filter name=360tuongtac-app --format '{{.Status}}'")
print(f"   {result}")

# 7. Test login
print("\n7. Testing login...")
result = ssh('''curl -s -X POST http://localhost:3001/api/admin/login \\
  -H "Content-Type: application/json" \\
  -d '{"password": "wd!*dY4^4HPg:}nV"}' ''')
print(f"   Result: {result[:100]}")

print("\n" + "="*60)
print("✅ DONE! Test login at: https://grow.360tuongtac.com/admin")
print("="*60)
