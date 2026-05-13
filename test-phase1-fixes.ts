/**
 * Test script to verify Phase 1 fixes
 */

import { parseAIResponse, convertMarkdownToHtml } from './lib/admin/content-parser';
import { validateBlogPostContent, normalizeBlogPostData } from './lib/admin/content-validator';

// Test Case 1: AI Response with markdown code blocks
const testResponse1 = `\`\`\`json
{
  "title": "Test Blog Post",
  "excerpt": "This is a test excerpt for SEO purposes with enough length",
  "content": "## Test Heading\\n\\nThis is **bold text** and this is *italic text*.\\n\\n- List item 1\\n- List item 2\\n\\n### Subheading\\n\\nMore content here with [a link](https://example.com).",
  "tags": ["Test", "Blog", "SEO"],
  "imageUrl": "/images/test.webp",
  "imageAlt": "Test image description"
}
\`\`\``;

// Test Case 2: AI Response without markdown wrapper
const testResponse2 = `{
  "title": "Another Test Post",
  "excerpt": "Another test excerpt that meets the minimum length requirement for SEO",
  "content": "## Another Heading\\n\\nContent with **markdown** formatting.\\n\\n1. Numbered list\\n2. Second item",
  "tags": ["Test"],
  "imageUrl": "/images/another.webp",
  "imageAlt": "Another test image"
}`;

async function runTests() {
  console.log('=== PHASE 1 FIXES VERIFICATION ===\n');

  // Test 1: Parse markdown-wrapped JSON
  console.log('Test 1: Parsing markdown-wrapped JSON response...');
  try {
    const parsed1 = await parseAIResponse(testResponse1);
    console.log('✅ Successfully parsed');
    console.log('  Title:', parsed1.title);
    console.log('  Content type:', typeof parsed1.content);
    console.log('  Content preview:', parsed1.content?.substring(0, 100));
    console.log('  Has HTML tags:', parsed1.content?.includes('<'));
    console.log('');
  } catch (error) {
    console.log('❌ Failed:', error);
    console.log('');
  }

  // Test 2: Parse raw JSON
  console.log('Test 2: Parsing raw JSON response...');
  try {
    const parsed2 = await parseAIResponse(testResponse2);
    console.log('✅ Successfully parsed');
    console.log('  Title:', parsed2.title);
    console.log('  Content type:', typeof parsed2.content);
    console.log('  Content preview:', parsed2.content?.substring(0, 100));
    console.log('  Has HTML tags:', parsed2.content?.includes('<'));
    console.log('');
  } catch (error) {
    console.log('❌ Failed:', error);
    console.log('');
  }

  // Test 3: Field normalization
  console.log('Test 3: Testing field normalization...');
  const testData = {
    title: 'Test Post',
    excerpt: 'Test excerpt with sufficient length for SEO requirements',
    content: '## Test\\n\\nContent here',
    tags: ['Test'],
    imageUrl: '/images/test.webp',
    imageAlt: 'Test alt text'
  };

  const normalized = normalizeBlogPostData(testData);
  console.log('✅ Normalized fields:');
  console.log('  featuredImage:', normalized.featuredImage);
  console.log('  imageUrl:', normalized.imageUrl);
  console.log('  alt:', normalized.alt);
  console.log('  imageAlt:', normalized.imageAlt);
  console.log('');

  // Test 4: Validation
  console.log('Test 4: Testing content validation...');
  const validation = validateBlogPostContent(normalized);
  console.log('✅ Validation result:');
  console.log('  Valid:', validation.valid);
  console.log('  Errors:', validation.errors);
  console.log('  Warnings:', validation.warnings);
  console.log('');

  // Test 5: Markdown to HTML conversion
  console.log('Test 5: Testing Markdown to HTML conversion...');
  const markdown = `## Heading 1

This is **bold** and *italic* text.

- Item 1
- Item 2
- Item 3

### Subheading

Some paragraph text with a [link](https://example.com).
`;

  try {
    const html = await convertMarkdownToHtml(markdown);
    console.log('✅ Conversion successful');
    console.log('  HTML length:', html.length);
    console.log('  HTML preview:', html.substring(0, 200));
    console.log('');
  } catch (error) {
    console.log('❌ Failed:', error);
    console.log('');
  }

  console.log('=== TESTS COMPLETE ===');
}

runTests().catch(console.error);
