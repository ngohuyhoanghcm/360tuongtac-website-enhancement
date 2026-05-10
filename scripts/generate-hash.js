const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.error('Usage: node generate-hash.js <password>');
    process.exit(1);
}

bcrypt.hash(password, 12).then(hash => {
    console.log('');
    console.log('✅ Generated bcrypt hash:');
    console.log('NEXT_ADMIN_PASSWORD_HASH=' + hash);
    console.log('');
    console.log(' Add this to your .env file');
}).catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
