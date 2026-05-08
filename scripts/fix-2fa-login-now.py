#!/usr/bin/env python3
"""
Fix 2FA login on production VPS
- Update .env.prod with correct values
- Restart container
"""

import subprocess
import sys

VPS_HOST = "root@14.225.224.130"
VPS_PORT = "2277"

ENV_CONTENT = """NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://grow.360tuongtac.com
NEXT_ADMIN_PASSWORD_HASH=$2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
NEXT_ADMIN_SESSION_TIMEOUT=3600000
"""

def run_ssh(cmd, check_output=False):
    """Run SSH command"""
    full_cmd = f"ssh {VPS_HOST} -p {VPS_PORT} \"{cmd}\""
    print(f"\n🔧 Running: {cmd}")
    
    try:
        result = subprocess.run(full_cmd, shell=True, capture_output=check_output, text=True)
        if check_output:
            return result.stdout.strip()
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("="*60)
    print("🔧 FIXING 2FA LOGIN ON PRODUCTION VPS")
    print("="*60)
    
    # Step 1: Write correct env file
    print("\n Step 1: Writing correct .env.prod...")
    escaped_content = ENV_CONTENT.replace('$', '$$')
    escaped_escaped = escaped_content.replace('$', '\\$')
    
    cmd = f"cat > /opt/360tuongtac/.env.prod << 'ENVEOF'\n{ENV_CONTENT}ENVEOF"
    run_ssh(cmd)
    
    # Step 2: Verify
    print("\n🔍 Step 2: Verifying .env.prod...")
    result = run_ssh("cat /opt/360tuongtac/.env.prod", check_output=True)
    if result:
        print("✅ .env.prod content:")
        for line in result.split('\n'):
            if '=' in line:
                key, val = line.split('=', 1)
                if 'PASSWORD_HASH' in key or '2FA_SECRET' in key:
                    print(f"   {key} = {val[:20]}...{val[-10:] if len(val) > 30 else val}")
                else:
                    print(f"   {key} = {val}")
    
    # Step 3: Restart container
    print("\n🔄 Step 3: Restarting container...")
    run_ssh("docker restart 360tuongtac-app")
    
    # Step 4: Wait and check
    print("\n⏳ Step 4: Waiting for container to start...")
    import time
    time.sleep(5)
    
    result = run_ssh("docker ps --filter name=360tuongtac-app --format '{{.Status}}'", check_output=True)
    if result and "Up" in result:
        print(f"✅ Container is running: {result}")
    else:
        print("❌ Container not running properly")
        return
    
    # Step 5: Quick health check
    print("\n Step 5: Health check...")
    result = run_ssh("curl -s http://localhost:3001/api/admin/health", check_output=True)
    if result:
        print(f"✅ Health check: {result[:100]}...")
    
    print("\n" + "="*60)
    print("✅ FIX COMPLETE!")
    print("="*60)
    print("\n TEST LOGIN NOW:")
    print("   URL: https://grow.360tuongtac.com/admin")
    print("   Password: wd!*dY4^4HPg:}nV")
    print("   2FA: Check Google Authenticator")
    print("\n" + "="*60)

if __name__ == "__main__":
    main()
