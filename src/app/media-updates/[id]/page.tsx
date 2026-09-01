'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Package,
  CalendarDays,
  Users,
  Sparkles,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  MediaData,
  MEDIA_UPDATES_SHEET_NAME as SHEET_NAME,
  isExternallyVisible,
  isPubliclyReachable,
} from '@/lib/mediaUpdates';

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) {
  if (!value?.trim()) return null;
  return (
    <tr className="border-b border-gray-200 last:border-b-0">
      <th
        scope="row"
        className="w-36 shrink-0 whitespace-nowrap bg-gray-50 px-4 py-3.5 text-left align-top text-sm font-medium text-gray-500 sm:w-44"
      >
        <span className="inline-flex items-center gap-1.5">
          <Icon className="h-4 w-4 shrink-0 text-gray-400" />
          {label}
        </span>
      </th>
      <td className="whitespace-pre-line px-4 py-3.5 text-[15px] leading-relaxed text-gray-800">{value}</td>
    </tr>
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
  const title = (showInternalDetails && item['제목']) || item['외부용 제목'] || item['제목'] || '제목 없음';
  const schedule = [item['공지일'] && `공지 ${item['공지일']}`, item['적용일'] && `적용 ${item['적용일']}`]
    .filter(Boolean)
    .join(' · ');

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
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
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
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
        </div>

        {item['대표 이미지 URL'] && (
          <div className="flex max-h-[28rem] w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item['대표 이미지 URL']} alt="" className="max-h-[28rem] w-full object-contain" />
          </div>
        )}

        <div>
          <h2 className="mb-3 text-base font-semibold text-gray-900">상세 정보</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <tbody>
                <InfoRow icon={Package} label="광고 상품 유형" value={item['광고 상품 유형']} />
                <InfoRow icon={CalendarDays} label="일정" value={schedule} />
                <InfoRow icon={Users} label="적용 대상" value={item['적용 대상']} />
                <InfoRow icon={Sparkles} label="주요 변경사항" value={item['주요 변경사항']} />
                <InfoRow icon={ClipboardCheck} label="실무 체크사항" value={item['실무 체크사항']} />
                <InfoRow icon={AlertTriangle} label="유의사항" value={item['유의사항']} />
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
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
          {item['검색 키워드'] && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {item['검색 키워드']
                .split(',')
                .map((kw) => kw.trim())
                .filter(Boolean)
                .map((kw, i) => (
                  <span key={i} className="text-xs text-gray-400">
                    #{kw.replace(/\s+/g, '')}
                  </span>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
