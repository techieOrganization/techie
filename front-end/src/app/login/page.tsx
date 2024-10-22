'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import '@/styles/pages/login/login.scss';
// interface User {
//   id: string;
//   nickname: string;
//   createdDate: string;
//   modifiedDate: string;
//   email: string;
// }

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
      <div className="input-wrapper">
        <div className="email-wrapper">
          <span>이메일</span>
          <input type="text" onChange={onChangeEmail} value={email} />
        </div>
        <div className="password-wrapper">
          <span>비밀번호</span>
          <input type="password" onChange={onChangePassword} value={password} />
          <div className="span-wrapper">
            <span>
              <Link href="#">아이디 찾기</Link>
            </span>
            <span>
              <Link href="#">비밀번호 찾기</Link>
            </span>
            <span>
              <Link href={'/signup'}>회원가입</Link>
            </span>
          </div>
        </div>
      </div>
      <div className="button-wrapper">
        <button>로그인</button>
      </div>
    </div>
  );
};

export default Login;
