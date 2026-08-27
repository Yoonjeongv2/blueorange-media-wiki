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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white bg-opacity-80 border-b border-gray-200 border-opacity-50">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Blueorange
          </Link>

          {/* Navigation - Motion Menu Style */}
          <nav className="flex gap-8 items-center">
            {/* 공개 자료 */}
            <div className="relative group">
              <button
                onClick={() => toggleMenu('public')}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-lg transition-all hover:bg-gray-100"
              >
                공개 자료
                <span className={`text-xs transition-transform duration-300 ${openMenu === 'public' ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {openMenu === 'public' && (
                <div className="absolute left-0 top-full mt-2 w-56 backdrop-blur-md bg-white bg-opacity-95 border border-gray-200 border-opacity-50 rounded-2xl shadow-2xl py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Link
                    href="/media-updates"
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-purple-50 rounded-lg mx-2 transition-all"
                  >
                    📊 미디어 업데이트
                  </Link>
                  <Link
                    href="/products"
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-purple-50 rounded-lg mx-2 transition-all"
                  >
                    📋 매체 상품소개서
                  </Link>
                </div>
              )}
            </div>

            {/* 내부 자료 - 로그인 시에만 표시 */}
            {isLoggedIn && (
              <div className="relative group">
                <button
                  onClick={() => toggleMenu('internal')}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-lg transition-all hover:bg-gray-100"
                >
                  내부 자료
                  <span className={`text-xs transition-transform duration-300 ${openMenu === 'internal' ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {openMenu === 'internal' && (
                  <div className="absolute left-0 top-full mt-2 w-56 backdrop-blur-md bg-white bg-opacity-95 border border-gray-200 border-opacity-50 rounded-2xl shadow-2xl py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Link
                      href="/issues"
                      className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-blue-50 rounded-lg mx-2 transition-all"
                    >
                      ❓ 매체 이슈 가이드
                    </Link>
                    <Link
                      href="/events"
                      className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-blue-50 rounded-lg mx-2 transition-all"
                    >
                      📅 웨비나/미팅 일정
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* 로그인 버튼 */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('login')}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-medium transition-all transform hover:scale-105"
            >
              {isLoggedIn ? '마이페이지' : '로그인'}
              <span className={`text-xs transition-transform duration-300 ${openMenu === 'login' ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {openMenu === 'login' && (
              <div className="absolute right-0 top-full mt-2 w-56 backdrop-blur-md bg-white bg-opacity-95 border border-gray-200 border-opacity-50 rounded-2xl shadow-2xl py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={handleLogin}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-purple-50 rounded-lg mx-2 transition-all"
                    >
                      로그인
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-purple-50 rounded-lg mx-2 transition-all"
                    >
                      회원가입
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-blue-50 rounded-lg mx-2 transition-all"
                    >
                      마이페이지
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-red-50 rounded-lg mx-2 transition-all"
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
