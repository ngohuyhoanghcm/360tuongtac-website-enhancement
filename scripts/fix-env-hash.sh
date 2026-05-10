#!/bin/bash
# Fix password hash in .env.production

ENV_FILE="/opt/360tuongtac/.env.production"

echo "Current password hash:"
grep NEXT_ADMIN_PASSWORD_HASH "$ENV_FILE"

echo ""
echo "Fixing: wrapping hash in quotes..."

# Use Python to safely edit the file
python3 -c "
import re

with open('$ENV_FILE', 'r') as f:
    content = f.read()

# Replace unquoted hash with quoted version
content = re.sub(
    r'NEXT_ADMIN_PASSWORD_HASH=(\$2b\$\S+)',
    r\"NEXT_ADMIN_PASSWORD_HASH='\1'\",
    content
)

with open('$ENV_FILE', 'w') as f:
    f.write(content)

print('Fixed!')
"

echo ""
echo "New password hash:"
grep NEXT_ADMIN_PASSWORD_HASH "$ENV_FILE"

echo ""
echo "Restarting container..."
docker restart 360tuongtac-app

echo ""
echo "Waiting for container to start..."
sleep 5

echo ""
echo "Verifying environment variable:"
docker exec 360tuongtac-app env | grep NEXT_ADMIN_PASSWORD_HASH
