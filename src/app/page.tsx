import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-light tracking-tight text-gray-900">
            Blueorange Media Wiki
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            미디어 정보 허브 및 전략 기획 자료실
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Public Sections */}
          <section>
            <h2 className="mb-6 text-2xl font-light text-gray-900">공개 자료</h2>
            <div className="space-y-4">
              <Link
                href="/media-updates"
                className="group block rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      미디어 업데이트
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      네이버, 카카오, Meta, Google, 토스의 최신 정보
                    </p>
                  </div>
                  <span className="text-2xl text-gray-300 group-hover:text-gray-400">
                    →
                  </span>
                </div>
              </Link>

              <Link
                href="/products"
                className="group block rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      매체 상품소개서
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      매체별 기본 상품 정보 및 타깃별 소개서
                    </p>
                  </div>
                  <span className="text-2xl text-gray-300 group-hover:text-gray-400">
                    →
                  </span>
                </div>
              </Link>
            </div>
          </section>

          {/* Internal Sections */}
          <section>
            <h2 className="mb-6 text-2xl font-light text-gray-900">내부 자료</h2>
            <div className="space-y-4">
              <Link
                href="/issues"
                className="group block rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      매체 이슈 가이드
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Q&A 사례 모음 및 해결방안
                    </p>
                  </div>
                  <span className="text-2xl text-gray-300 group-hover:text-gray-400">
                    →
                  </span>
                </div>
              </Link>

              <Link
                href="/events"
                className="group block rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      웨비나/미팅 일정
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      행사 일정 및 참석 관리
                    </p>
                  </div>
                  <span className="text-2xl text-gray-300 group-hover:text-gray-400">
                    →
                  </span>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-16">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-gray-600">
          <p>Blueorange Media Wiki © 2026</p>
        </div>
      </footer>
    </div>
  );
}
