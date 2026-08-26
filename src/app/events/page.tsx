'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface EventData {
  [key: string]: string;
}

export default function Events() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch('/api/sheets?sheet=웨비나%2F미팅');
      const result = await response.json();
      setEvents(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/"
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            ← 돌아가기
          </Link>
          <h1 className="text-4xl font-light tracking-tight text-gray-900">
            웨비나 및 미팅 일정
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            주요 행사 일정 및 참석 현황
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {loading ? (
          <div className="py-12 text-center text-gray-600">로드 중...</div>
        ) : (
          <div className="space-y-6">
            {events.length > 0 ? (
              events.map((event, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {event['행사명'] || event['Event'] || '행사명'}
                      </h3>
                      <div className="mt-4 space-y-2 text-sm">
                        <p>
                          <span className="text-gray-600">매체: </span>
                          <span className="font-medium">
                            {event['매체'] || event['Platform'] || '-'}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">일시: </span>
                          <span>{event['날짜'] || event['Date'] || '-'}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">시간: </span>
                          <span>{event['시간'] || event['Time'] || '-'}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">장소: </span>
                          <span>{event['장소'] || event['Location'] || '-'}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">참석 여부: </span>
                          <span
                            className={`font-medium ${
                              event['참석'] === '예'
                                ? 'text-green-600'
                                : event['참석'] === '아니오'
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                            }`}
                          >
                            {event['참석'] || event['Attendance'] || '-'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-600">
                아직 등록된 일정이 없습니다.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
