import axios from 'axios';

interface RegisterUserParams {
  nickname: string;
  password: string;
  email: string;
}

export const fetchRegisterUser = async (params: RegisterUserParams): Promise<void> => {
  try {
    const response = await axios.post(`/api/users/register`, {
      nickname: params.nickname,
      password: params.password,
      email: params.email,
    });
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw new Error('Api error');
  }
};
