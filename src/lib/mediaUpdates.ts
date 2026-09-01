export interface MediaData {
  [key: string]: string;
}

export const MEDIA_PLATFORMS = ['네이버', '카카오', 'Meta', 'Google', '토스', '기타'];
export const MEDIA_UPDATES_SHEET_NAME = 'update의 사본';

export function normalizePlatform(raw: string): string {
  const v = raw.toUpperCase();
  if (v.includes('NAVER') || raw.includes('네이버')) return '네이버';
  if (v.includes('KAKAO') || raw.includes('카카오')) return '카카오';
  if (v.includes('META') || raw.includes('페이스북') || raw.includes('인스타')) return 'Meta';
  if (v.includes('GOOGLE') || raw.includes('구글')) return 'Google';
  if (v.includes('TOSS') || raw.includes('토스')) return '토스';
  return '기타';
}

export function parseFlexibleDate(raw: string): Date | null {
  if (!raw?.trim()) return null;
  const normalized = raw.trim().replace(/\./g, '-').replace(/-\s+/g, '-').replace(/\s+/g, '').replace(/-$/, '');
  const parsed = new Date(normalized);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function isApproved(item: MediaData): boolean {
  return (item['게시 승인'] || '').trim() === '승인';
}

export function isExternallyVisible(item: MediaData): boolean {
  return (item['공개 범위'] || '').trim() !== '내부용';
}

export function isWithinPublishWindow(item: MediaData): boolean {
  const now = new Date();
  const start = parseFlexibleDate(item['공개 시작일'] || '');
  const end = parseFlexibleDate(item['공개 종료일'] || '');
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

export function isPubliclyReachable(item: MediaData): boolean {
  return isApproved(item) && isWithinPublishWindow(item);
}
