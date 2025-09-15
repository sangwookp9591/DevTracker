export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:8080/api' : 'https://devtracker.co.kr/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const GIT_CONFIG = {
  GITHUB_CLIENT_ID: 'Ov23liJgJ5EQFHHpJUts',
  GITLAB_CLIENT_ID: 'Ov23liJgJ5EQFHHpJUts',
};

export const NOTIFICATION_CONFIG = {
  BREAK_REMINDER_INTERVAL: 25 * 60 * 1000, // 25 minutes
  DAILY_GOAL_REMINDER_TIME: '18:00',
  PROJECT_DEADLINE_REMINDER_DAYS: 3,
};
