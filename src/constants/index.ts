export const DEVELOPER_TYPES = [
  { value: 'FRONTEND', label: '프론트엔드', icon: '⚛️' },
  { value: 'BACKEND', label: '백엔드', icon: '🔧' },
  { value: 'FULLSTACK', label: '풀스택', icon: '🚀' },
  { value: 'MOBILE', label: '모바일', icon: '📱' },
  { value: 'DESIGNER', label: 'UI/UX 디자이너', icon: '🎨' },
  { value: 'DEVOPS', label: 'DevOps', icon: '⚙️' },
  { value: 'OTHER', label: '기타', icon: '💻' },
];

export const PROJECT_TYPES = [
  { value: 'WEB', label: '웹 개발', icon: '🌐' },
  { value: 'MOBILE', label: '모바일 앱', icon: '📱' },
  { value: 'DESKTOP', label: '데스크톱 앱', icon: '🖥️' },
  { value: 'API', label: 'API 개발', icon: '🔧' },
  { value: 'DESIGN', label: '디자인', icon: '🎨' },
  { value: 'CONSULTING', label: '컨설팅', icon: '💼' },
  { value: 'OTHER', label: '기타', icon: '📁' },
];

export const PROJECT_STATUSES = [
  { value: 'PLANNING', label: '기획 중', color: '#94A3B8' },
  { value: 'IN_PROGRESS', label: '진행 중', color: '#3B82F6' },
  { value: 'TESTING', label: '테스트 중', color: '#F59E0B' },
  { value: 'DEPLOYMENT', label: '배포 중', color: '#8B5CF6' },
  { value: 'COMPLETED', label: '완료', color: '#10B981' },
  { value: 'PAUSED', label: '일시 중단', color: '#EF4444' },
  { value: 'CANCELLED', label: '취소', color: '#6B7280' },
];

export const PRIORITY_LEVELS = [
  { value: 'LOW', label: '낮음', icon: '🟢', color: '#10B981' },
  { value: 'MEDIUM', label: '보통', icon: '🟡', color: '#F59E0B' },
  { value: 'HIGH', label: '높음', icon: '🔴', color: '#EF4444' },
  { value: 'URGENT', label: '긴급', icon: '🚨', color: '#DC2626' },
];

export const TRACKING_METHODS = [
  { value: 'MANUAL', label: '수동 입력', icon: '✋' },
  { value: 'AUTO_GIT', label: 'Git 자동 추적', icon: '🔀' },
  { value: 'AUTO_IDE', label: 'IDE 연동', icon: '💻' },
  { value: 'POMODORO', label: '포모도로', icon: '🍅' },
];

export const GIT_PLATFORMS = [
  { value: 'GITHUB', label: 'GitHub', icon: '📁' },
  { value: 'GITLAB', label: 'GitLab', icon: '🦊' },
  { value: 'BITBUCKET', label: 'Bitbucket', icon: '🪣' },
  { value: 'OTHER', label: '기타', icon: '🔗' },
];

export const SUBSCRIPTION_PLANS = [
  {
    value: 'FREE',
    label: '무료',
    price: 0,
    features: ['기본 시간 추적', '3개 프로젝트', '기본 리포트'],
  },
  {
    value: 'BASIC',
    label: '베이직',
    price: 9900,
    features: ['무제한 프로젝트', 'Git 연동', '상세 분석', '클라이언트 관리'],
  },
  {
    value: 'PRO',
    label: '프로',
    price: 19900,
    features: [
      '베이직 모든 기능',
      'IDE 연동',
      '팀 협업',
      '고급 분석',
      '우선 지원',
    ],
  },
];
