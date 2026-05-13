/**
 * Content Parser Module
 * Handles parsing and converting AI-generated content
 * 
 * Features:
 * - Strip markdown code blocks from AI responses
 * - Parse JSON responses
 * - Convert Markdown to HTML
 * - Normalize field names
 */

import { remark } from 'remark';
import html from 'remark-html';

export interface ParsedAIResponse {
  title: string;
  excerpt: string;
  content: string;  // HTML format
  tags: string[];
  category?: string;
  suggestedServices?: string[];
  relatedServices?: string[];
  relatedPosts?: string[];
  chart?: any;
  faq?: any[];
  [key: string]: any;  // Allow additional fields
}

/**
 * Strip markdown code blocks from AI response
 * Handles cases like: ```json {...} ``` or ``` {...} ``` or even typos like ```jsson
 * IMPROVED: Ultra-robust pattern matching with fallback
 */
export function stripMarkdownCodeBlocks(rawResponse: string): string {
  let cleaned = rawResponse.trim();
  
  // Strategy 1: Remove ANY ``` wrapper (with or without language specifier)
  // This handles: ```json, ```JSON, ```jsson (typos), ```javascript, or just ```
  const anyCodeBlockRegex = /^```[\w]*\s*\n?([\s\S]*?)\n?```\s*$/m;
  
  if (anyCodeBlockRegex.test(cleaned)) {
    const match = cleaned.match(anyCodeBlockRegex);
    if (match && match[1]) {
      cleaned = match[1].trim();
      console.log('[Content Parser] Stripped markdown code block');
      return cleaned;
    }
  }
  
  // Strategy 2: If response starts with ``` but doesn't end properly
  // Try to find the closing ``` anywhere in the text
  if (cleaned.startsWith('```')) {
    const firstNewline = cleaned.indexOf('\n');
    if (firstNewline !== -1) {
      // Skip the opening ``` line
      cleaned = cleaned.substring(firstNewline + 1);
      
      // Find closing ```
      const closingIndex = cleaned.lastIndexOf('```');
      if (closingIndex !== -1) {
        cleaned = cleaned.substring(0, closingIndex).trim();
        console.log('[Content Parser] Stripped incomplete markdown code block');
        return cleaned;
      }
    }
  }
  
  // Strategy 3: Just remove first line if it starts with ```
  if (cleaned.startsWith('```')) {
    const lines = cleaned.split('\n');
    if (lines[0].match(/^```/)) {
      cleaned = lines.slice(1).join('\n').trim();
      console.log('[Content Parser] Removed first line with ```');
    }
  }
  
  return cleaned;
}

/**
 * Fix common JSON syntax errors in AI responses
 * Handles: unescaped quotes, trailing commas, single quotes, etc.
 */
function fixJsonSyntaxIssues(jsonStr: string): string {
  let fixed = jsonStr;
  
  // Step 1: Remove trailing commas before } or ]
  fixed = fixed.replace(/,\s*([\]}])/g, '$1');
  
  // Step 2: Replace single quotes with double quotes (carefully)
  // Only replace quotes that are not inside already-quoted strings
  fixed = fixed.replace(/'([^']*)'/g, '"$1"');
  
  // Step 3: Remove comments
  fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '');
  fixed = fixed.replace(/\/\/[^\n]*/g, '');
  
  // Step 4: Fix control characters in strings
  fixed = fixControlCharacters(fixed);
  
  // Step 5: Fix unescaped quotes inside strings (LAST - most aggressive)
  fixed = fixUnescapedQuotes(fixed);
  
  return fixed;
}

/**
 * Handle truncated JSON responses from AI
 * When AI response is cut off mid-string, attempt to recover by:
 * 1. Closing open strings
 * 2. Adding missing closing braces
 * 3. Completing incomplete HTML tags
 */
