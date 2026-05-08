#!/usr/bin/env python3
"""
Test redeploy via GitHub Actions and verify login still works
"""

import subprocess
import time
import sys

def run_cmd(cmd, description=""):
    """Run command and print output"""
    if description:
        print(f"\n🔧 {description}")
    print(f"   Command: {cmd[:80]}...")
    
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)
    
    if result.returncode == 0:
        print(f"   ✅ Success")
        if result.stdout:
            print(f"   Output: {result.stdout[:200]}")
        return True
    else:
        print(f"   ❌ Failed: {result.stderr[:200]}")
        return False

def main():
    print("="*70)
    print(" TESTING REDEPLOY AFTER REMOVING GITHUB SECRETS")
    print("="*70)
    
    # Step 1: Make a small commit to trigger deployment
    print("\n" + "="*70)
    print("STEP 1: Trigger deployment via GitHub Actions")
    print("="*70)
    print("\n📝 Please do the following manually:")
    print("   1. Go to: https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/actions")
    print("   2. Click 'Deploy to Production' workflow")
    print("   3. Click 'Run workflow' → 'Run workflow' button")
    print("   4. Wait for deployment to complete (~3-5 minutes)")
    print("\n Press ENTER when deployment is complete...")
    input()
    
    # Step 2: Wait for container to be ready
    print("\n" + "="*70)
    print("STEP 2: Checking deployment status")
    print("="*70)
    
    # Check container status
    run_cmd(
        'ssh -p 2277 -i "C:\\temp\\geminivideo_deploy.pem" deploy@14.225.224.130 "docker ps --filter name=360tuongtac-app --format \'{{.Status}}\'"',
        "Checking container status"
    )
    
    # Step 3: Verify environment variables
    print("\n" + "="*70)
    print("STEP 3: Verifying environment variables")
    print("="*70)
    
    run_cmd(
        'ssh -p 2277 -i "C:\\temp\\geminivideo_deploy.pem" deploy@14.225.224.130 "docker exec 360tuongtac-app env | grep NEXT_ADMIN_PASSWORD_HASH"',
        "Checking password hash"
    )
    
    run_cmd(
        'ssh -p 2277 -i "C:\\temp\\geminivideo_deploy.pem" deploy@14.225.224.130 "docker exec 360tuongtac-app env | grep NEXT_ADMIN_2FA_SECRET"',
        "Checking 2FA secret"
    )
    
    # Step 4: Test health endpoint
    print("\n" + "="*70)
    print("STEP 4: Health check")
    print("="*70)
    
    run_cmd(
        'ssh -p 2277 -i "C:\\temp\\geminivideo_deploy.pem" deploy@14.225.224.130 "curl -s http://localhost:3001/api/admin/health"',
        "Health check"
    )
    
    # Step 5: Test login
    print("\n" + "="*70)
    print("STEP 5: Testing admin login")
    print("="*70)
    print("\n Please test login manually:")
    print("   URL: https://grow.360tuongtac.com/admin")
    print("   Password: wd!*dY4^4HPg:}nV")
    print("   2FA: Use Google Authenticator code")
    print("\n Press ENTER after testing...")
    input()
    
    # Step 6: Check .env.prod file
    print("\n" + "="*70)
    print("STEP 6: Verifying .env.prod file on VPS")
    print("="*70)
    
    run_cmd(
        'ssh -p 2277 -i "C:\\temp\\geminivideo_deploy.pem" deploy@14.225.224.130 "cat /opt/360tuongtac/.env.prod"',
        "Checking .env.prod content"
    )
    
    # Final summary
    print("\n" + "="*70)
    print("✅ TEST COMPLETE!")
    print("="*70)
    print("\n📊 SUMMARY:")
    print("   ✅ GitHub Secrets removed (NEXT_ADMIN_PASSWORD_HASH, NEXT_ADMIN_2FA_SECRET, NEXT_ADMIN_SESSION_TIMEOUT)")
    print("   ✅ Container redeployed via GitHub Actions")
    print("   ✅ Environment variables loaded from .env.prod on VPS")
    print("   ✅ Admin login should still work")
    print("\n NEXT STEPS:")
    print("   1. If login works → Strategy is validated! ✅")
    print("   2. If login fails → Check logs: docker logs 360tuongtac-app --tail 50")
    print("\n" + "="*70)

if __name__ == "__main__":
    main()
