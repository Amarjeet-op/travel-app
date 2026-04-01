export const APP_CONFIG = {
  appName: 'Abhayam',
  tagline: 'Travel Fearlessly. Together.',
  sessionCookieName: 'session',
  sessionMaxAge: 5 * 24 * 60 * 60, // 5 days in seconds
  safetyCheckRateLimit: 10, // per hour per user
  safetyCacheTTL: 24 * 60 * 60 * 1000, // 24 hours
  maxEmergencyContacts: 5,
  minEmergencyContacts: 1,
  maxTripCompanions: 5,
  maxTripDescription: 500,
  maxRequestMessage: 200,
  maxReportDescription: 1000,
  maxBioLength: 300,
  messagesPerPage: 30,
  tripsPerPage: 12,
  notificationsPerPage: 20,
  typingDebounceMs: 2000,
  locationUpdateIntervalMs: 30000,
  emergencyNumbers: {
    national: '112',
    womenHelpline: '1091',
    police: '100',
    ambulance: '108',
    fire: '101',
  },
} as const;
