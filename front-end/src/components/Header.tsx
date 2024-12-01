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
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const router = useRouter();
  const dispatch = useDispatch();

  const checkLoginStatus = () => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token); // 토큰 유무에 따라 상태 업데이트
  };

  useEffect(() => {
    checkLoginStatus(); // 초기 로그인 상태 확인
    const handleLoginStatusChange = () => checkLoginStatus();

    window.addEventListener('loginStatusChanged', handleLoginStatusChange);

    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove('token'); // 쿠키 제거
    dispatch(clearUserInfo()); // Redux 상태 초기화
    setIsLoggedIn(false); // 상태 업데이트
    window.dispatchEvent(new Event('loginStatusChanged')); // 상태 변경 이벤트 트리거
    router.push('/'); // 메인 페이지로 이동
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/playlists/${selectedCategory}?query=${encodeURIComponent(searchQuery)}`);
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

        <div className="search_box">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
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
