import axios from 'axios';
import { API_CONFIG } from './env';
import { useAuthStore } from '../store';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - 토큰 자동 추가
apiClient.interceptors.request.use(
  config => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response Interceptor - 토큰 갱신 처리
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshAuth, logout } = useAuthStore.getState();

      try {
        const success = await refreshAuth();
        if (success) {
          const { token } = useAuthStore.getState();
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