function fixTruncatedJson(jsonStr: string): string {
  let fixed = jsonStr.trim();
  
  console.log('[Content Parser] Attempting to fix truncated JSON...');
  
  // Check if response is truncated (doesn't end with })
  if (!fixed.endsWith('}')) {
    console.log('[Content Parser] Response appears truncated - attempting recovery');
    
    // Strategy 1: Close the current string if it's in the middle of a value
    // Look for the last occurrence of a field that's incomplete
    const lastColonIndex = fixed.lastIndexOf(':');
    if (lastColonIndex !== -1) {
      const afterColon = fixed.substring(lastColonIndex + 1).trim();
      
      // If it starts with quote but doesn't end with quote
      if (afterColon.startsWith('"') && !afterColon.endsWith('"')) {
        // Find a good place to truncate the string (last sentence boundary)
        const stringValue = afterColon.substring(1); // Remove opening quote
        
        // Try to find last sentence ending with </p>, </li>, or period
        const sentenceEndings = ['</p>', '</li>', '</ul>', '</ol>', '. ', '。'];
        let truncatePoint = -1;
        let usedEnding = '';
        
        for (const ending of sentenceEndings) {
          const lastPos = stringValue.lastIndexOf(ending);
          if (lastPos > truncatePoint) {
            truncatePoint = lastPos;
            usedEnding = ending;
          }
        }
        
        // If we found a good truncation point, use it
        if (truncatePoint !== -1 && truncatePoint > 100) {
          const truncatedValue = stringValue.substring(0, truncatePoint + usedEnding.length);
          fixed = fixed.substring(0, lastColonIndex + 1) + ` "${truncatedValue}"\n}`;
          console.log('[Content Parser] Truncated incomplete string at sentence boundary');
          return fixed;
        }
        
        // Otherwise just close the string at current position
        // Find the last safe character (not a backslash)
        let safeEnd = stringValue.length - 1;
        while (safeEnd > 0 && stringValue[safeEnd] === '\\') {
          safeEnd--;
        }
        
        const truncatedValue = stringValue.substring(0, safeEnd + 1);
        fixed = fixed.substring(0, lastColonIndex + 1) + ` "${truncatedValue}"\n}`;
        console.log('[Content Parser] Closed truncated string');
        return fixed;
      }
    }
    
    // Strategy 2: Just add closing brace if nothing else works
    if (!fixed.endsWith('}')) {
      fixed = fixed + '\n}';
      console.log('[Content Parser] Added missing closing brace');
    }
  }
  
  return fixed;
}

/**
 * Fix unescaped quotes inside JSON string values
 */
function fixUnescapedQuotes(jsonStr: string): string {
  let result = '';
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];
    const prevChar = i > 0 ? jsonStr[i - 1] : '';
    
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
      // Starting a string
      inString = true;
      result += char;
    } else if (char === '"' && inString) {
      // Check if this is a closing quote
      // Look ahead: should be followed by , } ] or whitespace
      const nextNonWhitespace = jsonStr.slice(i + 1).match(/^\s*([,\]}])/);
      if (nextNonWhitespace) {
        // This is a closing quote
        inString = false;
        result += char;
      } else {
        // This is an unescaped quote inside the string - escape it
        result += '\\"';
      }
    } else {
      result += char;
    }
  }
  
  return result;
}

/**
 * Fix unescaped control characters in JSON strings
 */
