import socialLogin from '@/components/axios/socialLogin';
const redirect_uri = 'http://localhost:3000/socialLoginCallback'; // 로그인 이후 리다이렉트 될 Url  이후 수정 예정

// 구글 로그인
export const loginWithGoogle = async () => {
  const googleLoginUrl = `/oauth2/authorization/google?mode=login&redirect_uri=${redirect_uri}`;
  try {
    window.location.href = `${socialLogin.defaults.baseURL}${googleLoginUrl}`;
  } catch (error) {
    console.error('구글 로그인 실패', error);
  }
};
// 네이버 로그인
export const loginWithNaver = async () => {
  const naverLoginUrl = `/oauth2/authorization/naver?mode=login&redirect_uri=${redirect_uri}`;
  try {
    window.location.href = `${socialLogin.defaults.baseURL}${naverLoginUrl}`;
  } catch (error) {
    console.error('네이버 로그인 실패', error);
  }
};
// 추후 Url 로 받은 토큰 값을 디코딩하는 과정 필요
