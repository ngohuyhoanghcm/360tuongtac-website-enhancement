const fs = require('fs');
const buffer = fs.readFileSync('public/images/blog/cach-tang-tuong-tac-tiktok-hieu-qua.webp');
console.log(buffer.toString('utf8', 0, 20));
