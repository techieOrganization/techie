import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface RegisterUserParams {
  nickname: string;
  password: string;
  email: string;
}

export const fetchRegisterUser = async (params: RegisterUserParams): Promise<void> => {
  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_REGISTER_USER!, {
      nickname: params.nickname,
      password: params.password,
      email: params.email,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('404 오류');
        }
        throw new Error(`${error.response.status} 오류`);
      } else if (error.request) {
        throw new Error('request 오류');
      } else {
        throw new Error('request 설정 오류');
      }
    } else {
      console.error('Error', error);
    }
  }
};
