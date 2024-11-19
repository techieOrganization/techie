'use client';

import React, { useState } from 'react';
import '@/styles/pages/mypage/mypage.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import UserInfoSection from '@/components/mypage/UserInfoSection';
import MyMemoSection from '@/components/mypage/MyMemoSection';
import MyVideoSection from '@/components/mypage/MyVideoSection';

const Mypage = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [activeSection, setActiveSection] = useState<'info' | 'memos' | 'videos'>('info');

  return (
    <div className="mypage_container">
      <div className="inner">
        <h2 className="section_title">마이페이지</h2>
        <div className="mypage_cont_all">
          <div className="left_cont">
            <h2 className="title">
              안녕하세요! <strong>{userInfo?.nickname}</strong>님😊
            </h2>
            <ul>
              <li
                className={activeSection === 'info' ? 'active' : ''}
                onClick={() => setActiveSection('info')}
              >
                정보수정
              </li>
              <li
                className={activeSection === 'memos' ? 'active' : ''}
                onClick={() => setActiveSection('memos')}
              >
                내 메모 모음
              </li>
              <li
                className={activeSection === 'videos' ? 'active' : ''}
                onClick={() => setActiveSection('videos')}
              >
                내 영상 모음
              </li>
            </ul>
          </div>
          <div className="right_cont">
            {activeSection === 'info' && <UserInfoSection />}
            {activeSection === 'memos' && <MyMemoSection />}
            {activeSection === 'videos' && <MyVideoSection />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
