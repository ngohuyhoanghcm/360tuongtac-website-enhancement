const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'data', 'services');

fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts').forEach(f => {
  const p = path.join(servicesDir, f);
  let content = fs.readFileSync(p, 'utf8');

  let lines = content.split('\\n');
  for (let i = 0; i < lines.length; i++) {
     if (lines[i].includes('relatedServices:') && i > 0) {
        if (!lines[i-1].trim().endsWith(',')) {
           lines[i-1] = lines[i-1] + ',';
        }
     }
  }
  fs.writeFileSync(p, lines.join('\\n'));
});
console.log('Fixed services syntax');
