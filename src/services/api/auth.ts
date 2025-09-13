import { apiClient } from '../../config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  developerType: string;
  hourlyRate?: number;
  githubUsername?: string;
}

export interface AuthResponse {
  user: any;
  token: string;
  refreshToken: string;
}

export const loginAPI = async (data: LoginRequest) => {
  return apiClient.post<AuthResponse>('/auth/login', data);
};

export const registerAPI = async (data: RegisterRequest) => {
  return await apiClient.post<AuthResponse>('/auth/register', data);
};

export const refreshTokenAPI = async (refreshToken: string) => {
  return apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh', {
    refreshToken,
  });
};

export const logoutAPI = async () => {
  return apiClient.post('/auth/logout');
};
