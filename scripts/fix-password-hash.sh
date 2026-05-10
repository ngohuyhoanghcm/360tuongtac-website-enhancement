#!/bin/bash
set -e

echo "=== Fixing Password Hash in .env.production ==="
echo ""

ENV_FILE="/opt/360tuongtac/.env.production"

# Backup
echo "1. Creating backup..."
cp $ENV_FILE ${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)

# Fix using Python
echo "2. Fixing password hash..."
python3 -c "
import re
import sys

env_file = sys.argv[1]

with open(env_file, 'r') as f:
    lines = f.readlines()

fixed_lines = []
for line in lines:
    if line.startswith('NEXT_ADMIN_PASSWORD_HASH=') and \"'\" not in line:
        # Extract hash value
        hash_value = line.split('=', 1)[1].strip()
        # Wrap in quotes
        fixed_line = f\"NEXT_ADMIN_PASSWORD_HASH='{hash_value}'\n\"
        fixed_lines.append(fixed_line)
        print(f'   Fixed: {hash_value[:20]}...')
    else:
        fixed_lines.append(line)

with open(env_file, 'w') as f:
    f.writelines(fixed_lines)

print('   Password hash wrapped in quotes!')
" "$ENV_FILE"

# Verify
echo ""
echo "3. Verification:"
echo "   File content:"
grep NEXT_ADMIN_PASSWORD_HASH "$ENV_FILE" | head -c 100
echo "..."

# Restart container
echo ""
echo "4. Restarting container..."
docker restart 360tuongtac-app

echo "5. Waiting for container to start (10 seconds)..."
sleep 10

# Check
echo ""
echo "6. Checking environment variable in container:"
HASH_IN_CONTAINER=$(docker exec 360tuongtac-app env | grep NEXT_ADMIN_PASSWORD_HASH | cut -d'=' -f2-)

echo "   Hash length: ${#HASH_IN_CONTAINER}"
echo "   Hash preview: ${HASH_IN_CONTAINER:0:30}..."

if [[ ${#HASH_IN_CONTAINER} -gt 50 ]]; then
    echo ""
    echo "✅ SUCCESS: Password hash is complete!"
else
    echo ""
    echo "❌ ERROR: Password hash is still truncated!"
    exit 1
fi
