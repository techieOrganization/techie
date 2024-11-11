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
    console.error('');
  }
};
