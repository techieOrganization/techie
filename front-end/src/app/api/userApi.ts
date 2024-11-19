import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

// 닉네임 및 비밀번호 업데이트 함수
export const updateUserInfo = async (nickname?: string, password?: string): Promise<string> => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('로그인이 필요합니다.');

    // 요청 본문(payload) 구성
    const payload: { nickname?: string; password?: string } = {};
    if (nickname) payload.nickname = nickname;
    if (password) payload.password = password;

    // 서버에 요청 보내기
    await axios.put('/api/users/me', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 알림 메시지 반환
    if (nickname && password) {
      return '닉네임과 비밀번호가 성공적으로 수정되었습니다.';
    } else if (nickname) {
      return '닉네임이 성공적으로 수정되었습니다.';
    } else if (password) {
      return '비밀번호가 성공적으로 수정되었습니다.';
    }
    return '정보가 성공적으로 수정되었습니다.';
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || '정보 수정에 실패했습니다.');
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
