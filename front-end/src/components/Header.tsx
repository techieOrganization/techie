'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';

import { clearUserInfo } from '@/redux/reducer';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // 로그인 상태 확인 함수
  const checkLoginStatus = () => {
    try {
      const token = Cookies.get('token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error accessing Cookies:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener('loginStatusChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('loginStatusChanged'));
    router.push('/');
    dispatch(clearUserInfo());
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/playlists?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header id="header">
      <div className="inner">
        <div className="header_menu">
          <h1 className="logo">
            <Link href="/">TECHIE</Link>
          </h1>
          <ul className="menu_list">
            <li className="menu_item">
              <Link href="/playlists">강의 탐색 🔍</Link>
            </li>
            <li className="menu_item">
              <Link href="/teacher-lists">성장 멘토 🌱</Link>
            </li>
            <li className="menu_item">
              <Link href="/community">커뮤니티 💬</Link>
            </li>
          </ul>
        </div>
        <div className="search_box">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" onClick={handleSearch}>
            <FiSearch size={20} />
          </button>
        </div>
        <div className="auth_box">
          <ul className="auth_list">
            {isLoggedIn ? (
              <>
                <li className="auth_item">
                  <button onClick={handleLogout}>로그아웃</button>
                </li>
                <li className="auth_item">
                  <Link href="/mypage">마이페이지</Link>
                </li>
              </>
            ) : (
              <>
                <li className="auth_item login">
                  <Link href="/login">로그인</Link>
                </li>
                <li className="auth_item signup">
                  <Link href="/signup">회원가입</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
