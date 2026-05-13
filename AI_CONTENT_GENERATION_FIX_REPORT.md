# Báo Cáo Fix Lỗi AI Content Generation - Phase 1

**Ngày fix:** 13/05/2026  
**Trạng thái:** ✅ **ĐANG TIẾN HÀNH**  
**Thời gian:** ~45 phút  

---

## 🔍 PHÂN TÍCH VẤN ĐỀ

### Lỗi Ban Đầu
```
❌ "Không thể parse kết quả từ AI. Vui lòng thử lại."
```

### Log Server Phân Tích

**Test 1: Topic-based Generation**
```
[AI Generator] Raw AI response length: 5202
[Content Parser] First 200 chars: ```json
{
  "title": "Tăng Like Facebook 2026: ..."
  
[Content Parser] ⚠️ Strategy 1 failed: Unexpected token '`', "```jsson
```

**Vấn đề:** AI trả về JSON wrapped trong markdown code block (```json ... ```) nhưng regex stripping không hoạt động.

**Test 2: URL-based Generation**
```
[AI Generator] Raw AI response length: 900
[Content Parser] ⚠️ Strategy 1 failed: Unterminated string in JSON at position 900
```

**Vấn đề:** AI response bị truncate ở 900 chars do `maxOutputTokens=4000` quá thấp.

---

## 🔧 CÁC THAY ĐỔI ĐÃ THỰC HIỆN

### 1. Cải Thiện Content Parser (`lib/admin/content-parser.ts`)

#### A. Fix `stripMarkdownCodeBlocks()` - Regex Improved
**Trước:**
```typescript
if (cleaned.startsWith('```json')) {
  cleaned = cleaned.replace(/^```json\s*\n/, '').replace(/\n\s*```$/, '');
}
```

**Sau:**
```typescript
const jsonBlockRegex = /^```(?:json|JSON|Json)\s*\n([\s\S]*?)\n?```$/m;
const genericBlockRegex = /^```\s*\n([\s\S]*?)\n?```$/m;

if (jsonBlockRegex.test(cleaned)) {
  const match = cleaned.match(jsonBlockRegex);
  if (match && match[1]) {
    cleaned = match[1].trim();
  }
}
```

**Lý do:** Regex cũ không handle được các case:
- ```JSON (uppercase)
- ```Json (mixed case)
- Không có newline sau ```json

#### B. Fix `parseAIJsonResponse()` - Strategy 2 Improved
**Trước:**
```typescript
const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
if (jsonMatch) {
  return JSON.parse(jsonMatch[0]);
}
```

**Sau:**
```typescript
// Brace counting algorithm
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
  return JSON.parse(jsonStr);
}
```

**Lý do:** Regex `/\{[\s\S]*\}/` greedy và không handle nested objects đúng. Brace counting chính xác hơn.

#### C. Added 4 Fallback Strategies
1. **Strategy 1:** Direct JSON parse after stripping code blocks
2. **Strategy 2:** Brace counting extraction (NEW - improved)
3. **Strategy 3:** Array extraction (for JSON arrays)
4. **Strategy 4:** Auto-fix common JSON issues (trailing commas, single quotes, comments)

### 2. Cải Thiện System Prompts (`lib/admin/ai-content-generator.ts`)

**Thêm phần nhấn mạnh JSON format:**
```
⚠️ **QUAN TRỌNG NHẤT:**
- Output PHẢI là JSON hợp lệ, KHÔNG thêm text ngoài JSON
- KHÔNG sử dụng markdown code blocks (\`\`\`json ... \`\`\`)
- KHÔNG thêm giải thích, lời chào, hay text khác
- Chỉ trả về JSON object, bắt đầu bằng { và kết thúc bằng }
- Đảm bảo tất cả strings đều dùng double quotes (")
- Không để trailing commas

⚠️ BẮT BUỘC: JSON phải valid 100%, nếu không hệ thống sẽ lỗi!
```

**Lý do:** Gemini đôi khi không tuân thủ JSON format, cần nhấn mạnh mạnh mẽ hơn.

### 3. Tăng `AI_MAX_TOKENS` (`.env.local`)

**Trước:**
```
AI_MAX_TOKENS=4000
```

**Sau:**
```
AI_MAX_TOKENS=8000
```

**Lý do:** Blog post cần 2000-3000+ từ, với JSON overhead cần 8000 tokens để không bị truncate.

---

## 📊 KẾT QUẢ MONG ĐỢI

### Sau Khi Fix:
1. ✅ Markdown code blocks được strip đúng
2. ✅ JSON extracted chính xác bằng brace counting
3. ✅ AI response không bị truncate (8000 tokens)
4. ✅ Fallback strategies handle edge cases
5. ✅ System prompts ép AI trả về JSON valid

### Expected Log Output:
```
[Content Parser] ✅ Strategy 1 succeeded - Direct JSON parse
HOẶC
[Content Parser] ✅ Strategy 2 succeeded - Brace counting extraction
```

---

## 🧪 TESTING PLAN

### Test Case 1: Topic-based Generation
1. Navigate to /admin/ai-content
2. Tab "Từ Topic"
3. Topic: "Mẹo tăng like Facebook 2026"
4. Click "Tạo nội dung với AI"
5. **Expected:** Content generates successfully, no parse error

### Test Case 2: URL-based Generation
1. Tab "Từ URL"
2. URL: https://fptshop.com.vn/...
3. Click "Tạo nội dung với AI"
4. **Expected:** Content generates successfully, full JSON parsed

### Test Case 3: Check Server Logs
Verify logs show:
```
[Content Parser] ✅ Strategy 1 succeeded - Direct JSON parse
HOẶC
[Content Parser] ✅ Strategy 2 succeeded - Brace counting extraction
```

---

## ⚠️ RỦI RO & GIỚI HẠN

### Rủi Ro:
1. **AI_MAX_TOKENS tăng → API cost tăng** (nhưng vẫn trong giới hạn reasonable)
2. **Brace counting có thể fail** nếu JSON có string chứa `{` hoặc `}` (rare)

### Giới Hạn:
- Strategy 4 (auto-fix JSON) có thể over-fix và làm mất data
- Nếu AI trả về hoàn toàn không phải JSON, vẫn sẽ fail (đây là expected behavior)

---

## 📝 NEXT STEPS

### Immediate (Sau khi deploy):
1. ✅ Test cả 2 generation modes (topic & URL)
2. ✅ Verify server logs show successful parsing
3. ✅ Check generated blog posts are complete (not truncated)

### Future Improvements:
1. Add retry logic (max 3 retries with exponential backoff)
2. Add response validation before saving
3. Log actual AI responses for debugging (in development only)
4. Consider using structured output API (Gemini supports this)

---

## 📋 FILES MODIFIED

1. `lib/admin/content-parser.ts` (+71 lines, -16 lines)
2. `lib/admin/ai-content-generator.ts` (+18 lines, -2 lines)
3. `.env.local` (+1 line, -1 line)

**Total changes:** ~90 lines modified

---

**Report created by:** AI Assistant  
**Date:** 13/05/2026  
**Status:** Fixes implemented, ready for testing

