'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/api/loginUserApi';
import '@/styles/pages/login/login.scss';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 입력값 변경 시 formData 업데이트
  const onChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 로그인 폼 제출 시 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await performLogin();
    } catch (loginError) {
      handleLoginError(loginError);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 요청 전송 함수
  const performLogin = async () => {
    const res = await loginUser(formData);
    if (res.status === 200) {
      const token = res.data.token;
      localStorage.setItem('token', token);
      window.dispatchEvent(new Event('loginStatusChanged')); // 로그인 상태 변경 이벤트 발생
      router.push('/'); // 로그인 성공 시 메인 페이지로 이동
    }
  };

  // 로그인 오류 처리 함수
  const handleLoginError = (error) => {
    if (error?.response?.status === 401) {
      setError('이메일 또는 비밀번호가 잘못되었습니다.');
    } else {
      setError('로그인 중 오류가 발생했습니다.');
    }
    console.error('로그인 오류:', error);
  };

  return (
    <div className="login-container">
      <div className="title-wrapper">
        <h2>TECHIE</h2>
      </div>
      <form className="input-wrapper" onSubmit={handleLogin}>
        <div className="email-wrapper">
          <span>이메일</span>
          <input type="text" name="email" onChange={onChange} value={formData.email} required />
        </div>
        <div className="password-wrapper">
          <span>비밀번호</span>
          <input
            type="password"
            name="password"
            onChange={onChange}
            value={formData.password}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-wrapper">
          <button type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
