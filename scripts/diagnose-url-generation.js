/**
 * Diagnostic script to capture and analyze raw AI response from URL-based generation
 * This will help us identify the exact control characters causing JSON parse failures
 */

const fs = require('fs');
const path = require('path');

// Simulate the AI response that's failing
const rawResponse = `{
  "title": "15+ Cách Tăng Tương Tác TikTok Hiệu Quả & Nhanh Chóng 2024",
  "excerpt": "Khám phá các cách tăng tương tác TikTok hiệu quả nhất 2024, từ tối ưu profile, sáng tạo nội dung theo trend đến áp dụng thuật toán. Bí quyết giúp video viral, thu hút triệu view!",
  "content": "# 15+ Cách Tăng Tương Tác TikTok Hiệu Quả & Nhanh Chóng 2024\\n\\nTikTok đã trở thành một hiện tượng toàn cầu, là sân chơi lý tưởng cho các nhà sáng tạo nội dung, doanh nghiệp và cá nhân muốn lan tỏa thông điệp của mình.",
  "tags": ["tiktok", "tuong-tac", "social-media"]
}`;

console.log('=== DIAGNOSTIC: Analyzing Raw AI Response ===\n');
console.log('Response length:', rawResponse.length);
console.log('First 500 chars:', rawResponse.substring(0, 500));

// Check for control characters
console.log('\n=== Checking for Control Characters ===\n');
const controlChars = [];
for (let i = 0; i < rawResponse.length; i++) {
  const charCode = rawResponse.charCodeAt(i);
  if (charCode < 32 && charCode !== 10 && charCode !== 13 && charCode !== 9) {
    // Not newline (\n=10), carriage return (\r=13), or tab (\t=9)
    controlChars.push({
      position: i,
      charCode: charCode,
      hex: charCode.toString(16).padStart(4, '0'),
      context: rawResponse.substring(Math.max(0, i - 20), i + 20)
    });
  }
}

if (controlChars.length > 0) {
  console.log(`Found ${controlChars.length} control character(s):\n`);
  controlChars.forEach((cc, idx) => {
    console.log(`${idx + 1}. Position: ${cc.position}`);
    console.log(`   Char Code: ${cc.charCode} (0x${cc.hex})`);
    console.log(`   Context: ...${cc.context}...`);
    console.log('');
  });
} else {
  console.log('✅ No problematic control characters found\n');
}

// Try to parse
console.log('=== Attempting JSON Parse ===\n');
try {
  const parsed = JSON.parse(rawResponse);
  console.log('✅ SUCCESS: JSON parsed successfully');
  console.log('Title:', parsed.title);
  console.log('Content length:', parsed.content?.length);
} catch (error) {
  console.log('❌ FAILED:', error.message);
  
  // Find the exact position
  const positionMatch = error.message.match(/position (\d+)/);
  if (positionMatch) {
    const pos = parseInt(positionMatch[1]);
    console.log(`\nError at position: ${pos}`);
    console.log('Context (50 chars before and after):');
    console.log('...', rawResponse.substring(Math.max(0, pos - 50), pos + 50), '...');
    console.log('\nCharacter at error position:', rawResponse[pos]);
    console.log('Char code:', rawResponse.charCodeAt(pos));
  }
}

// Test fix strategies
console.log('\n\n=== Testing Fix Strategies ===\n');

// Strategy: Replace control characters
function fixControlCharacters(jsonStr) {
  let result = '';
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];
    
    if (escapeNext) {
      result += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      result += char;
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && !inString) {
      inString = true;
      result += char;
    } else if (char === '"' && inString) {
      inString = false;
      result += char;
    } else if (inString) {
      const charCode = char.charCodeAt(0);
      if (charCode < 32) {
        if (char === '\n') result += '\\n';
        else if (char === '\r') result += '\\r';
        else if (char === '\t') result += '\\t';
        else result += `\\u${charCode.toString(16).padStart(4, '0')}`;
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }
  
  return result;
}

const fixed = fixControlCharacters(rawResponse);
console.log('After fixControlCharacters:');
console.log('Length:', fixed.length);
console.log('Changed:', fixed.length !== rawResponse.length ? 'YES' : 'NO');

try {
  const parsed = JSON.parse(fixed);
  console.log('✅ SUCCESS after fixControlCharacters');
} catch (error) {
  console.log('❌ Still failed:', error.message);
}

// Save for inspection
const outputPath = path.join(__dirname, 'debug-ai-response.txt');
fs.writeFileSync(outputPath, rawResponse);
console.log(`\n📄 Raw response saved to: ${outputPath}`);
