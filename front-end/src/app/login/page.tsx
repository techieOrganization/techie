import React from 'react';
import '@/styles/pages/signup/signup.scss';
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
    <div className="login_container">
      <h2>로그인</h2>
      <p>Teckie에 오신 것을 환영 합니다.</p>

      <form className="signup_form">
        <div className="form_group">
          <label className="form_label" htmlFor="email">이메일</label>
          <input className="form_input" type="email" id="email" placeholder='이메일을 입력해주세요.' />
        </div>
        <div className="form_group">
          <label className="form_label" htmlFor="password">비밀번호</label>
          <input className="form_input" type="password" id="password" placeholder='비밀번호를 입력해주세요.'/>
        </div>
        <button className="login_button" type="submit">로그인</button>
        <button className="signup_button" type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Login;
