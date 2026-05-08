#!/bin/bash
# Safe redeploy script - rebuilds Docker image with new secrets

echo "========================================="
echo "  360TuongTac Safe Redeploy"
echo "========================================="
echo ""
echo "This will trigger GitHub Actions to:"
echo "1. Build new Docker image with updated secrets"
echo "2. Deploy to VPS safely"
echo "3. Verify deployment"
echo ""
echo "⚠️  This is SAFE - will NOT delete data!"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Triggering GitHub Actions workflow..."
echo ""

# Create empty commit to trigger build
git commit --allow-empty -m "ci: trigger redeploy with updated 2FA secrets"
git push origin main

echo ""
echo "✅ Commit pushed to main branch"
echo " GitHub Actions workflow will start automatically"
echo ""
echo "Monitor at:"
echo "https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/actions"
echo ""
echo "Expected timeline: 5-10 minutes"
echo ""
echo "After deployment completes, verify with:"
echo "  ssh -p 2277 -i ~/.ssh/geminivideo_deploy.pem deploy@14.225.224.130"
echo "  docker exec 360tuongtac-app env | grep NEXT_ADMIN"
echo ""
