'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MediaData {
  [key: string]: string;
}

const MEDIA_PLATFORMS = ['네이버', '카카오', 'Meta', 'Google', '토스', '기타'];
const SHEET_NAME = 'update의 사본';

function normalizePlatform(raw: string): string {
  const v = raw.toUpperCase();
  if (v.includes('NAVER') || raw.includes('네이버')) return '네이버';
  if (v.includes('KAKAO') || raw.includes('카카오')) return '카카오';
  if (v.includes('META') || raw.includes('페이스북') || raw.includes('인스타')) return 'Meta';
  if (v.includes('GOOGLE') || raw.includes('구글')) return 'Google';
  if (v.includes('TOSS') || raw.includes('토스')) return '토스';
  return '기타';
}

function parseFlexibleDate(raw: string): Date | null {
  if (!raw?.trim()) return null;
  const normalized = raw.trim().replace(/\./g, '-').replace(/-\s+/g, '-').replace(/\s+/g, '').replace(/-$/, '');
  const parsed = new Date(normalized);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function isApproved(item: MediaData): boolean {
  return (item['게시 승인'] || '').trim() === '승인';
}

function isExternallyVisible(item: MediaData): boolean {
  return (item['공개 범위'] || '').trim() !== '내부용';
}

function isWithinPublishWindow(item: MediaData): boolean {
  const now = new Date();
  const start = parseFlexibleDate(item['공개 시작일'] || '');
  const end = parseFlexibleDate(item['공개 종료일'] || '');
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

export default function MediaUpdates() {
  const [data, setData] = useState<Record<string, MediaData[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(MEDIA_PLATFORMS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(`/api/sheets?sheet=${encodeURIComponent(SHEET_NAME)}`);
      const result = await response.json();

      const grouped: Record<string, MediaData[]> = {};
      MEDIA_PLATFORMS.forEach((platform) => {
        grouped[platform] = [];
      });

      if (Array.isArray(result)) {
        result
          .filter((item: MediaData) => isApproved(item) && isWithinPublishWindow(item))
          .forEach((item: MediaData) => {
            const platform = normalizePlatform(item['매체명'] || '');
            grouped[platform].push(item);
          });
      }

      setData(grouped);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  const visibleItems = (data[selectedPlatform] || []).filter(
    (item) => isLoggedIn || isExternallyVisible(item)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/"
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            ← 돌아가기
          </Link>
          <h1 className="text-4xl font-light tracking-tight text-gray-900">
            미디어 업데이트
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            각 매체의 최신 정보 및 업데이트
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Platform Tabs */}
        <div className="mb-12 flex gap-2 border-b border-gray-200">
          {MEDIA_PLATFORMS.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-4 py-3 font-medium transition-colors ${
                selectedPlatform === platform
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-12 text-center text-gray-600">로드 중...</div>
        ) : (
          <div className="space-y-6">
            {visibleItems.length > 0 ? (
              visibleItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  {item['대표 이미지 URL'] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item['대표 이미지 URL']}
                      alt=""
                      className="mb-4 max-h-48 w-full rounded-lg object-cover"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item['외부용 제목'] || item['제목'] || '제목 없음'}
                    </h3>
                    {!isExternallyVisible(item) && (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        내부 전용
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {item['공지일'] || '-'}
                  </p>
                  <p className="mt-3 text-gray-700">
                    {item['외부용 요약'] || item['핵심 요약'] || '내용 없음'}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-600">
                아직 등록된 정보가 없습니다.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