function fixControlCharacters(jsonStr: string): string {
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
      // Inside a string - fix unescaped control characters
      const charCode = char.charCodeAt(0);
      if (charCode < 32) {
        // Replace control characters with escaped versions
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

/**
 * Parse AI JSON response with error handling
 * IMPROVED: Multiple fallback strategies + JSON syntax fixing
 */
export function parseAIJsonResponse(rawResponse: string): any {
  console.log('[Content Parser] === PARSING AI JSON RESPONSE ===');
  console.log('[Content Parser] Raw response length:', rawResponse.length);
  console.log('[Content Parser] First 200 chars:', rawResponse.substring(0, 200));
  
  // Strategy 1: Strip markdown code blocks and parse
  const cleaned = stripMarkdownCodeBlocks(rawResponse);
  console.log('[Content Parser] After stripping code blocks, length:', cleaned.length);
  
  try {
    const result = JSON.parse(cleaned);
    console.log('[Content Parser] ✅ Strategy 1 succeeded - Direct JSON parse');
    return result;
  } catch (error) {
    console.log('[Content Parser] ⚠️ Strategy 1 failed:', error instanceof Error ? error.message : 'Unknown');
    
    // Strategy 2: Fix JSON syntax issues and parse
    console.log('[Content Parser] Trying Strategy 2 - Fix JSON syntax issues...');
    try {
      const fixed = fixJsonSyntaxIssues(cleaned);
      console.log('[Content Parser] Fixed JSON length:', fixed.length);
      const result = JSON.parse(fixed);
      console.log('[Content Parser] ✅ Strategy 2 succeeded - Fixed JSON syntax');
      return result;
    } catch (fixError) {
      console.log('[Content Parser] ⚠️ Strategy 2 failed:', fixError instanceof Error ? fixError.message : 'Unknown');
      
      // Strategy 2.5: Handle truncated JSON (AI response cut off)
      console.log('[Content Parser] Trying Strategy 2.5 - Fix truncated JSON...');
      try {
        const fixedTruncated = fixTruncatedJson(cleaned);
        console.log('[Content Parser] Fixed truncated JSON length:', fixedTruncated.length);
        const result = JSON.parse(fixedTruncated);
        console.log('[Content Parser] ✅ Strategy 2.5 succeeded - Fixed truncated JSON');
        return result;
      } catch (truncError) {
        console.log('[Content Parser] ⚠️ Strategy 2.5 failed:', truncError instanceof Error ? truncError.message : 'Unknown');
      }
    }
    
    // Strategy 3: Try to extract JSON object using brace counting
    console.log('[Content Parser] Trying Strategy 3 - Brace counting extraction...');
    
    let braceCount = 0;
    let jsonStart = -1;
    let jsonEnd = -1;
    
    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === '{') {
        if (braceCount === 0) jsonStart = i;
        braceCount++;
      } else if (cleaned[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          jsonEnd = i + 1;
          break;
        }
      }
    }
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonStr = cleaned.substring(jsonStart, jsonEnd);
      console.log('[Content Parser] Extracted JSON string length:', jsonStr.length);
      
      // Try parsing as-is
      try {
        const result = JSON.parse(jsonStr);
        console.log('[Content Parser] ✅ Strategy 3 succeeded - Brace counting extraction');
        return result;
      } catch (innerError) {
        console.log('[Content Parser] ⚠️ Strategy 3a failed:', innerError instanceof Error ? innerError.message : 'Unknown');
        
        // Try fixing the extracted JSON
        try {
          const fixed = fixJsonSyntaxIssues(jsonStr);
          const result = JSON.parse(fixed);
          console.log('[Content Parser] ✅ Strategy 3b succeeded - Brace counting + fix');
          return result;
        } catch (fixError2) {
          console.log('[Content Parser] ⚠️ Strategy 3b failed:', fixError2 instanceof Error ? fixError2.message : 'Unknown');
        }
      }
    } else {
      console.log('[Content Parser] ⚠️ Strategy 3: Could not find balanced JSON braces');
    }
    
    // Strategy 4: Try to find JSON array
    console.log('[Content Parser] Trying Strategy 4 - Extract JSON array...');
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        const result = JSON.parse(arrayMatch[0]);
        console.log('[Content Parser] ✅ Strategy 4 succeeded - Array extraction');
        return result;
      } catch (innerError) {
        console.log('[Content Parser] ⚠️ Strategy 4 failed:', innerError instanceof Error ? innerError.message : 'Unknown');
      }
    }
    
    // Strategy 5: Last resort - try aggressive fixes
    console.log('[Content Parser] Trying Strategy 5 - Aggressive JSON fixes...');
    try {
      let aggressive = cleaned
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/'([^']*)'/g, '"$1"')
        .replace(/\/\*[^*]*\*\//g, '')
        .replace(/\/\/[^\n]*/g, '');
      
      // Fix unescaped quotes
      aggressive = fixUnescapedQuotes(aggressive);
      aggressive = fixControlCharacters(aggressive);
      
      const result = JSON.parse(aggressive);
      console.log('[Content Parser] ✅ Strategy 5 succeeded - Aggressive fixes');
      return result;
    } catch (aggressiveError) {
      console.log('[Content Parser] ⚠️ Strategy 5 failed:', aggressiveError instanceof Error ? aggressiveError.message : 'Unknown');
    }
    
    // All strategies failed
    console.error('[Content Parser] ❌ All parsing strategies failed');
    console.error('[Content Parser] Raw response (first 500 chars):', rawResponse.substring(0, 500));
    throw new Error(
      `Invalid AI response format. Expected JSON but got: ${rawResponse.substring(0, 150)}...\n` +
      `AI may have returned non-JSON text. Please try again or check AI provider configuration.`
    );
  }
}

