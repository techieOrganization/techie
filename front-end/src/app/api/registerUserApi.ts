import axios from 'axios';

interface RegisterUserParams {
  nickname: string;
  email: string;
  password: string;
}

export const fetchRegisterUser = async (params: RegisterUserParams) => {
  try {
    const response = await axios.post('http://localhost:8080/api/users/join', {
      nickname: params.nickname,
      email: params.email,
      password: params.password,
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};
