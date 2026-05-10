# 🚀 QUICK START: Test AI Content Hub với Gemini

## ✅ API KEY ĐÃ CONFIGURED

```
Provider: Google Gemini
API Key: AIzaSyBUmhsfoGIEW7Pl9BQNIlriLfV68zbCfoE
Model: gemini-2.5-flash
Status: ✅ Active
```

---

##  STEPS ĐỂ TEST

### **Step 1: Restart Dev Server**
```powershell
# Trong terminal đang chạy npm run dev:
Ctrl + C

# Start lại:
npm run dev
```

### **Step 2: Access AI Content Hub**
```
URL: http://localhost:3000/admin/ai-content
```

### **Step 3: Test Case 1 - Từ Topic**
```
💡 Chủ đề: Hướng dẫn tăng tương tác TikTok 2026
📂 Danh mục: TikTok
🎯 Keywords: tiktok, tương tác, 2026
🎨 Tone: Professional
️ Auto-save: ❌
☑️ Generate image: ❌

 Click: "Tạo nội dung với AI"
```

### **Step 4: Test Case 2 - Từ URL**
```
 URL: https://fptshop.com.vn/tin-tuc/thu-thuat/12-cach-tang-tuong-tac-tiktok-176591
📂 Danh mục: TikTok
🎯 Keywords: tăng tương tác tiktok, thuật toán tiktok 2026
 Tone: Professional
☑️ Auto-save: 
☑️ Generate image: ❌

 Click: "Tạo nội dung với AI"
```

### **Step 5: Test Case 3 - Từ Text**
```
📝 Text: (Paste đoạn văn bản về TikTok marketing)
📂 Danh mục: Social Media
 Keywords: tiktok, marketing, social media
🎨 Tone: Casual
☑️ Auto-save: ✅
☑️ Generate image: 

👉 Click: "Tạo nội dung với AI"
```

---

## ✅ EXPECTED RESULTS

### **Success Indicators:**
```
✅ Loading: 0% → 100% (~15-30 seconds)
✅ Success message: "Nội dung đã được tạo thành công!"
✅ Content preview hiển thị
✅ SEO Score: 75-90
✅ No errors in console
```

### **Content Quality:**
```
✅ Vietnamese language (correct)
✅ SEO optimized
✅ Proper heading structure (H1, H2, H3)
✅ Meta description (120-155 chars)
✅ Word count: 800-1500 words
```

---

## 🐛 TROUBLESHOOTING

### **Error: "API key not valid"**
```
🔍 Check: .env.local has correct key
 Fix: Verify key is AIzaSyBUmhsfoGIEW7Pl9BQNIlriLfV68zbCfoE
🔄 Restart: npm run dev
```

### **Error: "Quota exceeded"**
```
🔍 Check: Google Cloud Console → Billing
 Fix: Enable billing or upgrade plan
💡 Alternative: Switch to OpenAI temporarily
```

### **Error: "403 Permission denied"**
```
🔍 Check: API key permissions in Google Cloud
🔧 Fix: Enable Gemini API for project
🔗 Link: https://console.cloud.google.com/apis/library
```

---

## 📊 TESTING CHECKLIST

```
[ ] Dev server restarted with new config
[ ] Can access /admin/ai-content
[ ] Tab "Từ Topic" works
[ ] Tab "Từ URL" works
[ ] Tab "Từ Text" works
[ ] Content generated in Vietnamese
[ ] SEO Score 75-90
[ ] No console errors
[ ] Loading indicator works
[ ] Error handling works
```

---

## 🔒 SECURITY REMINDERS

### **Before Committing:**
```bash
# Run security check
.\scripts\pre-commit-security-check.sh

# Manual check
Select-String -Pattern "AIzaSyBUmhsfo" -Path *.md,*.ts,*.tsx
```

### **Documentation Format:**
```markdown
❌ WRONG:
API key: AIzaSyBUmhsfoGIEW7Pl9BQNIlriLfV68zbCfoE

✅ CORRECT:
API key: AIzaSyBUmhsfo...[REDACTED]...E
# or
API key: [GEMINI_API_KEY]
```

---

## 📞 SUPPORT

**If issues persist:**
1. Check terminal logs for errors
2. Verify .env.local has correct key
3. Confirm Google Cloud billing is active
4. Test with simple prompt first
5. Check Google AI Studio dashboard

---

**Good luck with testing! 🚀**
