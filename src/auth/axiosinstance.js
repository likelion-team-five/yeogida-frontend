import axios from "axios";
import { Cookies } from "react-cookie";

// CSRF 토큰을 쿠키에서 꺼내는 함수
const getCsrfTokenFromCookie = () => {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : null;
};

const axiosInstance = axios.create({
  baseURL: `https://meaningful-barbette-moda-backend-69ee5792.koyeb.app`,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    const csrfToken = getCsrfTokenFromCookie();

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// 응답 인터셉터 (토큰 갱신)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const cookies = new Cookies();
      const refreshToken = cookies.get('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post(
            'https://meaningful-barbette-moda-backend-69ee5792.koyeb.app/api/v1/auth/token/refresh',
            { refresh_token: refreshToken }
          );

          const newAccessToken = response.data.accessToken;
          cookies.set('accessToken', newAccessToken, { path: '/' });

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.log('Refresh token error:', refreshError);
          window.location.href = '/';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
