import axios from 'axios';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
interface RegisterUserParams {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const fetchRegisterUser = async (params: RegisterUserParams) => {
  try {
    const response = await axios.post(`${baseUrl}/api/users/join`, {
      nickname: params.nickname,
      email: params.email,
      password: params.password,
      confirmPassword: params.confirmPassword,
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};
