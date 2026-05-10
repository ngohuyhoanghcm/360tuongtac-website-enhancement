import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
    console.error('Usage: npx tsx generate-hash.ts <password>');
    process.exit(1);
}

bcrypt.hash(password, 12).then(hash => {
    console.log('');
    console.log('✅ Generated bcrypt hash:');
    console.log('NEXT_ADMIN_PASSWORD_HASH=' + hash);
    console.log('');
    console.log('📝 Add this to your .env.production file');
    console.log('');
}).catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
