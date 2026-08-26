import { google } from 'googleapis';

const credentials = {
  type: 'service_account',
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: 'blueorange',
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: 'blueorange',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/blueorange-service-account%40blueorange-media-wiki.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
} as const;

const auth = new google.auth.GoogleAuth({
  credentials: credentials as any,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

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
