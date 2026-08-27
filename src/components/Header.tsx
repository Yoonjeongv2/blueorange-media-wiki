'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setOpenMenu(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setOpenMenu(null);
  };

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
          <nav className="flex gap-8 items-center">
            {/* 공개 자료 */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('public')}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                미디어 업데이트
                <span className={`transition-transform ${openMenu === 'public' ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {openMenu === 'public' && (
                <div className="absolute left-0 top-full mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <Link
                    href="/media-updates"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    네이버, 카카오, Meta, Google, 토스
                  </Link>
                </div>
              )}
            </div>

            {/* 매체 상품소개서 */}
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 font-medium py-2"
            >
              매체 상품소개서
            </Link>

            {/* 매체 이슈 가이드 - 내부용 */}
            {isLoggedIn && (
              <Link
                href="/issues"
                className="text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                매체 이슈 가이드
              </Link>
            )}

            {/* 웨비나/미팅 일정 - 내부용 */}
            {isLoggedIn && (
              <Link
                href="/events"
                className="text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                웨비나/미팅 일정
              </Link>
            )}
          </nav>

          {/* 로그인 버튼 */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('login')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {isLoggedIn ? '마이페이지' : '로그인'}
              <span className={`transition-transform ${openMenu === 'login' ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {openMenu === 'login' && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={handleLogin}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      로그인
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      회원가입
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      마이페이지
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      로그아웃
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
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
