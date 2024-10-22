'use client';

import React, { useState } from 'react';
import '@/styles/pages/register/register.scss';

// interface User {
//   id: string;
//   nickname: string;
//   passwordConfirm: boolean;
// }

const Signup = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isMatchPassword, setIsMatchPassword] = useState(true);

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailValue.trim() !== '' && emailPattern.test(emailValue));
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setIsMatchPassword(password === e.target.value);
  };

  const getInputClass = () => {
    if (email.trim() === '') {
      return '';
    }
    return isValidEmail ? 'valid' : 'invalid';
  };

  return (
    <div className="register-container">
      <div className="title-wrapper">
        <h2>회원가입</h2>
      </div>
      <form className="register-wrapper">
        <span>닉네임</span>
        <input
          type="text"
          className="input"
          placeholder="Techie Project 에서 사용하실 닉네임을 입력해주세요"
          onChange={onChangeNickname}
          value={nickname}
        />
        <span>이메일</span>
        <input
          type="text"
          className={`input ${getInputClass()}`}
          placeholder="example@email.com"
          onChange={onChangeEmail}
          value={email}
        />
        {/* 이메일 유효성 검사 결과에 따른 메시지 추가 */}
        {!isValidEmail && email.trim() !== '' && (
          <span className="email-error">유효하지 않은 이메일 형식입니다.</span>
        )}
        <span>비밀번호</span>
        <input
          type="password"
          className="input"
          placeholder="********"
          onChange={onChangePassword}
          value={password}
        />
        <span> • 영문/숫자/특수문자 중, 2가지 이상 포함</span>
        <span> • 8자 이상 32자 이하 입력 (공백 제외)</span>
        <span> • 연속 3자 이상 동일한 문자/숫자 제외</span>
        <span>비밀번호 확인</span>
        <input
          type="password"
          className="input"
          placeholder="********"
          onChange={onChangeConfirmPassword}
          value={confirmPassword}
        />
        {/* 비밀번호 불일치 시 에러 메시지 추가 */}
        {!isMatchPassword && confirmPassword.trim() !== '' && (
          <span className="password-error">비밀번호가 일치하지 않습니다.</span>
        )}
      </form>
      <div className="button-wrapper">
        <button className="register_button">가입하기</button>
      </div>
    </div>
  );
};

export default Signup;
