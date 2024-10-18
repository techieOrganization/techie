"use client"; 

import React from 'react';
import Link from 'next/link';
import './Header.module.css'

const Header = () => {
  return (
    <header id="header">
      <nav className="nav_bar">
        <div className="inner">
          <h1 className="logo">
            <Link href='/'>TECKIE</Link>
          </h1>
          <div className="header_menu">
            <ul className="menu_list">
              <li className="menu_item">
                <Link href="/lectures">강의</Link>
              </li>
              <li className="menu_item">
                <Link href="/community">커뮤니티</Link>
              </li>
            </ul>
            <div className="search_box">
              <input type="text" placeholder="검색어를 입력하세요" />
              <button type="button" className="btn_search">
              </button>
            </div>
            <ul className="menu_list auth_menu">
              <li className="menu_item">
                <Link href="/login">로그인</Link>
              </li>
              <li className="menu_item">
                <Link href="/signup">회원가입</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

  );
};

export default Header;
