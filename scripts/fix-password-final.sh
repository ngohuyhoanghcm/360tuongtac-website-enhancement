#!/usr/bin/env bash
# Fix password hash escaping for Docker env-file

ENV="/opt/360tuongtac/.env.production"

# Step 1: Read current hash
CURRENT=$(grep "^NEXT_ADMIN_PASSWORD_HASH=" $ENV | cut -d'=' -f2- | tr -d "'" | tr -d '"')
echo "Current: $CURRENT"
echo "Length: ${#CURRENT}"

# Step 2: Escape $ signs
ESCAPED=${CURRENT//\$/\$\$}
echo "Escaped: $ESCAPED"

# Step 3: Write back to file
sed -i "s|^NEXT_ADMIN_PASSWORD_HASH=.*|NEXT_ADMIN_PASSWORD_HASH='$ESCAPED'|" $ENV

echo ""
echo "New content in file:"
grep PASSWORD_HASH $ENV

# Step 4: Restart container
echo ""
echo "Restarting container..."
docker restart 360tuongtac-app

# Step 5: Wait and verify
echo "Waiting 12 seconds..."
sleep 12

echo ""
echo "Verifying in container:"
docker exec 360tuongtac-app env | grep PASSWORD_HASH | head -c 80
echo "..."

HASH=$(docker exec 360tuongtac-app env | grep PASSWORD_HASH | cut -d'=' -f2-)
echo "Full hash length in container: ${#HASH}"
