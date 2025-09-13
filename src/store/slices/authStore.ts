import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '../../store/type/user.type';
import { loginAPI, registerAPI, refreshTokenAPI } from '../../services/api/auth';
import { loadStoredAuth, saveAuth, removeAuth } from '../../services/storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isFirstLaunch: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setAuth: (user: User, token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  setFirstLaunch: (isFirst: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isFirstLaunch: true,
        isLoading: false,
        error: null,

        // Actions
        setAuth: (user, token, refreshToken) => {
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            error: null,
          });
          saveAuth({ user, token, refreshToken });
        },

        setUser: user => {
          set({ user });
        },

        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            const response = await loginAPI({ email, password });
            const { user, token, refreshToken } = response.data;

            get().setAuth(user, token, refreshToken);
            set({ isLoading: false });
            return true;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || '로그인에 실패했습니다.',
            });
            return false;
          }
        },

        register: async userData => {
          set({ isLoading: true, error: null });
          try {
            const response = await registerAPI(userData);
            const { user, token, refreshToken } = response.data;

            get().setAuth(user, token, refreshToken);
            set({ isLoading: false });
            return true;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || '회원가입에 실패했습니다.',
            });
            return false;
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
          removeAuth();
        },

        refreshAuth: async () => {
          const { refreshToken } = get();
          if (!refreshToken) return false;

          try {
            const response = await refreshTokenAPI(refreshToken);
            const { token: newToken, refreshToken: newRefreshToken } = response.data;

            set({ token: newToken, refreshToken: newRefreshToken });
            return true;
          } catch (error) {
            get().logout();
            return false;
          }
        },

        checkAuthStatus: async () => {
          try {
            const storedAuth = await loadStoredAuth();
            if (storedAuth) {
              set({
                user: storedAuth.user,
                token: storedAuth.token,
                refreshToken: storedAuth.refreshToken,
                isAuthenticated: true,
              });
            }
          } catch (error) {
            console.log('No stored auth found');
          }
        },

        clearError: () => set({ error: null }),

        setFirstLaunch: isFirst => set({ isFirstLaunch: isFirst }),
      }),
      {
        name: 'auth-storage',
        partialize: state => ({
          isFirstLaunch: state.isFirstLaunch,
        }),
      },
    ),
  ),
);
