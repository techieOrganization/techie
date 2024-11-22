import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

// 유저 정보 조회
export const getUserInfo = async (): Promise<{ email: string; nickname: string }> => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('로그인이 필요합니다.');

    const response = await axios.get('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || '유저 정보를 가져오는데 실패했습니다.');
    }
    throw error;
  }
};

// 닉네임 업데이트
export const updateUserNickname = async (nickname: string): Promise<string> => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('로그인이 필요합니다.');

    const payload = { nickname };

    await axios.put('/api/users/me', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return '닉네임이 성공적으로 수정되었습니다.';
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || '닉네임 수정에 실패했습니다.');
    }
    throw error;
  }
};

// 비밀번호 업데이트
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<string> => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('로그인이 필요합니다.');

    const payload = { password: currentPassword, newPassword };

    await axios.put('/api/users/me', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return '비밀번호가 성공적으로 수정되었습니다.';
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('기존 비밀번호를 다시 확인해주세요.');
      }
      throw new Error(error.response?.data?.message || '비밀번호 수정에 실패했습니다.');
    }
    throw error;
  }
};

// 회원 탈퇴
export const deleteUser = async (password: string): Promise<string> => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('로그인이 필요합니다.');

    const payload = { password };

    await axios.delete('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });

    return '회원 탈퇴가 성공적으로 처리되었습니다.';
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || '회원 탈퇴에 실패했습니다.');
    }
    throw error;
  }
};
