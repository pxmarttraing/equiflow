
# EquiFlow 備品借用系統 - GitHub 部署指南

本專案已配置為可透過 GitHub Pages 快速發佈。請按照以下步驟操作：

## 🚀 部署步驟

1. **建立 GitHub 儲存庫**：
   - 在 GitHub 上建立一個新的儲存庫 (Repository)。
   - 將本機所有檔案上傳或推送到儲存庫的 `main` 分支。

2. **設定 API Key (重要)**：
   - 前往你的 GitHub Repository 頁面。
   - 點擊 **Settings** -> **Secrets and variables** -> **Actions**。
   - 點擊 **New repository secret**。
   - Name 填入 `GEMINI_API_KEY`。
   - Value 填入你的 Google Gemini API Key。

3. **啟動 GitHub Pages**：
   - 前往 **Settings** -> **Pages**。
   - 在 **Build and deployment** -> **Source** 選擇 `GitHub Actions`。

4. **查看結果**：
   - 當你推送程式碼後，點擊上方導覽列的 **Actions** 可以看到部署進度。
   - 部署完成後，你會在 **Settings** -> **Pages** 看到你的網站專屬網址。

## 🛠️ 開發環境
如果你想在自己的電腦上開發：
```bash
npm install
npm run dev
```

## 📝 注意事項
- 本系統目前使用瀏覽器的 `localStorage` 儲存資料，若清除瀏覽器暫存或更換電腦，資料將會重置。
- 若需多人異地同步資料，建議未來串接 Supabase 或 Firebase 資料庫。
