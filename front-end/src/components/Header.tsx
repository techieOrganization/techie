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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 선택한 카테고리 상태 추가
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

  // 검색 실행 함수
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 선택된 카테고리를 포함한 검색 URL 생성
      router.push(
        `/playlists?query=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`,
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
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
              <Link href="/playlists/ALL">강의 탐색 🔍</Link>
            </li>
            <li className="menu_item">
              <Link href="/teacher-lists">성장 멘토 🌱</Link>
            </li>
            <li className="menu_item">
              <Link href="/community">커뮤니티 💬</Link>
            </li>
          </ul>
        </div>

        {/* 검색 박스 */}
        <div className="search_box">
          {/* 카테고리 선택 드롭다운 */}
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="ALL">전체</option>
            <option value="LANG">언어</option>
            <option value="GAME">게임 개발</option>
            <option value="BACK">백엔드</option>
            <option value="MOBILE">모바일</option>
            <option value="FRONT">프론트엔드</option>
            <option value="DATA">데이터</option>
            <option value="AI">인공지능</option>
            <option value="SEC">보안</option>
            <option value="CS">CS</option>
            <option value="CLOUD">클라우드</option>
          </select>

          <input
            type="text"
            placeholder="배우고 싶은 개발 지식을 검색해보세요."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="button" onClick={handleSearch}>
            <FiSearch size={20} />
          </button>
        </div>

        {/* 로그인/로그아웃 박스 */}
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
