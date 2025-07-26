import { fetchRegisterUser } from '@/app/api/registerUserApi';
// 회원가입 요청 전송 함수
export const registerUser = async (userData: {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  await fetchRegisterUser(userData);
};
