import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* 히어로 섹션 */}
      <section className="relative py-40 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              Blueorange<br />Media Wiki
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            미디어 정보 허브 및 전략 기획 자료실
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/media-updates"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
            >
              미디어 업데이트
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 border-2 border-gray-400 text-gray-900 rounded-lg font-medium hover:bg-white hover:shadow-md transition-all"
            >
              매체 상품소개서
            </Link>
          </div>
        </div>
      </section>

      {/* 미디어 업데이트 섹션 */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">미디어 업데이트</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {['네이버', '카카오', 'Meta', 'Google', '토스'].map((platform, idx) => (
              <Link
                key={platform}
                href="/media-updates"
                className="group relative overflow-hidden rounded-2xl p-8 text-white text-center font-medium transition-all transform hover:scale-105 hover:shadow-2xl"
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
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 공개 자료 */}
            <div className="rounded-3xl backdrop-blur-sm bg-white bg-opacity-70 border border-white border-opacity-50 p-10 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">공개 자료</h3>
              <div className="space-y-4">
                <Link
                  href="/media-updates"
                  className="block p-6 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all transform hover:scale-102"
                >
                  <h4 className="font-semibold text-gray-900 text-lg">📊 미디어 업데이트</h4>
                  <p className="text-sm text-gray-600 mt-2">네이버, 카카오, Meta, Google, 토스의 최신 정보</p>
                </Link>
                <Link
                  href="/products"
                  className="block p-6 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all transform hover:scale-102"
                >
                  <h4 className="font-semibold text-gray-900 text-lg">📋 매체 상품소개서</h4>
                  <p className="text-sm text-gray-600 mt-2">매체별 기본 상품 정보 및 타깃별 소개서</p>
                </Link>
              </div>
            </div>

            {/* 내부 자료 */}
            <div className="rounded-3xl backdrop-blur-sm bg-white bg-opacity-70 border border-white border-opacity-50 p-10 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">내부 자료</h3>
              <div className="space-y-4">
                <Link
                  href="/issues"
                  className="block p-6 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-300 transition-all transform hover:scale-102"
                >
                  <h4 className="font-semibold text-gray-900 text-lg">❓ 매체 이슈 가이드</h4>
                  <p className="text-sm text-gray-600 mt-2">Q&A 사례 모음 및 해결방안</p>
                </Link>
                <Link
                  href="/events"
                  className="block p-6 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-300 transition-all transform hover:scale-102"
                >
                  <h4 className="font-semibold text-gray-900 text-lg">📅 웨비나/미팅 일정</h4>
                  <p className="text-sm text-gray-600 mt-2">행사 일정 및 참석 관리</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-6 text-center">
        <div className="mx-auto max-w-6xl text-sm text-gray-600 backdrop-blur-sm">
          <p>Blueorange Media Wiki © 2026</p>
        </div>
      </footer>
    </div>
  );
}
