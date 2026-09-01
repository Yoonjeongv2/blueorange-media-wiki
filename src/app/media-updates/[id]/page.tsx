'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  MediaData,
  MEDIA_UPDATES_SHEET_NAME as SHEET_NAME,
  isExternallyVisible,
  isPubliclyReachable,
} from '@/lib/mediaUpdates';

function DetailField({ label, value }: { label: string; value: string }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900">{label}</h2>
      <p className="mt-1.5 whitespace-pre-line text-gray-700 leading-relaxed">{value}</p>
    </div>
  );
}

export default function MediaUpdateDetail() {
  const params = useParams();
  const id = decodeURIComponent(String(params.id ?? ''));

  const [item, setItem] = useState<MediaData | null | undefined>(undefined); // undefined = 로딩 중
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const response = await fetch(`/api/sheets?sheet=${encodeURIComponent(SHEET_NAME)}`);
      const result = await response.json();
      const found = Array.isArray(result)
        ? result.find((row: MediaData) => row['게시물 ID'] === id)
        : null;
      setItem(found || null);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setItem(null);
    }
  }

  if (item === undefined) {
    return <div className="min-h-screen bg-white py-24 text-center text-gray-600">로드 중...</div>;
  }

  const loggedInEnoughToView = item && (isExternallyVisible(item) || isLoggedIn);
  const viewable = item && isPubliclyReachable(item) && loggedInEnoughToView;

  if (!viewable) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="text-gray-600">존재하지 않거나 볼 수 없는 게시물입니다.</p>
          <Link href="/media-updates" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
            ← 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const showInternalDetails = isLoggedIn;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/media-updates" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            ← 미디어 업데이트로 이동
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        {item['대표 이미지 URL'] && (
          <div className="flex max-h-96 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item['대표 이미지 URL']} alt="" className="max-h-96 w-full object-contain" />
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {item['매체명'] && (
              <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">{item['매체명']}</span>
            )}
            {item['업데이트 유형'] && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{item['업데이트 유형']}</span>
            )}
            {item['중요도'] && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">{item['중요도']}</span>
            )}
            {!isExternallyVisible(item) && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">내부 전용</span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-gray-900">
            {(showInternalDetails && item['제목']) || item['외부용 제목'] || item['제목'] || '제목 없음'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {[item['공지일'] && `공지일 ${item['공지일']}`, item['적용일'] && `적용일 ${item['적용일']}`]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>

        <DetailField label="요약" value={showInternalDetails ? item['핵심 요약'] : item['외부용 요약'] || item['핵심 요약']} />

        {showInternalDetails && (
          <div className="space-y-6 rounded-xl border border-gray-200 p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">내부 상세 (로그인 사용자에게만 표시)</p>
            <DetailField label="적용 대상" value={item['적용 대상']} />
            <DetailField label="주요 변경사항" value={item['주요 변경사항']} />
            <DetailField label="실무 체크사항" value={item['실무 체크사항']} />
            <DetailField label="유의사항" value={item['유의사항']} />
            <DetailField label="검색 키워드" value={item['검색 키워드']} />
          </div>
        )}

        {item['참고 URL'] && (
          <a
            href={item['참고 URL']}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-indigo-600 hover:underline"
          >
            원문 보기 →
          </a>
        )}
      </main>
    </div>
  );
}
