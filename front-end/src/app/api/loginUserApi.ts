import axios from 'axios';

interface LoginUserParams {
  email: string;
  password: string;
}

export const loginUser = async (params: LoginUserParams) => {
  try {
    const response = await axios.post('http://localhost:8080/login', {
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
