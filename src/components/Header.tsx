'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            Blueorange Media Wiki
          </Link>

          {/* Navigation */}
          <nav className="flex gap-8">
            {/* 공개 자료 */}
            <div className="relative group">
              <button
                onClick={() => toggleMenu('public')}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                공개 자료
                <span className={`transition-transform ${openMenu === 'public' ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Dropdown */}
              {openMenu === 'public' && (
                <div className="absolute left-0 top-full mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <Link
                    href="/media-updates"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    미디어 업데이트
                  </Link>
                  <Link
                    href="/products"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    매체 상품소개서
                  </Link>
                </div>
              )}
            </div>

            {/* 내부 자료 */}
            <div className="relative group">
              <button
                onClick={() => toggleMenu('internal')}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                내부 자료
                <span className={`transition-transform ${openMenu === 'internal' ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Dropdown */}
              {openMenu === 'internal' && (
                <div className="absolute left-0 top-full mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <Link
                    href="/issues"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    매체 이슈 가이드
                  </Link>
                  <Link
                    href="/events"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    웨비나/미팅 일정
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Close menu when clicking outside */}
      {openMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenMenu(null)}
        />
      )}
    </header>
  );
}
