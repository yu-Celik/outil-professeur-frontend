/**
 * Token Manager Service
 * Handles automatic token refresh with rotation, queue management, and error handling
 * Epic 7: Refresh Token System
 */

import type { SessionTokenMetadata } from "@/types/auth";
import {
  storeSessionMetadata,
  clearSessionMetadata,
  getTimeUntilExpiration,
  isTokenExpiringSoon,
} from "./token-storage";

// Refresh 2 minutes before expiration (120000ms)
const REFRESH_THRESHOLD_MS = 120000;

interface TokenManagerConfig {
  /** Callback to execute actual refresh API call */
  onRefresh: () => Promise<SessionTokenMetadata>;
  /** Callback when refresh succeeds */
  onRefreshSuccess?: (metadata: SessionTokenMetadata) => void;
  /** Callback when refresh fails */
  onRefreshError?: (error: Error) => void;
  /** Callback when logout is required */
  onLogoutRequired?: () => void;
}

/**
 * Singleton TokenManager for managing automatic token refresh
 */
class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<SessionTokenMetadata> | null = null;
  private config: TokenManagerConfig | null = null;

  /**
   * Initialize the token manager with configuration
   */
  public initialize(config: TokenManagerConfig): void {
    this.config = config;
  }

  /**
   * Start automatic token refresh monitoring
   * @param metadata Initial session metadata returned by backend
   */
  public start(metadata: SessionTokenMetadata): void {
    if (!this.config) {
      console.error("TokenManager not initialized");
      return;
    }

    // Store metadata locally for expiration tracking
    storeSessionMetadata(metadata);

    // Clear any existing timer
    this.stop();

    // Schedule next refresh
    this.scheduleNextRefresh();
  }

  /**
   * Stop automatic token refresh monitoring
   */
  public stop(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  /**
   * Force an immediate token refresh
   * Handles concurrent refresh requests (returns existing promise)
   */
  public async forceRefresh(): Promise<SessionTokenMetadata> {
    if (!this.config) {
      throw new Error("TokenManager not initialized");
    }

    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start new refresh
    this.isRefreshing = true;
    this.refreshPromise = this.executeRefresh();

    try {
      const metadata = await this.refreshPromise;
      return metadata;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Check if token needs refresh and execute if necessary
   * @returns true if refresh was performed
   */
  public async checkAndRefresh(): Promise<boolean> {
    if (isTokenExpiringSoon(REFRESH_THRESHOLD_MS)) {
      await this.forceRefresh();
      return true;
    }
    return false;
  }

  /**
   * Get current refresh state
   */
  public getState() {
    return {
      isRefreshing: this.isRefreshing,
      hasTimer: this.refreshTimer !== null,
    };
  }

  /**
   * Schedule next automatic refresh
   */
  private scheduleNextRefresh(): void {
    const timeUntilExpiration = getTimeUntilExpiration();

    if (timeUntilExpiration <= 0) {
      // Token already expired, trigger immediate refresh
      this.forceRefresh().catch((error) => {
        console.error("Auto-refresh failed for expired token:", error);
        this.handleRefreshError(error);
      });
      return;
    }

    // Schedule refresh REFRESH_THRESHOLD_MS before expiration
    const refreshDelay = Math.max(
      0,
      timeUntilExpiration - REFRESH_THRESHOLD_MS,
    );

    this.refreshTimer = setTimeout(() => {
      this.forceRefresh().catch((error) => {
        console.error("Scheduled auto-refresh failed:", error);
        this.handleRefreshError(error);
      });
    }, refreshDelay);
  }

  /**
   * Execute the actual refresh API call
   */
  private async executeRefresh(): Promise<SessionTokenMetadata> {
    if (!this.config) {
      throw new Error("TokenManager not initialized");
    }

    try {
      // Call the refresh callback (API call)
      const metadata = await this.config.onRefresh();

      // Store new metadata from backend
      storeSessionMetadata(metadata);

      // Call success callback
      this.config.onRefreshSuccess?.(metadata);

      // Schedule next refresh
      this.scheduleNextRefresh();

      return metadata;
    } catch (error) {
      // Handle error
      const err =
        error instanceof Error ? error : new Error("Unknown refresh error");
      this.handleRefreshError(err);
      throw err;
    }
  }

  /**
   * Handle refresh errors
   */
  private handleRefreshError(error: Error): void {
    if (!this.config) return;

    // Stop automatic refresh
    this.stop();

    // Clear stored metadata
    clearSessionMetadata();

    // Call error callback
    this.config.onRefreshError?.(error);

    // Check if we need to trigger logout
    // Error codes that require logout:
    // - 401: Unauthorized (token expired/invalid)
    // - TOKEN_REUSE_DETECTED: Security breach
    // - REFRESH_TOKEN_EXPIRED: Token chain expired
    const errorMessage = error.message.toLowerCase();
    const requiresLogout =
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("token_reuse") ||
      errorMessage.includes("expired") ||
      errorMessage.includes("401");

    if (requiresLogout) {
      this.config.onLogoutRequired?.();
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
