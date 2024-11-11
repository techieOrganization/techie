'use client';

import React, { useState } from 'react';
import '@/styles/pages/login/login.scss';
import { signIn } from 'next-auth/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 오류 메시지를 저장할 상태 추가

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    console.log('로그인 시도:', { email, password });

    const res = await signIn('Credentials', {
      redirect: false, // 자동 리다이렉트를 방지
      email: email,
      password: password,
      callbackUrl: '/',
    });
    console.log('클라이언트 페이지 함수 호출');
    console.log('signIn 결과:', res); // 결과 로그 추가

    if (res?.error) {
      setError(res.error); // 오류 발생 시 오류 메시지 설정
    }
  };

  return (
    <div className="login-container">
      <div className="title-wrapper">
        <h2>TECHIE</h2>
      </div>
      <form className="input-wrapper" onSubmit={handleLogin}>
        <div className="email-wrapper">
          <span>이메일</span>
          <input type="text" onChange={onChangeEmail} value={email} required />
        </div>
        <div className="password-wrapper">
          <span>비밀번호</span>
          <input type="password" onChange={onChangePassword} value={password} required />
        </div>
        {error && <p className="error-message">{error}</p>} {/* 오류 메시지 표시 */}
        <div className="button-wrapper">
          <button type="submit">로그인</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
