#!/bin/bash
# Test login API
echo "Testing login API..."
curl -s -X POST http://localhost:3001/api/admin/login \
  -H 'Content-Type: application/json' \
  -d '{"password":"wd!*dY4^4HPg:}nV"}' \
  | jq '.'

echo ""
echo "Checking environment variables..."
docker exec 360tuongtac-app env | grep NEXT_ADMIN
