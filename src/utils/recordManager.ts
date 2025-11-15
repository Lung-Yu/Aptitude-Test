import type { AssessmentRecord, RecordManager, RecordSaveResult } from '../types/record.types';

const SHEETS_WEB_APP_URL = import.meta.env.VITE_SHEETS_WEB_APP_URL as string | undefined;
const SHEETS_API_KEY = import.meta.env.VITE_SHEETS_API_KEY as string | undefined;
const SHEETS_ID = import.meta.env.VITE_SHEETS_SHEET_ID as string | undefined;
const SHEETS_RANGE = (import.meta.env.VITE_SHEETS_RANGE as string | undefined) || 'Responses!A:O';

const JSON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json'
};

const buildRow = (record: AssessmentRecord): (string | number)[] => {
  const answersSummary = Object.entries(record.answers)
    .map(([questionId, value]) => `${questionId}:${Array.isArray(value) ? value.join(', ') : value}`)
    .join(' | ');

  return [
    record.submittedAt,
    record.profile.name,
    record.profile.email,
    record.profile.organization ?? '',
    record.profile.role ?? '',
    record.profile.experience ?? '',
    record.totalScore,
    record.totalMaxScore,
    record.overallPercentage,
    record.scenarioSummary.graded,
    record.scenarioSummary.pending,
    JSON.stringify(record.quadrantScores),
    JSON.stringify(record.quadrantMaxScores),
    answersSummary,
    JSON.stringify(record.scenarioScores),
    record.profile.notes ?? ''
  ];
};

class GoogleSheetsRecordManager implements RecordManager {
  async save(record: AssessmentRecord): Promise<RecordSaveResult> {
    if (!record.profile.consent) {
      throw new Error('請先勾選同意上傳成績。');
    }

    if (SHEETS_WEB_APP_URL) {
      return this.forwardToWebhook(record);
    }

    if (!SHEETS_API_KEY || !SHEETS_ID) {
      throw new Error('缺少 Google Sheets 設定，請於 .env 中設定變數。');
    }

    return this.appendRow(record);
  }

  private async forwardToWebhook(record: AssessmentRecord): Promise<RecordSaveResult> {
    // Use URLSearchParams to avoid CORS preflight (no Content-Type: application/json header)
    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify(record));

    const response = await fetch(SHEETS_WEB_APP_URL as string, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Apps Script webhook 執行失敗');
    }

    const payload = await response
      .json()
      .catch(() => ({ message: '成績已送出', sheetUrl: undefined as string | undefined }));

    return {
      success: true,
      message: payload.message ?? '成績已送出',
      sheetUrl: payload.sheetUrl
    };
  }

  private async appendRow(record: AssessmentRecord): Promise<RecordSaveResult> {
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encodeURIComponent(
      SHEETS_RANGE
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${SHEETS_API_KEY}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
        range: SHEETS_RANGE,
        majorDimension: 'ROWS',
        values: [buildRow(record)]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Google Sheets API 呼叫失敗');
    }

    await response.json().catch(() => ({}));

    return {
      success: true,
      message: '成績已儲存到 Google Sheets',
      sheetUrl: `https://docs.google.com/spreadsheets/d/${SHEETS_ID}`
    };
  }
}

export const googleSheetsRecordManager: RecordManager = new GoogleSheetsRecordManager();
