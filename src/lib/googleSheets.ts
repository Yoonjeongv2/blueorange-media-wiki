import { google } from 'googleapis';
import { googleAuth } from './googleAuth';

const sheets = google.sheets({ version: 'v4', auth: googleAuth });

export async function getSheetData(sheetName: string) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: sheetName,
    });

    const rows = response.data.values || [];
    if (rows.length) {
      const headers = rows[0];
      const data = rows.slice(1).map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
      return data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching sheet "${sheetName}":`, error);
    return [];
  }
}

export async function getSheetHeaders(sheetName: string): Promise<string[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${sheetName}!1:1`,
  });
  return response.data.values?.[0] || [];
}

/**
 * 시트의 실제 헤더 순서에 맞춰 한 행을 추가합니다.
 * fields는 헤더 이름(또는 동의어)을 키로 하는 값 맵입니다.
 */
export async function appendSheetRow(
  sheetName: string,
  fields: Record<string, string>,
  headerAliases: Record<string, string[]>
) {
  const headers = await getSheetHeaders(sheetName);
  if (!headers.length) {
    throw new Error(`"${sheetName}" 시트에서 헤더를 찾을 수 없습니다.`);
  }

  const row = headers.map((header) => {
    const canonicalKey = Object.keys(headerAliases).find((key) =>
      [key, ...headerAliases[key]].includes(header)
    );
    return canonicalKey ? fields[canonicalKey] ?? '' : '';
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: sheetName,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  });

  return row;
}
