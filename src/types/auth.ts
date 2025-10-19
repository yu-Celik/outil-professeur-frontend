export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subjects?: string; // JSON string of selected subjects
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

// ============================================================================
// Refresh Token System Types (Epic 7)
// ============================================================================

/**
 * Session token metadata returned by backend
 * Contains expiration times for access token management
 * Matches backend Epic 7 implementation
 */
export interface SessionTokenMetadata {
  /** ISO 8601 timestamp when access token expires */
  access_token_expires_at: string;
  /** ISO 8601 timestamp when refresh token was issued */
  refresh_token_issued_at: string;
  /** ISO 8601 timestamp when refresh token expires */
  refresh_token_expires_at: string;
  /** ISO 8601 timestamp when refresh token was last used (optional) */
  refresh_token_last_used_at?: string | null;
}

/**
 * Login response from backend with session metadata
 */
export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    display_name: string;
  };
  /** Session metadata for token refresh management */
  session: SessionTokenMetadata;
}

/**
 * Register response from backend with session metadata
 */
export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    display_name: string;
  };
  /** Session metadata for token refresh management */
  session: SessionTokenMetadata;
}

/**
 * Refresh token response from backend
 * Returns new session metadata after token rotation
 * Also returns updated user info
 */
export interface RefreshResponse {
  message: string;
  /** Updated user info */
  user: {
    id: string;
    email: string;
    display_name: string;
  };
  /** Updated session metadata with new expiration times */
  session: SessionTokenMetadata;
}

/**
 * Logout response from backend
 */
export interface LogoutResponse {
  message: string;
}

/**
 * RFC 7807 Problem Details for HTTP APIs
 * Standard error format from Rust backend
 */
export interface ProblemDetails {
  /** HTTP status code */
  status: number;
  /** Short, human-readable summary of the problem */
  title: string;
  /** Human-readable explanation specific to this occurrence */
  detail: string;
  /** URI reference that identifies the specific occurrence */
  instance?: string;
  /** URI reference that identifies the problem type */
  type?: string;
  /** Additional error code for client-side handling */
  code?: string;
}
