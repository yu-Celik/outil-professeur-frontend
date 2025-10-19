/**
 * Auth Library - Refresh Token System (Epic 7)
 * Central export point for authentication utilities
 */

// Token Management
export { tokenManager } from "./token-manager";
export {
  storeSessionMetadata,
  getSessionMetadata,
  clearSessionMetadata,
  isTokenExpiringSoon,
  isTokenExpired,
  getTimeUntilExpiration,
} from "./token-storage";

// Multi-Tab Sync
export { authBroadcast } from "./broadcast-channel";
