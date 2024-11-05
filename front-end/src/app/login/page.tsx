'use client';

import React, { useState } from 'react';
import '@/styles/pages/login/login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="login-container">
      <div className="title-wrapper">
        <h2>TECHIE</h2>
      </div>
      <form className="input-wrapper">
        <div className="email-wrapper">
          <span>이메일</span>
          <input type="text" onChange={onChangeEmail} value={email} />
        </div>
        <div className="password-wrapper">
          <span>비밀번호</span>
          <input type="password" onChange={onChangePassword} value={password} />
        </div>
        <div className="button-wrapper">
          <button type="submit">로그인</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
