// polyfill 추가 - 파일 최상단에 위치
import 'react-native-url-polyfill/auto';

import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../../config/api';

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
}

// GitHub OAuth 설정
const GITHUB_CONFIG = {
  clientId: 'Ov23liJgJ5EQFHHpJUts',
  redirectUri: 'com.devtracker.app://oauth/callback',
  scopes: ['user:email', 'read:user'],
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

/**
 * GitHub OAuth2 로그인 시작
 */
export const signInWithGitHub = async (): Promise<AuthResult> => {
  try {
    console.log('GitHub OAuth 시작...');

    // GitHub OAuth URL 생성
    const authUrl = buildAuthUrl();
    console.log('Auth URL:', authUrl);

    // InAppBrowser 사용 가능 여부 확인
    if (!(await InAppBrowser.isAvailable())) {
      console.log('InAppBrowser not available, using external browser');
      await Linking.openURL(authUrl);
      return {
        success: false,
        error: 'InAppBrowser를 사용할 수 없습니다. 외부 브라우저로 이동합니다.',
      };
    }

    // InAppBrowser로 GitHub 로그인 페이지 열기
    const result = await InAppBrowser.openAuth(authUrl, GITHUB_CONFIG.redirectUri, {
      // iOS 설정
      ephemeralWebSession: false,
      // 브라우저 옵션
      showTitle: true,
      toolbarColor: '#24292e', // GitHub 색상
      secondaryToolbarColor: 'black',
      enableUrlBarHiding: true,
      enableDefaultShare: false,
      forceCloseOnRedirection: true,
      // Android 설정
      showInRecents: false,
    });

    console.log('InAppBrowser result:', result);

    if (result.type === 'success' && result.url) {
      // Authorization code 추출
      const code = extractCodeFromUrl(result.url);

      if (!code) {
        throw new Error('Authorization code를 받을 수 없습니다.');
      }

      console.log('Authorization code received');

      // Access token 교환
      const accessToken = await exchangeCodeForToken(code);

      // GitHub 사용자 정보 가져오기
      const githubUser = await fetchGitHubUserInfo(accessToken);
      console.log('GitHub user info:', githubUser);

      // 백엔드 서버 인증
      const devTrackerAuth = await authenticateWithBackend(accessToken, githubUser);

      if (devTrackerAuth.success) {
        // 토큰 저장
        await saveTokens(accessToken, devTrackerAuth.token!);

        return {
          success: true,
          user: devTrackerAuth.user,
          token: devTrackerAuth.token,
        };
      }

      return devTrackerAuth;
    } else if (result.type === 'cancel') {
      console.log('사용자가 로그인을 취소했습니다.');
      return {
        success: false,
        error: 'login_cancelled',
      };
    }

    return {
      success: false,
      error: '인증에 실패했습니다.',
    };
  } catch (error: any) {
    console.error('GitHub OAuth Error:', error);

    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * GitHub OAuth URL 생성 - 직접 쿼리스트링 생성으로 TypeScript 오류 회피
 */
const buildAuthUrl = (): string => {
  const params = {
    client_id: GITHUB_CONFIG.clientId,
    redirect_uri: GITHUB_CONFIG.redirectUri,
    scope: GITHUB_CONFIG.scopes.join(' '),
    response_type: 'code',
    state: generateRandomState(), // CSRF 보호용
  };

  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `${GITHUB_CONFIG.authorizationEndpoint}?${queryString}`;
};

/**
 * URL에서 authorization code 추출 - TypeScript 타입 오류 회피
 */
const extractCodeFromUrl = (url: string): string | null => {
  try {
    // URL 객체 생성
    const urlObj = new URL(url);

    // searchParams를 any로 타입 캐스팅하여 get 메서드 사용
    const searchParams = urlObj.searchParams as any;

    // polyfill이 정상 작동하는 경우
    if (searchParams && typeof searchParams.get === 'function') {
      return searchParams.get('code');
    }

    // fallback: 정규식으로 직접 파싱
    const match = url.match(/[?&]code=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch (error) {
    console.error('URL parsing error:', error);

    // 최종 fallback: 정규식으로 직접 파싱
    try {
      const match = url.match(/[?&]code=([^&]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    } catch (fallbackError) {
      console.error('Fallback URL parsing error:', fallbackError);
      return null;
    }
  }
};

/**
 * Authorization code를 access token으로 교환 - 직접 form data 생성으로 TypeScript 오류 회피
 */
const exchangeCodeForToken = async (code: string): Promise<string> => {
  // URLSearchParams 대신 직접 form data 생성
  const formData = {
    client_id: GITHUB_CONFIG.clientId,
    code: code,
    redirect_uri: GITHUB_CONFIG.redirectUri,
  };

  const body = Object.entries(formData)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  const response = await fetch(GITHUB_CONFIG.tokenEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  });

  if (!response.ok) {
    throw new Error('토큰 교환에 실패했습니다.');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return data.access_token;
};

/**
 * GitHub API에서 사용자 정보 가져오기
 */
const fetchGitHubUserInfo = async (accessToken: string): Promise<GitHubUser> => {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'DevTracker-App',
    },
  });

  if (!response.ok) {
    throw new Error('GitHub 사용자 정보를 가져오는데 실패했습니다.');
  }

  const user = await response.json();

  // 이메일이 공개되지 않은 경우 별도 API 호출
  if (!user.email) {
    try {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'DevTracker-App',
        },
      });

      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((email: any) => email.primary);
        user.email = primaryEmail?.email || '';
      }
    } catch (error) {
      console.warn('이메일 정보를 가져오는데 실패했습니다:', error);
    }
  }

  return user;
};