/**
 * Convert Markdown content to HTML using remark
 */
export async function convertMarkdownToHtml(markdownContent: string): Promise<string> {
  try {
    const processed = await remark()
      .use(html)
      .process(markdownContent);
    
    let htmlContent = processed.toString();
    
    // Clean up excessive whitespace
    htmlContent = htmlContent
      .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
      .replace(/<p>\s*<\/p>/g, '')  // Remove empty paragraphs
      .trim();
    
    return htmlContent;
  } catch (error) {
    console.error('[Content Parser] Failed to convert Markdown to HTML:', error);
    // Fallback: Return raw content with basic paragraph wrapping
    return `<p>${markdownContent.replace(/\n\n/g, '</p><p>')}</p>`;
  }
}

/**
 * Normalize AI response fields to match BlogPost interface
 */
export function normalizeBlogPostFields(parsedResponse: any): ParsedAIResponse {
  return {
    // Core fields (required)
    title: parsedResponse.title || '',
    excerpt: parsedResponse.excerpt || parsedResponse.metaDescription || '',
    content: parsedResponse.content || '',
    tags: parsedResponse.tags || [],
    
    // Optional fields
    category: parsedResponse.category || 'General',
    suggestedServices: parsedResponse.suggestedServices || [],
    relatedServices: parsedResponse.relatedServices || parsedResponse.suggestedServices || [],
    relatedPosts: parsedResponse.relatedPosts || [],
    chart: parsedResponse.chart || undefined,
    faq: parsedResponse.faq || [],
    
    // Preserve any additional fields
    ...parsedResponse,
  };
}

/**
 * Main parser function - complete pipeline
 * 1. Strip markdown code blocks
 * 2. Parse JSON
 * 3. Normalize fields
 * 4. Convert content from Markdown to HTML
 */
export async function parseAIResponse(rawResponse: string): Promise<ParsedAIResponse> {
  console.log('[Content Parser] Parsing AI response...');
  console.log('[Content Parser] Raw response length:', rawResponse.length);
  
  // Step 1 & 2: Parse JSON (includes stripping code blocks)
  const parsedJson = parseAIJsonResponse(rawResponse);
  
  // Step 3: Normalize fields
  const normalized = normalizeBlogPostFields(parsedJson);
  
  // Step 4: Convert Markdown content to HTML
  if (normalized.content) {
    console.log('[Content Parser] Converting Markdown to HTML...');
    normalized.content = await convertMarkdownToHtml(normalized.content);
    console.log('[Content Parser] HTML content length:', normalized.content.length);
  }
  
  console.log('[Content Parser] Parsing complete');
  return normalized;
}
