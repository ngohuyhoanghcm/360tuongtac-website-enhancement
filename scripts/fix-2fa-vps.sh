#!/bin/bash
# Fix 2FA login - Run directly on VPS

echo "=========================================="
echo "FIXING 2FA LOGIN ON VPS"
echo "=========================================="

# Create .env.prod with correct values
cat > /opt/360tuongtac/.env.prod << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://grow.360tuongtac.com
NEXT_ADMIN_PASSWORD_HASH=$2b$12$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
NEXT_ADMIN_SESSION_TIMEOUT=3600000
EOF

echo ""
echo "1. Verifying .env.prod..."
cat /opt/360tuongtac/.env.prod

echo ""
echo "2. Checking password hash length..."
grep PASSWORD_HASH /opt/360tuongtac/.env.prod | wc -c

echo ""
echo "3. Restarting container..."
docker restart 360tuongtac-app

echo ""
echo "4. Waiting 10 seconds..."
sleep 10

echo ""
echo "5. Container status:"
docker ps --filter name=360tuongtac-app --format '{{.Status}}'

echo ""
echo "6. Testing login..."
curl -s -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "wd!*dY4^4HPg:}nV"}'

echo ""
echo "=========================================="
echo "DONE! Test at: https://grow.360tuongtac.com/admin"
echo "=========================================="
