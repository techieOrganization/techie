import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface AuthUserParams {
  email: string;
  password: string;
}

export const fetchAuthUser = async (params: AuthUserParams): Promise<void> => {
  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_AUTH_USER!, {
      email: params.email,
      password: params.password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
