
// Environment configuration for the application
// This allows you to easily switch between development, staging, and production environments

// API configuration
export const API_CONFIG = {
  // Base URL for all API requests
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://your-cloud-backend-api.com',
  
  // API version (if your API uses versioning)
  apiVersion: import.meta.env.VITE_API_VERSION || 'v1',
  
  // API timeout in milliseconds
  timeout: 30000,
  
  // Whether to include credentials in API requests (cookies, HTTP authentication)
  withCredentials: true,
};

// Feature flags
export const FEATURES = {
  // Enable/disable features based on environment variables or hard-coded values
  enableRealTimeUpdates: import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES === 'true' || false,
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true' || false,
  debugMode: import.meta.env.DEV || false,
};

// Authentication configuration
export const AUTH_CONFIG = {
  // Storage key for the authentication token
  tokenStorageKey: 'authToken',
  
  // Whether to use local storage or session storage
  // Local storage persists across browser sessions, session storage is cleared when page is closed
  useLocalStorage: true,
  
  // Token refresh settings
  refreshTokenBeforeExpiryMs: 5 * 60 * 1000, // 5 minutes before expiry
};

// Application settings
export const APP_SETTINGS = {
  // Default language
  defaultLanguage: 'en',
  
  // Date and time formats
  dateFormat: 'MMM d, yyyy',
  timeFormat: 'h:mm a',
  
  // Glucose reading thresholds
  glucoseThresholds: {
    low: 70,
    high: 180,
  },
};

