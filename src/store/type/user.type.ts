export type DeveloperType =
  | 'FRONTEND'
  | 'BACKEND'
  | 'FULLSTACK'
  | 'MOBILE'
  | 'DESIGNER'
  | 'DEVOPS'
  | 'OTHER';

export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO';

export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  developerType: DeveloperType;
  subscriptionPlan: SubscriptionPlan;
  hourlyRate: number;
  timezone: string;
  githubUsername?: string;
  gitlabUsername?: string;
}
