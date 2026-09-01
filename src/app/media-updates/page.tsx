'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  MediaData,
  MEDIA_PLATFORMS,
  MEDIA_UPDATES_SHEET_NAME as SHEET_NAME,
  normalizePlatform,
  isExternallyVisible,
  isPubliclyReachable,
} from '@/lib/mediaUpdates';

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
          .filter((item: MediaData) => isPubliclyReachable(item))
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
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              ← 돌아가기
            </Link>
            <Link
              href="/admin/media-updates"
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              업데이트 등록 →
            </Link>
          </div>
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
                <Link
                  key={idx}
                  href={`/media-updates/${encodeURIComponent(item['게시물 ID'] || String(idx))}`}
                  className="block rounded-lg border border-gray-200 p-6 hover:shadow-sm hover:border-gray-300 transition-all"
                >
                  {item['대표 이미지 URL'] && (
                    <div className="mb-4 flex max-h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item['대표 이미지 URL']}
                        alt=""
                        className="max-h-48 w-full object-contain"
                      />
                    </div>
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
                </Link>
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
