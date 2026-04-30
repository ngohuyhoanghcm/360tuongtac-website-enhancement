const fs = require('fs');
const buffer = fs.readFileSync('public/images/blog/seeding-la-gi.webp');
console.log(buffer.slice(0, 50).toString('utf8'));
console.log(buffer.slice(0, 10).toString('hex'));
