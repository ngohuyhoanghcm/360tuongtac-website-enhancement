#!/bin/bash
# 360TuongTac Traefik Dynamic Config Deployment Script
# SAFE: Does NOT modify existing configs

set -e

TRAefik_CONFIG_DIR="/etc/dokploy/traefik/dynamic"
CONFIG_FILE="360tuongtac-traefik-config.yml"
BACKUP_DIR="/tmp/traefik-backup-$(date +%Y%m%d_%H%M%S)"

echo " Deploying 360TuongTac Traefik Configuration"
echo "=============================================="

# Step 1: Backup existing config (safety first)
echo ""
echo "📦 Step 1: Creating backup..."
mkdir -p "$BACKUP_DIR"
if [ -f "$TRAefik_CONFIG_DIR/$CONFIG_FILE" ]; then
    cp "$TRAefik_CONFIG_DIR/$CONFIG_FILE" "$BACKUP_DIR/"
    echo "✅ Backup created: $BACKUP_DIR/$CONFIG_FILE"
else
    echo "ℹ️  No existing config to backup (first deployment)"
fi

# Step 2: Get current container IP
echo ""
echo "🔍 Step 2: Getting container IP..."
CONTAINER_IP=$(docker inspect 360tuongtac-app 2>/dev/null | grep -A 3 '"dokploy-network"' | grep '"IPv4Address"' | awk -F'"' '{print $4}' | cut -d'/' -f1)

if [ -z "$CONTAINER_IP" ]; then
    echo "❌ ERROR: Could not find container IP"
    echo "   Make sure container '360tuongtac-app' is running"
    exit 1
fi

echo "✅ Container IP: $CONTAINER_IP"

# Step 3: Generate config with correct IP
echo ""
echo "⚙️  Step 3: Generating config file..."
cat > "/tmp/$CONFIG_FILE" << EOF
http:
  routers:
    360tuongtac-router:
      rule: "Host(\`grow.360tuongtac.com\`)"
      entryPoints:
        - websecure
      service: 360tuongtac-service
      tls:
        certResolver: letsencrypt
  
  services:
    360tuongtac-service:
      loadBalancer:
        servers:
          - url: "http://${CONTAINER_IP}:3000"
        passHostHeader: true
EOF

echo "✅ Config file generated at /tmp/$CONFIG_FILE"

# Step 4: Validate config syntax
echo ""
echo "🔎 Step 4: Validating config syntax..."
if command -v python3 &> /dev/null; then
    python3 -c "
import yaml
import sys
try:
    with open('/tmp/$CONFIG_FILE', 'r') as f:
        yaml.safe_load(f)
    print('✅ YAML syntax valid')
except yaml.YAMLError as e:
    print(f'❌ YAML syntax error: {e}')
    sys.exit(1)
" 2>/dev/null || echo "⚠️  Python YAML validator not available, skipping syntax check"
else
    echo "⚠️  Python3 not available, skipping syntax validation"
fi

# Step 5: Deploy config
echo ""
echo "📤 Step 5: Deploying config..."
cp "/tmp/$CONFIG_FILE" "$TRAefik_CONFIG_DIR/$CONFIG_FILE"
chmod 644 "$TRAefik_CONFIG_DIR/$CONFIG_FILE"

echo "✅ Config deployed to $TRAefik_CONFIG_DIR/$CONFIG_FILE"

# Step 6: Verify file exists
echo ""
echo "🔍 Step 6: Verifying deployment..."
if [ -f "$TRAefik_CONFIG_DIR/$CONFIG_FILE" ]; then
    echo "✅ File exists in Traefik config directory"
    echo "📄 Config content:"
    cat "$TRAefik_CONFIG_DIR/$CONFIG_FILE"
else
    echo "❌ ERROR: File not found after deployment!"
    echo "🔄 Restoring from backup..."
    if [ -f "$BACKUP_DIR/$CONFIG_FILE" ]; then
        cp "$BACKUP_DIR/$CONFIG_FILE" "$TRAefik_CONFIG_DIR/$CONFIG_FILE"
        echo "✅ Backup restored"
    fi
    exit 1
fi

# Step 7: Summary
echo ""
echo "=============================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=============================================="
echo ""
echo "📊 Summary:"
echo "  - Config file: $TRAefik_CONFIG_DIR/$CONFIG_FILE"
echo "  - Container IP: $CONTAINER_IP"
echo "  - Domain: grow.360tuongtac.com"
echo "  - Backup: $BACKUP_DIR/"
echo ""
echo "⏳ Traefik will auto-reload config (watch=true)"
echo "🔍 Check logs: docker logs dokploy-proxy --tail 50 | grep 360tuongtac"
echo ""
echo "🧪 Test in 10-15 seconds:"
echo "  curl -I https://grow.360tuongtac.com"
echo ""
