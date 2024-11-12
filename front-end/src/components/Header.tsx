'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 로그인 상태 확인 함수
  const checkLoginStatus = () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener('loginStatusChanged', checkLoginStatus);
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('loginStatusChanged'));
    router.push('/');
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
              <Link href="/">강의 목록</Link>
            </li>
            <li className="menu_item">
              <Link href="/community">커뮤니티</Link>
            </li>
          </ul>
        </div>
        <div className="search_box">
          <input type="text" placeholder="검색어를 입력하세요" />
          <button type="button">
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
