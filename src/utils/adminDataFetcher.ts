import type { ParticipantRecord, SheetFetchResult } from '../types/admin.types';

const SHEETS_ID = import.meta.env.VITE_SHEETS_SHEET_ID as string;

export async function fetchAllRecords(): Promise<SheetFetchResult> {
  if (!SHEETS_ID) {
    return {
      success: false,
      records: [],
      error: '缺少 Google Sheets ID 設定'
    };
  }

  try {
    // Use public CSV export for sheets with "Anyone with link can view" permission
    const endpoint = `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('Sheet1')}`;

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error('無法讀取 Google Sheets 資料');
    }

    const csvText = await response.text();
    
    // Parse CSV
    const rows = parseCSV(csvText);

    // Skip header row
    const dataRows = rows.slice(1);
    
    const records: ParticipantRecord[] = dataRows
      .filter((row: string[]) => row.length >= 16)
      .map((row: string[]) => ({
        timestamp: row[0] || '',
        name: row[1] || '',
        email: row[2] || '',
        organization: row[3] || '',
        role: row[4] || '',
        experience: row[5] || '',
        totalScore: parseFloat(row[6]) || 0,
        totalMaxScore: parseFloat(row[7]) || 0,
        percentage: parseFloat(row[8]) || 0,
        gradedScenarios: parseInt(row[9]) || 0,
        pendingScenarios: parseInt(row[10]) || 0,
        quadrantScores: parseJSON(row[11]),
        quadrantMaxScores: parseJSON(row[12]),
        answers: row[13] || '',
        scenarioScores: row[14] || '',
        notes: row[15] || ''
      }));

    return {
      success: true,
      records
    };
  } catch (error) {
    return {
      success: false,
      records: [],
      error: error instanceof Error ? error.message : '讀取失敗'
    };
  }
}

function parseJSON(value: string): Record<string, number> {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \r\n
      }
      currentRow.push(currentField);
      if (currentRow.some(f => f !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Add last field and row if exists
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}
