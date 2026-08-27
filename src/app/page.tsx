import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 - FinSight Labs 스타일 */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-32 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Blueorange Media Wiki
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            미디어 정보 허브 및 전략 기획 자료실
          </p>
          <div className="mt-12 flex gap-4 justify-center">
            <Link
              href="/media-updates"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              미디어 업데이트
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 border border-gray-300 text-gray-900 rounded-lg font-medium hover:border-gray-400 transition-colors"
            >
              매체 상품소개서
            </Link>
          </div>
        </div>
      </section>

      {/* 미디어 업데이트 슬라이더 */}
      <section className="py-16 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">미디어 업데이트</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['네이버', '카카오', 'Meta', 'Google', '토스'].map((platform) => (
              <Link
                key={platform}
                href="/media-updates"
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white hover:shadow-lg transition-all text-center font-medium"
              >
                {platform}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 섹션 카드 - 공개/내부 자료 */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 공개 자료 */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">공개 자료</h3>
              <div className="space-y-4">
                <Link
                  href="/media-updates"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all"
                >
                  <h4 className="font-semibold text-gray-900">📊 미디어 업데이트</h4>
                  <p className="text-sm text-gray-600 mt-2">네이버, 카카오, Meta, Google, 토스의 최신 정보</p>
                </Link>
                <Link
                  href="/products"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all"
                >
                  <h4 className="font-semibold text-gray-900">📋 매체 상품소개서</h4>
                  <p className="text-sm text-gray-600 mt-2">매체별 기본 상품 정보 및 타깃별 소개서</p>
                </Link>
              </div>
            </div>

            {/* 내부 자료 */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">내부 자료</h3>
              <div className="space-y-4">
                <Link
                  href="/issues"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all"
                >
                  <h4 className="font-semibold text-gray-900">❓ 매체 이슈 가이드</h4>
                  <p className="text-sm text-gray-600 mt-2">Q&A 사례 모음 및 해결방안</p>
                </Link>
                <Link
                  href="/events"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all"
                >
                  <h4 className="font-semibold text-gray-900">📅 웨비나/미팅 일정</h4>
                  <p className="text-sm text-gray-600 mt-2">행사 일정 및 참석 관리</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 bg-white py-8 px-6">
        <div className="mx-auto max-w-6xl text-center text-sm text-gray-600">
          <p>Blueorange Media Wiki © 2026</p>
        </div>
      </footer>
    </div>
  );
}
