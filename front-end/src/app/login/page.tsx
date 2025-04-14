'use client';

import React, { useState } from 'react';

import { AxiosError } from 'axios';

import '@/styles/pages/login/login.scss';

import { devConsoleError } from '@/utils/logger';
import { performLogin, decodeJWT } from '@/components/authservice/AuthLogin';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUserInfo } from '@/redux/reducer';
import { loginWithGoogle, loginWithNaver } from '../api/socialLoginApi';
import Image from 'next/image';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const dispatch = useDispatch();

  // 입력값 변경 시 formData 업데이트
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 로그인 폼 제출 시 처리 함수
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = await performLogin(formData);
      window.dispatchEvent(new Event('loginStatusChanged'));
      router.push('/'); // 로그인 성공 시 메인 페이지로 이동

      // JWT 디코딩
      const decodedJWT = decodeJWT(token);
      dispatch(setUserInfo(decodedJWT));
    } catch (loginError) {
      handleLoginError(loginError);
    } finally {
      setIsLoading(false);
    }
  };
  // 로그인 오류 처리 함수
  const handleLoginError = (error: unknown) => {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      setError('이메일 또는 비밀번호가 잘못되었습니다.');
    } else {
      setError('로그인 중 오류가 발생했습니다.');
    }
    devConsoleError('로그인 오류:', axiosError);
  };

  return (
    <div className="login-container">
      <div className="title-wrapper">
        <h2>TECHIE</h2>
      </div>
      <form className="input-wrapper" onSubmit={handleLogin}>
        <div className="email-wrapper">
          <strong>이메일</strong>
          <input type="text" name="email" onChange={onChange} value={formData.email} required />
        </div>
        <div className="password-wrapper">
          <strong>비밀번호</strong>
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
      <button onClick={loginWithGoogle} className="googleLogin">
        <Image src="/assets/images/main/googleIcon.png" alt="구글 아이콘" className="googleIcon" />
        Google 로그인
      </button>
      <button onClick={loginWithNaver} className="naverLogin">
        Naver 로그인
      </button>
    </div>
  );
};

export default Login;
