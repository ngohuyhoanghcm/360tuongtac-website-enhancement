const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'data', 'blog');
const servicesDir = path.join(__dirname, 'data', 'services');

const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
const serviceFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

function addRelatedArrays(filePath, type) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('relatedServices') && content.includes('relatedPosts')) {
    return;
  }

  let relatedServicesStr = '[]';
  let relatedPostsStr = '[]';

  const allBlogSlugs = blogFiles.map(x => x.replace('.ts', ''));
  const allServiceSlugs = serviceFiles.map(x => x.replace('.ts', ''));

  if (type === 'blog') {
    // Pick 2 random services
    const s1 = allServiceSlugs[Math.floor(Math.random() * allServiceSlugs.length)];
    const s2 = allServiceSlugs[Math.floor(Math.random() * allServiceSlugs.length)];
    relatedServicesStr = "['" + s1 + "', '" + s2 + "']";

    // Pick 3 random posts
    const p1 = allBlogSlugs[Math.floor(Math.random() * allBlogSlugs.length)];
    const p2 = allBlogSlugs[Math.floor(Math.random() * allBlogSlugs.length)];
    const p3 = allBlogSlugs[Math.floor(Math.random() * allBlogSlugs.length)];
    relatedPostsStr = "['" + p1 + "', '" + p2 + "', '" + p3 + "']";

  } else if (type === 'service') {
    // Pick 3 random posts
    const p1 = allBlogSlugs[Math.floor(Math.random() * allBlogSlugs.length)];
    const p2 = allBlogSlugs[Math.floor(Math.random() * allBlogSlugs.length)];
    const p3 = allBlogSlugs[Math.floor(Math.random() * allBlogSlugs.length)];
    relatedPostsStr = "['" + p1 + "', '" + p2 + "', '" + p3 + "']";
    relatedServicesStr = "[]";
  }

  if (content.includes('relatedServices:')) {
    return;
  }
  
  content = content.replace(/};\s*$/, ',\\n  relatedServices: ' + relatedServicesStr + ',\\n  relatedPosts: ' + relatedPostsStr + ',\\n};');

  fs.writeFileSync(filePath, content.replace(/\\n/g, '\n'));
}

blogFiles.forEach(f => addRelatedArrays(path.join(blogsDir, f), 'blog'));
serviceFiles.forEach(f => addRelatedArrays(path.join(servicesDir, f), 'service'));

console.log('Successfully injected related arrays!');
