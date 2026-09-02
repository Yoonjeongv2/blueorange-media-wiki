'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  FileText,
  HelpCircle,
  CalendarDays,
  PlusCircle,
  Newspaper,
  MessageSquare,
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
      label: '광고 상품 소개 자료',
      description: '매체별·상품군별 소개서',
      icon: FileText,
    },
    {
      href: '/newsletter',
      label: '미디어 뉴스레터',
      description: '월별 큐레이션 아카이브',
      icon: Newspaper,
    },
    {
      href: '/contact',
      label: '문의 / 요청',
      description: '상품 문의, 자료 요청, 미팅 요청',
      icon: MessageSquare,
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
    {
      href: '/admin/media-updates',
      label: '미디어 업데이트 등록',
      description: 'URL·텍스트·이미지로 새 업데이트 등록',
      icon: PlusCircle,
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
    <header className="sticky top-0 z-50 bg-warm border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo — clean logo only: 실제 회사 로고 원본(아이콘+워드마크) + Media Wiki 라벨 */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/blueorange-logo-horizontal.png"
              alt="Blueorange Communications"
              className="h-[30px] w-auto shrink-0"
            />
            <span className="flex items-baseline gap-1 border-l border-ink/15 pl-3">
              <span
                className="italic text-ink text-[17px] leading-none"
                style={{ fontFamily: "Georgia, 'Times New Roman', ui-serif, serif" }}
              >
                media
              </span>
              <span
                className="text-ink text-[17px] leading-none"
                style={{ fontFamily: "'Arial Black', 'Pretendard', sans-serif", fontWeight: 800 }}
              >
                wiki
              </span>
            </span>
          </Link>

          {/* Navigation — 플랫 인라인 메뉴, 버튼처럼 보이도록 hover 배경/밑줄 부여 */}
          <nav className="hidden md:flex items-center">
            <Link
              href="/"
              className="rounded-md px-2.5 py-2 text-sm font-semibold text-accent hover:bg-accent-soft transition-colors whitespace-nowrap"
            >
              HOME
            </Link>
            {groups.flatMap((group) => group.items).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2.5 py-2 text-sm font-medium text-ink-soft hover:text-ink hover:bg-warm-soft transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 우측: 로그인(텍스트) + 뉴스레터 구독(블랙 필 버튼) */}
          <div className="flex items-center gap-5">
            <div className="relative" ref={containerRef}>
              <button
                onClick={() => setOpenMenu(openMenu === 'login' ? null : 'login')}
                className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
              >
                {isLoggedIn ? '마이페이지' : '로그인'}
              </button>

              <AnimatePresence>
                {openMenu === 'login' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-3 w-48 rounded-2xl border border-ink/10 bg-warm/98 backdrop-blur-xl shadow-xl shadow-ink/10 p-2 origin-top-right"
                  >
                    {!isLoggedIn ? (
                      <>
                        <button
                          onClick={handleLogin}
                          className="w-full text-left px-3 py-2.5 text-sm text-ink hover:bg-warm-soft rounded-lg transition-colors"
                        >
                          로그인
                        </button>
                        <button className="w-full text-left px-3 py-2.5 text-sm text-ink hover:bg-warm-soft rounded-lg transition-colors">
                          회원가입
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="w-full text-left px-3 py-2.5 text-sm text-ink hover:bg-warm-soft rounded-lg transition-colors">
                          마이페이지
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2.5 text-sm text-ink hover:bg-accent-soft rounded-lg transition-colors"
                        >
                          로그아웃
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/newsletter"
              className="px-4 py-2 border border-ink text-ink rounded-sm text-sm font-semibold hover:bg-ink hover:text-warm transition-colors whitespace-nowrap"
            >
              뉴스레터 구독
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
