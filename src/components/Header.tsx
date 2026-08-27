'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  FileText,
  HelpCircle,
  CalendarDays,
  ChevronDown,
} from 'lucide-react';

interface SubItem {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  id: string;
  label: string;
  items: SubItem[];
}

const PUBLIC_GROUP: NavGroup = {
  id: 'public',
  label: '공개 자료',
  items: [
    {
      href: '/media-updates',
      label: '미디어 업데이트',
      description: '네이버, 카카오, Meta, Google, 토스',
      icon: BarChart3,
    },
    {
      href: '/products',
      label: '매체 상품소개서',
      description: '매체별 기본 상품 및 타깃 소개서',
      icon: FileText,
    },
  ],
};

const INTERNAL_GROUP: NavGroup = {
  id: 'internal',
  label: '내부 자료',
  items: [
    {
      href: '/issues',
      label: '매체 이슈 가이드',
      description: 'Q&A 사례 모음 및 해결방안',
      icon: HelpCircle,
    },
    {
      href: '/events',
      label: '웨비나/미팅 일정',
      description: '행사 일정 및 참석 관리',
      icon: CalendarDays,
    },
  ],
};

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const groups = isLoggedIn ? [PUBLIC_GROUP, INTERNAL_GROUP] : [PUBLIC_GROUP];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between" ref={containerRef}>
          {/* Logo */}
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            Blueorange
          </Link>

          {/* Navigation */}
          <nav className="flex gap-1 items-center">
            {groups.map((group) => (
              <div key={group.id} className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === group.id ? null : group.id)}
                  className={`flex items-center gap-1.5 text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                    openMenu === group.id ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {group.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenu === group.id ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {openMenu === group.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-gray-200/60 bg-white/95 backdrop-blur-xl shadow-xl shadow-gray-900/10 p-2 origin-top-left"
                    >
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600">
                              <Icon className="w-4.5 h-4.5" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-gray-900">{item.label}</span>
                              <span className="block text-xs text-gray-500 mt-0.5">{item.description}</span>
                            </span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* 로그인 버튼 */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'login' ? null : 'login')}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all"
            >
              {isLoggedIn ? '마이페이지' : '로그인'}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenu === 'login' ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {openMenu === 'login' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-gray-200/60 bg-white/95 backdrop-blur-xl shadow-xl shadow-gray-900/10 p-2 origin-top-right"
                >
                  {!isLoggedIn ? (
                    <>
                      <button
                        onClick={handleLogin}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        로그인
                      </button>
                      <button className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        회원가입
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        마이페이지
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        로그아웃
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
