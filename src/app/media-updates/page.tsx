'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MediaData {
  [key: string]: string;
}

const MEDIA_PLATFORMS = ['네이버', '카카오', 'Meta', 'Google', '토스'];

export default function MediaUpdates() {
  const [data, setData] = useState<Record<string, MediaData[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(MEDIA_PLATFORMS[0]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch('/api/sheets?sheet=미디어%20업데이트');
      const result = await response.json();

      const grouped: Record<string, MediaData[]> = {};
      MEDIA_PLATFORMS.forEach(platform => {
        grouped[platform] = [];
      });

      if (Array.isArray(result)) {
        result.forEach((item: MediaData) => {
          const platform = item['매체'] || item['Platform'];
          if (platform && grouped[platform]) {
            grouped[platform].push(item);
          }
        });
      }

      setData(grouped);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

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
            {data[selectedPlatform]?.length > 0 ? (
              data[selectedPlatform].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {item['제목'] || item['Title'] || '제목 없음'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {item['날짜'] || item['Date'] || '-'}
                  </p>
                  <p className="mt-3 text-gray-700">
                    {item['내용'] || item['Description'] || '내용 없음'}
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
