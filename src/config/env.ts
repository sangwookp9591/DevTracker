export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:8080/api'
    : 'https://api.devtracker.com/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const GIT_CONFIG = {
  GITHUB_CLIENT_ID: 'your_github_client_id',
  GITLAB_CLIENT_ID: 'your_gitlab_client_id',
};

export const NOTIFICATION_CONFIG = {
  BREAK_REMINDER_INTERVAL: 25 * 60 * 1000, // 25 minutes
  DAILY_GOAL_REMINDER_TIME: '18:00',
  PROJECT_DEADLINE_REMINDER_DAYS: 3,
};
