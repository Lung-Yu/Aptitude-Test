# Google Apps Script Webhook 設定指南

由於 Google Sheet 已開放「知道連結即可編輯」，最簡單的方式是部署一個 Apps Script Web App 作為寫入端點，完全不需要 API Key。

## 步驟

### 1. 開啟 Apps Script 編輯器

1. 開啟試算表：https://docs.google.com/spreadsheets/d/1m_ibL4JPHiYLbfL3MNzlbXKDTVOzuDlgkf3AbNxAyLI/edit
2. 點選「擴充功能」→「Apps Script」

### 2. 建立 Web App 程式碼

在 Apps Script 編輯器中，貼上以下程式碼（覆蓋預設的 `function myFunction() {}`）：

```javascript
// Handle CORS preflight requests
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

function doPost(e) {
  try {
    // Parse the incoming JSON payload
    const data = JSON.parse(e.postData.contents);
    
    // Open the active spreadsheet and get Sheet1
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Sheet1');
    
    // If Sheet1 doesn't exist, create it
    if (!sheet) {
      const newSheet = ss.insertSheet('Sheet1');
      // Add header row
      newSheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Organization',
        'Role',
        'Experience',
        'TotalScore',
        'TotalMaxScore',
        'Percentage',
        'GradedScenarios',
        'PendingScenarios',
        'QuadrantScores',
        'QuadrantMaxScores',
        'Answers',
        'ScenarioScores',
        'Notes'
      ]);
    }
    
    const targetSheet = sheet || ss.getSheetByName('Sheet1');
    
    // Build the row data
    const answersSummary = Object.entries(data.answers || {})
      .map(([qId, val]) => `${qId}:${Array.isArray(val) ? val.join(', ') : val}`)
      .join(' | ');
    
    const row = [
      data.submittedAt || new Date().toISOString(),
      data.profile.name || '',
      data.profile.email || '',
      data.profile.organization || '',
      data.profile.role || '',
      data.profile.experience || '',
      data.totalScore || 0,
      data.totalMaxScore || 0,
      data.overallPercentage || 0,
      data.scenarioSummary.graded || 0,
      data.scenarioSummary.pending || 0,
      JSON.stringify(data.quadrantScores || {}),
      JSON.stringify(data.quadrantMaxScores || {}),
      answersSummary,
      JSON.stringify(data.scenarioScores || {}),
      data.profile.notes || ''
    ];
    
    // Append the row
    targetSheet.appendRow(row);
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '成績已成功寫入 Google Sheets',
        sheetUrl: ss.getUrl()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*'
      });
      
  } catch (error) {
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: '寫入失敗：' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*'
      });
  }
}
```

### 3. 部署 Web App

1. 點擊右上角「部署」→「新增部署作業」
2. 類型：選擇「網頁應用程式」
3. 設定：
   - **說明**：Backend Assessment Record Webhook
   - **執行身分**：我（你的 Google 帳號）
   - **具有應用程式存取權的使用者**：**任何人**（重要！）
4. 點擊「部署」
5. 授權並允許權限
6. **複製 Web 應用程式 URL**（格式：`https://script.google.com/macros/s/.../exec`）

### 4. 更新 .env 檔案

將剛剛複製的 URL 填入 `.env`：

```bash
VITE_SHEETS_API_KEY=
VITE_SHEETS_SHEET_ID=1m_ibL4JPHiYLbfL3MNzlbXKDTVOzuDlgkf3AbNxAyLI
VITE_SHEETS_RANGE=Sheet1!A:O
VITE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### 5. 重新啟動開發伺服器

```bash
npm run dev
```

### 6. 測試

1. 完成測驗並填寫成績上傳表單
2. 點擊「📤 上傳成績到 Google Sheets」
3. 開啟 Chrome DevTools → Network，確認看到 POST 請求到 `script.google.com`
4. 回到試算表確認新增的資料列

---

## 注意事項

- Apps Script Web App 的執行身分設定為「我」，因此所有寫入都會以你的 Google 帳號進行
- 設定「任何人」可存取是安全的，因為 Apps Script URL 本身就是難以猜測的長字串
- 若未來需要更新程式碼，記得「管理部署作業」→「編輯」→「版本」選擇「新版本」
- Web App 有每日配額限制（免費版約 20,000 次呼叫/天），足夠一般使用

## 故障排除

**問題：部署後仍然無法寫入**
- 確認「具有應用程式存取權的使用者」設定為「任何人」
- 檢查 Apps Script 執行紀錄（「執行作業」頁籤）查看錯誤訊息
- 確認 `.env` 的 URL 結尾是 `/exec` 而非 `/dev`

**問題：收到 CORS 錯誤**
- 確認已在 Apps Script 中加入 `doOptions` 函式處理 preflight 請求（上方程式碼已包含）
- 確認所有 `ContentService` 回應都加上 `Access-Control-Allow-Origin: *` header
- 部署時必須選擇「新版本」才會套用程式碼變更
