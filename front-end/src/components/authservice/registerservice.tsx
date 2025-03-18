import { fetchRegisterUser } from '@/app/api/registerUserApi';
// 회원가입 요청 전송 함수
export const registerUser = async (userData: {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await fetchRegisterUser(userData);
  if (response.status === 200 || response.status === 201) {
    alert('회원가입 완료');
  }
};
