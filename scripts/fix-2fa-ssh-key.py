#!/usr/bin/env python3
"""
Fix 2FA login - Use SSH key authentication
"""

import subprocess
import os

# SSH key path
SSH_KEY = os.path.expanduser("~/.ssh/id_rsa")
VPS_HOST = "root@14.225.224.130"
VPS_PORT = "2277"

# Correct environment variables
PASSWORD_HASH = "$2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq"
TWO_FA_SECRET = "MBISKKLH57XMJL7L36D7PYG2XAUQGH54"

def run_ssh_cmd(cmd, description=""):
    """Run SSH command with key authentication"""
    if description:
        print(f"\n🔧 {description}")
    
    full_cmd = f'ssh -i {SSH_KEY} -o StrictHostKeyChecking=no -p {VPS_PORT} {VPS_HOST} "{cmd}"'
    
    try:
        result = subprocess.run(full_cmd, shell=True, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            print(f"   ✅ {result.stdout.strip()[:100]}")
            return result.stdout.strip()
        else:
            print(f"   ❌ Error: {result.stderr.strip()[:100]}")
            return None
    except Exception as e:
        print(f"   ❌ Exception: {e}")
        return None

def main():
    print("="*70)
    print("🔧 FIXING ADMIN 2FA LOGIN ON PRODUCTION")
    print("="*70)
    
    # Step 1: Check if SSH key exists
    if not os.path.exists(SSH_KEY):
        print(f"\n❌ SSH key not found at {SSH_KEY}")
        print("   Please create SSH key first or use password authentication")
        return
    
    print(f"\n✅ Using SSH key: {SSH_KEY}")
    
    # Step 2: Create .env.prod with correct values using Python heredoc
    print("\n Step 1: Creating .env.prod file...")
    
    # Use Python to write file to avoid shell escaping issues
    python_write_cmd = f'''python3 -c "
import os
content = '''NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://grow.360tuongtac.com
NEXT_ADMIN_PASSWORD_HASH={PASSWORD_HASH}
NEXT_ADMIN_2FA_SECRET={TWO_FA_SECRET}
NEXT_ADMIN_SESSION_TIMEOUT=3600000
'''
os.makedirs('/opt/360tuongtac', exist_ok=True)
with open('/opt/360tuongtac/.env.prod', 'w') as f:
    f.write(content)
print('✅ .env.prod created')
"'''
    
    run_ssh_cmd(python_write_cmd, "Creating .env.prod")
    
    # Step 3: Verify the file
    print("\n🔍 Step 2: Verifying .env.prod...")
    run_ssh_cmd("cat /opt/360tuongtac/.env.prod | head -5", "File content")
    
    # Step 4: Check file size
    run_ssh_cmd("wc -c /opt/360tuongtac/.env.prod", "File size")
    
    # Step 5: Restart container
    print("\n🔄 Step 3: Restarting container...")
    run_ssh_cmd("docker restart 360tuongtac-app", "Restarting container")
    
    # Step 6: Wait for container
    print("\n⏳ Step 4: Waiting 10 seconds for container to start...")
    import time
    time.sleep(10)
    
    # Step 7: Check container status
    print("\n📊 Step 5: Checking container status...")
    run_ssh_cmd("docker ps --filter name=360tuongtac-app --format '{{.Status}}'", "Container status")
    
    # Step 8: Check environment variables in container
    print("\n🔍 Step 6: Checking environment variables in container...")
    run_ssh_cmd("docker exec 360tuongtac-app env | grep NEXT_ADMIN | head -3", "Env vars")
    
    # Step 9: Test health endpoint
    print("\n Step 7: Health check...")
    run_ssh_cmd("curl -s http://localhost:3001/api/admin/health | head -c 200", "Health check")
    
    # Step 10: Test login
    print("\n Step 8: Testing login with correct password...")
    test_login_cmd = f'''curl -s -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{{"password": "wd!*dY4^4HPg:}}nV"}}' | python3 -m json.tool'''
    run_ssh_cmd(test_login_cmd, "Login test")
    
    print("\n" + "="*70)
    print("✅ FIX COMPLETE!")
    print("="*70)
    print("\n📝 NEXT STEPS:")
    print("   1. Open browser: https://grow.360tuongtac.com/admin")
    print("   2. Password: wd!*dY4^4HPg:}nV")
    print("   3. 2FA Code: Check Google Authenticator")
    print("\n   If still failing, check logs:")
    print("   ssh -i ~/.ssh/id_rsa -p 2277 root@14.225.224.130")
    print("   docker logs 360tuongtac-app --tail 50")
    print("="*70)

if __name__ == "__main__":
    main()
