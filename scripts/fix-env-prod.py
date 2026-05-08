#!/usr/bin/env python3
lines = [
    'NODE_ENV=production',
    'NEXT_PUBLIC_SITE_URL=https://grow.360tuongtac.com',
    'NEXT_ADMIN_PASSWORD_HASH=\\$2b\\$12\\$UNrxbUBujcx9YDosF1MEfey4bETTrCQk5FzCHUZEWaCS2rAV2noQq',
    'NEXT_ADMIN_2FA_SECRET=MBISKKLH57XMJL36D7PYG2XAUQGH54',
    'NEXT_ADMIN_SESSION_TIMEOUT=3600000',
    ''
]
with open('/opt/360tuongtac/.env.prod', 'w') as f:
    f.write('\n'.join(lines))
print('Done!')
