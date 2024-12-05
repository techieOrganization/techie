'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getUserInfo, updateUserNickname, updateUserPassword, deleteUser } from '@/app/api/userApi';
import { RootState } from '@/redux/store';
import { setUserInfo, clearUserInfo } from '@/redux/reducer';
import Cookies from 'js-cookie';
import { devConsoleError } from '@/utils/logger';

const UserInfoSection: React.FC = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();

  const [nickname, setNickname] = useState(userInfo?.nickname || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  // 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserInfo();
        dispatch(setUserInfo(userData));
        setNickname(userData.nickname);
      } catch (error) {
        devConsoleError('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [dispatch]);

  // 닉네임 수정
  const handleNicknameUpdate = async () => {
    try {
      await updateUserNickname(nickname);
      dispatch(setUserInfo({ ...userInfo, nickname }));
      alert('닉네임이 성공적으로 수정되었습니다.');
    } catch (error: unknown) {
      devConsoleError('Error during nickname update:', error);
      alert('닉네임 수정에 실패했습니다.');
    }
  };

  // 비밀번호 수정
  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      alert('기존 비밀번호와 새 비밀번호를 모두 입력해주세요.');
      return;
    }
    try {
      await updateUserPassword(currentPassword, newPassword);
      alert('비밀번호가 성공적으로 수정되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: unknown) {
      devConsoleError('Error during password update:', error);
      alert('비밀번호 수정에 실패했습니다.');
    }
  };

  // 회원 탈퇴
  const handleDeleteUser = async () => {
    if (!deletePassword) {
      alert('탈퇴를 위해 비밀번호를 입력해주세요.');
      return;
    }
    try {
      await deleteUser(deletePassword);
      alert('회원 탈퇴가 성공적으로 처리되었습니다.');
      Cookies.remove('token');
      dispatch(clearUserInfo());
      window.dispatchEvent(new Event('loginStatusChanged'));
      router.push('/');
    } catch (error: unknown) {
      devConsoleError('Error during account deletion:', error);
      alert('회원 탈퇴에 실패했습니다.');
    }
  };

  return (
    <div className="user_info_section">
      <p className="email_cont">
        <strong>이메일</strong> {userInfo?.email}
      </p>
      <div className="nickname_cont">
        <label>
          <strong>닉네임</strong>
          <div className="modify_cont">
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <button onClick={handleNicknameUpdate} className="nickname_modify_button">
              닉네임 수정
            </button>
          </div>
        </label>
      </div>
      <div className="password_cont">
        <label>
          <strong>기존 비밀번호</strong>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="기존 비밀번호 입력"
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
      <div className="delete_account_cont">
        <label>
          <strong>회원 탈퇴 비밀번호</strong>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="비밀번호 입력"
          />
        </label>
        <button onClick={handleDeleteUser} className="secession_button">
          회원 탈퇴
        </button>
      </div>
    </div>
  );
};

export default UserInfoSection;
