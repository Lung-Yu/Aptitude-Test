# 後端工程師能力評測系統

Backend Engineer Assessment Platform

## 專案簡介

這是一個專業的後端工程師技能評測網站，涵蓋四大技術象限：

- **Architecture & Design** - 系統設計/一致性/邊界
- **Performance & Observability** - 效能/快取/追蹤/指標
- **Reliability & Delivery** - 釋出/韌性/併發
- **Data & Storage** - 索引/查詢/Schema/安全

## 功能特色

✅ **20 道專業題目** - 單選題、複選題、是非題、情境題  
✅ **智能計分系統** - 自動計算各象限得分，支援分數分配  
✅ **視覺化分析** - 雷達圖展示四象限能力分布  
✅ **用戶體驗優化** - 進度追蹤、自動儲存、快速導航、響應式設計  
✅ **成績雲端紀錄** - 於結果頁直接上傳 Google Sheets，保留輸出擴充彈性

## 技術棧

- React 18 + TypeScript
- Vite 7 + Tailwind CSS 4
- Recharts (雷達圖)
- React Hook Form + Zod
- React Context (狀態管理)

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

訪問 http://localhost:5173

### 生產建置

```bash
npm run build
npm run preview  # 預覽生產版本
```

### Google Sheets 成績儲存

1. 建立或重用 Google Cloud 專案並啟用 **Google Sheets API**。
2. 建立 API Key（或 Apps Script Web App）並限制允許的來源網域。
3. 建立用於儲存成績的試算表，記下 Spreadsheet ID 與欲寫入的工作表範圍。
	- ✅ 可直接使用：`https://docs.google.com/spreadsheets/d/1m_ibL4JPHiYLbfL3MNzlbXKDTVOzuDlgkf3AbNxAyLI/edit?gid=0`
	- Spreadsheet ID：`1m_ibL4JPHiYLbfL3MNzlbXKDTVOzuDlgkf3AbNxAyLI`
	- 權限：目前設定為「知道連結即可編輯」，方便開箱使用但請注意分享對象。
4. 依照 `.env.example` 建立 `.env`，至少填入：

```bash
VITE_SHEETS_API_KEY=<Your API Key>
VITE_SHEETS_SHEET_ID=1m_ibL4JPHiYLbfL3MNzlbXKDTVOzuDlgkf3AbNxAyLI
VITE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/...
# 如需指定不同的工作表名稱可設定
# VITE_SHEETS_RANGE=Sheet1!A:O
# 亦可改用 Apps Script Web App
VITE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/...
```

> 詳細部署與混合資料策略說明請參考 `docs/DATA_STORAGE_ARCHITECTURE.md`。

### GitHub Pages 部署

專案已附上自動化流程（`.github/workflows/deploy-gh-pages.yml`），會在 `main` 分支 push 後建置並推送靜態檔案到 `gh-pages` 分支。

1. 於 GitHub Repository → Settings → Pages，選擇 `Deploy from a branch`，並指定 `gh-pages / (root)`。
2. 於 Repository Secrets 新增：
	- `VITE_SHEETS_API_KEY`
	- `VITE_SHEETS_SHEET_ID`（預設可填 `1m_ibL4JPHiYLbfL3MNzlbXKDTVOzuDlgkf3AbNxAyLI`）
	- `VITE_SHEETS_RANGE`（例如 `Sheet1!A:O`）
	- `VITE_SHEETS_WEB_APP_URL`（如未使用可留空但仍需建立 Secret）
3. Commit 並 push 後，workflow 會自動建置 `dist/`，並產生/更新 `gh-pages` 分支供 GitHub Pages 服用。
4. 若專案名稱非根網域，請於 `vite.config.ts` 設定 `base: '/<repo-name>/'` 以確保資源路徑正確。

## 計分規則

- **單選題 / 是非題**: 答對得 2 分
- **複選題**: 必須全選正確才得 3 分
- **情境題**: 滿分 5 分，根據評分準則手動評分

### 象限分數分配

- Q1-Q4: Architecture & Design
- Q5-Q8: Performance & Observability
- Q9-Q12: Reliability & Delivery
- Q13-Q16: Data & Storage
- Q17-Q20: 混合題（按比例分配到多個象限）

## 專案結構

```
src/
├── components/
│   ├── Quiz/              # 評測組件
│   └── Results/           # 結果組件
├── context/               # 狀態管理
├── data/                  # 題目資料
├── types/                 # TypeScript 類型
└── utils/                 # 工具函數
```

## 自定義題目

編輯 `src/data/questions.ts` 來修改或新增題目。

## 部署

建置後將 `dist/` 目錄部署到 Vercel、Netlify 或任意靜態伺服器。

若部署至 GitHub Pages，請同時於 Google API Key 設定允許 `https://<username>.github.io/*` 來源。

## 授權

MIT License
