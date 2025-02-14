import { loginUser } from '@/app/api/loginUserApi';
import Cookies from 'js-cookie';

import { devConsoleError } from '@/utils/logger';

// 로그인 요청 전송 함수
export const performLogin = async (formData: { email: string; password: string }) => {
  try {
    const res = await loginUser(formData);
    if (res.status === 200) {
      const token = res.headers['authorization']?.split(' ')[1];
      if (token) {
        // 쿠키에 토큰을 저장
        Cookies.set('token', token, { expires: 1, path: '/' });
        return token;
      } else {
        devConsoleError('Token is undefined in the response headers');
      }
    } else {
      devConsoleError('Failed to log in, unexpected response status');
    }
  } catch (error) {
    throw error;
  }
};

// JWT 디코딩 함수
export const decodeJWT = (token: string) => {
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
