'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IssueData {
  [key: string]: string;
}

export default function Issues() {
  const [issues, setIssues] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch('/api/sheets?sheet=이슈%20가이드');
      const result = await response.json();
      setIssues(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
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
            매체 이슈 가이드
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            자주 묻는 질문과 해결 방안
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {loading ? (
          <div className="py-12 text-center text-gray-600">로드 중...</div>
        ) : (
          <div className="space-y-4">
            {issues.length > 0 ? (
              issues.map((issue, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() =>
                      setExpandedIdx(expandedIdx === idx ? null : idx)
                    }
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {issue['질문'] || issue['Question'] || '질문'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {issue['카테고리'] || issue['Category'] || '-'}
                      </p>
                    </div>
                    <span className="text-2xl text-gray-400">
                      {expandedIdx === idx ? '−' : '+'}
                    </span>
                  </button>
                  {expandedIdx === idx && (
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                      <p className="text-gray-700">
                        {issue['답변'] || issue['Answer'] || '답변 없음'}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-600">
                아직 등록된 Q&A가 없습니다.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
