#  Hướng Dẫn Setup GitHub Credentials & Push Code

##  Vấn Đề Hiện Tại

Commit thành công nhưng push fail hoặc báo "Everything up-to-date" dù code chưa lên GitHub.

---

##  Cách 1: Setup Git Credential Manager (Recommended)

### Bước 1: Install Git Credential Manager

**Windows:**
```powershell
# Check nếu đã install
git credential-manager --version

# Nếu chưa có, download từ:
# https://github.com/git-ecosystem/git-credential-manager/releases
```

### Bước 2: Login GitHub

```bash
# Method 1: Browser-based login (easiest)
git login

# Method 2: Manual token
gh auth login
```

**Hoặc dùng Personal Access Token:**

1. **Tạo Token trên GitHub:**
   ```
   GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   Click "Generate new token (classic)"
   ```

2. **Chọn scopes:**
   - ✅ repo (Full control)
   - ✅ workflow (GitHub Actions)
   - ✅ read:org (nếu cần)

3. **Copy token** (chỉ hiện 1 lần!)

4. **Lưu vào Git:**
   ```bash
   git config --global credential.helper store
   
   # Lần push tiếp theo, Git sẽ hỏi username & token
   ```

### Bước 3: Test Push

```bash
cd 360tuongtac-website-enhancement

# Force push latest commit
git push origin main

# Nếu hỏi username/password:
# Username: ngohuyhoanghcm
# Password: [PASTE TOKEN - NOT GITHUB PASSWORD]
```

---

##  Cách 2: Dùng Git Bash (Nếu PowerShell gặp vấn đề)

### Bước 1: Mở Git Bash

```
Start Menu → Git → Git Bash
```

### Bước 2: Navigate to project

```bash
cd "/d/Project-Nâng cấp website 360TuongTac/360tuongtac-website-enhancement"
```

### Bước 3: Push

```bash
git push origin main
```

**Nếu hỏi credentials:**
- Username: `ngohuyhoanghcm`
- Password: `[Personal Access Token]`

---

##  Cách 3: Manual Push (Emergency)

Nếu vẫn không push được:

### Bước 1: Export diff

```bash
cd 360tuongtac-website-enhancement

# Tạo patch file
git format-patch origin/main --stdout > latest-changes.patch
```

### Bước 2: Upload lên GitHub qua Web UI

1. Mở: https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement
2. Click vào files cần update
3. Click pencil icon (Edit)
4. Paste changes
5. Commit directly

---

##  Cách 4: Re-authenticate Git

```bash
# Xóa cached credentials
git config --global --unset credential.helper

# Clear Windows Credential Manager
# Control Panel → Credential Manager → Windows Credentials
# Tìm và xóa git-related credentials

# Thử push lại
git push origin main
```

---

##  Verify Push Thành Công

### Check trên GitHub:

1. **Mở repository:**
   ```
   https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement
   ```

2. **Check commits:**
   ```
   Click "Commits" tab
   Tìm commit: "feat: admin 2FA security enhancement"
   ```

3. **Check files:**
   ```
   Phải thấy:
   - ADMIN_2FA_SETUP_GUIDE.md (new)
   - DEPLOYMENT_SECRETS_GUIDE.md (new)
   - app/admin/layout.tsx (modified)
   - app/api/admin/login/route.ts (modified)
   ```

4. **Check Actions:**
   ```
   Actions tab → "Build & Deploy to VPS"
   Phải thấy workflow đang chạy hoặc đã complete
   ```

---

##  Nếu Push Thành Công - Trigger Deploy

### Monitor GitHub Actions:

1. **Mở:**
   ```
   https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/actions
   ```

2. **Click vào workflow "Build & Deploy to VPS"**

3. **Check logs:**
   ```
   quality-gate (Build)
   ↓
   build-and-push (Docker)
   ↓
   deploy (VPS SSH)
   ↓
   verify (Health check)
   ```

4. **Expected result:**
   ```
   ✅ All jobs passed
   ✅ Container running on VPS
   ✅ Health check passed
   ```

---

## 🐛 Troubleshooting

### Lỗi: "Authentication failed"

**Fix:**
```bash
# Tạo mới Personal Access Token
GitHub → Settings → Developer settings → Personal access tokens

# Dùng token thay cho password
git push origin main
# Username: ngohuyhoanghcm
# Password: [TOKEN]
```

### Lỗi: "Permission denied"

**Fix:**
```bash
# Check repository access
https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement/settings/access

# Đảm bảo bạn có "Write" permission
```

### Lỗi: "Network error"

**Fix:**
```bash
# Check internet connection
ping github.com

# Check firewall/antivirus
# Thử disable temporarily
```

### Lỗi: "Remote origin already exists"

**Fix:**
```bash
# Update remote URL
git remote set-url origin https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement.git

# Verify
git remote -v
```

---

## 📋 Checklist

### Trước khi push:

- [ ] Code đã commit: `git commit -m "..."`
- [ ] Files đúng: `git status`
- [ ] Branch đúng: `git branch` (phải là `main`)
- [ ] Remote đúng: `git remote -v`

### Sau khi push:

- [ ] Commit hiện trên GitHub
- [ ] GitHub Actions tự động chạy
- [ ] Deploy workflow complete
- [ ] Production URL hoạt động: https://grow.360tuongtac.com

---

##  Quick Commands

```bash
# Check status
git status

# Check remote
git remote -v

# Push code
git push origin main

# Check on GitHub
start https://github.com/ngohuyhoanghcm/360tuongtac-website-enhancement
```

---

**Bây giờ anh thử push lại hoặc dùng cách nào phù hợp nhé!** 🚀

Sau khi push thành công, em sẽ hướng dẫn setup GitHub Secrets!
