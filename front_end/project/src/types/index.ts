export interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  alias?: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  isExpired: boolean;
}

export interface ClicksOverTime {
  date: string;
  clicks: number;
}

export interface DeviceBreakdown {
  device: string;
  count: number;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CreateLinkPayload {
  url: string;
  alias?: string;
  expiresAt?: string;
}