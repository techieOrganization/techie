import React from 'react';
import '@/styles/pages/login/login.scss';
// interface User {
//   id: string;
//   nickname: string;
//   createdDate: string;
//   modifiedDate: string;
//   email: string;
// }

const Login = () => {
  return (
    <div className="login-container">
      <div className="title-wrapper">
        <h2>TECHIE</h2>
      </div>
      <div className="input-wrapper">
        <div className="email-wrapper">
          <span>이메일</span>
          <input type="text" />
        </div>
        <div className="password-wrapper">
          <span>비밀번호</span>
          <input type="password" />
          <div className="span-wrapper">
            <span>아이디 찾기</span>
            <span>비밀번호 찾기</span>
            <span>회원가입</span>
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
