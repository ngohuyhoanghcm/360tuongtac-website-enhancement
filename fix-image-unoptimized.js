const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<Image /g, '<Image unoptimized={true} ');
  fs.writeFileSync(file, content);
}

fixFile('app/blog/page.tsx');
fixFile('app/blog/[slug]/page.tsx');
