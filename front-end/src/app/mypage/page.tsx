'use client';

import React, { useState } from 'react';
import '@/styles/pages/mypage/mypage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { updateUserInfo, deleteUser } from '@/app/api/userApi';
import { RootState } from '@/redux/store';
import { setUserInfo, clearUserInfo } from '@/redux/reducer';
import Cookies from 'js-cookie';

const Mypage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();

  const [nickname, setNickname] = useState(userInfo?.nickname || '');
  const [newPassword, setNewPassword] = useState('');

  // 유저 정보 업데이트 함수 호출
  const handleUserInfoUpdate = async () => {
    try {
      await updateUserInfo(nickname, newPassword);
      dispatch(setUserInfo({ ...userInfo, nickname }));
      alert('정보가 성공적으로 수정되었습니다.');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('오류 상태 코드:', error.response.status);
        console.error('오류 메시지:', error.response.data);
        alert(`오류: ${error.response.data.message || '정보 수정에 실패했습니다.'}`);
      } else {
        alert('정보 수정에 실패했습니다.');
      }
    }
  };

  // 회원 탈퇴 함수 호출
  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      alert('회원 탈퇴가 성공적으로 처리되었습니다.');

      // 탈퇴 후 처리
      Cookies.remove('token');
      dispatch(clearUserInfo());
      window.dispatchEvent(new Event('loginStatusChanged'));

      // 메인 페이지로 이동
      router.push('/');
    } catch (error) {
      alert(error instanceof Error ? error.message : '회원 탈퇴에 실패했습니다.');
    }
  };

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
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
              </div>
            </label>
          </div>
          <div className="password_cont">
            <label>
              <strong>새 비밀번호</strong>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호 입력"
              />
            </label>
            <button onClick={handleUserInfoUpdate} className="pwd_modify_button">
              정보 수정
            </button>
          </div>
          <button onClick={handleDeleteUser} className="secession_button">
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
