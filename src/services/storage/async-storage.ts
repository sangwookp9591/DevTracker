import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
  TRACKING_STATE: 'tracking_state',
  POMODORO_SETTINGS: 'pomodoro_settings',
};

export const saveAuth = async (authData: {
  user: any;
  token: string;
  refreshToken: string;
}): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.AUTH_TOKEN, authData.token],
      [STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken],
      [STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user)],
    ]);
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
};

export const loadStoredAuth = async (): Promise<{
  user: any;
  token: string;
  refreshToken: string;
} | null> => {
  try {
    const values = await AsyncStorage.multiGet([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);

    const token = values[0][1];
    const refreshToken = values[1][1];
    const userData = values[2][1];

    if (!token || !refreshToken || !userData) {
      return null;
    }

    return {
      token,
      refreshToken,
      user: JSON.parse(userData),
    };
  } catch (error) {
    console.error('Error loading stored auth:', error);
    return null;
  }
};

export const removeAuth = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  } catch (error) {
    console.error('Error removing auth data:', error);
    throw error;
  }
};

export const saveTrackingState = async (trackingState: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.TRACKING_STATE,
      JSON.stringify(trackingState),
    );
  } catch (error) {
    console.error('Error saving tracking state:', error);
    throw error;
  }
};

export const loadTrackingState = async (): Promise<any | null> => {
  try {
    const state = await AsyncStorage.getItem(STORAGE_KEYS.TRACKING_STATE);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Error loading tracking state:', error);
    return null;
  }
};

export const savePomodoroSettings = async (settings: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.POMODORO_SETTINGS,
      JSON.stringify(settings),
    );
  } catch (error) {
    console.error('Error saving pomodoro settings:', error);
    throw error;
  }
};

export const loadPomodoroSettings = async (): Promise<any | null> => {
  try {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.POMODORO_SETTINGS);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error loading pomodoro settings:', error);
    return null;
  }
};
