// Authentication Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
  profile: UserProfile;
}

export type UserRole = 'developer' | 'client';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  notifications: boolean;
}

// Roulette Customization Types
export interface RouletteConfig {
  id: string;
  clientId: string;
  name: string;
  segments: RouletteSegment[];
  appearance: RouletteAppearance;
  settings: RouletteSettings;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface RouletteSegment {
  id: string;
  label: string;
  color: string;
  probability: number;
  value?: string | number;
}

export interface RouletteAppearance {
  backgroundColor: string;
  wheelColors: string[];
  textColor: string;
  borderColor: string;
  logo?: string;
  backgroundImage?: string;
  wheelStyle: 'classic' | 'modern' | 'neon';
}

export interface RouletteSettings {
  spinDuration: number;
  autoSpin: boolean;
  soundEnabled: boolean;
  animationStyle: 'smooth' | 'bouncy' | 'linear';
  wheelSize: 'small' | 'medium' | 'large';
}

// Health Check Types
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: ServiceStatus[];
  uptime: number;
  version: string;
}

export interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
  lastCheck: Date;
}

// Firebase Health Check
export interface FirebaseHealthCheck {
  auth: boolean;
  firestore: boolean;
  hosting: boolean;
  functions?: boolean;
  storage?: boolean;
  timestamp: Date;
  errors?: string[];
}

// Game Types
export interface SpinResult {
  segment: RouletteSegment;
  angle: number;
  timestamp: Date;
  userId?: string;
}

// Analytics Types
export interface GameAnalytics {
  gameId: string;
  totalSpins: number;
  uniqueUsers: number;
  averageSpinsPerUser: number;
  segmentFrequency: Record<string, number>;
  timeframe: {
    start: Date;
    end: Date;
  };
}
