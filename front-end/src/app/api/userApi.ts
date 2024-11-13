import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

// 닉네임 업데이트 함수
export const updateNickname = async (nickname: string) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('로그인이 필요합니다.');

    const response = await axios.put(
      '/api/users/me',
      { nickname },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || '닉네임 수정에 실패했습니다.');
    }
    throw error;
  }
};

// 비밀번호 업데이트 함수
export const updatePassword = async (newPassword: string) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('로그인이 필요합니다.');

    const response = await axios.put(
      '/api/users/me',
      { password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || '비밀번호 수정에 실패했습니다.');
    }
    throw error;
  }
};

// 회원 탈퇴 함수
export const deleteUser = async () => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('로그인이 필요합니다.');

    await axios.delete('/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return '회원 탈퇴가 성공적으로 처리되었습니다.';
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || '회원 탈퇴에 실패했습니다.');
    }
    throw error;
  }
};