/**
 * 백엔드 서버에 GitHub 토큰으로 인증 요청
 */
const authenticateWithBackend = async (
  githubAccessToken: string,
  githubUser: GitHubUser,
): Promise<AuthResult> => {
  try {
    const response = await apiClient.post('/auth/github', {
      githubAccessToken,
      githubUser: {
        id: githubUser.id,
        login: githubUser.login,
        name: githubUser.name,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
      },
    });

    if (response.data.success) {
      return {
        success: true,
        user: response.data.data.user,
        token: response.data.data.token,
      };
    }

    return {
      success: false,
      error: response.data.message || 'GitHub 로그인에 실패했습니다.',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || '서버 오류가 발생했습니다.',
    };
  }
};

/**
 * 토큰들을 AsyncStorage에 저장
 */
const saveTokens = async (githubToken: string, devTrackerToken: string): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      ['github_access_token', githubToken],
      ['devtracker_token', devTrackerToken],
    ]);
  } catch (error) {
    console.error('토큰 저장 실패:', error);
  }
};

/**
 * 로그아웃 (토큰 정리)
 */
export const signOut = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(['github_access_token', 'devtracker_token']);
    console.log('로그아웃 완료');
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};

/**
 * 저장된 GitHub 토큰 확인
 */
export const hasValidGitHubToken = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('github_access_token');
    return !!token;
  } catch {
    return false;
  }
};

/**
 * 저장된 토큰들 가져오기
 */
export const getStoredTokens = async (): Promise<{
  githubToken: string | null;
  devTrackerToken: string | null;
}> => {
  try {
    const tokens = await AsyncStorage.multiGet(['github_access_token', 'devtracker_token']);
    return {
      githubToken: tokens[0][1],
      devTrackerToken: tokens[1][1],
    };
  } catch {
    return {
      githubToken: null,
      devTrackerToken: null,
    };
  }
};

/**
 * 랜덤 state 생성 (CSRF 보호)
 */
const generateRandomState = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * 에러 메시지 처리
 */
const getErrorMessage = (error: any): string => {
  if (error.message?.includes('User cancelled')) {
    return 'login_cancelled';
  }

  if (error.message?.includes('Network')) {
    return '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
  }

  return error.message || 'GitHub 로그인 중 오류가 발생했습니다.';
};
