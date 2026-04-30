const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertJpegToWebP() {
  const dir = path.join(process.cwd(), 'public', 'images', 'blog');
  const tempDir = path.join(process.cwd(), 'temp_conversion');
  
  // Create temp directory
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));
  
  console.log(`Found ${files.length} files to convert...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const tempPath = path.join(tempDir, file);
    try {
      // Read the file and convert to WebP
      const image = sharp(filePath);
      const metadata = await image.metadata();
      
      console.log(`Converting ${file}...`);
      console.log(`  - Input format: ${metadata.format}`);
      console.log(`  - Dimensions: ${metadata.width}x${metadata.height}`);
      
      // Convert to WebP with high quality (save to temp file first)
      await image
        .webp({ quality: 85 })
        .toFile(tempPath);
      
      // Replace original with converted file (delete then rename)
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
      
      // Verify the conversion
      const buffer = fs.readFileSync(filePath);
      const header = buffer.slice(0, 4).toString('hex');
      
      if (header === '52494646') {
        console.log(`  ✅ SUCCESS - Valid WebP header (${Math.round(buffer.length/1024)} KB)\n`);
        successCount++;
      } else {
        console.log(`  ❌ FAILED - Header is ${header}\n`);
        failCount++;
      }
    } catch (err) {
      console.error(`  ❌ Error converting ${file}:`, err.message, '\n');
      failCount++;
    }
  }
  
  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  console.log('\n=== CONVERSION SUMMARY ===');
  console.log(`Total files: ${files.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

convertJpegToWebP();
