#!/bin/bash
# Test admin login

PASSWORD="$1"
DOMAIN="https://grow.360tuongtac.com"

echo "🧪 Testing admin login..."
echo "Domain: $DOMAIN"
echo ""

# Test login endpoint
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$DOMAIN/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"password\": \"$PASSWORD\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response Body:"
echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"

if [ "$HTTP_CODE" = "200" ]; then
    echo ""
    echo "✅ LOGIN SUCCESSFUL!"
    # Extract token
    TOKEN=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin).get('token', 'N/A'))" 2>/dev/null)
    echo "Token: $TOKEN"
else
    echo ""
    echo "❌ LOGIN FAILED"
fi
