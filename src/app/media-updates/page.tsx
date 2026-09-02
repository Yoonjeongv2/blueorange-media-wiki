'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  MediaData,
  MEDIA_PLATFORMS,
  MEDIA_UPDATES_SHEET_NAME as SHEET_NAME,
  normalizePlatform,
  isExternallyVisible,
  isPubliclyReachable,
} from '@/lib/mediaUpdates';

const PLATFORM_LOGO: Record<string, { src?: string; bg: string }> = {
  네이버: { src: '/brand/naver-wordmark-sm.png', bg: 'bg-warm' },
  카카오: { src: '/brand/kakao-wordmark-sm.png', bg: 'bg-[#2b2b2b]' },
  Meta: { src: '/brand/meta-icon-color-sm.png', bg: 'bg-warm' },
  토스: { src: '/brand/toss-wordmark-sm.png', bg: 'bg-warm' },
  Google: { bg: 'bg-warm' },
  기타: { src: '/brand/blueorange-symbol-sm.png', bg: 'bg-warm-soft' },
};

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

function CardThumb({ item, platform }: { item: MediaData; platform: string }) {
  const imageUrl = item['대표 이미지 URL'];
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
    );
  }
  const logo = PLATFORM_LOGO[platform] ?? PLATFORM_LOGO['기타'];
  return (
    <div className={`h-full w-full flex items-center justify-center ${logo.bg}`}>
      {logo.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo.src} alt={platform} loading="lazy" className="h-8 w-auto opacity-90" />
      ) : (
        <GoogleG />
      )}
    </div>
  );
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
    <div className="min-h-screen">
      <header className="border-b border-ink/10 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-ink-soft hover:text-ink transition-colors">
              ← 돌아가기
            </Link>
            <Link
              href="/admin/media-updates"
              className="inline-flex items-center gap-1 rounded-full bg-warm-soft px-3.5 py-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              업데이트 등록 →
            </Link>
          </div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-accent uppercase mb-3">Media Update</p>
          <h1 className="text-3xl md:text-[2.25rem] font-bold text-ink tracking-tight">미디어 업데이트</h1>
          <p className="mt-2 text-[15px] text-ink-soft">네이버, 카카오, Meta, Google, 토스의 최신 정보 및 업데이트</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 flex flex-wrap gap-1 border-b border-ink/10">
          {MEDIA_PLATFORMS.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                selectedPlatform === platform
                  ? 'border-accent text-ink'
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-warm-soft animate-pulse" />
            ))}
          </div>
        ) : visibleItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleItems.map((item, idx) => {
              const title = item['외부용 제목'] || item['제목'] || '제목 없음';
              const summary = item['외부용 요약'] || item['핵심 요약'] || '내용 없음';
              const date = item['공지일'] || '-';
              const updateType = item['업데이트 유형'] || '';
              return (
                <Link
                  key={item['게시물 ID'] || idx}
                  href={`/media-updates/${encodeURIComponent(item['게시물 ID'] || String(idx))}`}
                  className="group rounded-2xl border border-ink/10 overflow-hidden bg-warm hover:shadow-lg hover:shadow-ink/5 transition-shadow"
                >
                  <div className="aspect-[16/9] w-full bg-warm-soft overflow-hidden">
                    <CardThumb item={item} platform={selectedPlatform} />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-ink-soft mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{date}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-ink leading-snug group-hover:text-accent transition-colors">
                        {title}
                      </h3>
                      {!isExternallyVisible(item) && (
                        <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                          내부 전용
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink-soft leading-relaxed line-clamp-2 mb-4">{summary}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-warm-soft px-3 py-1 text-xs font-medium text-ink-soft">
                        {selectedPlatform}
                      </span>
                      {updateType && (
                        <span className="rounded-full bg-warm-soft px-3 py-1 text-xs font-medium text-ink-soft">
                          {updateType}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-ink-soft">아직 등록된 정보가 없습니다.</div>
        )}
      </main>
    </div>
  );
}
