import axios from "axios";
import { Cookies } from "react-cookie";

const axiosInstance = axios.create({
  baseURL: `http://localhost:8000`, // 기본 URL
});

axiosInstance.interceptors.request.use(
  
  async (config) => {
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    console.log('AccessToken:', accessToken); // 토큰 디버깅
 // 쿠키에서 accessToken 가져오기
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`; // 요청 헤더에 액세스 토큰 추가
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 응답 인터셉터 추가: 401 오류 발생 시 리프레시 토큰을 사용해 액세스 토큰 갱신
axiosInstance.interceptors.response.use(
  (response) => response, // 정상적인 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 상태일 때 리프레시 토큰을 이용한 갱신 로직
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 방지 플래그

      const cookies = new Cookies();
      const refreshToken = cookies.get('refreshToken'); // 쿠키에서 refreshToken 가져오기

      if (refreshToken) {
        try {
          // 리프레시 토큰으로 새로운 액세스 토큰 요청
          const response = await axios.post(
            'https://meaningful-barbette-moda-backend-69ee5792.koyeb.app/api/v1/auth/token/refresh', 
            { refresh_token: refreshToken }
          );
          
          const newAccessToken = response.data.accessToken;
          
          // 새 액세스 토큰을 쿠키에 저장
          cookies.set('accessToken', newAccessToken, { path: '/' });

          // 원래 요청에 새로운 액세스 토큰을 추가
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); // 갱신된 토큰으로 다시 요청
        } catch (refreshError) {
          console.log('Refresh token error:', refreshError);
          window.location.href = '/';
          // 리프레시 토큰 갱신 실패 시 처리 (예: 로그인 화면으로 리다이렉트 등)
        }
      }
    }

    return Promise.reject(error); // 실패한 요청은 그대로 실패로 처리
  }
);

export default axiosInstance;