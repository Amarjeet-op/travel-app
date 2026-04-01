export type SafetySignal = 'green' | 'yellow' | 'red';

export interface SafetySource {
  title: string;
  url: string;
}

export interface SafetyResult {
  signal: SafetySignal;
  score: number;
  findings: string[];
  womenSafety: string;
  nightSafety: string;
  transport: string;
  emergencyNumbers: {
    police: string;
    hospital: string;
    womenHelpline: string;
  };
  sources: SafetySource[];
}

export interface SafetyCheck {
  area: string;
  city: string;
  travelerType: string;
  timeOfVisit: string;
  concerns?: string;
}

export interface SavedSafetyCheck {
  id: string;
  userId: string;
  city: string;
  area: string;
  travelerType: string;
  timeOfVisit: string;
  result: SafetyResult;
  savedAt: Date;
}
