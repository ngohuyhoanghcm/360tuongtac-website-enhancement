#!/usr/bin/env bash
# Debug 2FA authentication on production VPS

echo "========================================="
echo "  360TuongTac 2FA Debug Script"
echo "========================================="
echo ""

# SSH command
SSH_CMD="ssh -p 2277 deploy@14.225.224.130"

echo "[1/6] Checking container status..."
$SSH_CMD "docker ps --filter 'name=360tuongtac-app' --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"

echo ""
echo "[2/6] Checking environment variables..."
$SSH_CMD "docker exec 360tuongtac-app env | grep -E 'NEXT_ADMIN|2FA|SITE_URL' | sort"

echo ""
echo "[3/6] Checking .env.production file..."
$SSH_CMD "cat /opt/360tuongtac/.env.production 2>/dev/null || echo 'File not found'"

echo ""
echo "[4/6] Checking recent logs..."
$SSH_CMD "docker logs 360tuongtac-app --tail 50 2>&1 | grep -i -E 'login|2fa|admin|error|password' | tail -20"

echo ""
echo "[5/6] Testing password verification..."
$SSH_CMD "docker exec 360tuongtac-app node -e \"
const bcrypt = require('bcryptjs');
const hash = process.env.NEXT_ADMIN_PASSWORD_HASH;
console.log('Password hash exists:', !!hash);
console.log('Hash length:', hash ? hash.length : 0);
console.log('Hash starts with:', hash ? hash.substring(0, 10) : 'N/A');
\""

echo ""
echo "[6/6] Testing TOTP secret..."
$SSH_CMD "docker exec 360tuongtac-app node -e \"
const secret = process.env.NEXT_ADMIN_2FA_SECRET;
console.log('2FA Secret exists:', !!secret);
console.log('Secret length:', secret ? secret.length : 0);
console.log('Secret value:', secret);
console.log('Valid Base32:', /^[A-Z2-7]{32}$/.test(secret || ''));
\""

echo ""
echo "========================================="
echo "  Debug Complete"
echo "========================================="
