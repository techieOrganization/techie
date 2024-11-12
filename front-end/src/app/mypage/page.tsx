'use client';

import React from 'react';
import '@/styles/pages/mypage/mypage.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Mypage = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  return (
    <div className="mypage_container">
      <div className="inner">
        <h2 className="section_title">마이페이지</h2>
        <div className="user_info_section">
          <p className="email_cont">
            <strong>이메일</strong> {userInfo?.email}
          </p>
          <div className="nickname_cont">
            <label>
              <strong>닉네임</strong>
              <div className="modify_cont">
                <input type="text" value="테스트 유저" readOnly />
                <button>정보 수정</button>
              </div>
            </label>
          </div>
          <div className="password_cont">
            <label>
              <strong>비밀번호</strong>
              <input type="password" placeholder="현재 비밀번호 입력" readOnly />
              <input type="password" placeholder="새 비밀번호 입력" readOnly />
              <input type="password" placeholder="새 비밀번호 다시 입력" readOnly />
            </label>
          </div>
          <button className="pwd_modify_button">비밀번호 수정</button>
          <button className="secession_button">회원 탈퇴</button>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
