# Sweet Tracker Architecture Documentation

This document outlines the architecture of the Sweet Tracker application, explaining key components, their interactions, and how to integrate with cloud services like AWS and LocalStack.

## Project Overview

Sweet Tracker is a React-based web application for tracking glucose levels, providing visualizations, statistics, and logging capabilities. The application is built with:

- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **Tanstack Query**: Data fetching and caching
- **Recharts**: Chart visualizations
- **Framer Motion**: Animations

## Key Directories and Files

```
src/
├── components/     # UI Components
├── pages/          # Page components for routing
├── hooks/          # Custom React hooks
├── services/       # API integration layer
├── utils/          # Utility functions
├── config/         # Configuration files
└── lib/            # Helper libraries
```

## Core Components

### Data Flow

The application follows this general data flow:

1. User interacts with a page component
2. Page component uses React Query or direct API calls via services
3. Services layer handles API requests and transformations
4. Data is displayed through UI components

## API Integration Layer

The `src/services/api.ts` file serves as the central point for backend communication. It includes:

- **Fetch utilities** with authentication handling
- **Domain-specific API functions** for glucose data, logs, user profile, etc.
- **Type definitions** for data models
- **Fallback calculation utilities** for client-side processing

## Configuration

The `src/config/environment.ts` file manages environment-specific settings:

- **API_CONFIG**: API URL, version, timeout settings
- **FEATURES**: Feature flags
- **AUTH_CONFIG**: Authentication settings
- **APP_SETTINGS**: Application-specific settings

## AWS/LocalStack Integration Points

### 1. API Configuration

To integrate with AWS services or LocalStack, update the `API_CONFIG` in `src/config/environment.ts`:

```typescript
export const API_CONFIG = {
  // Point to your AWS API Gateway or LocalStack endpoint
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4566',
  
  // API Gateway stage or version
  apiVersion: import.meta.env.VITE_API_VERSION || 'v1',
  
  // Other settings...
};
```

### 2. Authentication Integration

For AWS Cognito or custom auth, modify the authentication logic in `services/api.ts`:

```typescript
// Example for AWS Cognito integration
export const login = async (email: string, password: string) => {
  // Implement Cognito authentication
  // Store tokens appropriately in storage based on AUTH_CONFIG
};
```

### 3. Data Service Integration

#### Lambda Functions

Each API function in `services/api.ts` can be mapped to AWS Lambda functions:

```typescript
// Maps to a Lambda function exposed via API Gateway
export const getGlucoseReadings = async (days: number): Promise<GlucoseReading[]> => {
  return fetchWithAuth(`/glucose/readings?days=${days}`);
};
```

#### DynamoDB or RDS

The data models defined in the services layer should match your database schema:

```typescript
// Should match DynamoDB table or RDS table structure
export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'food' | 'medication' | 'exercise' | 'note';
  value: string;
  glucoseReading?: number;
}
```

#### S3 for File Storage

Add functions for file uploads to S3:

```typescript
// Example S3 integration for file uploads
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetchWithAuth('/upload', {
    method: 'POST',
    body: formData,
    headers: {
      // No Content-Type header for multipart/form-data
    }
  });
  
  return response.url; // S3 URL returned from backend
};
```

### 4. LocalStack Testing

For local development with LocalStack:

1. Configure `API_CONFIG.baseUrl` to point to your LocalStack endpoint
2. Ensure your LocalStack container mimics the AWS services you're using
3. Use the data toggle component to switch between dummy data and your LocalStack API

## Key Files for AWS Integration

| File | Purpose | Integration Point |
|------|---------|-------------------|
| `config/environment.ts` | Configuration settings | Update API endpoints, feature flags |
| `services/api.ts` | API integration layer | Map to Lambda functions, implement AWS SDK calls |
| `hooks/useLocalStorage.tsx` | Local data persistence | Handle offline capabilities and token storage |
| `components/DataSourceToggle.tsx` | Switch between data sources | Toggle between LocalStack/AWS and mock data |
| `pages/*.tsx` | Page components | Use React Query for data fetching |

## Data Toggle Mechanism

The application includes a toggle to switch between API data and dummy data:

1. `components/DataSourceToggle.tsx` provides the UI component
2. `hooks/useLocalStorage.tsx` persists the toggle state
3. Page components use the toggle state to fetch from either API or dummy data

This toggle is particularly useful for testing LocalStack integration without affecting production data.

## Error Handling and Fallbacks

The application implements a graceful fallback strategy:

1. Attempt to fetch from the configured API endpoint
2. If the fetch fails, automatically switch to dummy data
3. Display appropriate error messages to the user
4. Log detailed error information to the console

## Testing Your AWS Integration

1. Configure your AWS/LocalStack endpoints in environment variables
2. Use the data source toggle to switch to API mode
3. Check network requests in your browser's developer tools
4. Verify data flow through the application
5. Test error scenarios by temporarily disabling your backend

## Extending the Application

To add new AWS-powered features:

1. Add new API functions to `services/api.ts`
2. Create corresponding UI components
3. Update page components to use the new functions
4. Add any necessary configuration to `config/environment.ts`

## Performance Considerations

- React Query handles caching and refetching
- Configure appropriate timeouts in `API_CONFIG`
- Implement proper error handling for all API calls
- Consider adding offline capabilities using service workers

## Security Best Practices

- Never store sensitive keys in frontend code
- Use proper authentication with short-lived tokens
- Implement proper CORS policies on your AWS resources
- Use API Gateway authorizers for secure endpoints
- Consider AWS WAF for additional protection
