'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import { loginUser } from '@/app/api/loginUserApi';
import '@/styles/pages/login/login.scss';
import { setUserInfo } from '@/redux/reducer';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      await performLogin();
    } catch (loginError) {
      handleLoginError(loginError);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 요청 전송 함수
  const performLogin = async () => {
    try {
      const res = await loginUser(formData);
      if (res.status === 200) {
        const token = res.headers['authorization']?.split(' ')[1];
        if (token) {
          // 쿠키에 토큰을 저장
          Cookies.set('token', token, { expires: 1, path: '/' });
          window.dispatchEvent(new Event('loginStatusChanged'));
          router.push('/'); // 로그인 성공 시 메인 페이지로 이동

          // JWT 디코딩
          const decodedJWT = decodeJWT(token);
          dispatch(setUserInfo(decodedJWT));
        } else {
          console.error('Token is undefined in the response headers');
        }
      } else {
        console.error('Failed to log in, unexpected response status');
      }
    } catch (error) {
      console.error('Error during login request:', error);
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  // JWT 디코딩 함수
  const decodeJWT = (token: string) => {
    const base64Payload = token.split('.')[1];
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(
      decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      ),
    );
  };

  // 로그인 오류 처리 함수
  const handleLoginError = (error: unknown) => {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      setError('이메일 또는 비밀번호가 잘못되었습니다.');
    } else {
      setError('로그인 중 오류가 발생했습니다.');
    }
    console.error('로그인 오류:', axiosError);
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
