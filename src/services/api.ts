
// This file serves as the central point for all API interactions with your backend
import { API_CONFIG, AUTH_CONFIG, APP_SETTINGS } from '@/config/environment';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // You can customize error handling based on status codes
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `API Error: ${response.status}`);
  }
  return response.json();
};

// Generic fetch function with authentication
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  // Get token from storage based on configuration
  const storage = AUTH_CONFIG.useLocalStorage ? localStorage : sessionStorage;
  const token = storage.getItem(AUTH_CONFIG.tokenStorageKey);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };
  
  // Add API version if configured
  const versionedEndpoint = API_CONFIG.apiVersion 
    ? `/${API_CONFIG.apiVersion}${endpoint}` 
    : endpoint;
  
  // Set up the request with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${versionedEndpoint}`, {
      ...options,
      headers,
      credentials: API_CONFIG.withCredentials ? 'include' : 'same-origin',
      signal: controller.signal
    });
    
    return handleResponse(response);
  } finally {
    clearTimeout(timeoutId);
  }
};

// ===== Glucose Data API =====

export interface GlucoseReading {
  timestamp: Date;
  value: number;
  status: 'low' | 'normal' | 'high';
}

// Get glucose readings for a specific time range
export const getGlucoseReadings = async (days: number = 1): Promise<GlucoseReading[]> => {
  // Here you would call your actual API endpoint
  // E.g., /glucose/readings?days=7
  const data = await fetchWithAuth(`/glucose/readings?days=${days}`);
  
  // Transform the data to match your frontend model if needed
  return data.map((reading: any) => ({
    timestamp: new Date(reading.timestamp),
    value: reading.value,
    // You might need to calculate status if your API doesn't provide it
    status: getGlucoseStatus(reading.value)
  }));
};

// Calculate glucose status based on value using thresholds from configuration
export const getGlucoseStatus = (value: number): 'low' | 'normal' | 'high' => {
  const { low, high } = APP_SETTINGS.glucoseThresholds;
  if (value < low) return 'low';
  if (value > high) return 'high';
  return 'normal';
};

// Calculate statistics from readings
export const getGlucoseStats = async () => {
  // Option 1: Call a dedicated endpoint that calculates stats on the server
  // return fetchWithAuth('/glucose/statistics');
  
  // Option 2: Calculate stats from the readings client-side
  const readings = await getGlucoseReadings(7); // Last 7 days
  return calculateStats(readings);
};

// Client-side stats calculation (fallback if your API doesn't provide it)
export const calculateStats = (readings: GlucoseReading[]) => {
  const values = readings.map(r => r.value);
  
  const average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  
  const lowReadings = readings.filter(r => r.status === 'low');
  const highReadings = readings.filter(r => r.status === 'high');
  const normalReadings = readings.filter(r => r.status === 'normal');
  
  const timeInRange = Math.round((normalReadings.length / readings.length) * 100);
  
  const highest = Math.max(...values);
  const lowest = Math.min(...values);
  
  return {
    average,
    timeInRange,
    highest,
    lowest,
    lowEvents: lowReadings.length > 0 ? lowReadings.length : 0,
    highEvents: highReadings.length > 0 ? highReadings.length : 0
  };
};

// ===== Log Entries API =====

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'food' | 'medication' | 'exercise' | 'note';
  value: string;
  glucoseReading?: number;
}

// Get all log entries
export const getLogEntries = async (): Promise<LogEntry[]> => {
  const data = await fetchWithAuth('/log-entries');
  
  // Transform the data if needed
  return data.map((entry: any) => ({
    ...entry,
    timestamp: new Date(entry.timestamp)
  }));
};

// Add a new log entry
export const addLogEntry = async (entry: Omit<LogEntry, 'id'>): Promise<LogEntry> => {
  const response = await fetchWithAuth('/log-entries', {
    method: 'POST',
    body: JSON.stringify(entry)
  });
  
  return {
    ...response,
    timestamp: new Date(response.timestamp)
  };
};

// Delete a log entry
export const deleteLogEntry = async (id: string): Promise<void> => {
  await fetchWithAuth(`/log-entries/${id}`, {
    method: 'DELETE'
  });
};

// ===== User Profile API =====

export interface UserProfile {
  name: string;
  lastScanned: Date;
  targetRange: { min: number; max: number };
  device: {
    name: string;
    batteryLevel: number;
    lastSync: Date;
  };
}

// Get user profile data
export const getUserProfile = async (): Promise<UserProfile> => {
  const data = await fetchWithAuth('/user/profile');
  
  // Transform dates
  return {
    ...data,
    lastScanned: new Date(data.lastScanned),
    device: {
      ...data.device,
      lastSync: new Date(data.device.lastSync)
    }
  };
};

// Update user profile
export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await fetchWithAuth('/user/profile', {
    method: 'PATCH',
    body: JSON.stringify(profile)
  });
  
  // Transform dates in the response
  return {
    ...response,
    lastScanned: new Date(response.lastScanned),
    device: {
      ...response.device,
      lastSync: new Date(response.device.lastSync)
    }
  };
};

// ===== Authentication API =====

// Example login function
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await handleResponse(response);
  
  // Store the auth token based on configuration
  if (data.token) {
    const storage = AUTH_CONFIG.useLocalStorage ? localStorage : sessionStorage;
    storage.setItem(AUTH_CONFIG.tokenStorageKey, data.token);
  }
  
  return data;
};

// Example logout function
export const logout = () => {
  const storage = AUTH_CONFIG.useLocalStorage ? localStorage : sessionStorage;
  storage.removeItem(AUTH_CONFIG.tokenStorageKey);
  
  // Optional: Call logout endpoint
  // return fetchWithAuth('/auth/logout', { method: 'POST' });
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const storage = AUTH_CONFIG.useLocalStorage ? localStorage : sessionStorage;
  return !!storage.getItem(AUTH_CONFIG.tokenStorageKey);
};
