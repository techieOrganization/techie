'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { fetchRegisterUser } from '@/app/api/registerUserApi';
import '@/styles/pages/register/register.scss';

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  // 입력값 변경 시 formData 업데이트
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 회원가입 폼 제출 시 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { nickname, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await registerUser({ nickname, email, password });
      await loginUserAfterSignup(email, password);
    } catch (error) {
      handleSignupError(error);
    }
  };

  // 회원가입 요청 전송 함수
  const registerUser = async (userData) => {
    const response = await fetchRegisterUser(userData);
    if (response.status === 200 || response.status === 201) {
      alert('회원가입 완료');
    }
  };

  // 회원가입 후 로그인 상태 전환 함수
  const loginUserAfterSignup = async (email, password) => {
    const loginResponse = await axios.post('http://localhost:8080/login', { email, password });

    if (loginResponse.status === 200) {
      const token = loginResponse.data.token;
      localStorage.setItem('token', token);

      router.push('/login'); // 로그인 페이지로 이동
    }
  };

  // 회원가입 오류 처리 함수
  const handleSignupError = (error) => {
    const errorMessage = error.response?.data || '회원가입 중 오류가 발생했습니다.';
    setError(errorMessage);
    console.error('회원가입 오류:', error);
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
          name="nickname"
          className="input"
          placeholder="Techie Project 에서 사용하실 닉네임을 입력해주세요"
          onChange={handleChange}
          value={formData.nickname}
          required
        />
        <span>이메일</span>
        <input
          type="email"
          name="email"
          className="input"
          placeholder="example@email.com"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <span>비밀번호</span>
        <input
          type="password"
          name="password"
          className="input"
          placeholder="********"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <span>• 영문/숫자/특수문자 중, 2가지 이상 포함</span>
        <span>• 8자 이상 32자 이하 입력 (공백 제외)</span>
        <span>• 연속 3자 이상 동일한 문자/숫자 제외</span>
        <span>비밀번호 확인</span>
        <input
          type="password"
          name="confirmPassword"
          className="input"
          placeholder="********"
          onChange={handleChange}
          value={formData.confirmPassword}
          required
        />
        {error && <p className="error-message">{error}</p>}
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
