import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 모든 API 요청의 기본 경로 설정
});

// 요청 인터셉터: Authorization 헤더에 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // 쿠키에서 토큰 가져오기

    console.log('Token:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
