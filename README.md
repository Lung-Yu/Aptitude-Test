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

## 授權

MIT License
