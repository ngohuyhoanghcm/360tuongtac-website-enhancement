#!/bin/bash
# Phase 1: Backup Production Data
# This script creates a comprehensive backup without affecting other services

set -e

echo "📦 Starting 360TuongTac Production Backup..."
echo "=============================================="
echo ""

# Create backup directory with timestamp
BACKUP_DIR="/tmp/360tuongtac-backup-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "✅ Backup directory created: $BACKUP_DIR"
echo ""

# Step 1: Backup data directory
echo "📂 Step 1: Backing up data directory..."
if [ -d "/opt/360tuongtac/data" ]; then
    cp -r /opt/360tuongtac/data "$BACKUP_DIR/"
    echo "✅ Data directory backed up"
    echo "   Contents:"
    ls -la "$BACKUP_DIR/data/" | tail -n +2
else
    echo "⚠️  Warning: /opt/360tuongtac/data not found"
fi
echo ""

# Step 2: Backup .env.prod
echo "🔐 Step 2: Backing up .env.prod..."
if [ -f "/opt/360tuongtac/.env.prod" ]; then
    cp /opt/360tuongtac/.env.prod "$BACKUP_DIR/"
    echo "✅ .env.prod backed up"
    # Show file size (not content for security)
    ls -lh "$BACKUP_DIR/.env.prod" | awk '{print "   Size: " $5}'
else
    echo "⚠️  Warning: .env.prod not found"
fi
echo ""

# Step 3: Backup docker-compose.yml
echo "🐳 Step 3: Backing up docker-compose.yml..."
if [ -f "/opt/360tuongtac/docker-compose.yml" ]; then
    cp /opt/360tuongtac/docker-compose.yml "$BACKUP_DIR/"
    echo "✅ docker-compose.yml backed up"
    ls -lh "$BACKUP_DIR/docker-compose.yml" | awk '{print "   Size: " $5}'
else
    echo "⚠️  Warning: docker-compose.yml not found"
fi
echo ""

# Step 4: Backup any other important files
echo "📋 Step 4: Backing up additional files..."
ADDITIONAL_FILES=(
    "/opt/360tuongtac/Dockerfile"
    "/opt/360tuongtac/.env.production"
    "/opt/360tuongtac/package.json"
)

for file in "${ADDITIONAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        cp "$file" "$BACKUP_DIR/$filename"
        echo "✅ Backed up: $filename"
    fi
done
echo ""

# Step 5: Verify backup
echo "🔍 Step 5: Verifying backup..."
echo "   Backup location: $BACKUP_DIR"
echo "   Total size:"
du -sh "$BACKUP_DIR" | awk '{print "   " $1}'
echo ""
echo "   Files in backup:"
ls -lh "$BACKUP_DIR" | tail -n +2
echo ""

# Step 6: List data directory structure
if [ -d "$BACKUP_DIR/data" ]; then
    echo "📊 Data directory structure:"
    find "$BACKUP_DIR/data" -type f | head -20
    echo ""
fi

echo "=============================================="
echo "✅ Backup completed successfully!"
echo "📦 Backup location: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Verify backup contents"
echo "2. (Optional) Download to local machine:"
echo "   scp -P 2277 -r deploy@14.225.224.130:$BACKUP_DIR ~/360tuongtac-production-backup/"
echo ""
