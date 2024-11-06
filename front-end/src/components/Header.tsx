import React from 'react';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';

const Header = () => {
  return (
    <header id="header">
      <div className="inner">
        <div className="header_menu">
          <h1 className="logo">
            <Link href="/">TECHIE</Link>
          </h1>
          <ul className="menu_list">
            <li className="menu_item">
              <Link href="/playlists">강의 목록</Link>
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
            <li className="auth_item login">
              <Link href="/login">로그인</Link>
            </li>
            <li className="auth_item signup">
              <Link href="/signup">회원가입</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
