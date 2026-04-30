const fs = require('fs');
const files = fs.readdirSync('public/images/blog').filter(f => f.endsWith('.webp'));
for (const file of files) {
  try {
    const buffer = fs.readFileSync('public/images/blog/' + file);
    console.log(file, buffer.slice(0, 16).toString('hex'));
  } catch(e) {}
}
