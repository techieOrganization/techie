'use client';

import React, { useState } from 'react';
import '@/styles/pages/register/register.scss';
import { fetchRegisterUser } from '@/app/api/registerUserApi';

const Signup = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      await fetchRegisterUser({ email, password, nickname });
      alert('회원가입 완료');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <div className="title-wrapper">
        <h2>회원가입</h2>
      </div>
      <form className="register-wrapper" onSubmit={handleSubmit}>
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
          className="input"
          placeholder="example@email.com"
          onChange={onChangeEmail}
          value={email}
        />
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
        <div className="button-wrapper">
          <button className="register_button" type="submit">
            가입하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
