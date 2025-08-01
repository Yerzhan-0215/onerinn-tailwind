'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GlobeAltIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

const labels = {
  ru: {
    artworks: 'Произведения',
    rentals: 'Аренда',
    install: 'Установить приложение',
    faq: 'Часто задаваемые вопросы',
    register: 'Зарегистрироваться',
    login: 'Войти',
    hello: 'Привет',
    logout: 'Выйти',
    profile: 'Профиль',
    edit: 'Редактировать',
  },
  kk: {
    artworks: 'Өнер туындылары',
    rentals: 'Жалдау',
    install: 'Қолданбаны орнату',
    faq: 'Жиі қойылатын сұрақтар',
    register: 'Тіркелу',
    login: 'Кіру',
    hello: 'Сәлем',
    logout: 'Шығу',
    profile: 'Профиль',
    edit: 'Өзгерту',
  },
  zh: {
    artworks: '艺术品',
    rentals: '租赁',
    install: '安装应用',
    faq: '常见问题',
    register: '注册',
    login: '登录',
    hello: '您好',
    logout: '退出',
    profile: '我的主页',
    edit: '编辑资料',
  },
  en: {
    artworks: 'Artworks',
    rentals: 'Rentals',
    install: 'Install App',
    faq: 'FAQ',
    register: 'Register',
    login: 'Login',
    hello: 'Hello',
    logout: 'Logout',
    profile: 'My Profile',
    edit: 'Edit Profile',
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const lang = pathname.startsWith('/ru')
    ? 'ru'
    : pathname.startsWith('/kk')
    ? 'kk'
    : pathname.startsWith('/zh')
    ? 'zh'
    : 'en';

  const t = labels[lang];
  const [user, setUser] = useState<{ email?: string; phone?: string; avatarUrl?: string } | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const changeLang = (targetLang: string) => {
    const newPath = pathname.replace(/^\/(ru|kk|zh)/, '').replace(/^\//, '');
    const target = targetLang === 'en' ? '/' : `/${targetLang}`;
    router.push(`${target}/${newPath}`);
    setShowLangMenu(false);
  };

  return (
    <nav className="w-full bg-white text-black px-6 py-3 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 左侧：Logo */}
        <Link href={`/${lang === 'en' ? '' : lang}`} className="text-xl font-bold text-blue-600">
          Önerinn
        </Link>

        {/* 中间：四个按钮居中 */}
        <div className="flex space-x-6 justify-center flex-1">
          <Link href={`/${lang}/artworks`} className="text-sm text-gray-600 hover:text-black">
            {t.artworks}
          </Link>
          <Link href={`/${lang}/rentals`} className="text-sm text-gray-600 hover:text-black">
            {t.rentals}
          </Link>
          <Link href={`/${lang}/app`} className="text-sm text-gray-600 hover:text-black">
            {t.install}
          </Link>
          <Link href={`/${lang}/faq`} className="text-sm text-gray-600 hover:text-black">
            {t.faq}
          </Link>
        </div>

        {/* 右侧：登录注册 + 语言切换器 */}
        <div className="flex items-center space-x-4 text-sm">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="h-8 w-8 rounded-full cursor-pointer hover:opacity-80"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
              ) : (
                <UserCircleIcon
                  className="h-7 w-7 text-gray-600 cursor-pointer hover:text-black"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
              )}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {t.profile}
                  </Link>
                  <Link href="/profile/edit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {t.edit}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href={`/${lang === 'en' ? '' : lang}/register`}
                className="text-gray-600 hover:text-black font-medium"
              >
                {t.register}
              </Link>
              <Link
                href={`/${lang === 'en' ? '' : lang}/login`}
                className="bg-white text-black px-4 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition font-semibold"
              >
                {t.login}
              </Link>
            </>
          )}

          {/* Language Switcher */}
          <div className="relative" ref={langMenuRef}>
            <GlobeAltIcon
              className="h-5 w-5 text-gray-500 hover:text-black cursor-pointer"
              onClick={() => setShowLangMenu(!showLangMenu)}
            />
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                <button onClick={() => changeLang('kk')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  Қазақша
                </button>
                <button onClick={() => changeLang('ru')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  Русский
                </button>
                <button onClick={() => changeLang('en')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  English
                </button>
                <button onClick={() => changeLang('zh')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  中文
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
