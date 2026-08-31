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
};

export const googleAuth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
