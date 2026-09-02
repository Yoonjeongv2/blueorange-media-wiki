'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  MediaData,
  MEDIA_UPDATES_SHEET_NAME as SHEET_NAME,
  normalizePlatform,
  isExternallyVisible,
  isPubliclyReachable,
  parseFlexibleDate,
} from '@/lib/mediaUpdates';

const CACHE_KEY = 'home-updates-cache-v3';

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

function FeaturedThumb({ item, platform }: { item: MediaData; platform: string }) {
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

export default function Home() {
  const [updates, setUpdates] = useState<MediaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        setUpdates(JSON.parse(cached));
        setLoading(false);
      }
    } catch {
      // ignore cache read errors
    }

    (async () => {
      try {
        const res = await fetch(`/api/sheets?sheet=${encodeURIComponent(SHEET_NAME)}`);
        const result = await res.json();
        if (!Array.isArray(result)) return;

        const visible = result
          .filter((item: MediaData) => isPubliclyReachable(item))
          .filter((item: MediaData) => isLoggedIn || isExternallyVisible(item))
          .sort((a: MediaData, b: MediaData) => {
            const da = parseFlexibleDate(a['공지일'] || '')?.getTime() ?? 0;
            const db = parseFlexibleDate(b['공지일'] || '')?.getTime() ?? 0;
            return db - da;
          })
          .slice(0, 4);

        setUpdates(visible);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(visible));
        } catch {
          // ignore cache write errors
        }
      } catch (error) {
        console.error('Failed to fetch updates:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* 최근 업데이트 — 카드형 */}
      <section className="px-6 py-14 md:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-[11px] font-bold tracking-[0.2em] text-accent uppercase mb-3">
            Media Update
          </p>
          <h1 className="text-center text-3xl md:text-[2.25rem] font-bold text-ink mb-12 tracking-tight">
            최근 업데이트
          </h1>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-warm-soft animate-pulse" />
              ))}
            </div>
          ) : updates.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {updates.map((item, idx) => {
                const platform = normalizePlatform(item['매체명'] || '');
                const title = item['외부용 제목'] || item['제목'] || '제목 없음';
                const summary = item['외부용 요약'] || item['핵심 요약'] || '';
                const date = item['공지일'] || '';
                const updateType = item['업데이트 유형'] || '';
                return (
                  <Link
                    key={item['게시물 ID'] || idx}
                    href={`/media-updates/${encodeURIComponent(item['게시물 ID'] || String(idx))}`}
                    className="group rounded-2xl border border-ink/10 overflow-hidden bg-warm hover:shadow-lg hover:shadow-ink/5 transition-shadow"
                  >
                    <div className="aspect-[16/9] w-full bg-warm-soft overflow-hidden">
                      <FeaturedThumb item={item} platform={platform} />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-1.5 text-xs text-ink-soft mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="tabular-nums">{date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-ink mb-2 leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                        {title}
                      </h3>
                      {summary && (
                        <p className="text-sm text-ink-soft leading-relaxed line-clamp-2 mb-4">{summary}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-warm-soft px-3 py-1 text-xs font-medium text-ink-soft">
                          {platform}
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
            <div className="py-8 text-center text-sm text-ink-soft">아직 등록된 업데이트가 없습니다.</div>
          )}

          <div className="mt-10 text-center">
            <Link href="/media-updates" className="text-sm font-semibold text-ink hover:text-accent transition-colors">
              전체 업데이트 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 자료 아카이브 — 2단 리스트 */}
      <section className="border-t border-ink/10 px-6 py-12">
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.1em] text-ink-soft uppercase mb-4">공개 자료</h3>
            <Link href="/media-updates" className="block py-4 border-t border-ink/10 group">
              <h4 className="text-[15px] font-semibold text-ink group-hover:text-accent transition-colors">
                미디어 업데이트
              </h4>
              <p className="text-[13px] text-ink-soft mt-1">네이버, 카카오, Meta, Google, 토스의 최신 정보</p>
            </Link>
            <Link href="/products" className="block py-4 border-t border-ink/10 group">
              <h4 className="text-[15px] font-semibold text-ink group-hover:text-accent transition-colors">
                광고 상품 소개 자료
              </h4>
              <p className="text-[13px] text-ink-soft mt-1">매체별·상품군별 소개서</p>
            </Link>
          </div>
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.1em] text-ink-soft uppercase mb-4">내부 자료</h3>
            <Link href="/issues" className="block py-4 border-t border-ink/10 group">
              <h4 className="text-[15px] font-semibold text-ink group-hover:text-accent transition-colors">
                매체 이슈 가이드
              </h4>
              <p className="text-[13px] text-ink-soft mt-1">Q&amp;A 사례 모음 및 해결방안</p>
            </Link>
            <Link href="/events" className="block py-4 border-t border-ink/10 group">
              <h4 className="text-[15px] font-semibold text-ink group-hover:text-accent transition-colors">
                웨비나/미팅 일정
              </h4>
              <p className="text-[13px] text-ink-soft mt-1">행사 일정 및 참석 관리</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-ink/10 py-8 px-6 text-center">
        <div className="mx-auto max-w-5xl text-xs text-ink-soft">
          <p>Blueorange Media Wiki © 2026</p>
        </div>
      </footer>
    </div>
  );
}
