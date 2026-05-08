#!/usr/bin/env python3
# Fix 2FA secret - thêm 7L
content = """NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://grow.360tuongtac.com
NEXT_ADMIN_PASSWORD_HASH=$$2b$$12$$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq
NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL7L36D7PYG2XAUQGH54
NEXT_ADMIN_SESSION_TIMEOUT=3600000
"""
with open('/opt/360tuongtac/.env.prod', 'w') as f:
    f.write(content)
print('✅ .env.prod fixed!')
print('Secret:', [l for l in content.split('\n') if '2FA_SECRET' in l])

# Restart container with docker compose
import subprocess
subprocess.run(['docker', 'compose', 'down'], cwd='/opt/360tuongtac')
subprocess.run(['docker', 'compose', 'up', '-d'], cwd='/opt/360tuongtac')
print('✅ Container restarted with docker-compose!')
