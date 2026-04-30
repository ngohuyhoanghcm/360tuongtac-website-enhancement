const fs = require('fs');
const files = fs.readdirSync('public/images/blog').filter(f => f.endsWith('.webp'));
for (const file of files) {
  try {
    const size = fs.statSync('public/images/blog/' + file).size;
    console.log(file, size);
  } catch(e) {}
}
