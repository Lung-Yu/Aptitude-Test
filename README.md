# 軟體工程師能力評測系統

Software Engineer Assessment Platform

## 專案簡介

這是一個專業的軟體工程師技能評測網站，涵蓋六大技術維度：

- **演算法與資料結構** (Algorithm & Data Structure) - 資料結構選擇、演算法複雜度分析
- **前後端開發** (Full-Stack Development) - HTTP/API 設計、前後端技術、即時通訊
- **系統設計與架構** (System Design & Architecture) - 分散式系統、微服務、擴展性設計
- **效能與監控** (Performance & Monitoring) - 效能優化、快取策略、監控追蹤
- **資安與合規** (Security & Compliance) - 身份驗證、安全防護、OWASP Top 10
- **維運與協作** (DevOps & Collaboration) - CI/CD、部署策略、事故處理、技術決策

## 功能特色

✅ **30 道專業題目** - 單選題、複選題、是非題、情境題  
✅ **智能計分系統** - 自動計算各維度得分，支援分數分配  
✅ **職級自動評估** - Entry/Junior/Mid/Senior/Staff 職級評估（僅 Admin 可見）  
✅ **視覺化分析** - 雷達圖展示六維度能力分布  
✅ **用戶體驗優化** - 進度追蹤、自動儲存、快速導航、響應式設計  
✅ **成績雲端紀錄** - 於結果頁直接上傳 Google Sheets，保留輸出擴充彈性  
✅ **Admin 儀表板** - 多人雷達圖對比、職級徽章顯示、各維度詳細分析

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

- **單選題 / 是非題**: 依難度給分（Entry 2 分，Junior 3 分，Mid 4 分，Senior 5 分，Staff 6 分）
- **複選題**: 必須全選正確才得分，依難度給分
- **情境題**: 依難度給分（3-6 分），根據分層評分準則（rubric）手動評分

### 維度分數分配

- Q1-Q4: 演算法與資料結構 (Algorithm)
- Q5-Q8: 前後端開發 (Full-Stack)
- Q9-Q12: 系統設計與架構 (System Design)
- Q13-Q16: 效能與監控 (Performance)
- Q17-Q20: 資安與合規 (Security)
- Q21-Q24: 維運與協作 (DevOps)
- Q25-Q30: 情境題（按 distribution 比例分配到多個維度）

### 職級評估標準

系統會根據各維度得分率自動計算職級：

- **Entry** (0-40%): 具備基礎概念理解
- **Junior** (40-55%): 能在指導下獨立完成任務
- **Mid** (55-70%): 能獨立設計與實作功能
- **Senior** (70-85%): 能設計複雜系統並影響團隊
- **Staff** (85%+): 具備技術領導力

整體職級採用**中位數法**，避免單一強項掩蓋整體弱項。詳見 `docs/ASSESSMENT_DIMENSIONS.md`。

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

編輯 `src/data/questions.json` 來修改或新增題目。新增題目時請注意：

1. **維度平衡**: 確保每個維度都有適當的題目分布
2. **難度梯度**: Entry 到 Staff 各職級都應有代表性題目
3. **語言風格**: 中文為主，專有名詞用括號標註英文（如「快取（Cache）」）
4. **情境題評分準則**: 使用 rubric 欄位清楚標註各層級分數與評估標準

詳細題庫維護指南請參考 `docs/ASSESSMENT_DIMENSIONS.md`。

## 部署

建置後將 `dist/` 目錄部署到 Vercel、Netlify 或任意靜態伺服器。

若部署至 GitHub Pages，請同時於 Google API Key 設定允許 `https://<username>.github.io/*` 來源。

## 授權

MIT License
