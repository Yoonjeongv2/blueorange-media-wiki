import { google } from 'googleapis';

// GOOGLE_PRIVATE_KEY_B64(권장): PEM 전체를 base64로 인코딩한 값.
// 줄바꿈/따옴표가 섞인 PEM을 대시보드에 복사/붙여넣기하면 깨지기 쉬워서,
// 복사·붙여넣기로 손상될 일이 없는 base64 한 줄짜리 값을 우선 사용합니다.
// (레거시) GOOGLE_PRIVATE_KEY: "\n"이 포함된 PEM 문자열 그대로.
function resolvePrivateKey(): string | undefined {
  if (process.env.GOOGLE_PRIVATE_KEY_B64) {
    return Buffer.from(process.env.GOOGLE_PRIVATE_KEY_B64, 'base64').toString('utf8');
  }
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
}

const credentials = {
  type: 'service_account',
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: 'blueorange',
  private_key: resolvePrivateKey(),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: 'blueorange',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/blueorange-service-account%40blueorange-media-wiki.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

export const googleAuth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
