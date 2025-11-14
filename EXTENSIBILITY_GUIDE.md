# 象限擴充指南 (Quadrant Extensibility Guide)

## ✅ 重構完成

系統已經重構為**完全動態配置**，可以輕鬆新增、修改或刪除象限，無需修改程式碼。

## 🎯 如何新增象限

### 方法一：新增象限（不影響現有題目）

**步驟 1: 編輯 `src/data/categories.json`**

```json
[
  {
    "key": "architecture",
    "name": "Architecture & Design",
    "description": "系統設計/一致性/邊界",
    "color": "#3b82f6"
  },
  {
    "key": "performance",
    "name": "Performance & Observability",
    "description": "效能/快取/追蹤/指標",
    "color": "#10b981"
  },
  {
    "key": "reliability",
    "name": "Reliability & Delivery",
    "description": "釋出/韌性/併發",
    "color": "#f59e0b"
  },
  {
    "key": "data",
    "name": "Data & Storage",
    "description": "索引/查詢/Schema/安全",
    "color": "#8b5cf6"
  },
  {
    "key": "security",
    "name": "Security & Compliance",
    "description": "資安/權限/加密/合規",
    "color": "#ef4444"
  }
]
```

**步驟 2: 在 `src/data/questions.json` 新增相關題目**

```json
{
  "id": "Q21",
  "type": "single",
  "quadrant": "security",
  "question": "防止 SQL Injection 最有效的方式：",
  "options": [
    "A. String concatenation",
    "B. Prepared statements with parameter binding",
    "C. Client-side validation only",
    "D. Escape special characters manually"
  ],
  "correctAnswer": "B",
  "maxScore": 2
}
```

**步驟 3: 完成！** 🎉

- ✅ 雷達圖自動變成 5 軸
- ✅ 評分計算自動包含新象限
- ✅ 結果頁面自動顯示 5 個象限
- ✅ 不需要修改任何 TypeScript 或 React 程式碼

---

### 方法二：混合題目分配到新象限

```json
{
  "id": "Q22",
  "type": "scenario",
  "quadrant": "mixed",
  "question": "描述如何設計一個安全的認證系統...",
  "maxScore": 5,
  "distribution": {
    "architecture": 0.3,
    "security": 0.5,
    "data": 0.2
  },
  "rubric": [...]
}
```

---

## 🔧 架構說明

### 核心改進

#### 1. **動態類型定義**
```typescript
// src/data/categories.ts
export type Quadrant = typeof categoriesData[number]['key'];
// 自動從 JSON 推導出 'architecture' | 'performance' | ... 
```

#### 2. **通用計算邏輯**
```typescript
// src/utils/scoreCalculator.ts
const quadrantKeys = getQuadrantKeys();
quadrantKeys.forEach(key => {
  scores[key] = 0;
  maxScores[key] = 0;
});

// 動態分配分數
Object.entries(question.distribution).forEach(([quadrant, ratio]) => {
  scores[quadrant] += questionScore * ratio;
});
```

#### 3. **組件自動適應**
```tsx
// src/components/Results/ScenarioGrading.tsx
{Object.entries(distribution)
  .filter(([_, ratio]) => ratio > 0)
  .map(([quadrant, ratio]) => (
    <div>{quadrant}: {ratio * 100}%</div>
  ))
}
```

---

## 📊 實際應用範例

### 範例 1: 新增 "DevOps" 象限

```json
// categories.json
{
  "key": "devops",
  "name": "DevOps & Infrastructure",
  "description": "CI/CD/容器化/自動化",
  "color": "#06b6d4"
}

// questions.json
{
  "id": "Q23",
  "type": "multiple",
  "quadrant": "devops",
  "question": "容器化最佳實踐：",
  "options": [...],
  "correctAnswer": ["A", "B"],
  "maxScore": 3
}
```

### 範例 2: 分數分配到 6 個象限

```json
{
  "id": "Q24",
  "type": "scenario",
  "quadrant": "mixed",
  "distribution": {
    "architecture": 0.2,
    "performance": 0.15,
    "reliability": 0.15,
    "data": 0.15,
    "security": 0.2,
    "devops": 0.15
  }
}
```

---

## ⚠️ 注意事項

1. **象限 key 必須唯一**: 不能有重複的 `key` 值
2. **distribution 總和應為 1.0**: 例如 `0.25 + 0.25 + 0.25 + 0.25 = 1.0`
3. **顏色格式**: 使用 hex color code（如 `#3b82f6`）
4. **向後相容**: 修改 categories.json 後，舊的 localStorage 資料仍可正常載入

---

## 🎨 雷達圖自動縮放

雷達圖（Recharts）會**自動適應**象限數量：
- 4 個象限 → 正方形
- 5 個象限 → 五邊形
- 6 個象限 → 六邊形
- n 個象限 → n 邊形

無需手動調整圖表配置！

---

## 🚀 快速測試

```bash
# 1. 編輯 categories.json 新增象限
# 2. 編輯 questions.json 新增題目
# 3. 重新啟動開發伺服器
npm run dev
```

系統會自動識別新象限並完整整合到所有功能中。
