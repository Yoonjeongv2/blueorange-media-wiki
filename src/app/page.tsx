import Link from 'next/link';
import { BarChart3, FileText, HelpCircle, CalendarDays } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* 히어로 섹션 */}
      <section className="relative py-28 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-snug">
            Blueorange Media Wiki
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed mb-10">
            미디어 정보 허브 및 전략 기획 자료실
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/media-updates"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all transform hover:scale-105"
            >
              미디어 업데이트
            </Link>
            <Link
              href="/products"
              className="px-6 py-2.5 border border-gray-300 text-gray-900 rounded-lg text-sm font-medium hover:bg-white hover:shadow-md transition-all"
            >
              매체 상품소개서
            </Link>
          </div>
        </div>
      </section>

      {/* 미디어 업데이트 섹션 */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">미디어 업데이트</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['네이버', '카카오', 'Meta', 'Google', '토스'].map((platform, idx) => (
              <Link
                key={platform}
                href="/media-updates"
                className="group relative overflow-hidden rounded-xl py-6 px-4 text-white text-center text-sm font-medium transition-all transform hover:scale-105 hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, hsl(${210 + idx * 20}, 70%, 55%) 0%, hsl(${230 + idx * 20}, 70%, 45%) 100%)`
                }}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="relative">{platform}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 섹션 카드 - 공개/내부 자료 */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 공개 자료 */}
            <div className="rounded-2xl backdrop-blur-sm bg-white/70 border border-white/60 p-8 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-5 tracking-tight">공개 자료</h3>
              <div className="space-y-3">
                <Link
                  href="/media-updates"
                  className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600">
                    <BarChart3 className="w-4.5 h-4.5" />
                  </span>
                  <span>
                    <h4 className="font-semibold text-gray-900 text-sm">미디어 업데이트</h4>
                    <p className="text-xs text-gray-600 mt-1">네이버, 카카오, Meta, Google, 토스의 최신 정보</p>
                  </span>
                </Link>
                <Link
                  href="/products"
                  className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600">
                    <FileText className="w-4.5 h-4.5" />
                  </span>
                  <span>
                    <h4 className="font-semibold text-gray-900 text-sm">매체 상품소개서</h4>
                    <p className="text-xs text-gray-600 mt-1">매체별 기본 상품 정보 및 타깃별 소개서</p>
                  </span>
                </Link>
              </div>
            </div>

            {/* 내부 자료 */}
            <div className="rounded-2xl backdrop-blur-sm bg-white/70 border border-white/60 p-8 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-5 tracking-tight">내부 자료</h3>
              <div className="space-y-3">
                <Link
                  href="/issues"
                  className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-300 transition-all"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600">
                    <HelpCircle className="w-4.5 h-4.5" />
                  </span>
                  <span>
                    <h4 className="font-semibold text-gray-900 text-sm">매체 이슈 가이드</h4>
                    <p className="text-xs text-gray-600 mt-1">Q&A 사례 모음 및 해결방안</p>
                  </span>
                </Link>
                <Link
                  href="/events"
                  className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-300 transition-all"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600">
                    <CalendarDays className="w-4.5 h-4.5" />
                  </span>
                  <span>
                    <h4 className="font-semibold text-gray-900 text-sm">웨비나/미팅 일정</h4>
                    <p className="text-xs text-gray-600 mt-1">행사 일정 및 참석 관리</p>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-10 px-6 text-center">
        <div className="mx-auto max-w-6xl text-xs text-gray-500 backdrop-blur-sm">
          <p>Blueorange Media Wiki © 2026</p>
        </div>
      </footer>
    </div>
  );
}
