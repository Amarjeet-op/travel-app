export const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',

  auth: '/auth',
  adminLogin: '/admin-login',
  forgotPassword: '/forgot-password',
  onboarding: '/onboarding',

  dashboard: '/dashboard',
  trips: '/trips',
  newTrip: '/trips/new',
  tripDetail: (id: string) => `/trips/${id}`,
  myTrips: '/trips/my-trips',

  messages: '/messages',
  conversation: (id: string) => `/messages/${id}`,

  safetyChecker: '/safety-checker',
  savedSafetyChecks: '/safety-checker/saved',
  feedback: '/feedback',

  profile: '/profile',
  userProfile: (id: string) => `/profile/${id}`,

  notifications: '/notifications',
  settings: '/settings',

  admin: '/admin',
  adminUsers: '/admin/users',
  adminReports: '/admin/reports',
  adminFeedback: '/admin/feedback',
  adminTrips: '/admin/trips',
  adminLogs: '/admin/logs',
} as const;

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/trips',
  '/messages',
  '/safety-checker',
  '/profile',
  '/settings',
  '/notifications',
];

export const ADMIN_ROUTES = ['/admin'];

export const AUTH_ROUTES = ['/auth', '/admin-login'];
