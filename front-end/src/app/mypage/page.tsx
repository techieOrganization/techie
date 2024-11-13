'use client';

import React, { useState } from 'react';
import '@/styles/pages/mypage/mypage.scss';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { RootState } from '@/redux/store';
import { updateNickname, updatePassword, deleteUser } from '@/app/api/userApi';

const Mypage = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();

  const [nickname, setNickname] = useState(userInfo?.nickname || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 닉네임 업데이트 함수 호출
  const handleNicknameUpdate = async () => {
    try {
      await updateNickname(nickname);
      alert('닉네임이 성공적으로 수정되었습니다.');
    } catch (error) {
      alert(error instanceof Error ? error.message : '닉네임 수정에 실패했습니다.');
    }
  };

  // 비밀번호 업데이트 함수 호출
  const handlePasswordUpdate = async () => {
    try {
      await updatePassword(newPassword);
      alert('비밀번호가 성공적으로 수정되었습니다.');
    } catch (error) {
      alert(error instanceof Error ? error.message : '비밀번호 수정에 실패했습니다.');
    }
  };

  // 회원 탈퇴 함수 호출
  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      alert('회원 탈퇴가 성공적으로 처리되었습니다.');
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
                <button onClick={handleNicknameUpdate}>닉네임 수정</button>
              </div>
            </label>
          </div>
          <div className="password_cont">
            <label>
              <strong>현재 비밀번호</strong>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호 입력"
              />
            </label>
            <label>
              <strong>새 비밀번호</strong>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호 입력"
              />
            </label>
            <button onClick={handlePasswordUpdate} className="pwd_modify_button">
              비밀번호 수정
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
